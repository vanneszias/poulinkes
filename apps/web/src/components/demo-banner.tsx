export const TEST_CARD = "4242 4242 4242 4242";

export function DemoBanner() {
	return (
		<div role="note" className="bg-yolk px-5 py-2 text-center text-ink text-sm">
			<strong>Let op: dit is een demo.</strong> Poulinkes bestaat niet en
			betalingen zijn niet echt. Test de volledige flow met kaartnummer{" "}
			<code className="font-mono font-semibold">{TEST_CARD}</code>, een
			vervaldatum in de toekomst en een willekeurige CVC.
		</div>
	);
}
