import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToUserConversationInParticipantTable1604188004555 implements MigrationInterface {
  name = 'AddUniqueIndexToUserConversationInParticipantTable1604188004555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_368a87bc9983da52f512ca2e92` ON `participant` (`user`, `conversation`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_368a87bc9983da52f512ca2e92` ON `participant`');
  }
}
