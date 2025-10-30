import { IsString, IsNumber, IsOptional, IsObject, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-2024-001' })
  @IsString()
  orderNumber: string;

  @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ example: PaymentStatus.PENDING, enum: PaymentStatus, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 19.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiProperty({ example: 9.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping?: number;

  @ApiProperty({ example: 229.97 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 'Please handle with care', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    example: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      phone: '+1234567890'
    },
    required: false 
  })
  @IsOptional()
  @IsObject()
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

  @ApiProperty({ 
    example: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      phone: '+1234567890'
    },
    required: false 
  })
  @IsOptional()
  @IsObject()
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

  @ApiProperty({ example: 'credit_card', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ example: 'PAY-123456', required: false })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
