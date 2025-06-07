import { t } from "./trpc";
import { userRouter } from "./routers/user";
import { taskRouter } from "./routers/task";
import { subtaskRouter } from "./routers/subtask";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = t.router({
  user: userRouter,
  task: taskRouter,
  subtask: subtaskRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
