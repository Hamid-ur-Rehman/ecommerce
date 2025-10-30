import { OrderStatus, PaymentStatus } from '../entities/order.entity';
export declare class CreateOrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    orderNumber: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
    notes?: string;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
    };
    paymentMethod?: string;
    paymentReference?: string;
    items: CreateOrderItemDto[];
}
