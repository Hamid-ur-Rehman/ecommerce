"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const product_entity_1 = require("../products/entities/product.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let AdminService = class AdminService {
    constructor(usersRepository, productsRepository, ordersRepository, categoriesRepository) {
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
        this.ordersRepository = ordersRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, totalProducts, activeProducts, totalOrders, pendingOrders, completedOrders, totalCategories, activeCategories,] = await Promise.all([
            this.usersRepository.count(),
            this.usersRepository.count({ where: { isActive: true } }),
            this.productsRepository.count(),
            this.productsRepository.count({ where: { isActive: true } }),
            this.ordersRepository.count(),
            this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.PENDING } }),
            this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERED } }),
            this.categoriesRepository.count(),
            this.categoriesRepository.count({ where: { isActive: true } }),
        ]);
        const totalRevenue = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.paymentStatus = :status', { status: order_entity_1.PaymentStatus.PAID })
            .getRawOne();
        const monthlyRevenue = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.paymentStatus = :status', { status: order_entity_1.PaymentStatus.PAID })
            .andWhere('order.createdAt >= :date', {
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        })
            .getRawOne();
        const lowStockProducts = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.stock <= product.minStock')
            .andWhere('product.isActive = :isActive', { isActive: true })
            .getCount();
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                inactive: totalProducts - activeProducts,
                lowStock: lowStockProducts,
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders,
                cancelled: totalOrders - pendingOrders - completedOrders,
            },
            categories: {
                total: totalCategories,
                active: activeCategories,
                inactive: totalCategories - activeCategories,
            },
            revenue: {
                total: parseFloat(totalRevenue.total) || 0,
                monthly: parseFloat(monthlyRevenue.total) || 0,
            },
        };
    }
    async getRecentOrders(limit = 10) {
        return this.ordersRepository.find({
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getTopSellingProducts(limit = 10) {
        return this.productsRepository
            .createQueryBuilder('product')
            .leftJoin('product.orderItems', 'orderItem')
            .leftJoin('orderItem.order', 'order')
            .select([
            'product.id',
            'product.name',
            'product.price',
            'product.stock',
            'product.isActive',
            'SUM(orderItem.quantity) as totalSold',
            'SUM(orderItem.total) as totalRevenue',
        ])
            .where('order.paymentStatus = :status', { status: order_entity_1.PaymentStatus.PAID })
            .groupBy('product.id')
            .orderBy('totalSold', 'DESC')
            .limit(limit)
            .getRawMany();
    }
    async getLowStockProducts() {
        return this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.stock <= product.minStock')
            .andWhere('product.isActive = :isActive', { isActive: true })
            .orderBy('product.stock', 'ASC')
            .getMany();
    }
    async getOrderStatusDistribution() {
        const statuses = Object.values(order_entity_1.OrderStatus);
        const distribution = {};
        for (const status of statuses) {
            const count = await this.ordersRepository.count({ where: { status } });
            distribution[status] = count;
        }
        return distribution;
    }
    async getPaymentStatusDistribution() {
        const statuses = Object.values(order_entity_1.PaymentStatus);
        const distribution = {};
        for (const status of statuses) {
            const count = await this.ordersRepository.count({ where: { paymentStatus: status } });
            distribution[status] = count;
        }
        return distribution;
    }
    async getMonthlyRevenue(year = new Date().getFullYear()) {
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            const revenue = await this.ordersRepository
                .createQueryBuilder('order')
                .select('SUM(order.total)', 'total')
                .where('order.paymentStatus = :status', { status: order_entity_1.PaymentStatus.PAID })
                .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
                .getRawOne();
            const orderCount = await this.ordersRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(startDate, endDate),
                },
            });
            monthlyData.push({
                month,
                revenue: parseFloat(revenue.total) || 0,
                orders: orderCount,
            });
        }
        return monthlyData;
    }
    async getUserGrowth(months = 12) {
        const growthData = [];
        const currentDate = new Date();
        for (let i = months - 1; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0, 23, 59, 59);
            const newUsers = await this.usersRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(startDate, endDate),
                },
            });
            const totalUsers = await this.usersRepository.count({
                where: {
                    createdAt: (0, typeorm_2.LessThanOrEqual)(endDate),
                },
            });
            growthData.push({
                month: startDate.toISOString().slice(0, 7),
                newUsers,
                totalUsers,
            });
        }
        return growthData;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map