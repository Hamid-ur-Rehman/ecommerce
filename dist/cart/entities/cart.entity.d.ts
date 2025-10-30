import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';
export declare enum CartStatus {
    ACTIVE = "active",
    ABANDONED = "abandoned",
    CONVERTED = "converted"
}
export declare class Cart {
    id: number;
    status: CartStatus;
    totalAmount: number;
    totalItems: number;
    itemCount: number;
    metadata: Record<string, any>;
    sessionId: string;
    expiresAt: Date;
    user: User;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
    get isEmpty(): boolean;
    get isExpired(): boolean;
    get canCheckout(): boolean;
    get subtotal(): number;
    get itemCountValue(): number;
    calculateTotals(): void;
}
