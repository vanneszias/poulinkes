import type { Session } from "@poulinkes/auth";
import type { Database } from "@poulinkes/db";

import type { Plan } from "./plans";

export type ActiveSubscription = {
	plan: Plan;
	currentPeriodEnd: Date;
	cancelAtPeriodEnd: boolean;
};

export type Context = {
	session: Session | null;
	db: Database;
	/** Looks up the signed-in user's subscription at Polar. Only call it when needed. */
	getSubscription: () => Promise<ActiveSubscription | null>;
};
