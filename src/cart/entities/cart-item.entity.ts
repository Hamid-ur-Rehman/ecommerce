import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  productName: string;

  @Column({ nullable: true })
  productSku: string;

  @Column({ type: 'json', nullable: true })
  productAttributes: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  productImages: string[];

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, product => product.cartItems, { eager: true })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get unitPrice(): number {
    return this.totalPrice / this.quantity;
  }

  get isAvailable(): boolean {
    return this.product && this.product.isActive && this.product.stock >= this.quantity;
  }

  calculateTotal(): void {
    this.totalPrice = this.price * this.quantity;
  }
}