import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessageTable1604126645566 implements MigrationInterface {
  name = 'CreateMessageTable1604126645566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `message` (`id` int NOT NULL AUTO_INCREMENT, `conversation` varchar(255) NOT NULL, `sendingUser` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_efb23ee5474e5d1644af5a4d70` (`conversation`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_efb23ee5474e5d1644af5a4d70` ON `message`');
    await queryRunner.query('DROP TABLE `message`');
  }
}
