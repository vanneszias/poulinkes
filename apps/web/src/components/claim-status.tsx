import type { AppRouter } from "@poulinkes/api/routers/index";
import { cn } from "@poulinkes/ui/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";

type FoxClaimStatus =
	inferRouterOutputs<AppRouter>["claims"]["list"][number]["status"];

const STATUS: Record<FoxClaimStatus, { label: string; className: string }> = {
	received: { label: "Ontvangen", className: "bg-yolk/30 text-ink" },
	approved: {
		label: "Nieuwe kippen onderweg",
		className: "bg-shutter/12 text-shutter",
	},
	delivered: { label: "Geleverd", className: "bg-shutter text-chalk" },
	rejected: { label: "Afgewezen", className: "bg-fox/15 text-[#9a3a0c]" },
};

export function ClaimStatus({ status }: { status: FoxClaimStatus }) {
	const { label, className } = STATUS[status];
	return (
		<span
			className={cn("rounded-full px-3 py-1 font-semibold text-sm", className)}
		>
			{label}
		</span>
	);
}
