"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("@/server/api/trpc");
const server_1 = require("@trpc/server");
exports.chatRouter = (0, trpc_1.createTRPCRouter)({
    getAll: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.chat.findMany();
    }),
    getOne: trpc_1.publicProcedure.input(zod_1.z.string()).query(async ({ ctx, input }) => {
        const foundChat = await ctx.prisma.chat.findUnique({
            where: { id: input },
            include: { users: true },
        });
        if (!foundChat) {
            throw new server_1.TRPCError({
                code: "NOT_FOUND",
                message: "Chat not found",
            });
        }
        return foundChat;
    }),
    countChats: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.chat.count();
    }),
    joinChat: trpc_1.protectedProcedure
        .input(zod_1.z.object({ chatId: zod_1.z.string(), userId: zod_1.z.string() }))
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
            throw new server_1.TRPCError({
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while trying to increment userCount after joining.",
                cause: error,
            });
        }
        return newChat;
    }),
    createChat: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string(),
        maxUsers: zod_1.z.number(),
        topic: zod_1.z.string(),
        description: zod_1.z.string(),
        creator: zod_1.z.string(),
    }))
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
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while trying to join creator of this chat to their chat.",
                cause: error,
            });
        }
        // increment userCount
        try {
            const chat = await ctx.prisma.chat.update({
                where: { id: newChat.id },
                data: { userCount: { increment: 1 } },
            });
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while trying to increment userCount.",
                cause: error,
            });
        }
        return newChat;
    }),
});
