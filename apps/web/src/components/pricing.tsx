import { PLANS, type Plan } from "@poulinkes/api/plans";
import { Button } from "@poulinkes/ui/components/button";
import { cn } from "@poulinkes/ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";

import { TEST_CARD } from "@/components/demo-banner";
import { authClient } from "@/lib/auth-client";
import { startCheckout } from "@/lib/checkout";

const FEATURED: Plan["slug"] = "familiekot";

export function Pricing() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();
	const [pending, setPending] = useState<Plan["slug"] | null>(null);

	async function choose(plan: Plan) {
		if (!session) {
			navigate({ to: "/login", search: { plan: plan.slug } });
			return;
		}
		setPending(plan.slug);
		await startCheckout(plan.slug);
		setPending(null);
	}

	return (
		<div>
			<div className="grid items-stretch gap-5 md:grid-cols-3">
				{PLANS.map((plan) => {
					const featured = plan.slug === FEATURED;
					return (
						<article
							key={plan.slug}
							className={cn(
								"flex flex-col rounded-3xl border-2 p-7",
								featured
									? "border-shutter bg-shutter text-chalk md:-my-4 md:py-11"
									: "border-ink/12 bg-white",
							)}
						>
							<div className="flex items-baseline justify-between gap-3">
								<h3 className="font-bold text-2xl [font-stretch:120%]">
									{plan.name}
								</h3>
								{featured && (
									<span className="rounded-full bg-yolk px-3 py-1 font-semibold text-ink text-sm">
										Meest gekozen
									</span>
								)}
							</div>
							<p
								className={cn(
									"mt-2",
									featured ? "text-chalk/80" : "text-muted-foreground",
								)}
							>
								{plan.pitch}
							</p>
							<p className="mt-6 flex items-baseline gap-1">
								<span className="font-display font-extrabold text-5xl [font-stretch:110%]">
									€{plan.price}
								</span>
								<span
									className={
										featured ? "text-chalk/80" : "text-muted-foreground"
									}
								>
									per maand
								</span>
							</p>
							<ul className="mt-6 grid flex-1 content-start gap-3">
								{plan.perks.map((perk) => (
									<li key={perk} className="flex gap-3">
										<Check
											aria-hidden
											className={cn(
												"mt-1 size-4 shrink-0",
												featured ? "text-yolk" : "text-shutter",
											)}
										/>
										{perk}
									</li>
								))}
							</ul>
							<Button
								size="lg"
								variant={featured ? "yolk" : "default"}
								className="mt-8 w-full"
								disabled={pending !== null}
								onClick={() => choose(plan)}
							>
								{pending === plan.slug
									? "Betaalpagina openen…"
									: `Kies ${plan.name}`}
							</Button>
						</article>
					);
				})}
			</div>
			<p className="mt-10 text-center text-muted-foreground text-sm">
				Demo: er wordt niets aangerekend. Betaal met testkaart{" "}
				<code className="font-mono font-semibold text-ink">{TEST_CARD}</code>,
				een vervaldatum in de toekomst en een willekeurige CVC.
			</p>
		</div>
	);
}
