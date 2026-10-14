import { cn } from "@poulinkes/ui/lib/utils";
import type { ReactNode } from "react";

type LegBandProps = {
	number: number;
	name: string;
	trait?: string | null;
	/** Dims the band, e.g. for a chicken taken by the fox. */
	muted?: boolean;
	className?: string;
	style?: React.CSSProperties;
	children?: ReactNode;
};

/**
 * A poultry leg band: the numbered plastic ring keepers clip around a chicken's leg.
 * Used wherever a chicken gets a name.
 */
export function LegBand({
	number,
	name,
	trait,
	muted,
	className,
	style,
	children,
}: LegBandProps) {
	return (
		<div
			style={style}
			className={cn(
				"relative flex min-h-16 items-center gap-4 rounded-full border-2 border-ink py-2 pr-6 pl-2",
				"bg-[repeating-linear-gradient(90deg,transparent_0_14px,rgb(0_0_0/0.045)_14px_16px)] bg-yolk",
				"shadow-[0_3px_0_var(--ink)]",
				muted && "bg-muted bg-none text-muted-foreground shadow-none",
				className,
			)}
		>
			<span
				className={cn(
					"grid h-12 min-w-16 shrink-0 place-items-center rounded-full border-2 border-ink bg-white px-2 font-display font-extrabold text-lg tabular-nums [font-stretch:115%]",
					muted && "border-current bg-transparent",
				)}
			>
				<span className="sr-only">Bandnummer </span>
				{String(number).padStart(2, "0")}
			</span>
			<span className="min-w-0 flex-1">
				<span className="block truncate font-bold font-display text-xl leading-tight [font-stretch:120%]">
					{name}
				</span>
				{trait && (
					<span className="block truncate text-sm opacity-80">{trait}</span>
				)}
			</span>
			{children}
		</div>
	);
}
