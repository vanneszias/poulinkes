import type { PlanSlug } from "@poulinkes/api/plans";
import { toast } from "sonner";

import { authClient } from "./auth-client";
import { authErrorMessage, errorMessage } from "./errors";

/** Sends a signed-in user to Polar checkout for the given plan. */
export async function startCheckout(plan: PlanSlug) {
	try {
		const { error } = await authClient.checkout({ slug: plan });
		if (error) {
			toast.error(
				`De betaalpagina kon niet geopend worden. ${authErrorMessage(error)}`,
			);
		}
	} catch (error) {
		toast.error(errorMessage(error));
	}
}
