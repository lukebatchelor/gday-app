import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameAvatarToConversationTable1604203963755 implements MigrationInterface {
  name = 'AddNameAvatarToConversationTable1604203963755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `conversation` ADD `name` varchar(255) NOT NULL DEFAULT 'Conversation' AFTER `id`"
    );
    await queryRunner.query('ALTER TABLE `conversation` ADD `avatarUrl` varchar(255) NULL AFTER `name`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `conversation` DROP COLUMN `avatarUrl`');
    await queryRunner.query('ALTER TABLE `conversation` DROP COLUMN `name`');
  }
}
