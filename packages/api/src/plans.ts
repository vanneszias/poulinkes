export const PLANS = [
	{
		slug: "stadskot",
		name: "Stadskot",
		price: 9,
		chickens: 2,
		claimsPerYear: 1,
		pitch: "Voor een stadstuin met plaats voor een klein hok.",
		perks: [
			"2 legkippen",
			"1 vervanging per jaar na een vossenaanval",
			"Naambandjes voor je kippen",
		],
	},
	{
		slug: "familiekot",
		name: "Familiekot",
		price: 15,
		chickens: 4,
		claimsPerYear: 2,
		pitch: "Genoeg eieren voor een gezin, elke week.",
		perks: [
			"4 legkippen",
			"2 vervangingen per jaar na een vossenaanval",
			"Naambandjes voor je kippen",
			"Jaarlijks een zak legmeel",
		],
	},
	{
		slug: "boerderijbende",
		name: "Boerderijbende",
		price: 25,
		chickens: 8,
		claimsPerYear: 6,
		pitch: "Voor wie een echte ren heeft en eieren uitdeelt aan de buren.",
		perks: [
			"8 legkippen",
			"Tot 6 vervangingen per jaar na een vossenaanval",
			"Naambandjes voor je kippen",
			"Advies over een vosbestendige ren",
		],
	},
] as const;

export type Plan = (typeof PLANS)[number];
export type PlanSlug = Plan["slug"];

export function getPlan(slug: string): Plan | undefined {
	return PLANS.find((plan) => plan.slug === slug);
}
