import { initTRPC, TRPCError } from "@trpc/server";
import z from "zod";

import type { Context } from "./context";

// Default zod messages ("Invalid input", ...) in Dutch, like our own.
z.config(z.locales.nl());

export const t = initTRPC.context<Context>().create({
	errorFormatter({ shape, error }) {
		// Show the first validation problem instead of the raw JSON list of issues.
		if (error.cause instanceof z.ZodError) {
			return {
				...shape,
				message:
					error.cause.issues[0]?.message ?? "Er klopt iets niet aan je invoer.",
			};
		}
		// Unexpected errors can carry database details; keep those in the logs.
		if (error.code === "INTERNAL_SERVER_ERROR") {
			return {
				...shape,
				message: "Er ging iets mis aan onze kant. Probeer het opnieuw.",
			};
		}
		return shape;
	},
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Je bent niet (meer) aangemeld. Meld je opnieuw aan.",
			cause: "No session",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});
