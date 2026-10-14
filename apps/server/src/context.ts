import type { Context as ApiContext } from "@poulinkes/api/context";
import type { Context as HonoContext } from "hono";

import { createAuth, getDb, getSubscription } from "./services";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<ApiContext> {
	const db = await getDb();
	const session = await (await createAuth(db)).api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		db,
		session,
		getSubscription: async () =>
			session ? getSubscription(session.user.id) : null,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
