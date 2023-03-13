import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const sleepRouter = createTRPCRouter({
    postMessage: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                message: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.sleepBook.create({
                    data: {
                        name: input.name,
                        message: input.message
                    }
                })
            } catch (error) {
                console.log('error');
            }
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.sleepBook.findMany({
                select: {
                    name: true,
                    message: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        } catch (error) {
            console.log(error);
        }
    })
});
