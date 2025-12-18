CREATE TABLE "limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"storage_limit_bytes" bigint DEFAULT 10737418240 NOT NULL,
	"forms_limit" integer DEFAULT 5 NOT NULL,
	"submissions_limit" integer DEFAULT 20 NOT NULL,
	"audio_hours_limit" numeric(10, 2) DEFAULT '2.0' NOT NULL,
	"video_minutes_limit" integer DEFAULT 0 NOT NULL,
	"video_intelligence_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "limits_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "limits" ADD CONSTRAINT "limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "limits" ADD CONSTRAINT "limits_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "limits_user_idx" ON "limits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "limits_subscription_idx" ON "limits" USING btree ("subscription_id");