import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { disconnectDatabase, resetDatabase } from "./helpers/db";
import request from "supertest";
import app from "../src/app.js";

describe("Auth", () => {
  const validUser = { name: "Budi Santoso", email: "budi@test.com", password: "password123" };

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("Berhasil register user baru", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.data.accessToken).toBeTypeOf("string");
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it("menolak register dengan email yang sudah terdaftar", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_TAKEN");
  });

  it("menolak register dengan password kurang dari 8 karakter", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("menolak register dengan format email tidak valid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: "bukan-email" });

    expect(res.status).toBe(400);
  });

  it("berhasil login dengan kredensial benar", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTypeOf("string");
  });

  it("menolak login dengan password salah", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "salahpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("menolak akses /me tanpa token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("berhasil akses /me dengan token valid", async () => {
    const registerRes = await request(app).post("/api/auth/register").send(validUser);
    const token = registerRes.body.data.accessToken;

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it("refresh token lama tidak lagi valid setelah logout", async () => {
    const registerRes = await request(app).post("/api/auth/register").send(validUser);
    const token = registerRes.body.data.accessToken;
    const cookies = registerRes.headers["set-cookie"];

    await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${token}`);
    const refreshRes = await request(app).post("/api/auth/refresh").set("Cookie", cookies);

    expect(refreshRes.status).toBe(401);
    expect(refreshRes.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  });
});
