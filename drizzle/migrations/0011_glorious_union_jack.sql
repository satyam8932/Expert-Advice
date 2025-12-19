ALTER TABLE "usage" ALTER COLUMN "video_minutes_used" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "usage" ALTER COLUMN "video_minutes_used" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "usage" ALTER COLUMN "audio_minutes_transcribed" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "usage" ALTER COLUMN "audio_minutes_transcribed" SET DEFAULT '0.00';