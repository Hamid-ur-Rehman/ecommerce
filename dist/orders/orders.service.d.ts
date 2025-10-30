import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsRepository;
    private usersRepository;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsRepository: Repository<Product>, usersRepository: Repository<User>);
    create(createOrderDto: CreateOrderDto, userId: number): Promise<Order>;
    findAll(page?: number, limit?: number, status?: OrderStatus, paymentStatus?: PaymentStatus, userId?: number): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Order>;
    findByOrderNumber(orderNumber: string): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
    updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Promise<Order>;
    cancel(id: number): Promise<Order>;
    getUserOrders(userId: number, page?: number, limit?: number): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    remove(id: number): Promise<void>;
    getOrderStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }>;
}
