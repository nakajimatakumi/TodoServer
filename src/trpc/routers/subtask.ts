import { z } from "zod";
import { t } from "../trpc";

export const subtaskRouter = t.router({
  // サブタスクを作成
  create: t.procedure
    .input(
      z.object({
        taskId: z.number().min(1),
        title: z
          .string()
          .min(1, "タイトルは必須です")
          .max(255, "タイトルは255文字以内です"),
        description: z.string().max(1000, "説明は1000文字以内です").optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースにサブタスクを作成
      return {
        id: Math.floor(Math.random() * 1000), // 仮のID
        title: input.title,
        description: input.description,
        isCompleted: false,
        taskId: input.taskId,
        createdBy: ctx.user.id,
        createdAt: new Date().toISOString(),
      };
    }),

  // サブタスクを更新
  update: t.procedure
    .input(
      z.object({
        subtaskId: z.number().min(1),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).optional(),
        isCompleted: z.boolean().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースのサブタスクを更新
      return {
        subtaskId: input.subtaskId,
        updatedFields: input,
        updatedBy: ctx.user.id,
        updatedAt: new Date().toISOString(),
      };
    }),

  // サブタスクを削除
  delete: t.procedure
    .input(
      z.object({
        subtaskId: z.number().min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: データベースからサブタスクを削除
      return {
        subtaskId: input.subtaskId,
        deletedBy: ctx.user.id,
        deletedAt: new Date().toISOString(),
      };
    }),
});
