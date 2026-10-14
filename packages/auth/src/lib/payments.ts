import { Polar } from "@polar-sh/sdk";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";

export type PolarConfig = {
	POLAR_ACCESS_TOKEN: string;
	/** "sandbox" or "production" */
	POLAR_SERVER: string;
};

export function createPolarClient(config: PolarConfig) {
	return new Polar({
		accessToken: config.POLAR_ACCESS_TOKEN,
		server: config.POLAR_SERVER === "production" ? "production" : "sandbox",
	});
}

export type ActivePolarSubscription = {
	productId: string;
	currentPeriodEnd: Date;
	cancelAtPeriodEnd: boolean;
};

/** Active subscriptions of a user, looked up by the Better Auth user ID (Polar external ID). */
export async function getActiveSubscriptions(
	config: PolarConfig,
	userId: string,
): Promise<ActivePolarSubscription[]> {
	try {
		const state = await createPolarClient(config).customers.getStateExternal({
			externalId: userId,
		});
		return state.activeSubscriptions.map((subscription) => ({
			productId: subscription.productId,
			currentPeriodEnd: subscription.currentPeriodEnd,
			cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
		}));
	} catch (error) {
		if (error instanceof ResourceNotFound) return [];
		throw error;
	}
}
