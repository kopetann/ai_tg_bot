import { MigrationInterface, QueryRunner } from "typeorm";

export class base1680372405229 implements MigrationInterface {
    name = 'base1680372405229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "eventType" character varying NOT NULL, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "balance" double precision`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nickname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requestCount" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requestCount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "template"`);
    }

}
