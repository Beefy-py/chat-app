import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { TRPCError } from "@trpc/server";
import { Message } from "@prisma/client";

interface MyEvents {
  sendMessage: (data: Message) => void;
  isTypingUpdate: () => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

const ee = new MyEventEmitter();

// who is currently typing, key is `name`
const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

// every 1s, clear old "isTyping"
const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit("isTypingUpdate");
  }
}, 3e3);

process.on("SIGTERM", () => clearInterval(interval));

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

      const { name } = ctx.session.user;

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

      ee.emit("sendMessage", newmessage);
      delete currentlyTyping["name"];
      ee.emit("isTypingUpdate");

      return newmessage;
    }),

  isTyping: protectedProcedure
    .input(z.object({ typing: z.boolean() }))
    .mutation(({ input, ctx }) => {
      const { name } = ctx.session.user; // it's a protectedProcedure so the user name must be defined (not sure)

      console.log("SESSION USER: ", ctx.session.user);

      if (!input.typing) {
        delete currentlyTyping[name!];
      } else {
        currentlyTyping[name!] = {
          lastTyped: new Date(),
        };
      }
      ee.emit("isTypingUpdate");
    }),

  onSendMessage: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      const onSendMessage = (data: Message) => emit.next(data);
      ee.on("sendMessage", onSendMessage);
      return () => {
        ee.off("sendMessage", onSendMessage);
      };
    });
  }),

  whoIsTyping: publicProcedure.subscription(() => {
    let prev: string[] | null = null;
    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const newData = Object.keys(currentlyTyping);

        if (!prev || prev.toString() !== newData.toString()) {
          emit.next(newData);
        }
        prev = newData;
      };
      ee.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        ee.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
});
