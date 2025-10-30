import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAll(page?: number, limit?: number, status?: OrderStatus, paymentStatus?: PaymentStatus, userId?: number): Promise<{
        orders: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMyOrders(req: any, page?: number, limit?: number): Promise<{
        orders: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    findByOrderNumber(orderNumber: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./entities/order.entity").Order>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<import("./entities/order.entity").Order>;
    cancel(id: string): Promise<import("./entities/order.entity").Order>;
    remove(id: string): Promise<void>;
}
