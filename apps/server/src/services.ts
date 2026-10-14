import type { ActiveSubscription } from "@poulinkes/api/context";
import { getPlan } from "@poulinkes/api/plans";
import {
	createAuth as createConfiguredAuth,
	polarProducts,
} from "@poulinkes/auth";
import { getActiveSubscriptions } from "@poulinkes/auth/lib/payments";
import { createDb, type Database } from "@poulinkes/db";

import { ENV } from "./env.server";

export function getDb(): Database {
	return createDb(ENV);
}
export async function createAuth(database?: Database) {
	return createConfiguredAuth(ENV, database ?? (await getDb()));
}

export async function getSubscription(
	userId: string,
): Promise<ActiveSubscription | null> {
	const products = Object.entries(polarProducts(ENV));
	for (const subscription of await getActiveSubscriptions(ENV, userId)) {
		const slug = products.find(
			([, productId]) => productId === subscription.productId,
		)?.[0];
		const plan = slug ? getPlan(slug) : undefined;
		if (plan) return { ...subscription, plan };
	}
	return null;
}
