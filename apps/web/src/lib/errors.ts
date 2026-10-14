import type { AppRouter } from "@poulinkes/api/routers/index";
import { TRPCClientError } from "@trpc/client";

const OFFLINE =
	"Je lijkt offline te zijn. Controleer je internetverbinding en probeer opnieuw.";
const UNREACHABLE =
	"We kunnen de server niet bereiken. Probeer het over een paar minuten opnieuw.";
const UNKNOWN = "Er ging iets mis aan onze kant. Probeer het opnieuw.";

const TRPC_MESSAGES: Record<string, string> = {
	UNAUTHORIZED: "Je bent niet (meer) aangemeld. Meld je opnieuw aan.",
	TOO_MANY_REQUESTS:
		"Even rustig aan. Probeer het binnen een minuutje opnieuw.",
	TIMEOUT: "De server antwoordt te traag. Probeer het opnieuw.",
	INTERNAL_SERVER_ERROR: UNKNOWN,
};

/** Turns any error from an API call into a sentence a user can act on. */
export function errorMessage(error: unknown): string {
	if (typeof navigator !== "undefined" && !navigator.onLine) return OFFLINE;

	if (error instanceof TRPCClientError) {
		const { data } = (error as TRPCClientError<AppRouter>).shape ?? {};
		// No shape means the request never got a tRPC answer (network, CORS, server down).
		if (!data) return UNREACHABLE;
		return TRPC_MESSAGES[data.code] ?? error.message ?? UNKNOWN;
	}

	if (error instanceof TypeError) return UNREACHABLE;
	return UNKNOWN;
}

const AUTH_MESSAGES: Record<string, string> = {
	INVALID_EMAIL_OR_PASSWORD: "Dat e-mailadres of wachtwoord klopt niet.",
	INVALID_EMAIL: "Dat lijkt geen geldig e-mailadres.",
	USER_ALREADY_EXISTS:
		"Er bestaat al een account met dat e-mailadres. Meld je aan in plaats van te registreren.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
		"Er bestaat al een account met dat e-mailadres. Meld je aan in plaats van te registreren.",
	PASSWORD_TOO_SHORT: "Dat wachtwoord is te kort.",
	PASSWORD_TOO_LONG: "Dat wachtwoord is te lang.",
	EMAIL_NOT_VERIFIED:
		"Bevestig eerst je e-mailadres via de mail die we stuurden.",
};

/** Same idea for better-auth errors, which come back as `{ code, status }`. */
export function authErrorMessage(error: {
	code?: string;
	status?: number;
}): string {
	if (error.code && AUTH_MESSAGES[error.code]) return AUTH_MESSAGES[error.code];
	if (error.status === 429) return TRPC_MESSAGES.TOO_MANY_REQUESTS;
	if (!error.status) return errorMessage(new TypeError());
	return UNKNOWN;
}
