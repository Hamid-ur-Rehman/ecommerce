import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus, PaymentStatus } from '../orders/entities/order.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCategories,
      activeCategories,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({ where: { isActive: true } }),
      this.productsRepository.count(),
      this.productsRepository.count({ where: { isActive: true } }),
      this.ordersRepository.count(),
      this.ordersRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.categoriesRepository.count(),
      this.categoriesRepository.count({ where: { isActive: true } }),
    ]);

    const totalRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    const monthlyRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
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

  async getRecentOrders(limit: number = 10) {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getTopSellingProducts(limit: number = 10) {
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
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
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
    const statuses = Object.values(OrderStatus);
    const distribution = {};

    for (const status of statuses) {
      const count = await this.ordersRepository.count({ where: { status } });
      distribution[status] = count;
    }

    return distribution;
  }

  async getPaymentStatusDistribution() {
    const statuses = Object.values(PaymentStatus);
    const distribution = {};

    for (const status of statuses) {
      const count = await this.ordersRepository.count({ where: { paymentStatus: status } });
      distribution[status] = count;
    }

    return distribution;
  }

  async getMonthlyRevenue(year: number = new Date().getFullYear()) {
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const revenue = await this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
        .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getRawOne();

      const orderCount = await this.ordersRepository.count({
        where: {
          createdAt: Between(startDate, endDate),
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

  async getUserGrowth(months: number = 12) {
    const growthData = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0, 23, 59, 59);

      const newUsers = await this.usersRepository.count({
        where: {
          createdAt: Between(startDate, endDate),
        },
      });

      const totalUsers = await this.usersRepository.count({
        where: {
          createdAt: LessThanOrEqual(endDate),
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
}
