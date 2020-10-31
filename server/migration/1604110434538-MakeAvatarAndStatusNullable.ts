import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeAvatarAndStatusNullable1604110434538 implements MigrationInterface {
  name = 'MakeAvatarAndStatusNullable1604110434538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` CHANGE `avatar_url` `avatar_url` varchar(255) NULL');
    await queryRunner.query('ALTER TABLE `user` CHANGE `status` `status` varchar(255) NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` CHANGE `status` `status` varchar(255) NOT NULL');
    await queryRunner.query('ALTER TABLE `user` CHANGE `avatar_url` `avatar_url` varchar(255) NOT NULL');
  }
}
