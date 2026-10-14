import { chicken } from "@poulinkes/db/schema/index";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, isNull, max } from "drizzle-orm";
import z from "zod";

import { protectedProcedure, router } from "../index";
import { requireSubscription } from "./subscription";

export const flockRouter = router({
	list: protectedProcedure.query(({ ctx }) =>
		ctx.db
			.select()
			.from(chicken)
			.where(eq(chicken.userId, ctx.session.user.id))
			.orderBy(asc(chicken.bandNumber)),
	),

	add: protectedProcedure
		.input(
			z.object({
				name: z.string().trim().min(1, "Geef je kip een naam.").max(60),
				trait: z.string().trim().max(120).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { plan } = await requireSubscription(ctx);
			const userId = ctx.session.user.id;

			const living = await ctx.db.$count(
				chicken,
				and(eq(chicken.userId, userId), isNull(chicken.lostToFoxAt)),
			);
			if (living >= plan.chickens) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Je ${plan.name} heeft plaats voor ${plan.chickens} kippen. Ze hebben allemaal al een naam.`,
				});
			}

			const [last] = await ctx.db
				.select({ highest: max(chicken.bandNumber) })
				.from(chicken)
				.where(eq(chicken.userId, userId));

			const [created] = await ctx.db
				.insert(chicken)
				.values({
					id: crypto.randomUUID(),
					userId,
					name: input.name,
					trait: input.trait,
					bandNumber: (last?.highest ?? 0) + 1,
				})
				.returning();
			return created;
		}),

	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(chicken)
				.where(
					and(
						eq(chicken.id, input.id),
						eq(chicken.userId, ctx.session.user.id),
					),
				);
		}),
});
