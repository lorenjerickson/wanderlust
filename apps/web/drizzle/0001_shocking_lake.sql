ALTER TABLE `worlds` ADD `owner_user_id` text REFERENCES users(id);--> statement-breakpoint
UPDATE `worlds`
SET `owner_user_id` = COALESCE(
    (
        SELECT `campaign_gms`.`user_id`
        FROM `campaigns`
        INNER JOIN `campaign_gms`
            ON `campaign_gms`.`campaign_id` = `campaigns`.`id`
        WHERE `campaigns`.`world_id` = `worlds`.`id`
            AND `campaign_gms`.`deleted_at` IS NULL
        ORDER BY `campaign_gms`.`created_at` ASC
        LIMIT 1
    ),
    (
        SELECT `users`.`id`
        FROM `users`
        WHERE `users`.`is_gm` = 1
        ORDER BY `users`.`createdOn` ASC
        LIMIT 1
    )
)
WHERE `owner_user_id` IS NULL;--> statement-breakpoint
INSERT OR IGNORE INTO `campaign_gms` (
    `campaign_id`,
    `user_id`,
    `created_at`,
    `created_by_user_id`,
    `updated_at`,
    `updated_by_user_id`
)
SELECT
    `campaigns`.`id`,
    `worlds`.`owner_user_id`,
    CURRENT_TIMESTAMP,
    `worlds`.`owner_user_id`,
    CURRENT_TIMESTAMP,
    `worlds`.`owner_user_id`
FROM `campaigns`
INNER JOIN `worlds` ON `worlds`.`id` = `campaigns`.`world_id`
WHERE `worlds`.`owner_user_id` IS NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_worlds_owner` ON `worlds` (`owner_user_id`);
