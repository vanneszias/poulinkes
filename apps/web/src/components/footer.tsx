import { Link } from "@tanstack/react-router";

import { Wordmark } from "./wordmark";

export default function Footer() {
	return (
		<footer className="bg-shutter-deep text-chalk">
			<div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
				<div className="max-w-sm">
					<Wordmark className="text-3xl" />
					<p className="mt-4 text-chalk/75">
						Legkippen op abonnement, geleverd door kwekers uit je eigen streek.
						Neemt de vos er een mee, dan brengen we een nieuwe.
					</p>
				</div>
				<nav aria-label="Abonnement" className="grid content-start gap-2">
					<h2 className="mb-1 font-sans font-semibold text-base text-yolk">
						Abonnement
					</h2>
					<Link to="/" hash="prijzen" className="hover:underline">
						Prijzen
					</Link>
					<Link to="/" hash="vossengarantie" className="hover:underline">
						Vossengarantie
					</Link>
					<Link to="/" hash="vragen" className="hover:underline">
						Veelgestelde vragen
					</Link>
				</nav>
				<nav aria-label="Voor klanten" className="grid content-start gap-2">
					<h2 className="mb-1 font-sans font-semibold text-base text-yolk">
						Voor klanten
					</h2>
					<Link to="/kot" className="hover:underline">
						Mijn kot
					</Link>
					<Link to="/vos-melden" className="hover:underline">
						Vos melden
					</Link>
					<Link to="/namen" className="hover:underline">
						Kippennamen bedenken
					</Link>
				</nav>
			</div>
			<div className="border-chalk/15 border-t">
				<p className="mx-auto max-w-6xl px-5 py-6 text-chalk/60 text-sm">
					© {new Date().getFullYear()} Poulinkes. Kippen uit Vlaanderen, voor
					Vlaanderen.
				</p>
			</div>
		</footer>
	);
}
