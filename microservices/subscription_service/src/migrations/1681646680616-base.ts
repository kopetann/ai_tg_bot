import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1681646680616 implements MigrationInterface {
    name = 'Base1681646680616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "extId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requestCount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "freeRequests"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "extId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requestCount" numeric`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscriptionDate" interval`);
        await queryRunner.query(`ALTER TABLE "users" ADD "freeRequests" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "freeRequests"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requestCount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "extId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "freeRequests" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscriptionDate" interval`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requestCount" numeric`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "extId" integer NOT NULL`);
    }

}
