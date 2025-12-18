ALTER TABLE "limits" RENAME COLUMN "audio_hours_limit" TO "audio_minutes_limit";--> statement-breakpoint
ALTER TABLE "usage" RENAME COLUMN "audio_hours_transcribed" TO "audio_minutes_transcribed";