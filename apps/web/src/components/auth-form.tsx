import type { PlanSlug } from "@poulinkes/api/plans";
import { Button } from "@poulinkes/ui/components/button";
import { Input } from "@poulinkes/ui/components/input";
import { Label } from "@poulinkes/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { startCheckout } from "@/lib/checkout";
import { authErrorMessage, errorMessage } from "@/lib/errors";

type Mode = "sign-in" | "sign-up";

const schemas = {
	"sign-in": z.object({
		name: z.string(),
		email: z.email("Vul een geldig e-mailadres in."),
		password: z.string().min(1, "Vul je wachtwoord in."),
	}),
	"sign-up": z.object({
		name: z.string().trim().min(2, "Vul je naam in."),
		email: z.email("Vul een geldig e-mailadres in."),
		password: z.string().min(8, "Kies een wachtwoord van minstens 8 tekens."),
	}),
};

export function AuthForm({
	mode,
	plan,
	onSwitchMode,
}: {
	mode: Mode;
	plan?: PlanSlug;
	onSwitchMode: () => void;
}) {
	const navigate = useNavigate();

	async function afterAuth() {
		if (plan) {
			await startCheckout(plan);
		} else {
			navigate({ to: "/kot" });
		}
	}

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: schemas[mode] },
		onSubmit: async ({ value }) => {
			const callbacks = {
				onSuccess: afterAuth,
				onError: ({ error }: { error: { code?: string; status?: number } }) => {
					toast.error(authErrorMessage(error));
				},
			};
			try {
				if (mode === "sign-up") {
					await authClient.signUp.email(value, callbacks);
				} else {
					await authClient.signIn.email(
						{ email: value.email, password: value.password },
						callbacks,
					);
				}
			} catch (error) {
				toast.error(errorMessage(error));
			}
		},
	});

	const fields = [
		...(mode === "sign-up"
			? [
					{
						name: "name",
						label: "Naam",
						type: "text",
						autoComplete: "name",
					} as const,
				]
			: []),
		{
			name: "email",
			label: "E-mailadres",
			type: "email",
			autoComplete: "email",
		},
		{
			name: "password",
			label: "Wachtwoord",
			type: "password",
			autoComplete: mode === "sign-up" ? "new-password" : "current-password",
		},
	] as const;

	return (
		<div>
			<form
				noValidate
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="grid gap-5"
			>
				{fields.map((f) => (
					<form.Field key={f.name} name={f.name}>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>{f.label}</Label>
								<Input
									id={field.name}
									name={field.name}
									type={f.type}
									autoComplete={f.autoComplete}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-destructive text-sm">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				))}

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							size="lg"
							className="mt-2 w-full"
							disabled={isSubmitting}
						>
							{mode === "sign-up"
								? isSubmitting
									? "Account aanmaken…"
									: plan
										? "Account aanmaken en betalen"
										: "Account aanmaken"
								: isSubmitting
									? "Inloggen…"
									: "Inloggen"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-center text-muted-foreground">
				{mode === "sign-up" ? "Heb je al een account?" : "Nog geen account?"}{" "}
				<button
					type="button"
					onClick={onSwitchMode}
					className="font-semibold text-shutter underline decoration-2 decoration-yolk underline-offset-4"
				>
					{mode === "sign-up" ? "Log in" : "Maak er een aan"}
				</button>
			</p>
		</div>
	);
}
