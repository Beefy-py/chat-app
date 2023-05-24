"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerAuthSession = exports.authOptions = void 0;
const next_auth_1 = require("next-auth");
const discord_1 = __importDefault(require("next-auth/providers/discord"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const linkedin_1 = __importDefault(require("next-auth/providers/linkedin"));
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const env_mjs_1 = require("@/env.mjs");
const db_1 = require("@/server/db");
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
exports.authOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: (0, prisma_adapter_1.PrismaAdapter)(db_1.prisma),
    providers: [
        (0, discord_1.default)({
            clientId: env_mjs_1.env.DISCORD_ID,
            clientSecret: env_mjs_1.env.DISCORD_SECRET,
        }),
        (0, github_1.default)({
            clientId: env_mjs_1.env.GITHUB_ID,
            clientSecret: env_mjs_1.env.GITHUB_SECRET,
        }),
        (0, google_1.default)({
            clientId: env_mjs_1.env.GOOGLE_ID,
            clientSecret: env_mjs_1.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        (0, linkedin_1.default)({
            clientId: env_mjs_1.env.LINKEDIN_ID,
            clientSecret: env_mjs_1.env.LINKEDIN_SECRET,
        }),
    ],
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
const getServerAuthSession = (ctx) => {
    return (0, next_auth_1.getServerSession)(ctx.req, ctx.res, exports.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
