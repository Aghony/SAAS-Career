import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase, disconnectDatabase } from "./helpers/db.js";

async function registerAndLogin(email: string) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email, password: "password123" });
  return res.body.data.accessToken as string;
}

async function createApplication(token: string, company = "Tokopedia") {
  const res = await request(app)
    .post("/api/applications")
    .set("Authorization", `Bearer ${token}`)
    .send({ company, position: "Backend Engineer" });
  return res.body.data.application.id as string;
}

describe("Interview", () => {
  let token: string;
  let applicationId: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("interview@test.com");
    applicationId = await createApplication(token);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("berhasil membuat interview untuk application milik sendiri", async () => {
    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    expect(res.status).toBe(201);
    expect(res.body.data.interview.application.company).toBe("Tokopedia");
    expect(res.body.data.interview.status).toBe("scheduled"); // default
  });

  it("menolak create dengan applicationId milik user lain", async () => {
    const tokenB = await registerAndLogin("other@test.com");

    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("APPLICATION_NOT_FOUND");
  });

  it("menolak create dengan applicationId yang tidak ada sama sekali", async () => {
    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        applicationId: "00000000-0000-7000-8000-000000000000",
        type: "technical",
        scheduledAt: "2027-01-10T09:00:00.000Z",
      });

    expect(res.status).toBe(404);
  });

  it("menolak create tanpa scheduledAt", async () => {
    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical" });

    expect(res.status).toBe(400);
  });

  it("tidak bisa mengubah applicationId lewat update", async () => {
    const createRes = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    const otherApplicationId = await createApplication(token, "Gojek");

    const res = await request(app)
      .patch(`/api/interviews/${createRes.body.data.interview.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId: otherApplicationId, status: "completed" });

    // applicationId di body diabaikan validator (sudah di-.omit()), tapi status tetap ter-update
    expect(res.status).toBe(200);
    expect(res.body.data.interview.applicationId).toBe(applicationId);
    expect(res.body.data.interview.status).toBe("completed");
  });

  it("berhasil filter list berdasarkan applicationId", async () => {
    const applicationId2 = await createApplication(token, "Gojek");
    await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });
    await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        applicationId: applicationId2,
        type: "final",
        scheduledAt: "2027-01-15T09:00:00.000Z",
      });

    const res = await request(app)
      .get(`/api/interviews?applicationId=${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data.interviews).toHaveLength(1);
  });

  it("berhasil hapus interview", async () => {
    const createRes = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    await request(app)
      .delete(`/api/interviews/${createRes.body.data.interview.id}`)
      .set("Authorization", `Bearer ${token}`);

    const listRes = await request(app)
      .get("/api/interviews")
      .set("Authorization", `Bearer ${token}`);
    expect(listRes.body.data.interviews).toHaveLength(0);
  });

  it("menghapus application otomatis menghapus interview terkait (cascade)", async () => {
    await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    await request(app)
      .delete(`/api/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    const listRes = await request(app)
      .get("/api/interviews")
      .set("Authorization", `Bearer ${token}`);
    expect(listRes.body.data.interviews).toHaveLength(0);
  });
});
