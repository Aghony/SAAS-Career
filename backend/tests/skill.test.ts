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

describe("Skill", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("skill@test.com");
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("berhasil membuat skill baru", async () => {
    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "React",
        category: "framework",
        proficiencyLevel: "advanced",
        yearsOfExperience: 3,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.skill.name).toBe("React");
  });

  it("menolak create tanpa category", async () => {
    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React", proficiencyLevel: "advanced" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("menolak skill dengan nama yang sama untuk user yang sama", async () => {
    await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React", category: "framework", proficiencyLevel: "advanced" });

    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React", category: "framework", proficiencyLevel: "beginner" });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("SKILL_ALREADY_EXISTS");
  });

  it("mengizinkan nama skill sama di user yang berbeda", async () => {
    await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React", category: "framework", proficiencyLevel: "advanced" });

    const tokenB = await registerAndLogin("skillb@test.com");
    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ name: "React", category: "framework", proficiencyLevel: "beginner" });

    expect(res.status).toBe(201);
  });

  it("berhasil list, update, dan delete skill", async () => {
    const createRes = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Public Speaking", category: "soft_skill", proficiencyLevel: "intermediate" });
    const id = createRes.body.data.skill.id;

    const listRes = await request(app).get("/api/skills").set("Authorization", `Bearer ${token}`);
    expect(listRes.body.data.skills).toHaveLength(1);

    const updateRes = await request(app)
      .patch(`/api/skills/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ proficiencyLevel: "advanced" });
    expect(updateRes.body.data.skill.proficiencyLevel).toBe("advanced");

    await request(app).delete(`/api/skills/${id}`).set("Authorization", `Bearer ${token}`);
    const listAfter = await request(app).get("/api/skills").set("Authorization", `Bearer ${token}`);
    expect(listAfter.body.data.skills).toHaveLength(0);
  });

  it("update ke nama yang sudah dipakai skill lain ditolak", async () => {
    await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React", category: "framework", proficiencyLevel: "advanced" });
    const vueRes = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Vue", category: "framework", proficiencyLevel: "beginner" });

    const res = await request(app)
      .patch(`/api/skills/${vueRes.body.data.skill.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "React" });

    expect(res.status).toBe(409);
  });
});
