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

describe("Authorization - Isolasi Antar User", () => {
  let tokenA: string;
  let tokenB: string;
  let applicationIdA: string;

  beforeEach(async () => {
    await resetDatabase();
    tokenA = await registerAndLogin("usera@test.com");
    tokenB = await registerAndLogin("userb@test.com");

    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ company: "Rahasia Perusahaan A", position: "Engineer" });

    applicationIdA = createRes.body.data.application.id;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("User B tidak bisa melihat application milik User A (404, bukan 403)", async () => {
    const res = await request(app)
      .get(`/api/applications/${applicationIdA}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("APPLICATION_NOT_FOUND");
  });

  it("User B tidak bisa mengubah application milik User A", async () => {
    const res = await request(app)
      .patch(`/api/applications/${applicationIdA}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ status: "offer" });

    expect(res.status).toBe(404);

    const stillOwnedByA = await request(app)
      .get(`/api/applications/${applicationIdA}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(stillOwnedByA.body.data.application.status).not.toBe("offer");
  });

  it("User B tidak bisa menghapus application milik User A", async () => {
    const res = await request(app)
      .delete(`/api/applications/${applicationIdA}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);

    const stillExists = await request(app)
      .get(`/api/applications/${applicationIdA}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(stillExists.status).toBe(200);
  });

  it("List applications User B tidak boleh berisi data milik User A", async () => {
    const res = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
  });

  it("Dashboard User B tidak boleh menghitung data milik User A", async () => {
    const res = await request(app).get("/api/dashboard").set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalApplications).toBe(0);
  });

  it("User B tidak bisa melihat project milik User A", async () => {
    const createRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Project Rahasia A" });

    const res = await request(app)
      .get(`/api/projects/${createRes.body.data.project.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  it("User B tidak bisa mengubah skill milik User A", async () => {
    const createRes = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Skill Rahasia A", category: "other", proficiencyLevel: "expert" });

    const res = await request(app)
      .patch(`/api/skills/${createRes.body.data.skill.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ proficiencyLevel: "beginner" });

    expect(res.status).toBe(404);
  });

  it("User B tidak bisa mengubah interview milik User A", async () => {
    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ company: "Rahasia", position: "Engineer" });
    const applicationId = createRes.body.data.application.id;

    const interviewRes = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });

    const res = await request(app)
      .patch(`/api/interviews/${interviewRes.body.data.interview.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ status: "completed" });

    expect(res.status).toBe(404);
  });

  it("User B tidak bisa menitipkan interview ke application milik User A", async () => {
    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        applicationId: applicationIdA,
        type: "technical",
        scheduledAt: "2027-01-10T09:00:00.000Z",
      });

    expect(res.status).toBe(404);
  });
});
