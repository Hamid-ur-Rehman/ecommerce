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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, productsRepository, usersRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createOrderDto, userId) {
        const { items, ...orderData } = createOrderDto;
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (!product.isActive) {
                throw new common_1.BadRequestException(`Product ${product.name} is not available`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
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
        for (const item of orderItems) {
            await this.productsRepository.update(item.product.id, {
                stock: item.product.stock - item.quantity,
            });
        }
        return this.findOne(savedOrder.id);
    }
    async findAll(page = 1, limit = 10, status, paymentStatus, userId) {
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
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.ordersRepository.findOne({
            where: { orderNumber },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        Object.assign(order, updateOrderDto);
        return this.ordersRepository.save(order);
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        if (status === order_entity_1.OrderStatus.SHIPPED && !order.shippedAt) {
            order.shippedAt = new Date();
        }
        if (status === order_entity_1.OrderStatus.DELIVERED && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }
        order.status = status;
        return this.ordersRepository.save(order);
    }
    async updatePaymentStatus(id, paymentStatus) {
        const order = await this.findOne(id);
        order.paymentStatus = paymentStatus;
        return this.ordersRepository.save(order);
    }
    async cancel(id) {
        const order = await this.findOne(id);
        if (!order.canBeCancelled) {
            throw new common_1.BadRequestException('Order cannot be cancelled');
        }
        for (const item of order.items) {
            await this.productsRepository.update(item.product.id, {
                stock: item.product.stock + item.quantity,
            });
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        return this.ordersRepository.save(order);
    }
    async getUserOrders(userId, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, undefined, userId);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
    async getOrderStats() {
        const totalOrders = await this.ordersRepository.count();
        const pendingOrders = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.PENDING } });
        const completedOrders = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERED } });
        const cancelledOrders = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.CANCELLED } });
        const totalRevenue = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.paymentStatus = :status', { status: order_entity_1.PaymentStatus.PAID })
            .getRawOne();
        return {
            totalOrders,
            pendingOrders,
            completedOrders,
            cancelledOrders,
            totalRevenue: parseFloat(totalRevenue.total) || 0,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map