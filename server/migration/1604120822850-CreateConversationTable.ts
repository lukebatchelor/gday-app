import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationTable1604120822850 implements MigrationInterface {
  name = 'CreateConversationTable1604120822850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `conversation` (`id` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_864528ec4274360a40f66c2984` (`id`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_864528ec4274360a40f66c2984` ON `conversation`');
    await queryRunner.query('DROP TABLE `conversation`');
  }
}
