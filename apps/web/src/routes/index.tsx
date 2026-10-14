import { buttonVariants } from "@poulinkes/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { NameGenerator } from "@/components/name-generator";
import { Pricing } from "@/components/pricing";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const STEPS = [
	{
		title: "Kies je kot",
		body: "Twee, vier of acht legkippen. Je betaalt per maand en zegt op wanneer je wil.",
	},
	{
		title: "Wij brengen je kippen",
		body: "Een kweker uit je streek levert gezonde, gevaccineerde hennen die klaar zijn om te leggen.",
	},
	{
		title: "Vos geweest? Meld het",
		body: "Duid in je account aan welke kippen weg zijn. Binnen 48 uur staan er nieuwe in je ren.",
	},
];

const GUARANTEE = [
	{
		term: "Nieuwe kippen binnen 48 uur",
		detail: "Geleverd door de partnerkweker die het dichtst bij je woont.",
	},
	{
		term: "Meld binnen 7 dagen",
		detail:
			"Met de datum van de aanval en welke kippen de vos heeft meegenomen.",
	},
	{
		term: "Hok 's nachts dicht",
		detail:
			"De garantie geldt als je kippen 's nachts in een gesloten hok zaten.",
	},
	{
		term: "Vervangingen per jaar",
		detail:
			"Eén bij Stadskot, twee bij Familiekot, tot zes bij Boerderijbende.",
	},
];

const FAQ = [
	{
		q: "Wat voor kippen krijg ik?",
		a: "Legkippen van ongeveer twintig weken oud, gevaccineerd en klaar om te leggen. Ze komen van een erkende kweker uit je eigen streek, zodat ze niet uren in een vrachtwagen zitten.",
	},
	{
		q: "Heb ik zelf een hok nodig?",
		a: "Ja. Je kippen hebben een hok nodig dat 's nachts dicht kan, en een ren om overdag in te scharrelen. Reken op minstens een paar vierkante meter per kip.",
	},
	{
		q: "Wat gebeurt er als ik opzeg?",
		a: "Je kippen blijven bij jou. Je abonnement loopt tot het einde van de betaalde maand, daarna vervalt de vossengarantie.",
	},
	{
		q: "Geldt de garantie ook voor de marter of de hond van de buren?",
		a: "De garantie is gemaakt voor de vos, maar een marter of losgelopen hond behandelen we op dezelfde manier. Meld het gewoon.",
	},
	{
		q: "Waar leveren jullie?",
		a: "Overal in Vlaanderen en Brussel. Bij het afsluiten van je abonnement zie je welke kweker bij jou levert.",
	},
];

function HomeComponent() {
	return (
		<>
			<section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 md:pt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
				<div>
					<h1 className="font-extrabold text-[clamp(2.3rem,5vw,4.2rem)] [font-stretch:112%]">
						Legkippen op abonnement, met vossen&shy;garantie.
					</h1>
					<p className="mt-7 max-w-[34rem] text-lg text-muted-foreground md:text-xl">
						Je krijgt gezonde hennen van een kweker uit je streek. Neemt de vos
						er een mee? Meld het, en binnen 48 uur staat er een nieuwe kip in je
						ren.
					</p>
					<div className="mt-9 flex flex-wrap gap-3">
						<Link
							to="/"
							hash="prijzen"
							className={buttonVariants({ size: "lg" })}
						>
							Kies je kot
						</Link>
						<Link
							to="/"
							hash="hoe-het-werkt"
							className={buttonVariants({ size: "lg", variant: "outline" })}
						>
							Hoe het werkt
						</Link>
					</div>
				</div>

				<div className="rounded-[2rem] border-2 border-ink/10 bg-white p-6 md:p-8">
					<h2 className="font-bold text-2xl [font-stretch:115%]">
						Hoe gaan ze heten?
					</h2>
					<p className="mt-1 mb-6 text-muted-foreground">
						Elke kip krijgt een bandje met haar naam. Wat dacht je van deze?
					</p>
					<NameGenerator />
					<Link
						to="/namen"
						className="mt-5 inline-block font-semibold text-shutter underline decoration-2 decoration-yolk underline-offset-4"
					>
						Meer namen bedenken
					</Link>
				</div>
			</section>

			<section
				id="hoe-het-werkt"
				className="scroll-mt-20 border-ink/10 border-y bg-white"
			>
				<div className="mx-auto max-w-6xl px-5 py-20">
					<h2 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
						Hoe het werkt
					</h2>
					<ol className="mt-12 grid gap-10 md:grid-cols-3">
						{STEPS.map((step, i) => (
							<li key={step.title} className="border-shutter border-t-4 pt-6">
								<span className="font-display font-extrabold text-shutter text-xl tabular-nums [font-stretch:130%]">
									Stap {i + 1}
								</span>
								<h3 className="mt-2 font-bold text-2xl">{step.title}</h3>
								<p className="mt-3 max-w-[30ch] text-muted-foreground">
									{step.body}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section
				id="prijzen"
				className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24"
			>
				<div className="mb-14 max-w-2xl">
					<h2 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
						Kies je kot
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Maandelijks opzegbaar. Levering en vossengarantie zitten in de
						prijs.
					</p>
				</div>
				<Pricing />
			</section>

			<section
				id="vossengarantie"
				className="scroll-mt-20 bg-shutter text-chalk"
			>
				<div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.2fr]">
					<div>
						<h2 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
							De vossen&shy;garantie
						</h2>
						<p className="mt-6 max-w-md text-chalk/80 text-lg">
							Een vos kan in één nacht een heel kot leegmaken. Dat is erg
							genoeg. Daarom hoef je niet ook nog eens op zoek naar nieuwe
							kippen: dat doen wij.
						</p>
						<Link
							to="/vos-melden"
							className={buttonVariants({
								variant: "yolk",
								size: "lg",
								className: "mt-8",
							})}
						>
							Vos melden
						</Link>
					</div>
					<dl className="grid gap-px overflow-hidden rounded-3xl bg-chalk/15 sm:grid-cols-2">
						{GUARANTEE.map((item) => (
							<div key={item.term} className="bg-shutter-deep p-7">
								<dt className="border-fox border-l-4 pl-3 font-semibold text-lg">
									{item.term}
								</dt>
								<dd className="mt-3 text-chalk/75">{item.detail}</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			<section
				id="vragen"
				className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24"
			>
				<h2 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
					Vragen
				</h2>
				<div className="mt-10 divide-y divide-ink/12 border-ink/12 border-y">
					{FAQ.map((item) => (
						<details key={item.q} className="group py-5">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-lg [&::-webkit-details-marker]:hidden">
								{item.q}
								<span
									aria-hidden
									className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink/20 text-xl leading-none transition-transform group-open:rotate-45"
								>
									+
								</span>
							</summary>
							<p className="mt-3 max-w-[65ch] text-muted-foreground">
								{item.a}
							</p>
						</details>
					))}
				</div>
			</section>
		</>
	);
}
