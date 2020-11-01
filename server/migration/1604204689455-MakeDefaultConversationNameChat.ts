import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDefaultConversationNameChat1604204689455 implements MigrationInterface {
  name = 'MakeDefaultConversationNameChat1604204689455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `conversation` CHANGE `name` `name` varchar(255) NOT NULL DEFAULT 'Chat'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `conversation` CHANGE `name` `name` varchar(255) NOT NULL DEFAULT 'Conversation'"
    );
  }
}
