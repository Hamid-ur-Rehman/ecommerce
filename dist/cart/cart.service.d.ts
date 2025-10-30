import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CheckoutCartDto } from './dto/checkout-cart.dto';
import { OrdersService } from '../orders/orders.service';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productRepository;
    private userRepository;
    private ordersService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productRepository: Repository<Product>, userRepository: Repository<User>, ordersService: OrdersService);
    getOrCreateCart(userId: number): Promise<Cart>;
    addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart>;
    getCart(userId: number): Promise<Cart>;
    updateCartItem(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart>;
    removeFromCart(userId: number, itemId: number): Promise<Cart>;
    clearCart(userId: number): Promise<Cart>;
    checkout(userId: number, checkoutCartDto: CheckoutCartDto): Promise<any>;
    getCartItemCount(userId: number): Promise<number>;
}
