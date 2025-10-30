import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';
export declare class CartItem {
    id: number;
    quantity: number;
    price: number;
    totalPrice: number;
    productName: string;
    productSku: string;
    productAttributes: Record<string, any>;
    productImages: string[];
    cart: Cart;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
    get unitPrice(): number;
    get isAvailable(): boolean;
    calculateTotal(): void;
}
