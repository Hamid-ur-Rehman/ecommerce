import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Category } from '../categories/entities/category.entity';
export declare class AdminService {
    private usersRepository;
    private productsRepository;
    private ordersRepository;
    private categoriesRepository;
    constructor(usersRepository: Repository<User>, productsRepository: Repository<Product>, ordersRepository: Repository<Order>, categoriesRepository: Repository<Category>);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            active: number;
            inactive: number;
        };
        products: {
            total: number;
            active: number;
            inactive: number;
            lowStock: number;
        };
        orders: {
            total: number;
            pending: number;
            completed: number;
            cancelled: number;
        };
        categories: {
            total: number;
            active: number;
            inactive: number;
        };
        revenue: {
            total: number;
            monthly: number;
        };
    }>;
    getRecentOrders(limit?: number): Promise<Order[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    getLowStockProducts(): Promise<Product[]>;
    getOrderStatusDistribution(): Promise<{}>;
    getPaymentStatusDistribution(): Promise<{}>;
    getMonthlyRevenue(year?: number): Promise<any[]>;
    getUserGrowth(months?: number): Promise<any[]>;
}
