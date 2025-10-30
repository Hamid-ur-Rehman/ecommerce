"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartTables1761479025130 = void 0;
class CreateCartTables1761479025130 {
    constructor() {
        this.name = 'CreateCartTables1761479025130';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."carts_status_enum" AS ENUM('active', 'abandoned', 'converted')`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "status" "public"."carts_status_enum" NOT NULL DEFAULT 'active', "totalAmount" numeric(10,2) NOT NULL DEFAULT '0', "totalItems" integer NOT NULL DEFAULT '0', "metadata" json, "sessionId" character varying, "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "productName" character varying, "productSku" character varying, "productAttributes" json, "productImages" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cartId" integer, "productId" integer, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TYPE "public"."carts_status_enum"`);
    }
}
exports.CreateCartTables1761479025130 = CreateCartTables1761479025130;
//# sourceMappingURL=1761479025130-CreateCartTables.js.map