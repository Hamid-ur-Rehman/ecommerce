"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("../users/entities/role.entity");
const product_entity_1 = require("../products/entities/product.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const cart_item_entity_1 = require("../cart/entities/cart-item.entity");
let DatabaseConfig = class DatabaseConfig {
    createTypeOrmOptions() {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'Sailor1234!',
            database: process.env.DB_DATABASE || 'ecommerce',
            entities: [user_entity_1.User, role_entity_1.Role, product_entity_1.Product, category_entity_1.Category, order_entity_1.Order, order_item_entity_1.OrderItem, cart_entity_1.Cart, cart_item_entity_1.CartItem],
            synchronize: !isProduction,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: isProduction,
            logging: !isProduction,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
    }
};
exports.DatabaseConfig = DatabaseConfig;
exports.DatabaseConfig = DatabaseConfig = __decorate([
    (0, common_1.Injectable)()
], DatabaseConfig);
//# sourceMappingURL=database.config.js.map