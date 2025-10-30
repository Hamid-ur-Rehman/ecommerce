"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicSeedData1700000000002 = void 0;
class BasicSeedData1700000000002 {
    constructor() {
        this.name = 'BasicSeedData1700000000002';
    }
    async up(queryRunner) {
        const rolesCount = await queryRunner.query(`SELECT COUNT(*) as count FROM "roles"`);
        if (parseInt(rolesCount[0].count) === 0) {
            await queryRunner.query(`
        INSERT INTO "roles" ("name", "description", "permissions") VALUES
        ('admin', 'Administrator with full access', '["users:read", "users:write", "products:read", "products:write", "categories:read", "categories:write", "orders:read", "orders:write"]'),
        ('moderator', 'Moderator with limited admin access', '["products:read", "products:write", "categories:read", "categories:write", "orders:read"]'),
        ('user', 'Regular user with basic access', '["products:read", "orders:read", "orders:write"]')
      `);
        }
        const categoriesCount = await queryRunner.query(`SELECT COUNT(*) as count FROM "categories"`);
        if (parseInt(categoriesCount[0].count) === 0) {
            await queryRunner.query(`
        INSERT INTO "categories" ("name", "description", "slug", "isActive", "sortOrder", "seoTitle", "seoDescription") VALUES
        ('Electronics', 'Electronic devices and gadgets', 'electronics', true, 1, 'Electronics Store', 'Shop the latest electronic devices and gadgets'),
        ('Clothing', 'Fashion and apparel', 'clothing', true, 2, 'Clothing Store', 'Discover the latest fashion trends and clothing'),
        ('Home & Garden', 'Home improvement and garden supplies', 'home-garden', true, 3, 'Home & Garden Store', 'Everything you need for your home and garden'),
        ('Sports', 'Sports equipment and accessories', 'sports', true, 4, 'Sports Store', 'Get active with our sports equipment and accessories'),
        ('Books', 'Books and educational materials', 'books', true, 5, 'Book Store', 'Explore our collection of books and educational materials')
      `);
            const electronicsId = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Electronics'`);
            const clothingId = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Clothing'`);
            await queryRunner.query(`
        INSERT INTO "categories" ("name", "description", "slug", "isActive", "sortOrder", "seoTitle", "seoDescription", "parentId") VALUES
        ('Smartphones', 'Mobile phones and accessories', 'smartphones', true, 1, 'Smartphones', 'Latest smartphones and mobile accessories', ${electronicsId[0].id}),
        ('Laptops', 'Laptop computers and accessories', 'laptops', true, 2, 'Laptops', 'High-performance laptops for work and gaming', ${electronicsId[0].id}),
        ('Audio', 'Audio equipment and headphones', 'audio', true, 3, 'Audio Equipment', 'Premium audio equipment and headphones', ${electronicsId[0].id})
      `);
            await queryRunner.query(`
        INSERT INTO "categories" ("name", "description", "slug", "isActive", "sortOrder", "seoTitle", "seoDescription", "parentId") VALUES
        ('Men''s Clothing', 'Men''s fashion and apparel', 'mens-clothing', true, 1, 'Men''s Clothing', 'Stylish men''s clothing and accessories', ${clothingId[0].id}),
        ('Women''s Clothing', 'Women''s fashion and apparel', 'womens-clothing', true, 2, 'Women''s Clothing', 'Trendy women''s clothing and accessories', ${clothingId[0].id}),
        ('Kids'' Clothing', 'Children''s clothing and accessories', 'kids-clothing', true, 3, 'Kids'' Clothing', 'Comfortable and stylish kids'' clothing', ${clothingId[0].id})
      `);
        }
        const productsCount = await queryRunner.query(`SELECT COUNT(*) as count FROM "products"`);
        if (parseInt(productsCount[0].count) === 0) {
            const smartphoneCategory = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Smartphones'`);
            const laptopCategory = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Laptops'`);
            const audioCategory = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Audio'`);
            const mensClothingCategory = await queryRunner.query(`SELECT id FROM "categories" WHERE name = 'Men''s Clothing'`);
            await queryRunner.query(`
        INSERT INTO "products" ("name", "description", "price", "originalPrice", "stock", "minStock", "sku", "isActive", "isFeatured", "weight", "brand", "rating", "reviewCount", "seoTitle", "seoDescription", "categoryId") VALUES
        ('iPhone 15 Pro', 'Latest iPhone with advanced features', 999.99, 1099.99, 50, 5, 'IPH15PRO-001', true, true, 187, 'Apple', 4.8, 150, 'iPhone 15 Pro - Latest Apple Smartphone', 'Get the latest iPhone 15 Pro with cutting-edge technology', ${smartphoneCategory[0].id}),
        ('MacBook Pro 16"', 'Powerful laptop for professionals', 2499.99, 2799.99, 25, 3, 'MBP16-001', true, true, 2000, 'Apple', 4.9, 89, 'MacBook Pro 16" - Professional Laptop', 'High-performance MacBook Pro for creative professionals', ${laptopCategory[0].id}),
        ('Sony WH-1000XM5', 'Premium noise-canceling headphones', 399.99, 449.99, 30, 5, 'SONY-WH1000XM5', true, true, 250, 'Sony', 4.7, 234, 'Sony WH-1000XM5 Headphones', 'Premium noise-canceling wireless headphones', ${audioCategory[0].id}),
        ('Nike Air Max 270', 'Comfortable running shoes', 150.00, 180.00, 100, 10, 'NIKE-AM270-001', true, false, 300, 'Nike', 4.5, 567, 'Nike Air Max 270 Running Shoes', 'Comfortable and stylish running shoes from Nike', ${mensClothingCategory[0].id}),
        ('Adidas Ultraboost 22', 'High-performance running shoes', 180.00, 200.00, 75, 8, 'ADIDAS-UB22-001', true, true, 280, 'Adidas', 4.6, 423, 'Adidas Ultraboost 22 Running Shoes', 'High-performance running shoes with energy return', ${mensClothingCategory[0].id})
      `);
        }
        const adminUserExists = await queryRunner.query(`SELECT COUNT(*) as count FROM "users" WHERE email = 'admin@example.com'`);
        if (parseInt(adminUserExists[0].count) === 0) {
            const adminRole = await queryRunner.query(`SELECT id FROM "roles" WHERE name = 'admin'`);
            await queryRunner.query(`
        INSERT INTO "users" ("email", "password", "firstName", "lastName", "isActive", "isEmailVerified", "roleId") VALUES
        ('admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'Admin', 'User', true, true, ${adminRole[0].id})
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'admin@example.com'`);
        await queryRunner.query(`DELETE FROM "products" WHERE "sku" IN ('IPH15PRO-001', 'MBP16-001', 'SONY-WH1000XM5', 'NIKE-AM270-001', 'ADIDAS-UB22-001')`);
        await queryRunner.query(`DELETE FROM "categories" WHERE "parentId" IS NOT NULL`);
        await queryRunner.query(`DELETE FROM "categories" WHERE "name" IN ('Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books')`);
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('admin', 'moderator', 'user')`);
    }
}
exports.BasicSeedData1700000000002 = BasicSeedData1700000000002;
//# sourceMappingURL=1700000000002-BasicSeedData.js.map