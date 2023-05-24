"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("@/server/api/trpc");
const chat_1 = require("@/server/api/routers/chat");
const message_1 = require("./routers/message");
const user_1 = require("./routers/user");
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    chat: chat_1.chatRouter,
    message: message_1.messageRouter,
    user: user_1.userRouter,
});
