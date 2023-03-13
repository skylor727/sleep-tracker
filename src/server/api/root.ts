import { createTRPCRouter } from "~/server/api/trpc";
import { sleepRouter } from "~/server/api/routers/sleep";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sleepbook: sleepRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
