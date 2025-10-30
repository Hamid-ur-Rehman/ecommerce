import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemCountToCart1761480331707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column already exists
        const hasColumn = await queryRunner.hasColumn('carts', 'itemCount');
        if (!hasColumn) {
            await queryRunner.query(`ALTER TABLE "carts" ADD "itemCount" integer NOT NULL DEFAULT '0'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if column exists before dropping
        const hasColumn = await queryRunner.hasColumn('carts', 'itemCount');
        if (hasColumn) {
            await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "itemCount"`);
        }
    }

}
