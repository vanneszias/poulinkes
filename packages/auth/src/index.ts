import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import type { Database } from "@poulinkes/db";
import * as schema from "@poulinkes/db/schema/auth";
import { betterAuth } from "better-auth";

import { createPolarClient, type PolarConfig } from "./lib/payments";

export type AuthConfig = PolarConfig & {
	BETTER_AUTH_URL: string;
	BETTER_AUTH_SECRET: string;
	CORS_ORIGIN: string;
	POLAR_SUCCESS_URL: string;
	POLAR_PRODUCT_STADSKOT: string;
	POLAR_PRODUCT_FAMILIEKOT: string;
	POLAR_PRODUCT_BOERDERIJBENDE: string;
};

/** Plan slug → Polar product ID. Slugs match `PLANS` in @poulinkes/api/plans. */
export function polarProducts(env: AuthConfig) {
	return {
		stadskot: env.POLAR_PRODUCT_STADSKOT,
		familiekot: env.POLAR_PRODUCT_FAMILIEKOT,
		boerderijbende: env.POLAR_PRODUCT_BOERDERIJBENDE,
	};
}

export function createAuth(
	env: AuthConfig,
	database: Database,
	desktopOrigins: readonly string[] = [],
) {
	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "sqlite",
			schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN, ...desktopOrigins],
		emailAndPassword: { enabled: true },
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [
			polar({
				client: createPolarClient(env),
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: Object.entries(polarProducts(env)).map(
							([slug, productId]) => ({
								slug,
								productId,
							}),
						),
						successUrl: env.POLAR_SUCCESS_URL,
						authenticatedUsersOnly: true,
					}),
					portal(),
				],
			}),
		],
	});
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
