-- Full DB schema — run once against a fresh MySQL database to create every
-- table. Source of truth is db/types.ts (the Kysely Database interface, kept
-- in sync with this file by hand); this .sql has no active tooling behind it
-- (originally Prisma-generated, before the app moved to Kysely+mysql2 — see
-- README for why), it's just the plain DDL, preserved because it's the exact
-- schema already applied to the real databases (local dev + production).

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `password_hash` VARCHAR(191) NULL,
    `oauth_providers` JSON NULL,
    `active_role` ENUM('client', 'creator') NOT NULL,
    `has_client_profile` BOOLEAN NOT NULL DEFAULT false,
    `has_creator_profile` BOOLEAN NOT NULL DEFAULT false,
    `notification_prefs` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_profiles` (
    `user_id` CHAR(36) NOT NULL,
    `company_name` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(191) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creator_profiles` (
    `user_id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `niches` JSON NULL,
    `starting_rate` DECIMAL(10, 2) NULL,
    `typical_turnaround_days` INTEGER NULL,
    `avatar_url` VARCHAR(191) NULL,
    `avg_rating` DECIMAL(2, 1) NOT NULL DEFAULT 0,
    `review_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_accounts` (
    `id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `platform` ENUM('instagram', 'tiktok', 'youtube', 'facebook') NOT NULL,
    `handle` VARCHAR(191) NOT NULL,
    `follower_count` INTEGER NOT NULL,
    `engagement_rate` DECIMAL(5, 2) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `oauth_token_ref` TEXT NULL,
    `last_synced_at` DATETIME(3) NULL,

    UNIQUE INDEX `social_accounts_creator_id_platform_key`(`creator_id`, `platform`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_items` (
    `id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `media_url` VARCHAR(191) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `briefs` (
    `id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `format` ENUM('reel', 'ugc', 'youtube', 'tiktok', 'photo') NOT NULL,
    `niche` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `budget_min` DECIMAL(10, 2) NOT NULL,
    `budget_max` DECIMAL(10, 2) NOT NULL,
    `deadline` DATE NOT NULL,
    `status` ENUM('open', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `briefs_status_idx`(`status`),
    INDEX `briefs_client_id_status_idx`(`client_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reference_images` (
    `id` CHAR(36) NOT NULL,
    `brief_id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bids` (
    `id` CHAR(36) NOT NULL,
    `brief_id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `delivery_days` INTEGER NOT NULL,
    `note` TEXT NULL,
    `status` ENUM('pending', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `bids_brief_id_creator_id_key`(`brief_id`, `creator_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `direct_offers` (
    `id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `brief_id` CHAR(36) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `format` ENUM('reel', 'ugc', 'youtube', 'tiktok', 'photo') NOT NULL,
    `turnaround_days` INTEGER NOT NULL,
    `message` TEXT NULL,
    `status` ENUM('pending', 'countered', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_revisions` (
    `id` CHAR(36) NOT NULL,
    `offer_id` CHAR(36) NOT NULL,
    `proposed_by` ENUM('client', 'creator') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `turnaround_days` INTEGER NOT NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deals` (
    `id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `brief_id` CHAR(36) NULL,
    `offer_id` CHAR(36) NULL,
    `source` ENUM('bid', 'direct_offer') NOT NULL,
    `agreed_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('negotiating', 'agreement_pending', 'escrow_funded', 'in_production', 'draft_submitted', 'changes_requested', 'approved', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'negotiating',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agreements` (
    `id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NOT NULL,
    `usage_rights` ENUM('organic', 'paid_ads', 'whitelisting') NOT NULL,
    `live_duration_days` INTEGER NOT NULL,
    `approval_required` BOOLEAN NOT NULL,
    `min_views` INTEGER NULL,
    `client_consented_at` DATETIME(3) NULL,
    `creator_consented_at` DATETIME(3) NULL,

    UNIQUE INDEX `agreements_deal_id_key`(`deal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drafts` (
    `id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `status` ENUM('submitted', 'approved', 'changes_requested') NOT NULL DEFAULT 'submitted',
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewed_at` DATETIME(3) NULL,
    `client_feedback` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `escrows` (
    `id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `funded_at` DATETIME(3) NULL,
    `live_started_at` DATETIME(3) NULL,
    `live_url` VARCHAR(191) NULL,
    `payout_released_at` DATETIME(3) NULL,
    `status` ENUM('unfunded', 'held', 'released', 'refunded') NOT NULL DEFAULT 'unfunded',

    UNIQUE INDEX `escrows_deal_id_key`(`deal_id`),
    INDEX `escrows_status_live_started_at_idx`(`status`, `live_started_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `provider_token` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `last4` CHAR(4) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payout_methods` (
    `id` CHAR(36) NOT NULL,
    `creator_id` CHAR(36) NOT NULL,
    `provider` ENUM('stripe_connect') NOT NULL,
    `account_ref` VARCHAR(191) NOT NULL,
    `schedule` ENUM('weekly', 'biweekly') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NOT NULL,
    `type` ENUM('escrow_fund', 'payout', 'refund') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'succeeded', 'failed') NOT NULL DEFAULT 'pending',
    `provider_ref` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transactions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `threads` (
    `id` CHAR(36) NOT NULL,
    `participant_a_id` CHAR(36) NOT NULL,
    `participant_b_id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NULL,
    `brief_id` CHAR(36) NULL,

    UNIQUE INDEX `threads_participant_a_id_participant_b_id_key`(`participant_a_id`, `participant_b_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` CHAR(36) NOT NULL,
    `thread_id` CHAR(36) NOT NULL,
    `sender_id` CHAR(36) NOT NULL,
    `text` TEXT NULL,
    `attachment_url` VARCHAR(191) NULL,
    `system_event` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `read_at` DATETIME(3) NULL,

    INDEX `messages_thread_id_created_at_idx`(`thread_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_read_at_idx`(`user_id`, `read_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` CHAR(36) NOT NULL,
    `deal_id` CHAR(36) NOT NULL,
    `reviewer_id` CHAR(36) NOT NULL,
    `reviewee_id` CHAR(36) NOT NULL,
    `rating` INTEGER NOT NULL,
    `tags` JSON NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reviews_deal_id_reviewer_id_key`(`deal_id`, `reviewer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `push_tokens` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `push_tokens_user_id_token_key`(`user_id`, `token`(255)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `client_profiles` ADD CONSTRAINT `client_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creator_profiles` ADD CONSTRAINT `creator_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `social_accounts` ADD CONSTRAINT `social_accounts_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_items` ADD CONSTRAINT `portfolio_items_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `briefs` ADD CONSTRAINT `briefs_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reference_images` ADD CONSTRAINT `reference_images_brief_id_fkey` FOREIGN KEY (`brief_id`) REFERENCES `briefs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bids` ADD CONSTRAINT `bids_brief_id_fkey` FOREIGN KEY (`brief_id`) REFERENCES `briefs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bids` ADD CONSTRAINT `bids_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `direct_offers` ADD CONSTRAINT `direct_offers_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `direct_offers` ADD CONSTRAINT `direct_offers_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `direct_offers` ADD CONSTRAINT `direct_offers_brief_id_fkey` FOREIGN KEY (`brief_id`) REFERENCES `briefs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_revisions` ADD CONSTRAINT `offer_revisions_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `direct_offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_brief_id_fkey` FOREIGN KEY (`brief_id`) REFERENCES `briefs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `direct_offers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drafts` ADD CONSTRAINT `drafts_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escrows` ADD CONSTRAINT `escrows_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payout_methods` ADD CONSTRAINT `payout_methods_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `creator_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_participant_a_id_fkey` FOREIGN KEY (`participant_a_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_participant_b_id_fkey` FOREIGN KEY (`participant_b_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_brief_id_fkey` FOREIGN KEY (`brief_id`) REFERENCES `briefs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_deal_id_fkey` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewee_id_fkey` FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `push_tokens` ADD CONSTRAINT `push_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
