import { t } from "../trpc";

export const userRouter = t.router({
  // 現在のユーザー情報を取得
  getProfile: t.procedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
    };
  }),

  // テスト用のエンドポイント
  test: t.procedure.query(({ ctx }) => {
    return `Hello, ${ctx.user.email}!`;
  }),
});
