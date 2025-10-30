import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { envConfig } from './env.config';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Sailor1234!',
      database: process.env.DB_DATABASE || 'ecommerce',
      entities: [User, Role, Product, Category, Order, OrderItem, Cart, CartItem],
      synchronize: !isProduction, // Disable in production
      migrations: ['dist/migrations/*.js'],
      migrationsRun: isProduction, // Auto-run migrations in production
      logging: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
  }
}
