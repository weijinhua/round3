import { MigrationInterface, QueryRunner } from 'typeorm';

export class Charts1777903972626 implements MigrationInterface {
  name = 'Charts1777903972626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "charts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "prompt" text NOT NULL, "config" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_charts_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "charts" ADD CONSTRAINT "FK_charts_user" FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "charts" DROP CONSTRAINT "FK_charts_user"`);
    await queryRunner.query(`DROP TABLE "charts"`);
  }
}
