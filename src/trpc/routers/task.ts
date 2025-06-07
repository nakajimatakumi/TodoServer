import { z } from "zod";
import { t } from "../trpc";

export const taskRouter = t.router({
  // タスク一覧を取得
  getAll: t.procedure
    .input(
      z.object({
        completed: z.boolean().optional(), // 完了状態でフィルター
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(({ input, ctx }) => {
      // TODO: データベースからタスクを取得
      return {
        tasks: [],
        pagination: {
          page: input.page,
          limit: input.limit,
          total: 0,
        },
        userId: ctx.user.id,
      };
    }),

  // 特定のタスクを取得（サブタスク含む）
  getById: t.procedure
    .input(
      z.object({
        taskId: z.number().min(1),
      })
    )
    .query(({ input, ctx }) => {
      // TODO: データベースからタスクとサブタスクを取得
      return {
        task: {
          id: input.taskId,
          title: "サンプルタスク",
          description: "説明",
          isCompleted: false,
          startAt: null,
          endAt: null,
          userId: ctx.user.id,
        },
        subtasks: [],
      };
    }),

  // タスクを作成
  create: t.procedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, "タイトルは必須です")
          .max(255, "タイトルは255文字以内です"),
        description: z.string().max(1000, "説明は1000文字以内です").optional(),
        startAt: z.string().datetime().optional(),
        endAt: z.string().datetime().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースにタスクを作成
      return {
        id: Math.floor(Math.random() * 1000), // 仮のID
        title: input.title,
        description: input.description,
        isCompleted: false,
        startAt: input.startAt,
        endAt: input.endAt,
        userId: ctx.user.id,
        createdAt: new Date().toISOString(),
      };
    }),

  // タスクを更新
  update: t.procedure
    .input(
      z.object({
        taskId: z.number().min(1),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).optional(),
        isCompleted: z.boolean().optional(),
        startAt: z.string().datetime().optional(),
        endAt: z.string().datetime().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースのタスクを更新
      return {
        taskId: input.taskId,
        updatedFields: input,
        updatedBy: ctx.user.id,
        updatedAt: new Date().toISOString(),
      };
    }),

  // タスクを削除
  delete: t.procedure
    .input(
      z.object({
        taskId: z.number().min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースからタスクを削除（サブタスクも含む）
      return {
        taskId: input.taskId,
        deletedBy: ctx.user.id,
        deletedAt: new Date().toISOString(),
      };
    }),
});
