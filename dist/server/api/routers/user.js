"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("@/server/api/trpc");
exports.userRouter = (0, trpc_1.createTRPCRouter)({
    getAll: trpc_1.protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany();
    }),
});
