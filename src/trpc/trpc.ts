import { initTRPC } from "@trpc/server";

export type Context = {
  user: {
    id: string;
    email: string;
  };
};

export const t = initTRPC.context<Context>().create();
