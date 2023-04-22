import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany();
  }),

  getAllInChat: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.message.findMany({
      where: {
        chatId: input,
      },
    });
  }),

  countMessages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.count();
  }),

  createMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        userName: z.string(),
        userImage: z.string(),
        chatId: z.string(),
        content: z.string(),
        lastMessageDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const omitLastMessageDate = (({ lastMessageDate, ...o }) => o)(input);

      const newmessage = await ctx.prisma.message.create({
        data: { ...omitLastMessageDate },
      });

      try {
        const chat = await ctx.prisma.chat.update({
          where: { id: input.chatId },
          data: {
            messageCount: { increment: 1 },
            lastMessageDate: input.lastMessageDate,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while trying to increment messageCount.",
          cause: error,
        });
      }

      try {
        const chat = await ctx.prisma.chat.update({
          where: { id: input.chatId },
          data: { lastMessageDate: new Date() },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while trying to set lastMessageDate.",
          cause: error,
        });
      }

      return newmessage;
    }),
});
