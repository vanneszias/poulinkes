import type { PlanSlug } from "@poulinkes/api/plans";
import { toast } from "sonner";

import { authClient } from "./auth-client";

/** Sends a signed-in user to Polar checkout for the given plan. */
export async function startCheckout(plan: PlanSlug) {
	const { error } = await authClient.checkout({ slug: plan });
	if (error) {
		toast.error(
			"De betaalpagina kon niet geopend worden. Probeer het opnieuw.",
		);
	}
}
