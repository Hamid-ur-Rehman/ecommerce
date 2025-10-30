import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const { items, ...orderData } = createOrderDto;
    
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not available`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
        productName: product.name,
        productSku: product.sku,
        productAttributes: product.attributes,
      });

      orderItems.push(orderItem);
    }

    const tax = orderData.tax || 0;
    const shipping = orderData.shipping || 0;
    const total = subtotal + tax + shipping;

    const order = this.ordersRepository.create({
      ...orderData,
      user,
      subtotal,
      total,
      items: orderItems,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Update product stock
    for (const item of orderItems) {
      await this.productsRepository.update(item.product.id, {
        stock: item.product.stock - item.quantity,
      });
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    paymentStatus?: PaymentStatus,
    userId?: number,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (userId) {
      queryBuilder.andWhere('order.user.id = :userId', { userId });
    }

    const total = await queryBuilder.getCount();
    
    const orders = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { orderNumber },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    
    if (status === OrderStatus.SHIPPED && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    
    if (status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }

  async updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    return this.ordersRepository.save(order);
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (!order.canBeCancelled) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    // Restore product stock
    for (const item of order.items) {
      await this.productsRepository.update(item.product.id, {
        stock: item.product.stock + item.quantity,
      });
    }

    order.status = OrderStatus.CANCELLED;
    return this.ordersRepository.save(order);
  }

  async getUserOrders(userId: number, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, undefined, undefined, userId);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async getOrderStats() {
    const totalOrders = await this.ordersRepository.count();
    const pendingOrders = await this.ordersRepository.count({ where: { status: OrderStatus.PENDING } });
    const completedOrders = await this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED } });
    const cancelledOrders = await this.ordersRepository.count({ where: { status: OrderStatus.CANCELLED } });

    const totalRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
    };
  }
}
