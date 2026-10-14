import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import "varlock/auto-load";

/** Only the `prod` stage (`bun run deploy:prod`) claims the real domains. */
const PRODUCTION = process.env.ALCHEMY_STAGE === "prod";

export const db = Cloudflare.D1.Database("database", {
	migrations: "../../packages/db/src/migrations",
});

export const server = Cloudflare.Worker("server", {
	main: "../../apps/server/src/index.ts",
	compatibility: {
		flags: ["nodejs_compat"],
	},
	env: {
		DB: db,
		CORS_ORIGIN: Config.String("CORS_ORIGIN"),
		BETTER_AUTH_SECRET: Config.Redacted("BETTER_AUTH_SECRET"),
		BETTER_AUTH_URL: Cloudflare.Worker.URL,
		POLAR_ACCESS_TOKEN: Config.Redacted("POLAR_ACCESS_TOKEN"),
		POLAR_SUCCESS_URL: Config.String("POLAR_SUCCESS_URL"),
		POLAR_SERVER: Config.String("POLAR_SERVER"),
		POLAR_PRODUCT_STADSKOT: Config.String("POLAR_PRODUCT_STADSKOT"),
		POLAR_PRODUCT_FAMILIEKOT: Config.String("POLAR_PRODUCT_FAMILIEKOT"),
		POLAR_PRODUCT_BOERDERIJBENDE: Config.String("POLAR_PRODUCT_BOERDERIJBENDE"),
	},
	domain: PRODUCTION ? "api.poulinkes.com" : undefined,
	dev: {
		port: 3000,
	},
});

export type ServerEnv = Cloudflare.InferEnv<typeof server>;

export default Alchemy.Stack(
	"poulinkes",
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const serverWorker = yield* server;
		const webWorker = yield* Cloudflare.Website.Vite("web", {
			rootDir: "../../apps/web",
			assets: {
				htmlHandling: "auto-trailing-slash",
				notFoundHandling: "single-page-application",
			},
			domain: PRODUCTION
				? { name: "poulinkes.com", redirects: ["www.poulinkes.com"] }
				: undefined,
			env: {
				VITE_SERVER_URL: serverWorker.url.as<string>(),
			},
			dev: {
				port: 3001,
			},
		});

		return {
			web: webWorker.url,
			server: serverWorker.url,
		};
	}),
);
