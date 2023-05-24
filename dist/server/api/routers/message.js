"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("@/server/api/trpc");
const observable_1 = require("@trpc/server/observable");
const events_1 = require("events");
const server_1 = require("@trpc/server");
class MyEventEmitter extends events_1.EventEmitter {
}
const ee = new MyEventEmitter();
// who is currently typing, key is `name`
const currentlyTyping = Object.create(null);
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
exports.messageRouter = (0, trpc_1.createTRPCRouter)({
    getAll: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.message.findMany();
    }),
    getAllInChat: trpc_1.publicProcedure.input(zod_1.z.string()).query(({ ctx, input }) => {
        return ctx.prisma.message.findMany({
            where: {
                chatId: input,
            },
        });
    }),
    countMessages: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.message.count();
    }),
    createMessage: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        userId: zod_1.z.string(),
        userName: zod_1.z.string(),
        userImage: zod_1.z.string(),
        chatId: zod_1.z.string(),
        content: zod_1.z.string(),
        lastMessageDate: zod_1.z.date(),
    }))
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while trying to increment messageCount.",
                cause: error,
            });
        }
        try {
            const chat = await ctx.prisma.chat.update({
                where: { id: input.chatId },
                data: { lastMessageDate: new Date() },
            });
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while trying to set lastMessageDate.",
                cause: error,
            });
        }
        ee.emit("sendMessage", newmessage);
        delete currentlyTyping["name"];
        ee.emit("isTypingUpdate");
        return newmessage;
    }),
    isTyping: trpc_1.protectedProcedure
        .input(zod_1.z.object({ typing: zod_1.z.boolean() }))
        .mutation(({ input, ctx }) => {
        const { name } = ctx.session.user; // it's a protectedProcedure so the user name must be defined (not sure)
        console.log("SESSION USER: ", ctx.session.user);
        if (!input.typing) {
            delete currentlyTyping[name];
        }
        else {
            currentlyTyping[name] = {
                lastTyped: new Date(),
            };
        }
        ee.emit("isTypingUpdate");
    }),
    onSendMessage: trpc_1.publicProcedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            const onSendMessage = (data) => emit.next(data);
            ee.on("sendMessage", onSendMessage);
            return () => {
                ee.off("sendMessage", onSendMessage);
            };
        });
    }),
    whoIsTyping: trpc_1.publicProcedure.subscription(() => {
        let prev = null;
        return (0, observable_1.observable)((emit) => {
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
