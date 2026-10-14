// Alchemy validates deployment inputs with Varlock; Workers use native env bindings.
import type { PublicCoercedEnvSchema } from "./env";

export const ENV = {
	// biome-ignore lint/style/noNonNullAssertion: validated by Varlock at deploy time
	VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL!,
} satisfies Pick<PublicCoercedEnvSchema, "VITE_SERVER_URL">;
