import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  minStock: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @ManyToOne(() => Category, category => category.products, { eager: true })
  category: Category;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isInStock(): boolean {
    return this.stock > 0;
  }

  get isLowStock(): boolean {
    return this.stock <= this.minStock;
  }

  get discountPercentage(): number {
    if (!this.originalPrice || this.originalPrice <= this.price) {
      return 0;
    }
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
}
