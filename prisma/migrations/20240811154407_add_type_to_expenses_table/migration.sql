-- DropIndex
DROP INDEX `auth_tokens_user_id_fkey` ON `auth_tokens`;

-- DropIndex
DROP INDEX `expenses_category_id_fkey` ON `expenses`;

-- DropIndex
DROP INDEX `expenses_user_id_fkey` ON `expenses`;

-- AlterTable
ALTER TABLE `expenses` ADD COLUMN `type` VARCHAR(10) NULL;

-- AddForeignKey
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
