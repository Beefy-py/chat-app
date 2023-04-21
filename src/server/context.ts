import { prisma } from "@/server/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
export interface CreateInnerContextOptions
  extends Partial<CreateNextContextOptions> {}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createSSGHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createInnerTRPCContext(opts: CreateInnerContextOptions) {
  const session = await getSession({ req: opts.req });
  return {
    prisma,
    session,
    ...opts,
  };
}
