import { t } from "../trpc";

export const dashboardRouter = t.router({
  // ダッシュボード用の統計情報
  getStats: t.procedure.query(({ ctx }) => {
    // TODO: データベースから統計情報を取得
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      totalSubtasks: 0,
      completedSubtasks: 0,
      userId: ctx.user.id,
    };
  }),
});
