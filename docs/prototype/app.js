const pick = (list) => list[Math.floor(Math.random() * list.length)];

// --- Kippennaamgenerator ---------------------------------------------------

const STYLES = {
	vlaams: {
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
			"Nonkel Jef",
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
		],
		tags: [
			"legt elke dag om 7u stipt",
			"kent iedereen in de straat",
			"pikt naar de postbode",
			"is altijd eerst bij het voer",
			"zit graag op de tuinstoel",
		],
	},
	deftig: {
		first: [
			"Madame",
			"Gravin",
			"Lady",
			"Barones",
			"Duchesse",
			"Professor",
			"Dokter",
			"Monseigneur",
		],
		last: [
			"Pluimeau",
			"de Kakelière",
			"von Eierstein",
			"Featherington",
			"van Hoenderdaele",
			"Dooierwijck",
			"du Poulailler",
		],
		tags: [
			"drinkt enkel regenwater",
			"legt uitsluitend extra-large",
			"heeft een hekel aan modder",
			"stamt af van Napoleons kippen",
			"neemt geen bevelen aan van hanen",
		],
	},
	rock: {
		first: [
			"Kip",
			"Lady",
			"Big",
			"Little",
			"Sister",
			"Mama",
			"Wild",
			"Johnny",
			"Queen",
		],
		last: [
			"Thunderwing",
			"Rocksnavel",
			"Eggstorm",
			"Pluimbreker",
			"Kakelstar",
			"Hennessy",
			"Graanbarones",
			"Scratch",
		],
		tags: [
			"krijst op de maat",
			"is al twee keer ontsnapt",
			"vreest geen vos",
			"heeft een punkkuif",
			"slaapt nooit in het hok",
		],
	},
	woordgrap: {
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
			"Leg",
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
		],
		tags: [
			"legt eieren met woordspelingen",
			"heeft een zwak voor gerstekorrels",
			"is de ei-gen-wijste van het kot",
			"ziet het allemaal zitten",
			"is een echte kakelaar",
		],
	},
};

function chickenName(style) {
	const s = STYLES[style];
	return { name: `${pick(s.first)} ${pick(s.last)}`, tag: pick(s.tags) };
}

function uniqueNames(style, count) {
	const seen = new Map();
	for (let tries = 0; seen.size < count && tries < count * 20; tries++) {
		const c = chickenName(style);
		if (!seen.has(c.name)) seen.set(c.name, c);
	}
	return [...seen.values()];
}

const namesEl = document.getElementById("names");
const shareBtn = document.getElementById("share");
const sharedEl = document.getElementById("shared");
let current = [];

document.getElementById("generate").addEventListener("click", () => {
	const style = document.getElementById("style").value;
	const count = Math.min(
		12,
		Math.max(1, +document.getElementById("count").value || 1),
	);
	current = uniqueNames(style, count);
	namesEl.innerHTML = "";
	current.forEach((c, i) => {
		const li = document.createElement("li");
		li.style.animationDelay = `${i * 60}ms`;
		li.textContent = c.name;
		const small = document.createElement("small");
		small.textContent = c.tag;
		li.append(small);
		namesEl.append(li);
	});
	shareBtn.hidden = false;
	sharedEl.textContent = "";
});

shareBtn.addEventListener("click", async () => {
	const text = `Mijn kippenbende: ${current.map((c) => c.name).join(", ")} 🐔 Verzin de jouwe op poulinkes.be/namen`;
	try {
		if (navigator.share)
			await navigator.share({ title: "Mijn kippenbende", text });
		else {
			await navigator.clipboard.writeText(text);
			sharedEl.textContent =
				"Gekopieerd! Plak het op Insta, Facebook of in de familiegroep.";
		}
	} catch {
		/* gebruiker annuleerde */
	}
});

// --- Abonnement kiezen ------------------------------------------------------

const signup = document.getElementById("signup");
for (const btn of document.querySelectorAll(".choose")) {
	btn.addEventListener("click", () => {
		document.getElementById("chosen").textContent =
			btn.closest(".plan").dataset.plan;
		signup.hidden = false;
		signup.scrollIntoView({ behavior: "smooth", block: "center" });
	});
}

signup.addEventListener("submit", (e) => {
	e.preventDefault();
	const nr = `POU-${Math.floor(10000 + Math.random() * 90000)}`;
	signup.querySelector(".result").textContent =
		`Welkom bij Poulinkes! Uw abonnementsnummer is ${nr}. Uw kiekens worden ingepland.`;
});

// --- Vossenclaim ------------------------------------------------------------

const claim = document.getElementById("claim");
claim.datum.max = new Date().toISOString().slice(0, 10);
claim.addEventListener("submit", (e) => {
	e.preventDefault();
	const n = +claim.aantal.value;
	claim.querySelector(".result").textContent =
		`Claim ontvangen. ${n} vervangkip${n > 1 ? "pen" : ""} onderweg binnen 48 uur. Sterkte. 🦊❌`;
});
