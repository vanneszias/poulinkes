import { cn } from "@poulinkes/ui/lib/utils";

/** "Poulinkes" set extra wide, with a leg band standing in for the dot on the i. */
export function Wordmark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-baseline font-display font-extrabold text-2xl tracking-tight [font-stretch:135%]",
				className,
			)}
		>
			Poul
			<span className="relative">
				ı
				<span
					aria-hidden
					className="absolute -top-[0.08em] left-1/2 h-[0.2em] w-[0.42em] -translate-x-1/2 rounded-full border-[0.05em] border-current bg-yolk"
				/>
			</span>
			nkes
		</span>
	);
}
