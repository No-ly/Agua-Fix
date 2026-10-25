import { MigrationInterface, QueryRunner } from "typeorm";

// Esquema del primer parcial: usuarios y reportes (todavía sin fotos)
export class InitSchema1792962881111 implements MigrationInterface {
    name = 'InitSchema1792962881111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // uuid_generate_v4() vive en esta extensión; IF NOT EXISTS la vuelve segura de repetir
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isNotificationEnabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_5b250ddb22b3e4f8234ab172021" UNIQUE ("email"), CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "WATER_REPORT" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "description" character varying NOT NULL, "severity" character varying NOT NULL DEFAULT 'medium', "reporterPhone" character varying NOT NULL, "isResolved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b232cdd6d3e95978564720c2ebe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    }

}
