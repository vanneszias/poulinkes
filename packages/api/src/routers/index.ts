import { publicProcedure, router } from "../index";
import { claimsRouter } from "./claims";
import { flockRouter } from "./flock";
import { subscriptionRouter } from "./subscription";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	subscription: subscriptionRouter,
	flock: flockRouter,
	claims: claimsRouter,
});
export type AppRouter = typeof appRouter;
