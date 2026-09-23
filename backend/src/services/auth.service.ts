import { userRepository } from "../repositories/user.repository.js";
import { passwordUtil } from "../utils/password.js";
import { tokenService } from "./token.service.js";
import { sha256 } from "../utils/hash.js";
import { AppError } from "../utils/AppError.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validators.js";

async function issueTokens(userId: string) {
  const accessToken = tokenService.signAccessToken(userId);
  const refreshToken = tokenService.signRefreshToken(userId);
  await userRepository.updateRefreshTokenHash(userId, sha256(refreshToken));
  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, "EMAIL_TAKEN", "Email sudah terdaftar");

    const passwordHash = await passwordUtil.hash(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    return { user, ...(await issueTokens(user.id)) };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) throw new AppError(401, "INVALID_CREDENTIALS", "Email atau password salah");

    const isValid = await passwordUtil.verify(user.passwordHash, input.password);
    if (!isValid) throw new AppError(401, "INVALID_CREDENTIALS", "Email atau password salah");

    return { user, ...(await issueTokens(user.id)) };
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new AppError(401, "NO_REFRESH_TOKEN", "Tidak ada sesi aktif");

    let payload;
    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Sesi tidak valid, silakan login ulang");
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || user.refreshTokenHash !== sha256(refreshToken)) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Sesi tidak valid, silakan login ulang");
    }

    return { user, ...(await issueTokens(user.id)) };
  },

  async logout(userId: string) {
    await userRepository.updateRefreshTokenHash(userId, null);
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User tidak ditemukan");
    return user;
  },
};
