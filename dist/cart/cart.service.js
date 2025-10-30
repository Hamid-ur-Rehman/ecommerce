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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const orders_service_1 = require("../orders/orders.service");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, productRepository, userRepository, ordersService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.ordersService = ordersService;
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            cart = this.cartRepository.create({ user });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Product is not available');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = cart.items?.find(item => item.product.id === productId);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new common_1.BadRequestException('Insufficient stock for requested quantity');
            }
            existingItem.quantity = newQuantity;
            existingItem.calculateTotal();
            await this.cartItemRepository.save(existingItem);
        }
        else {
            const cartItem = this.cartItemRepository.create({
                cart,
                product,
                quantity,
                price: product.price,
            });
            cartItem.calculateTotal();
            await this.cartItemRepository.save(cartItem);
        }
        return this.getCart(userId);
    }
    async getCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            return this.getOrCreateCart(userId);
        }
        cart.calculateTotals();
        await this.cartRepository.save(cart);
        return cart;
    }
    async updateCartItem(userId, itemId, updateCartItemDto) {
        const { quantity } = updateCartItemDto;
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId, cart: { user: { id: userId } } },
            relations: ['product', 'cart'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        cartItem.quantity = quantity;
        cartItem.calculateTotal();
        await this.cartItemRepository.save(cartItem);
        return this.getCart(userId);
    }
    async removeFromCart(userId, itemId) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId, cart: { user: { id: userId } } },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.cartItemRepository.remove(cartItem);
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items'],
        });
        if (cart && cart.items) {
            await this.cartItemRepository.remove(cart.items);
        }
        return this.getCart(userId);
    }
    async checkout(userId, checkoutCartDto) {
        const cart = await this.getCart(userId);
        if (cart.isEmpty) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        for (const item of cart.items) {
            const product = await this.productRepository.findOne({
                where: { id: item.product.id },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.product.name} no longer exists`);
            }
            if (!product.isActive) {
                throw new common_1.BadRequestException(`Product ${item.product.name} is no longer available`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${item.product.name}`);
            }
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const orderItems = cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
        }));
        const createOrderDto = {
            orderNumber,
            items: orderItems,
            subtotal: cart.subtotal,
            tax: checkoutCartDto.tax || 0,
            shipping: checkoutCartDto.shipping || 0,
            total: cart.subtotal + (checkoutCartDto.tax || 0) + (checkoutCartDto.shipping || 0),
            shippingAddress: checkoutCartDto.shippingAddress,
            billingAddress: checkoutCartDto.billingAddress,
            paymentMethod: checkoutCartDto.paymentMethod,
            notes: checkoutCartDto.notes,
        };
        const order = await this.ordersService.create(createOrderDto, userId);
        await this.clearCart(userId);
        return {
            message: 'Order created successfully',
            order,
        };
    }
    async getCartItemCount(userId) {
        const cart = await this.getCart(userId);
        return cart.itemCount;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        orders_service_1.OrdersService])
], CartService);
//# sourceMappingURL=cart.service.js.map