"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../users/entities/role.entity");
const product_entity_1 = require("../products/entities/product.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const cart_item_entity_1 = require("../cart/entities/cart-item.entity");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Sailor1234!',
    database: process.env.DB_DATABASE || 'ecommerce',
    entities: [user_entity_1.User, role_entity_1.Role, product_entity_1.Product, category_entity_1.Category, order_entity_1.Order, order_item_entity_1.OrderItem, cart_entity_1.Cart, cart_item_entity_1.CartItem],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
//# sourceMappingURL=typeorm.config.js.map