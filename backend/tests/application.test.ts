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

describe("Application CRUD", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("owner@test.com");
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("berhasil membuat application baru", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Tokopedia", position: "Backend Engineer", status: "applied" });

    expect(res.status).toBe(201);
    expect(res.body.data.application.company).toBe("Tokopedia");
    expect(res.body.data.application.status).toBe("applied");
  });

  it("menolak create tanpa field wajib (company)", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ position: "Backend Engineer" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("menolak create jika salaryMin lebih besar dari salaryMax", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Shopee", position: "Engineer", salaryMin: 20000000, salaryMax: 5000000 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("berhasil list applications dengan pagination", async () => {
    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "A", position: "Engineer" });
    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "B", position: "Engineer" });

    const res = await request(app)
      .get("/api/applications?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(2);
    expect(res.body.data.meta.total).toBe(2);
  });

  it("berhasil filter applications berdasarkan status", async () => {
    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "A", position: "Engineer", status: "interview" });
    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "B", position: "Engineer", status: "wishlist" });

    const res = await request(app)
      .get("/api/applications?status=interview")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].company).toBe("A");
  });

  it("berhasil update application", async () => {
    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Gojek", position: "Engineer", status: "applied" });

    const res = await request(app)
      .patch(`/api/applications/${createRes.body.data.application.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "interview" });

    expect(res.status).toBe(200);
    expect(res.body.data.application.status).toBe("interview");
  });

  it("berhasil delete application, lalu get-by-id mengembalikan 404", async () => {
    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Gojek", position: "Engineer" });

    const id = createRes.body.data.application.id;
    const deleteRes = await request(app)
      .delete(`/api/applications/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/applications/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });
});
