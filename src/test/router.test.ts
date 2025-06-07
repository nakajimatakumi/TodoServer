import { describe, it, expect } from "vitest";
import { userRouter } from "../trpc/routers/user";
import { taskRouter } from "../trpc/routers/task";
import { dashboardRouter } from "../trpc/routers/dashboard";

describe("tRPC Router Unit Tests", () => {
  const mockContext = {
    user: {
      id: "test-user-id",
      email: "test@example.com",
    },
  };

  describe("User Router", () => {
    it("should return user profile", async () => {
      const caller = userRouter.createCaller(mockContext);
      const result = await caller.getProfile();

      expect(result).toEqual({
        id: "test-user-id",
        email: "test@example.com",
      });
    });

    it("should return test message", async () => {
      const caller = userRouter.createCaller(mockContext);
      const result = await caller.test();

      expect(result).toBe("Hello, test@example.com!");
    });
  });

  describe("Task Router", () => {
    it("should return all tasks", async () => {
      const caller = taskRouter.createCaller(mockContext);
      const result = await caller.getAll({
        page: 1,
        limit: 10,
        completed: false,
      });

      expect(result).toHaveProperty("tasks");
      expect(result).toHaveProperty("pagination");
      expect(result).toHaveProperty("userId");
      expect(Array.isArray(result.tasks)).toBe(true);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.userId).toBe(mockContext.user.id);
    });

    it("should create a new task", async () => {
      const caller = taskRouter.createCaller(mockContext);
      const taskData = {
        title: "Unit Test Task",
        description: "Task created in unit test",
      };

      const result = await caller.create(taskData);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe(taskData.description);
      expect(result.isCompleted).toBe(false);
      expect(result.userId).toBe(mockContext.user.id);
      expect(result.createdAt).toBeDefined();
      expect(typeof result.createdAt).toBe("string");
    });
  });

  describe("Dashboard Router", () => {
    it("should return dashboard stats", async () => {
      const caller = dashboardRouter.createCaller(mockContext);
      const result = await caller.getStats();

      expect(result).toHaveProperty("totalTasks");
      expect(result).toHaveProperty("completedTasks");
      expect(result).toHaveProperty("pendingTasks");
      expect(typeof result.totalTasks).toBe("number");
      expect(typeof result.completedTasks).toBe("number");
      expect(typeof result.pendingTasks).toBe("number");
      expect(result.totalTasks).toBe(
        result.completedTasks + result.pendingTasks
      );
    });
  });
});
