import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "node:fs";
import app from "../src/app.js";
import { prisma } from "../src/config/prisma.js";
import { resetDatabase, disconnectDatabase } from "./helpers/db.js";
;

async function registerAndLogin(email: string) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email, password: "password123" });
  return res.body.data.accessToken as string;
}

const fakePdf = Buffer.from("%PDF-1.4 fake content for testing");

describe("Resume", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("resume@test.com");
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("berhasil upload resume PDF, otomatis jadi primary", async () => {
    const res = await request(app)
      .post("/api/resumes")
      .set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Backend Engineer")
      .attach("file", fakePdf, "resume.pdf");

    expect(res.status).toBe(201);
    expect(res.body.data.resume.label).toBe("Resume Backend Engineer");
    expect(res.body.data.resume.isPrimary).toBe(true);
    expect(res.body.data.resume.filePath).toBeUndefined(); // tidak boleh bocor ke client
  });

  it("menolak upload tanpa file", async () => {
    const res = await request(app)
      .post("/api/resumes")
      .set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Tanpa File");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("FILE_REQUIRED");
  });

  it("menolak upload file bukan PDF", async () => {
    const res = await request(app)
      .post("/api/resumes")
      .set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Salah Format")
      .attach("file", Buffer.from("plain text"), "resume.txt");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_FILE_TYPE");
  });

  it("resume kedua tidak otomatis jadi primary", async () => {
    await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume A").attach("file", fakePdf, "a.pdf");

    const res = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume B").attach("file", fakePdf, "b.pdf");

    expect(res.body.data.resume.isPrimary).toBe(false);
  });

  it("set resume lain jadi primary otomatis un-set yang lama", async () => {
    const resA = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume A").attach("file", fakePdf, "a.pdf");
    const resB = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume B").attach("file", fakePdf, "b.pdf");

    await request(app)
      .patch(`/api/resumes/${resB.body.data.resume.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPrimary: true });

    const list = await request(app).get("/api/resumes").set("Authorization", `Bearer ${token}`);
    const a = list.body.data.resumes.find((r: { id: string; isPrimary: boolean }) => r.id === resA.body.data.resume.id);
    const b = list.body.data.resumes.find((r: { id: string; isPrimary: boolean }) => r.id === resB.body.data.resume.id);

    expect(a.isPrimary).toBe(false);
    expect(b.isPrimary).toBe(true);
  });

  it("berhasil download resume", async () => {
    const createRes = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Download").attach("file", fakePdf, "download.pdf");

    const res = await request(app)
      .get(`/api/resumes/${createRes.body.data.resume.id}/download`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
  });

  it("berhasil hapus resume beserta file fisiknya", async () => {
    const createRes = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Hapus").attach("file", fakePdf, "delete.pdf");

    const resumeId = createRes.body.data.resume.id;
    const record = await prisma.resume.findUniqueOrThrow({ where: { id: resumeId } });
    expect(fs.existsSync(record.filePath)).toBe(true);

    await request(app).delete(`/api/resumes/${resumeId}`).set("Authorization", `Bearer ${token}`);

    expect(fs.existsSync(record.filePath)).toBe(false);
  });

  it("user lain tidak bisa download resume milik user ini (404)", async () => {
    const createRes = await request(app).post("/api/resumes").set("Authorization", `Bearer ${token}`)
      .field("label", "Resume Rahasia").attach("file", fakePdf, "rahasia.pdf");

    const tokenB = await registerAndLogin("other@test.com");

    const res = await request(app)
      .get(`/api/resumes/${createRes.body.data.resume.id}/download`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });
});