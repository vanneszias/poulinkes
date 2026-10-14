import { buttonVariants } from "@poulinkes/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LegBand } from "@/components/leg-band";

export const Route = createFileRoute("/welkom")({
	component: WelcomePage,
	head: () => ({ meta: [{ title: "Welkom bij Poulinkes" }] }),
});

const NEXT = [
	"Binnen twee werkdagen belt de kweker uit je streek om een leverdag af te spreken.",
	"Op die dag brengt hij je kippen, met een bandje rond hun poot.",
	"Geef ze intussen al een naam in je account. Dan staat die mee op het bandje.",
];

function WelcomePage() {
	return (
		<div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
			<div>
				<h1 className="font-extrabold text-[clamp(2.4rem,5vw,4rem)] [font-stretch:118%]">
					Welkom bij Poulinkes
				</h1>
				<p className="mt-5 text-lg text-muted-foreground">
					Je betaling is gelukt en je abonnement loopt. Dit gebeurt er nu:
				</p>
				<ol className="mt-8 grid gap-5">
					{NEXT.map((step, i) => (
						<li key={step} className="flex gap-4">
							<span className="grid size-9 shrink-0 place-items-center rounded-full bg-shutter font-bold font-display text-chalk">
								{i + 1}
							</span>
							<span className="pt-1">{step}</span>
						</li>
					))}
				</ol>
				<Link
					to="/kot"
					className={buttonVariants({ size: "lg", className: "mt-10" })}
				>
					Naar mijn kot
				</Link>
			</div>
			<div className="grid content-center gap-4" aria-hidden>
				<LegBand
					number={1}
					name="Nog geen naam"
					trait="Kies er een in je account"
					className="-rotate-2"
				/>
				<LegBand
					number={2}
					name="Nog geen naam"
					trait="Kies er een in je account"
					className="rotate-1"
				/>
			</div>
		</div>
	);
}
