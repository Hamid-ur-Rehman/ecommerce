import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getRecentOrders(limit?: number): Promise<import("../orders/entities/order.entity").Order[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    getLowStockProducts(): Promise<import("../products/entities/product.entity").Product[]>;
    getOrderStatusDistribution(): Promise<{}>;
    getPaymentStatusDistribution(): Promise<{}>;
    getMonthlyRevenue(year?: number): Promise<any[]>;
    getUserGrowth(months?: number): Promise<any[]>;
}
