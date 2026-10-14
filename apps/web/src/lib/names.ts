export const NAME_STYLES = {
	vlaams: {
		label: "Klassiek Vlaams",
		first: [
			"Gerda",
			"Marieke",
			"Jeanine",
			"Rosa",
			"Godelieve",
			"Mariette",
			"Bertha",
			"Paula",
			"Lieve",
			"Rita",
			"Agnes",
			"Mieke",
			"Fientje",
			"Josée",
			"Monique",
			"Hilda",
			"Germaine",
		],
		last: [
			"Van den Hoek",
			"De Pluim",
			"Van de Mesthoop",
			"Kakelaers",
			"Vanderei",
			"De Smet",
			"Pikkemaat",
			"Verstraeten",
			"Van 't Kot",
			"Vandenbroeck",
			"De Leghenne",
			"Van Graanbeke",
		],
		traits: [
			"legt elke dag om zeven uur stipt",
			"kent iedereen in de straat",
			"pikt naar de postbode",
			"is altijd als eerste bij het voer",
			"zit graag op de tuinstoel",
			"houdt de buurt in de gaten vanop de mesthoop",
			"eet liever slaresten dan legmeel",
		],
	},
	deftig: {
		label: "Deftig",
		first: [
			"Madame",
			"Gravin",
			"Lady",
			"Barones",
			"Duchesse",
			"Professor",
			"Dokter",
			"Jonkvrouw",
		],
		last: [
			"Pluimeau",
			"de Kakelière",
			"von Eierstein",
			"Featherington",
			"van Hoenderdaele",
			"Dooierwijck",
			"du Poulailler",
			"de Grainville",
		],
		traits: [
			"drinkt enkel regenwater",
			"legt uitsluitend extra grote eieren",
			"heeft een hekel aan modder",
			"neemt geen bevelen aan van hanen",
			"verwacht haar graan op een schoteltje",
			"stamt naar eigen zeggen af van een keizerlijke kip",
		],
	},
	stoer: {
		label: "Stoer",
		first: [
			"Kip",
			"Lady",
			"Big",
			"Little",
			"Sister",
			"Mama",
			"Wild",
			"Queen",
			"Ma",
		],
		last: [
			"Thunderwing",
			"Rocksnavel",
			"Eggstorm",
			"Pluimbreker",
			"Kakelstar",
			"Scratch",
			"Graanbarones",
			"Ijzerpoot",
		],
		traits: [
			"kakelt op de maat",
			"is al twee keer ontsnapt",
			"jaagt de kat de tuin uit",
			"heeft een kuif als een punker",
			"slaapt het liefst op het dak van het hok",
			"staart de vos recht in de ogen",
		],
	},
	woordgrap: {
		label: "Woordgrappen",
		first: [
			"Kip",
			"Hennie",
			"Eierik",
			"Kakelien",
			"Pluimke",
			"Dooier",
			"Henriëtte",
			"Tokkie",
			"Kiplinda",
			"Eggbert",
			"Omeletta",
		],
		last: [
			"Pootjes",
			"Omelet",
			"Scharrelaar",
			"Kakelbont",
			"Broedzak",
			"Eierbal",
			"Vederlicht",
			"Krokantje",
			"Legmeester",
			"Spiegelei",
		],
		traits: [
			"is de ei-gen-wijste van het kot",
			"ziet het allemaal zitten",
			"heeft het hart op de juiste plek, net onder de vleugel",
			"legt eieren met een knipoog",
			"is een echte kakelaar",
		],
	},
} as const;

export type NameStyle = keyof typeof NAME_STYLES;

export type ChickenName = { name: string; trait: string };

const pick = <T>(list: readonly T[]) =>
	list[Math.floor(Math.random() * list.length)];

export function generateNames(style: NameStyle, count: number): ChickenName[] {
	const { first, last, traits } = NAME_STYLES[style];
	const names = new Map<string, ChickenName>();
	for (let tries = 0; names.size < count && tries < count * 25; tries++) {
		const name = `${pick(first)} ${pick(last)}`;
		if (!names.has(name)) names.set(name, { name, trait: pick(traits) });
	}
	return [...names.values()];
}

export function isNameStyle(value: unknown): value is NameStyle {
	return typeof value === "string" && value in NAME_STYLES;
}
