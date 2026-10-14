import type { AppRouter } from "@poulinkes/api/routers/index";
import { Button, buttonVariants } from "@poulinkes/ui/components/button";
import { Input } from "@poulinkes/ui/components/input";
import { Label } from "@poulinkes/ui/components/label";
import { Skeleton } from "@poulinkes/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { toast } from "sonner";
import { ClaimStatus } from "@/components/claim-status";
import { LegBand } from "@/components/leg-band";
import { NameGenerator } from "@/components/name-generator";
import { Pricing } from "@/components/pricing";
import { authClient } from "@/lib/auth-client";
import { errorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/kot")({
	component: KotPage,
	head: () => ({ meta: [{ title: "Mijn kot | Poulinkes" }] }),
});

function KotPage() {
	const { session } = Route.useRouteContext();
	const subscription = useQuery(trpc.subscription.current.queryOptions());
	const firstName = session.data?.user.name.split(" ")[0];

	return (
		<div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
			<p className="text-lg text-muted-foreground">Dag {firstName}</p>
			<h1 className="mt-1 font-extrabold text-4xl [font-stretch:118%] md:text-5xl">
				Mijn kot
			</h1>

			{subscription.isPending ? (
				<Skeleton className="mt-10 h-40 rounded-3xl" />
			) : subscription.data ? (
				<Subscribed subscription={subscription.data} />
			) : (
				<section className="mt-10">
					<p className="mb-12 max-w-xl text-lg">
						Je hebt nog geen abonnement. Kies een kot, dan zoeken we een kweker
						in je buurt.
					</p>
					<Pricing />
				</section>
			)}
		</div>
	);
}

type SubscriptionData = NonNullable<
	inferRouterOutputs<AppRouter>["subscription"]["current"]
>;

function Subscribed({ subscription }: { subscription: SubscriptionData }) {
	const { plan } = subscription;

	return (
		<>
			<section className="mt-10 grid gap-6 rounded-3xl bg-shutter p-7 text-chalk md:grid-cols-[1fr_auto] md:items-center md:p-9">
				<div>
					<h2 className="font-bold text-3xl [font-stretch:120%]">
						{plan.name}
					</h2>
					<p className="mt-2 text-chalk/80">
						{plan.chickens} legkippen, €{plan.price} per maand.{" "}
						{subscription.cancelAtPeriodEnd
							? `Opgezegd, loopt tot ${formatDate(subscription.currentPeriodEnd)}.`
							: `Volgende betaling op ${formatDate(subscription.currentPeriodEnd)}.`}
					</p>
					<p className="mt-1 text-chalk/80">
						Nog {subscription.claimsLeft} van {plan.claimsPerYear}{" "}
						{plan.claimsPerYear === 1 ? "vervanging" : "vervangingen"} over dit
						jaar.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						to="/vos-melden"
						className={buttonVariants({ variant: "yolk" })}
					>
						Vos melden
					</Link>
					<Button
						variant="outline"
						className="border-chalk/40 text-chalk hover:bg-chalk/10 hover:text-chalk"
						onClick={() => authClient.customer.portal()}
					>
						Abonnement beheren
					</Button>
				</div>
			</section>

			<Flock capacity={plan.chickens} />
			<Claims />
		</>
	);
}

function Flock({ capacity }: { capacity: number }) {
	const queryClient = useQueryClient();
	const flock = useQuery(trpc.flock.list.queryOptions());
	const add = useMutation(
		trpc.flock.add.mutationOptions({
			onSuccess: (chicken) => {
				toast.success(`${chicken.name} heeft een bandje.`);
				queryClient.invalidateQueries(trpc.flock.list.queryFilter());
			},
			onError: (error) => toast.error(errorMessage(error)),
		}),
	);
	const [ownName, setOwnName] = useState("");

	const living = flock.data?.filter((c) => !c.lostToFoxAt) ?? [];
	const lost = flock.data?.filter((c) => c.lostToFoxAt) ?? [];
	const unnamed = capacity - living.length;

	return (
		<section className="mt-16">
			<h2 className="font-extrabold text-3xl [font-stretch:118%]">Je kippen</h2>
			<p className="mt-2 text-muted-foreground">
				{unnamed > 0
					? `${unnamed} van je ${capacity} kippen ${unnamed === 1 ? "heeft" : "hebben"} nog geen naam.`
					: "Al je kippen hebben een naam."}
			</p>

			{flock.isPending ? (
				<Skeleton className="mt-8 h-16 rounded-full" />
			) : (
				<ul className="mt-8 grid gap-4 md:grid-cols-2">
					{living.map((chicken) => (
						<li key={chicken.id}>
							<LegBand
								number={chicken.bandNumber}
								name={chicken.name}
								trait={chicken.trait}
							/>
						</li>
					))}
					{lost.map((chicken) => (
						<li key={chicken.id}>
							<LegBand
								muted
								number={chicken.bandNumber}
								name={chicken.name}
								trait={`Meegenomen door de vos op ${formatDate(chicken.lostToFoxAt)}`}
							/>
						</li>
					))}
				</ul>
			)}

			{unnamed > 0 && (
				<div className="mt-10 grid gap-10 rounded-3xl border-2 border-ink/10 bg-white p-7 md:p-9 lg:grid-cols-[1.4fr_1fr]">
					<div>
						<h3 className="font-bold text-xl">Kies een naam</h3>
						<p className="mt-1 mb-6 text-muted-foreground">
							Geef een van deze namen aan een kip, of schud voor nieuwe.
						</p>
						<NameGenerator
							count={3}
							full
							pickLabel="Geef deze naam"
							onPick={(chicken) => add.mutate(chicken)}
						/>
					</div>
					<form
						className="grid content-start gap-3"
						onSubmit={(e) => {
							e.preventDefault();
							add.mutate(
								{ name: ownName },
								{ onSuccess: () => setOwnName("") },
							);
						}}
					>
						<h3 className="font-bold text-xl">Of verzin er zelf een</h3>
						<Label htmlFor="own-name" className="mt-3">
							Naam van je kip
						</Label>
						<Input
							id="own-name"
							value={ownName}
							onChange={(e) => setOwnName(e.target.value)}
							maxLength={60}
							required
						/>
						<Button
							type="submit"
							disabled={add.isPending}
							className="justify-self-start"
						>
							Naam geven
						</Button>
					</form>
				</div>
			)}
		</section>
	);
}

function Claims() {
	const claims = useQuery(trpc.claims.list.queryOptions());

	return (
		<section className="mt-16">
			<h2 className="font-extrabold text-3xl [font-stretch:118%]">
				Vossenmeldingen
			</h2>
			{claims.isPending ? (
				<Skeleton className="mt-8 h-20 rounded-2xl" />
			) : claims.data?.length ? (
				<ul className="mt-8 divide-y divide-ink/10 rounded-3xl border-2 border-ink/10 bg-white">
					{claims.data.map((claim) => (
						<li
							key={claim.id}
							className="flex flex-wrap items-center justify-between gap-4 p-6"
						>
							<div>
								<p className="font-semibold">
									{claim.chickensLost}{" "}
									{claim.chickensLost === 1 ? "kip" : "kippen"} op{" "}
									{formatDate(claim.happenedOn)}
								</p>
								<p className="text-muted-foreground text-sm">
									Gemeld op {formatDate(claim.createdAt)}
								</p>
							</div>
							<ClaimStatus status={claim.status} />
						</li>
					))}
				</ul>
			) : (
				<p className="mt-3 text-muted-foreground">
					Geen meldingen. Dat houden we graag zo.
				</p>
			)}
		</section>
	);
}
