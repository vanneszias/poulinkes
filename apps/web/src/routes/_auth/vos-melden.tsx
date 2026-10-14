import { Button, buttonVariants } from "@poulinkes/ui/components/button";
import { Checkbox } from "@poulinkes/ui/components/checkbox";
import { Input } from "@poulinkes/ui/components/input";
import { Label } from "@poulinkes/ui/components/label";
import { Skeleton } from "@poulinkes/ui/components/skeleton";
import { Textarea } from "@poulinkes/ui/components/textarea";
import { cn } from "@poulinkes/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/lib/errors";

import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/vos-melden")({
	component: ClaimPage,
	head: () => ({ meta: [{ title: "Vos melden | Poulinkes" }] }),
});

const CLAIM_WINDOW_DAYS = 7;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

function ClaimPage() {
	const subscription = useQuery(trpc.subscription.current.queryOptions());

	return (
		<div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
			<h1 className="font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
				Vos melden
			</h1>
			<p className="mt-4 max-w-xl text-lg text-muted-foreground">
				Spijtig van je kippen. Vul dit in, dan zoeken we een kweker in je buurt
				die binnen 48 uur nieuwe brengt.
			</p>

			{subscription.isPending ? (
				<Skeleton className="mt-10 h-96 rounded-3xl" />
			) : !subscription.data ? (
				<Notice>
					Je hebt geen actief abonnement, dus de vossengarantie geldt nog niet.{" "}
					<Link to="/" hash="prijzen" className="font-semibold underline">
						Bekijk de abonnementen
					</Link>
				</Notice>
			) : subscription.data.claimsLeft === 0 ? (
				<Notice>
					Je hebt je vervangingen voor dit jaar al gebruikt. Stuur ons een
					berichtje, dan bekijken we samen wat we kunnen doen.
				</Notice>
			) : (
				<ClaimForm maxChickens={subscription.data.plan.chickens} />
			)}
		</div>
	);
}

function Notice({ children }: { children: React.ReactNode }) {
	return (
		<p className="mt-10 rounded-3xl border-2 border-fox/40 bg-fox/8 p-7 text-lg">
			{children}
		</p>
	);
}

