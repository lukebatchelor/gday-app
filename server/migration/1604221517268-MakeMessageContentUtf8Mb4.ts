import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeMessageContentUtf8Mb41604221517268 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `message` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
