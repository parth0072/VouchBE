-- Adds name + email-verification support to users, for the 3-step signup
-- flow (name -> email/password -> verify email) and GET/PATCH /me.
-- Apply once, in order, after 001 (the base schema in db/schema.sql).
ALTER TABLE `users`
  ADD COLUMN `name` VARCHAR(191) NULL AFTER `notification_prefs`,
  ADD COLUMN `email_verified_at` DATETIME(3) NULL AFTER `name`,
  ADD COLUMN `verification_code` VARCHAR(6) NULL AFTER `email_verified_at`,
  ADD COLUMN `verification_code_expires_at` DATETIME(3) NULL AFTER `verification_code`;
