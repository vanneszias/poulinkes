import { chicken, foxClaim } from "@poulinkes/db/schema/index";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import z from "zod";

import { protectedProcedure, router } from "../index";
import { claimsUsedThisYear, requireSubscription } from "./subscription";

/** Claims must be filed within this many days of the attack. */
export const CLAIM_WINDOW_DAYS = 7;

const isoDate = z.iso.date("Kies de datum van de aanval.");

export const claimsRouter = router({
	list: protectedProcedure.query(({ ctx }) =>
		ctx.db
			.select()
			.from(foxClaim)
			.where(eq(foxClaim.userId, ctx.session.user.id))
			.orderBy(desc(foxClaim.createdAt)),
	),

	create: protectedProcedure
		.input(
			z.object({
				happenedOn: isoDate,
				/** Named chickens that were taken. */
				chickenIds: z.array(z.string()).default([]),
				/** Chickens without a name that were taken. */
				unnamedLost: z.number().int().min(0).default(0),
				coopWasClosed: z.boolean(),
				postalCode: z
					.string()
					.regex(/^[1-9]\d{3}$/, "Vul een Belgische postcode in, bv. 9000."),
				notes: z.string().trim().max(1000).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { plan } = await requireSubscription(ctx);
			const userId = ctx.session.user.id;

			const daysAgo = (Date.now() - Date.parse(input.happenedOn)) / 86_400_000;
			if (daysAgo < -1 || daysAgo > CLAIM_WINDOW_DAYS) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Meld een aanval binnen ${CLAIM_WINDOW_DAYS} dagen. Die datum valt erbuiten.`,
				});
			}

			if ((await claimsUsedThisYear(ctx, userId)) >= plan.claimsPerYear) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Je hebt je ${plan.claimsPerYear} vervanging(en) voor dit jaar al gebruikt. Neem contact op, dan zoeken we samen een oplossing.`,
				});
			}

			const total = input.chickenIds.length + input.unnamedLost;
			if (total < 1 || total > plan.chickens) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Duid aan hoeveel kippen de vos heeft meegenomen (maximaal ${plan.chickens}).`,
				});
			}

			const taken =
				input.chickenIds.length === 0
					? []
					: await ctx.db
							.select({ id: chicken.id })
							.from(chicken)
							.where(
								and(
									eq(chicken.userId, userId),
									inArray(chicken.id, input.chickenIds),
									isNull(chicken.lostToFoxAt),
								),
							);
			if (taken.length !== input.chickenIds.length) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Een van die kippen staat niet (meer) in je kot.",
				});
			}

			const claimId = crypto.randomUUID();
			await ctx.db.batch([
				ctx.db.insert(foxClaim).values({
					id: claimId,
					userId,
					chickensLost: total,
					happenedOn: input.happenedOn,
					coopWasClosed: input.coopWasClosed,
					postalCode: input.postalCode,
					notes: input.notes,
				}),
				ctx.db
					.update(chicken)
					.set({ lostToFoxAt: new Date(input.happenedOn) })
					.where(
						and(
							eq(chicken.userId, userId),
							inArray(chicken.id, input.chickenIds),
						),
					),
			]);
			return { id: claimId };
		}),
});
