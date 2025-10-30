import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
    productName: string;
    productSku: string;
    productAttributes: Record<string, any>;
    order: Order;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
    get unitPrice(): number;
}
