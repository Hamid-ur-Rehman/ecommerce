"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddItemCountToCart1761480331707 = void 0;
class AddItemCountToCart1761480331707 {
    async up(queryRunner) {
        const hasColumn = await queryRunner.hasColumn('carts', 'itemCount');
        if (!hasColumn) {
            await queryRunner.query(`ALTER TABLE "carts" ADD "itemCount" integer NOT NULL DEFAULT '0'`);
        }
    }
    async down(queryRunner) {
        const hasColumn = await queryRunner.hasColumn('carts', 'itemCount');
        if (hasColumn) {
            await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "itemCount"`);
        }
    }
}
exports.AddItemCountToCart1761480331707 = AddItemCountToCart1761480331707;
//# sourceMappingURL=1761480331707-AddItemCountToCart.js.map