const dateFormat = new Intl.DateTimeFormat("nl-BE", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** Dates arrive from the API as ISO strings, D1 date columns as "YYYY-MM-DD". */
export function formatDate(value: string | number | Date | null | undefined) {
	return value == null ? "" : dateFormat.format(new Date(value));
}
