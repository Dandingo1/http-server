ALTER TABLE "chirps" RENAME COLUMN "userId" TO "user_Id";--> statement-breakpoint
ALTER TABLE "chirps" DROP CONSTRAINT "chirps_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chirps" ADD CONSTRAINT "chirps_user_Id_users_id_fk" FOREIGN KEY ("user_Id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;