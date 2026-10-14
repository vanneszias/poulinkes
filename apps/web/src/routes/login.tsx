import { getPlan, type PlanSlug } from "@poulinkes/api/plans";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { LegBand } from "@/components/leg-band";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	validateSearch: (search): { plan?: PlanSlug } => ({
		plan: getPlan(String(search.plan ?? ""))?.slug,
	}),
	head: () => ({ meta: [{ title: "Inloggen | Poulinkes" }] }),
});

function LoginPage() {
	const { plan: planSlug } = Route.useSearch();
	const plan = planSlug ? getPlan(planSlug) : undefined;
	// Coming from a plan means you're most likely new here.
	const [mode, setMode] = useState<"sign-in" | "sign-up">(
		plan ? "sign-up" : "sign-in",
	);

	return (
		<div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
			<div>
				<h1 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
					{mode === "sign-up" ? "Maak je account aan" : "Welkom terug"}
				</h1>
				<p className="mt-4 max-w-sm text-lg text-muted-foreground">
					{plan
						? `Daarna ga je meteen door naar de betaling voor je ${plan.name}.`
						: "In je account zie je je kippen, je abonnement en je vossenmeldingen."}
				</p>
				{plan && (
					<LegBand
						number={plan.chickens}
						name={plan.name}
						trait={`€${plan.price} per maand, ${plan.chickens} legkippen`}
						className="mt-10 max-w-sm"
					/>
				)}
			</div>
			<div className="rounded-[2rem] border-2 border-ink/10 bg-white p-7 md:p-10">
				<AuthForm
					key={mode}
					mode={mode}
					plan={planSlug}
					onSwitchMode={() =>
						setMode(mode === "sign-up" ? "sign-in" : "sign-up")
					}
				/>
			</div>
		</div>
	);
}
