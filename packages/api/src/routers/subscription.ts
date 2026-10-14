import { foxClaim } from "@poulinkes/db/schema/index";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, ne } from "drizzle-orm";

import type { Context } from "../context";
import { protectedProcedure, router } from "../index";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/** Claims that count towards the yearly limit: everything in the last 365 days except rejected ones. */
export async function claimsUsedThisYear(ctx: Context, userId: string) {
	return ctx.db.$count(
		foxClaim,
		and(
			eq(foxClaim.userId, userId),
			ne(foxClaim.status, "rejected"),
			gte(foxClaim.createdAt, new Date(Date.now() - YEAR_MS)),
		),
	);
}

export async function requireSubscription(ctx: Context) {
	const subscription = await ctx.getSubscription();
	if (!subscription) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Je hebt nog geen actief abonnement. Kies eerst een kot.",
		});
	}
	return subscription;
}

export const subscriptionRouter = router({
	current: protectedProcedure.query(async ({ ctx }) => {
		const subscription = await ctx.getSubscription();
		if (!subscription) return null;
		const claimsUsed = await claimsUsedThisYear(ctx, ctx.session.user.id);
		return {
			plan: subscription.plan,
			currentPeriodEnd: subscription.currentPeriodEnd,
			cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
			claimsUsed,
			claimsLeft: Math.max(0, subscription.plan.claimsPerYear - claimsUsed),
		};
	}),
});
