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

async function createApplication(token: string, company: string, status = "applied") {
  const res = await request(app)
    .post("/api/applications")
    .set("Authorization", `Bearer ${token}`)
    .send({ company, position: "Engineer", status });
  return res.body.data.application.id as string;
}

describe("Analytics", () => {
  let token: string;

  beforeEach(async () => {
    await resetDatabase();
    token = await registerAndLogin("analytics@test.com");
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("mengembalikan data kosong saat belum ada application", async () => {
    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.applicationsOverTime).toHaveLength(6);
    expect(res.body.data.applicationsOverTime.every((m: { count: number }) => m.count === 0)).toBe(
      true
    );
    expect(res.body.data.offerRate).toBe(0);
    expect(res.body.data.totalInterviews).toBe(0);
    expect(res.body.data.topCompanies).toHaveLength(0);
  });

  it("application yang baru dibuat masuk ke bucket bulan ini", async () => {
    await createApplication(token, "Tokopedia");

    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);
    expect(res.body.data.applicationsOverTime.at(-1).count).toBe(1);
  });

  it("menghitung statusDistribution dengan benar", async () => {
    await createApplication(token, "A", "wishlist");
    await createApplication(token, "B", "applied");
    await createApplication(token, "C", "applied");

    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);

    expect(res.body.data.statusDistribution.wishlist).toBe(1);
    expect(res.body.data.statusDistribution.applied).toBe(2);
  });

  it("offerRate menghitung persentase dengan benar (exclude wishlist)", async () => {
    await createApplication(token, "A", "wishlist"); // tidak dihitung
    await createApplication(token, "B", "offer");
    await createApplication(token, "C", "rejected");

    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);
    expect(res.body.data.offerRate).toBe(50); // 1 offer dari 2 yang submit
  });

  it("topCompanies terurut dari yang paling sering dilamar", async () => {
    await createApplication(token, "Tokopedia");
    await createApplication(token, "Tokopedia");
    await createApplication(token, "Gojek");

    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);
    expect(res.body.data.topCompanies[0]).toEqual({ company: "Tokopedia", count: 2 });
  });

  it("menghitung interview by type dan status", async () => {
    const applicationId = await createApplication(token, "Tokopedia");
    await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicationId, type: "technical", scheduledAt: "2027-01-10T09:00:00.000Z" });
    await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        applicationId,
        type: "technical",
        status: "completed",
        scheduledAt: "2027-01-05T09:00:00.000Z",
      });

    const res = await request(app).get("/api/analytics").set("Authorization", `Bearer ${token}`);

    expect(res.body.data.totalInterviews).toBe(2);
    expect(res.body.data.interviewsByType.technical).toBe(2);
    expect(res.body.data.interviewsByStatus.scheduled).toBe(1);
    expect(res.body.data.interviewsByStatus.completed).toBe(1);
  });
});
