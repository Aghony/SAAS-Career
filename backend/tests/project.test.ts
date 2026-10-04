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

describe("Project", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("project@test.com");
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("berhasil membuat project baru", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Career SaaS", techStack: ["React", "Node.js"], isOngoing: true });

    expect(res.status).toBe(201);
    expect(res.body.data.project.title).toBe("Career SaaS");
    expect(res.body.data.project.techStack).toEqual(["React", "Node.js"]);
  });

  it("menolak create tanpa title", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Tanpa judul" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("menolak jika startDate setelah endDate", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Timeline Salah", startDate: "2026-06-01", endDate: "2026-01-01" });

    expect(res.status).toBe(400);
  });

  it("isOngoing true otomatis mengosongkan endDate", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Masih Jalan", endDate: "2026-01-01", isOngoing: true });

    expect(res.body.data.project.endDate).toBeNull();
  });

  it("berhasil list, update, dan delete project", async () => {
    const createRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Proyek A" });
    const id = createRes.body.data.project.id;

    const listRes = await request(app).get("/api/projects").set("Authorization", `Bearer ${token}`);
    expect(listRes.body.data.projects).toHaveLength(1);

    const updateRes = await request(app)
      .patch(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "Solo Developer" });
    expect(updateRes.body.data.project.role).toBe("Solo Developer");

    await request(app).delete(`/api/projects/${id}`).set("Authorization", `Bearer ${token}`);
    const getRes = await request(app)
      .get(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });
});
