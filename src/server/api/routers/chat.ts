import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const chatRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.findMany();
  }),

  getOne: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const foundChat = await ctx.prisma.chat.findUnique({
      where: { id: input },
      include: { users: true },
    });

    if (!foundChat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return foundChat;
  }),

  countChats: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.count();
  }),

  joinChat: protectedProcedure
    .input(z.object({ chatId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newChat = await ctx.prisma.chat.update({
        where: {
          id: input.chatId,
        },
        data: {
          users: {
            connect: {
              id: input.userId,
            },
          },
        },
      });

      if (newChat.userCount === newChat.maxUsers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "This chat is full.",
        });
      }

      // increment userCount
      try {
        const chat = await ctx.prisma.chat.update({
          where: { id: newChat.id },
          data: { userCount: { increment: 1 } },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while trying to increment userCount after joining.",
          cause: error,
        });
      }

      return newChat;
    }),

  createChat: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        maxUsers: z.number(),
        topic: z.string(),
        description: z.string(),
        creator: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const omitCreator = (({ creator, ...o }) => o)(input);

      const newChat = await ctx.prisma.chat.create({
        data: { ...omitCreator },
      });

      //add user to this chat
      try {
        const newChatwJoinedUser = await ctx.prisma.chat.update({
          where: {
            id: newChat.id,
          },
          data: {
            users: {
              connect: {
                id: input.creator,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while trying to join creator of this chat to their chat.",
          cause: error,
        });
      }

      // increment userCount
      try {
        const chat = await ctx.prisma.chat.update({
          where: { id: newChat.id },
          data: { userCount: { increment: 1 } },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while trying to increment userCount.",
          cause: error,
        });
      }

      return newChat;
    }),
});
