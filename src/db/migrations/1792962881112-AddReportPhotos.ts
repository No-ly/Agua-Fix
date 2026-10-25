import { MigrationInterface, QueryRunner } from "typeorm";

// Segundo parcial: foto de la fuga y foto de la reparación (nullable: los reportes viejos no tienen)
export class AddReportPhotos1792962881112 implements MigrationInterface {
    name = 'AddReportPhotos1792962881112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" ADD "photoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" ADD "repairPhotoUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" DROP COLUMN "repairPhotoUrl"`);
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" DROP COLUMN "photoUrl"`);
    }

}
