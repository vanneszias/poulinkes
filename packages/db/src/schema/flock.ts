import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

const createdAt = () =>
	integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull();

/** A named chicken in a customer's flock. */
export const chicken = sqliteTable(
	"chicken",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		trait: text("trait"),
		/** The number on the chicken's leg band. */
		bandNumber: integer("band_number").notNull(),
		lostToFoxAt: integer("lost_to_fox_at", { mode: "timestamp_ms" }),
		createdAt: createdAt(),
	},
	(table) => [index("chicken_userId_idx").on(table.userId)],
);

export const FOX_CLAIM_STATUSES = [
	"received",
	"approved",
	"delivered",
	"rejected",
] as const;
export type FoxClaimStatus = (typeof FOX_CLAIM_STATUSES)[number];

/** A request to replace chickens taken by a fox. */
export const foxClaim = sqliteTable(
	"fox_claim",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		chickensLost: integer("chickens_lost").notNull(),
		happenedOn: text("happened_on").notNull(),
		coopWasClosed: integer("coop_was_closed", { mode: "boolean" }).notNull(),
		postalCode: text("postal_code").notNull(),
		notes: text("notes"),
		status: text("status", { enum: FOX_CLAIM_STATUSES })
			.default("received")
			.notNull(),
		createdAt: createdAt(),
	},
	(table) => [index("fox_claim_userId_idx").on(table.userId)],
);
