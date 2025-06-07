import { describe, it, expect, beforeAll } from "vitest";
import app from "../index";
import { createTestJWTToken, testUserPayload } from "./jwt-utils";

// モックのCloudflare環境
const mockEnv = {
  JWT_SECRET_KEY: "test-secret-key-for-testing-purposes-only",
  D1: {} as D1Database,
  DB_ACCOUNT_ID: "test-account",
  DB_DATABASE_ID: "test-db",
  DB_TOKEN: "test-token",
};

// テスト用のリクエストヘルパー関数
const createTestRequest = (path: string, options: RequestInit = {}) => {
  const url = new URL(path, "https://test.workers.dev");
  return new Request(url.toString(), options);
};

describe("tRPC API Integration Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await createTestJWTToken(testUserPayload);
  });

  describe("Authentication", () => {
    it("should return 401 when no auth token is provided", async () => {
      const request = createTestRequest(
        "/user.getProfile?batch=0&input=%7B%7D"
      );
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    it("should return 401 when invalid auth token is provided", async () => {
      const request = createTestRequest(
        "/user.getProfile?batch=0&input=%7B%7D",
        {
          headers: {
            Authorization: "Bearer invalid-token",
          },
        }
      );
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(401);
    });
  });

  describe("User Endpoints", () => {
    it("should get user profile with valid auth token", async () => {
      const request = createTestRequest(
        "/user.getProfile?batch=0&input=%7B%7D",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;

      expect(data).toHaveProperty("result");
      expect(data.result).toHaveProperty("data");
      expect(data.result.data).toMatchObject({
        id: testUserPayload.sub,
        email: testUserPayload.email,
      });
    });

    it("should get user test endpoint", async () => {
      const request = createTestRequest("/user.test?batch=0&input=%7B%7D", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;

      expect(data.result.data).toBe(`Hello, ${testUserPayload.email}!`);
    });
  });

  describe("Task Endpoints", () => {
    it("should get all tasks", async () => {
      const request = createTestRequest(
        "/task.getAll?batch=0&input=%7B%22completed%22%3Afalse%7D",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;

      expect(data.result.data).toHaveProperty("tasks");
      expect(data.result.data.tasks).toBeInstanceOf(Array);
      if (data.result.data.tasks.length > 0) {
        expect(data.result.data.tasks[0]).toHaveProperty("id");
        expect(data.result.data.tasks[0]).toHaveProperty("title");
        expect(data.result.data.tasks[0]).toHaveProperty("isCompleted");
        expect(data.result.data.tasks[0]).toHaveProperty("userId");
      }
    });

    it("should create a new task", async () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
      };

      // 正しいtRPCのリクエスト形式でPOST
      const request = createTestRequest("/task.create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(taskData),
      });
      const response = await app.fetch(request, mockEnv);

      if (response.status !== 200) {
        const errorText = await response.text();
        console.log("Error response:", response.status, errorText);
      }

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;

      // 単一のレスポンス形式をチェック
      expect(data).toHaveProperty("result");
      expect(data.result).toHaveProperty("data");
      expect(data.result.data).toHaveProperty("id");
      expect(data.result.data).toHaveProperty("title", taskData.title);
      expect(data.result.data).toHaveProperty(
        "description",
        taskData.description
      );
      expect(data.result.data).toHaveProperty("isCompleted", false);
      expect(data.result.data).toHaveProperty("userId", testUserPayload.sub);
      expect(data.result.data).toHaveProperty("createdAt");
    });
  });

  describe("Dashboard Endpoints", () => {
    it("should get dashboard stats", async () => {
      const request = createTestRequest(
        "/dashboard.getStats?batch=0&input=%7B%7D",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const response = await app.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as any;

      expect(data.result.data).toHaveProperty("totalTasks");
      expect(data.result.data).toHaveProperty("completedTasks");
      expect(data.result.data).toHaveProperty("pendingTasks");
      expect(typeof data.result.data.totalTasks).toBe("number");
      expect(typeof data.result.data.completedTasks).toBe("number");
      expect(typeof data.result.data.pendingTasks).toBe("number");
    });
  });
});
