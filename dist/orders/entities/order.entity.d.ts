import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    notes: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    billingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod: string;
    paymentReference: string;
    trackingNumber: string;
    shippedAt: Date;
    deliveredAt: Date;
    user: User;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
    get itemCount(): number;
    get canBeCancelled(): boolean;
    get canBeRefunded(): boolean;
}
