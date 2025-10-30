import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CheckoutCartDto } from './dto/checkout-cart.dto';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto, CreateOrderItemDto } from '../orders/dto/create-order.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private ordersService: OrdersService,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      cart = this.cartRepository.create({ user });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    // Validate product
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    const cart = await this.getOrCreateCart(userId);

    // Check if product already exists in cart
    const existingItem = cart.items?.find(item => item.product.id === productId);

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }

      existingItem.quantity = newQuantity;
      existingItem.calculateTotal();
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create new cart item
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
        price: product.price,
      });
      cartItem.calculateTotal();
      await this.cartItemRepository.save(cartItem);
    }

    // Refresh cart with updated items
    return this.getCart(userId);
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return this.getOrCreateCart(userId);
    }

    // Calculate totals
    cart.calculateTotals();
    await this.cartRepository.save(cart);

    return cart;
  }

  async updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
      relations: ['product', 'cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    cartItem.calculateTotal();
    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId);
  }

  async removeFromCart(userId: number, itemId: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (cart && cart.items) {
      await this.cartItemRepository.remove(cart.items);
    }

    return this.getCart(userId);
  }

  async checkout(userId: number, checkoutCartDto: CheckoutCartDto): Promise<any> {
    const cart = await this.getCart(userId);

    if (cart.isEmpty) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate all items in cart
    for (const item of cart.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.product.name} no longer exists`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${item.product.name} is no longer available`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${item.product.name}`);
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order items from cart items
    const orderItems: CreateOrderItemDto[] = cart.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    // Create order DTO
    const createOrderDto: CreateOrderDto = {
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

    // Create order
    const order = await this.ordersService.create(createOrderDto, userId);

    // Clear cart after successful order creation
    await this.clearCart(userId);

    return {
      message: 'Order created successfully',
      order,
    };
  }

  async getCartItemCount(userId: number): Promise<number> {
    const cart = await this.getCart(userId);
    return cart.itemCount;
  }
}

