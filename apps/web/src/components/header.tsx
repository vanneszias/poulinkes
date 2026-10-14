import { Link } from "@tanstack/react-router";
import UserMenu from "./user-menu";
import { Wordmark } from "./wordmark";

const links = [
	{ to: "/", hash: "hoe-het-werkt", label: "Hoe het werkt" },
	{ to: "/", hash: "prijzen", label: "Prijzen" },
	{ to: "/", hash: "vossengarantie", label: "Vossengarantie" },
	{ to: "/namen", label: "Kippennamen" },
] as const;

export default function Header() {
	return (
		<header className="sticky top-0 z-20 border-ink/10 border-b bg-chalk/90 backdrop-blur">
			<div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-5">
				<Link to="/" aria-label="Poulinkes, naar de startpagina">
					<Wordmark />
				</Link>
				<nav
					aria-label="Hoofdmenu"
					className="hidden items-center gap-7 font-medium lg:flex"
				>
					{links.map((link) => (
						<Link
							key={link.label}
							to={link.to}
							hash={"hash" in link ? link.hash : undefined}
							className="decoration-2 decoration-yolk underline-offset-6 hover:underline"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<UserMenu />
			</div>
		</header>
	);
}
