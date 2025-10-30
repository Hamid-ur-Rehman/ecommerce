import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "permissions" json,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "phone" character varying,
        "address" character varying,
        "city" character varying,
        "country" character varying,
        "postalCode" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "emailVerificationToken" character varying,
        "passwordResetToken" character varying,
        "passwordResetExpires" TIMESTAMP,
        "roleId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "slug" character varying,
        "image" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "seoTitle" character varying,
        "seoDescription" text,
        "parentId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "originalPrice" numeric(10,2),
        "stock" integer NOT NULL DEFAULT 0,
        "minStock" integer NOT NULL DEFAULT 0,
        "sku" character varying,
        "images" json,
        "attributes" json,
        "isActive" boolean NOT NULL DEFAULT true,
        "isFeatured" boolean NOT NULL DEFAULT false,
        "weight" integer NOT NULL DEFAULT 0,
        "dimensions" character varying,
        "brand" character varying,
        "rating" integer NOT NULL DEFAULT 0,
        "reviewCount" integer NOT NULL DEFAULT 0,
        "seoTitle" character varying,
        "seoDescription" text,
        "categoryId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);

    // Create orders table
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "orderNumber" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "paymentStatus" character varying NOT NULL DEFAULT 'pending',
        "subtotal" numeric(10,2) NOT NULL,
        "tax" numeric(10,2) NOT NULL DEFAULT 0,
        "shipping" numeric(10,2) NOT NULL DEFAULT 0,
        "total" numeric(10,2) NOT NULL,
        "notes" character varying,
        "shippingAddress" json,
        "billingAddress" json,
        "paymentMethod" character varying,
        "paymentReference" character varying,
        "trackingNumber" character varying,
        "shippedAt" TIMESTAMP,
        "deliveredAt" TIMESTAMP,
        "userId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_orders_orderNumber" UNIQUE ("orderNumber"),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      )
    `);

    // Create order_items table
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" SERIAL NOT NULL,
        "quantity" integer NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "total" numeric(10,2) NOT NULL,
        "productName" character varying,
        "productSku" character varying,
        "productAttributes" json,
        "orderId" integer,
        "productId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_roleId" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "categories" 
      ADD CONSTRAINT "FK_categories_parentId" 
      FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD CONSTRAINT "FK_products_categoryId" 
      FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "FK_orders_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "FK_order_items_orderId" 
      FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "FK_order_items_productId" 
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_categories_slug" ON "categories" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_sku" ON "products" ("sku")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_categoryId" ON "products" ("categoryId")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_userId" ON "orders" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_status" ON "orders" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_order_items_orderId" ON "order_items" ("orderId")`);
    await queryRunner.query(`CREATE INDEX "IDX_order_items_productId" ON "order_items" ("productId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_productId"`);
    await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_orderId"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_userId"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_categoryId"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_parentId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_roleId"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_order_items_productId"`);
    await queryRunner.query(`DROP INDEX "IDX_order_items_orderId"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_status"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_products_categoryId"`);
    await queryRunner.query(`DROP INDEX "IDX_products_sku"`);
    await queryRunner.query(`DROP INDEX "IDX_categories_slug"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
