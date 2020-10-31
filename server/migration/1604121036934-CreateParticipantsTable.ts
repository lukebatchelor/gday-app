import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParticipantsTable1604121036934 implements MigrationInterface {
  name = 'CreateParticipantsTable1604121036934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `participant` (`id` int NOT NULL AUTO_INCREMENT, `user` varchar(255) NOT NULL, `conversation` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_a4edbf010c2a1c060f33f5b93c` (`user`), INDEX `IDX_e6bf2b8c4b3693233852a9f3b6` (`conversation`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_e6bf2b8c4b3693233852a9f3b6` ON `participant`');
    await queryRunner.query('DROP INDEX `IDX_a4edbf010c2a1c060f33f5b93c` ON `participant`');
    await queryRunner.query('DROP TABLE `participant`');
  }
}
