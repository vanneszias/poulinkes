import { Button } from "@poulinkes/ui/components/button";
import { cn } from "@poulinkes/ui/lib/utils";
import { Share2, Shuffle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	type ChickenName,
	generateNames,
	NAME_STYLES,
	type NameStyle,
} from "@/lib/names";

import { LegBand } from "./leg-band";

type NameGeneratorProps = {
	count?: number;
	initialStyle?: NameStyle;
	/** Show the style picker and share button. */
	full?: boolean;
	/** Turns each band into a pick action, e.g. to name a chicken in your flock. */
	onPick?: (chicken: ChickenName) => void;
	pickLabel?: string;
	className?: string;
};

export function NameGenerator({
	count = 3,
	initialStyle = "vlaams",
	full = false,
	onPick,
	pickLabel = "Kies",
	className,
}: NameGeneratorProps) {
	const [style, setStyle] = useState<NameStyle>(initialStyle);
	const [names, setNames] = useState(() => generateNames(initialStyle, count));

	function shuffle(nextStyle = style) {
		setStyle(nextStyle);
		setNames(generateNames(nextStyle, count));
	}

	async function share() {
		const url = `${window.location.origin}/namen`;
		const text = `Mijn kippen heten ${names.map((c) => c.name).join(", ")}. Bedenk namen voor de jouwe:`;
		if (navigator.share) {
			await navigator
				.share({ title: "Kippennamen van Poulinkes", text, url })
				.catch(() => {});
			return;
		}
		try {
			await navigator.clipboard.writeText(`${text} ${url}`);
			toast.success("Gekopieerd. Plak het waar je wil.");
		} catch {
			toast.error(
				"Kopiëren lukte niet. Selecteer de namen en kopieer ze zelf.",
			);
		}
	}

	return (
		<div className={cn("grid gap-6", className)}>
			{full && (
				<fieldset>
					<legend className="mb-3 font-semibold">Stijl</legend>
					<div className="flex flex-wrap gap-2">
						{(Object.keys(NAME_STYLES) as NameStyle[]).map((key) => (
							<label
								key={key}
								className={cn(
									"cursor-pointer rounded-full border-2 px-4 py-2 font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-shutter has-focus-visible:outline-offset-2",
									style === key
										? "border-ink bg-ink text-chalk"
										: "border-ink/20 bg-white hover:border-ink/50",
								)}
							>
								<input
									type="radio"
									name="name-style"
									value={key}
									checked={style === key}
									onChange={() => shuffle(key)}
									className="sr-only"
								/>
								{NAME_STYLES[key].label}
							</label>
						))}
					</div>
				</fieldset>
			)}

			<ul className="grid gap-4" aria-live="polite">
				{names.map((chicken, i) => (
					<li
						key={chicken.name}
						className="fade-in slide-in-from-left-6 animate-in fill-mode-both duration-500"
						style={{ animationDelay: `${i * 70}ms` }}
					>
						<LegBand number={i + 1} name={chicken.name} trait={chicken.trait}>
							{onPick && (
								<Button size="sm" onClick={() => onPick(chicken)}>
									{pickLabel}
								</Button>
							)}
						</LegBand>
					</li>
				))}
			</ul>

			<div className="flex flex-wrap gap-3">
				<Button variant="outline" onClick={() => shuffle()}>
					<Shuffle aria-hidden />
					Andere namen
				</Button>
				{full && (
					<Button variant="ghost" onClick={share}>
						<Share2 aria-hidden />
						Deel deze namen
					</Button>
				)}
			</div>
		</div>
	);
}
