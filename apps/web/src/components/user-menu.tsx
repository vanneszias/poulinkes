import { Button, buttonVariants } from "@poulinkes/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@poulinkes/ui/components/dropdown-menu";
import { Skeleton } from "@poulinkes/ui/components/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-11 w-40 rounded-full" />;
	}

	if (!session) {
		return (
			<div className="flex items-center gap-2">
				<Link to="/login" className={buttonVariants({ variant: "ghost" })}>
					Inloggen
				</Link>
				<Link
					to="/"
					hash="prijzen"
					className={buttonVariants({ className: "max-sm:hidden" })}
				>
					Kies je kot
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Link to="/kot" className={buttonVariants()}>
				Mijn kot
			</Link>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button variant="outline" size="icon" aria-label="Accountmenu" />
					}
				>
					{session.user.name.slice(0, 1).toUpperCase()}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-56 bg-card">
					<DropdownMenuGroup>
						<DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => authClient.customer.portal()}>
							Abonnement en facturen
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => {
								authClient.signOut({
									fetchOptions: { onSuccess: () => navigate({ to: "/" }) },
								});
							}}
						>
							Uitloggen
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
