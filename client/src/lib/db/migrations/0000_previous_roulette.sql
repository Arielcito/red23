CREATE TABLE "images_generator" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_email" text NOT NULL,
	"request_id" text NOT NULL,
	"prompt" text NOT NULL,
	"logo" text,
	"result" text,
	"result_with_logo" text,
	"tokens" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_members" (
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"username" text,
	"joined_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "telegram_winners" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigserial NOT NULL,
	"first_name" text NOT NULL,
	"username" text,
	"won_at" timestamp DEFAULT now(),
	"message" text
);
