import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  CONVERTED = 'converted',
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ default: 0 })
  totalItems: number;

  @Column({ default: 0 })
  itemCount: number;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, user => user.carts, { eager: true })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isEmpty(): boolean {
    return this.totalItems === 0;
  }

  get isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  get canCheckout(): boolean {
    return this.status === CartStatus.ACTIVE && !this.isEmpty && !this.isExpired;
  }

  get subtotal(): number {
    if (!this.items) return 0;
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  get itemCountValue(): number {
    return this.itemCount;
  }

  calculateTotals(): void {
    if (!this.items) {
      this.totalAmount = 0;
      this.totalItems = 0;
      this.itemCount = 0;
      return;
    }

    this.totalAmount = this.subtotal;
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.itemCount = this.totalItems; // Keep them in sync for now
  }
}