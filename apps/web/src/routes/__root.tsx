import { Toaster } from "@poulinkes/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { DemoBanner } from "@/components/demo-banner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import type { trpc } from "@/utils/trpc";

import "../index.css";

export interface RouterAppContext {
	trpc: typeof trpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "Poulinkes | Legkippen op abonnement, met vossengarantie",
			},
			{
				name: "description",
				content:
					"Legkippen op abonnement van kwekers uit je eigen streek. Neemt de vos er een mee? Dan leveren we binnen 48 uur een nieuwe.",
			},
			{ name: "theme-color", content: "#1e4632" },
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				forcedTheme="light"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<a
					href="#inhoud"
					className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-chalk"
				>
					Naar de inhoud
				</a>
				<div className="grid min-h-svh grid-rows-[auto_auto_1fr_auto]">
					<DemoBanner />
					<Header />
					<main id="inhoud">
						<Outlet />
					</main>
					<Footer />
				</div>
				<Toaster richColors position="top-center" />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</>
	);
}
