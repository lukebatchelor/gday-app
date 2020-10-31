import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastMessageToConversationTable1604127523294 implements MigrationInterface {
  name = 'AddLastMessageToConversationTable1604127523294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `conversation` ADD `lastMessage` int NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `conversation` DROP COLUMN `lastMessage`');
  }
}
