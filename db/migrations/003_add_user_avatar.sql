-- Adds a top-level avatar on users itself. The prototype's "Add a profile
-- photo" signup step (step 2 of 4) happens before role-select, so before
-- either client_profiles or creator_profiles exists — PATCH /me's avatar_url
-- write was a silent no-op at that point (nothing to write it to). This
-- column is the always-available target; settings.service.ts still syncs
-- into whichever profile row(s) exist too, since creator search/bids/etc.
-- already read avatar_url from creator_profiles/client_profiles, not users.
ALTER TABLE `users`
  ADD COLUMN `avatar_url` VARCHAR(191) NULL AFTER `name`;