function ClaimForm({ maxChickens }: { maxChickens: number }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const flock = useQuery(trpc.flock.list.queryOptions());
	const living = flock.data?.filter((c) => !c.lostToFoxAt) ?? [];
	const unnamedCount = Math.max(0, maxChickens - living.length);

	const today = new Date();
	const earliest = new Date(today.getTime() - CLAIM_WINDOW_DAYS * 86_400_000);

	const [selected, setSelected] = useState<string[]>([]);
	const [unnamedLost, setUnnamedLost] = useState(0);
	const [coopWasClosed, setCoopWasClosed] = useState(false);

	const create = useMutation(
		trpc.claims.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries();
				toast.success(
					"Melding ontvangen. We laten je weten wanneer je nieuwe kippen komen.",
				);
				navigate({ to: "/kot" });
			},
			onError: (error) => toast.error(errorMessage(error)),
		}),
	);

	const total = selected.length + unnamedLost;

	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		create.mutate({
			happenedOn: String(data.get("happenedOn")),
			postalCode: String(data.get("postalCode")).trim(),
			notes: String(data.get("notes") ?? "") || undefined,
			chickenIds: selected,
			unnamedLost,
			coopWasClosed,
		});
	}

	if (flock.isPending) return <Skeleton className="mt-10 h-96 rounded-3xl" />;

	return (
		<form
			onSubmit={submit}
			className="mt-10 grid gap-8 rounded-3xl border-2 border-ink/10 bg-white p-7 md:p-10"
		>
			<fieldset className="grid gap-4">
				<legend className="mb-4 font-bold text-xl">
					Welke kippen zijn weg?
				</legend>
				{living.length > 0 && (
					<div className="flex flex-wrap gap-3">
						{living.map((chicken) => {
							const checked = selected.includes(chicken.id);
							return (
								<label
									key={chicken.id}
									className={cn(
										"flex cursor-pointer items-center gap-3 rounded-full border-2 py-2 pr-5 pl-3 font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-shutter has-focus-visible:outline-offset-2",
										checked
											? "border-fox bg-fox/10"
											: "border-ink/15 hover:border-ink/40",
									)}
								>
									<input
										type="checkbox"
										className="sr-only"
										checked={checked}
										onChange={() =>
											setSelected(
												checked
													? selected.filter((id) => id !== chicken.id)
													: [...selected, chicken.id],
											)
										}
									/>
									<span className="grid h-8 min-w-10 place-items-center rounded-full bg-yolk px-2 font-display text-sm tabular-nums">
										{String(chicken.bandNumber).padStart(2, "0")}
									</span>
									{chicken.name}
								</label>
							);
						})}
					</div>
				)}
				{unnamedCount > 0 && (
					<div className="flex flex-wrap items-center gap-4">
						<span id="unnamed-label">
							{living.length > 0 ? "Kippen zonder naam" : "Aantal kippen"}
						</span>
						<fieldset
							className="flex items-center gap-2"
							aria-labelledby="unnamed-label"
						>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								aria-label="Eén minder"
								disabled={unnamedLost === 0}
								onClick={() => setUnnamedLost(unnamedLost - 1)}
							>
								<Minus />
							</Button>
							<output className="w-8 text-center font-bold font-display text-xl tabular-nums">
								{unnamedLost}
							</output>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								aria-label="Eén meer"
								disabled={unnamedLost >= unnamedCount}
								onClick={() => setUnnamedLost(unnamedLost + 1)}
							>
								<Plus />
							</Button>
						</fieldset>
					</div>
				)}
			</fieldset>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="happenedOn">Wanneer gebeurde het?</Label>
					<Input
						id="happenedOn"
						name="happenedOn"
						type="date"
						required
						defaultValue={isoDay(today)}
						min={isoDay(earliest)}
						max={isoDay(today)}
					/>
					<p className="text-muted-foreground text-sm">
						Tot {CLAIM_WINDOW_DAYS} dagen geleden.
					</p>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="postalCode">Postcode van je kot</Label>
					<Input
						id="postalCode"
						name="postalCode"
						inputMode="numeric"
						autoComplete="postal-code"
						pattern="[1-9][0-9]{3}"
						placeholder="9000"
						required
					/>
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="notes">Wat is er gebeurd?</Label>
				<Textarea
					id="notes"
					name="notes"
					maxLength={1000}
					placeholder="Bijvoorbeeld: gat onder de omheining aan de achterkant, sporen in de ren."
				/>
				<p className="text-muted-foreground text-sm">
					Niet verplicht, wel handig voor de kweker.
				</p>
			</div>

			<Label className="items-start gap-3 font-normal text-base leading-snug">
				<Checkbox
					checked={coopWasClosed}
					onCheckedChange={(value) => setCoopWasClosed(value === true)}
					className="mt-0.5"
				/>
				Mijn kippen zaten die nacht in een gesloten hok.
			</Label>
			{!coopWasClosed && (
				<p className="-mt-4 text-muted-foreground text-sm">
					De vossengarantie geldt als het hok 's nachts dicht was. Je kan toch
					melden, dan bekijken we het samen.
				</p>
			)}

			<Button
				type="submit"
				size="lg"
				className="justify-self-start"
				disabled={total === 0 || create.isPending}
			>
				{create.isPending
					? "Melding versturen…"
					: total === 0
						? "Duid aan welke kippen weg zijn"
						: `Melding versturen voor ${total} ${total === 1 ? "kip" : "kippen"}`}
			</Button>
			<Link
				to="/kot"
				className={buttonVariants({
					variant: "link",
					className: "-mt-4 justify-self-start px-0",
				})}
			>
				Terug naar mijn kot
			</Link>
		</form>
	);
}
