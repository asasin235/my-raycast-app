import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoteTable1688080000000 implements MigrationInterface {
  name = 'CreateNoteTable1688080000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "note" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "content" text NOT NULL,
        "reminderTime" datetime,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "note"`);
  }
}

