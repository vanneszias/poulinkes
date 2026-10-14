import { buttonVariants } from "@poulinkes/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { NameGenerator } from "@/components/name-generator";
import { isNameStyle, type NameStyle } from "@/lib/names";

export const Route = createFileRoute("/namen")({
	component: NamesPage,
	validateSearch: (search): { stijl?: NameStyle } => ({
		stijl: isNameStyle(search.stijl) ? search.stijl : undefined,
	}),
	head: () => ({
		meta: [
			{ title: "Kippennamen bedenken | Poulinkes" },
			{
				name: "description",
				content:
					"Op zoek naar een naam voor je kip? Van Godelieve Van 't Kot tot Gravin von Eierstein: bedenk er een paar en deel ze.",
			},
		],
	}),
});

function NamesPage() {
	const { stijl } = Route.useSearch();

	return (
		<div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
			<div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
				<div>
					<h1 className="font-extrabold text-[clamp(2.4rem,5vw,4rem)] [font-stretch:118%]">
						Kippennamen bedenken
					</h1>
					<p className="mt-6 max-w-md text-lg text-muted-foreground">
						Een kip zonder naam is gewoon een kip. Kies een stijl, schud tot je
						iets goeds hebt, en deel je favorieten met wie ook kippen heeft.
					</p>
					<p className="mt-4 max-w-md text-muted-foreground">
						Met een abonnement krijgt elke kip een bandje met haar naam, en zie
						je ze allemaal terug in je account.
					</p>
					<Link
						to="/"
						hash="prijzen"
						className={buttonVariants({ className: "mt-8" })}
					>
						Bekijk de abonnementen
					</Link>
				</div>
				<div className="rounded-[2rem] border-2 border-ink/10 bg-white p-6 md:p-10">
					<NameGenerator full count={5} initialStyle={stijl} />
				</div>
			</div>
		</div>
	);
}
