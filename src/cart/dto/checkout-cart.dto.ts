import { IsString, IsOptional, IsObject, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutCartDto {
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
    description: 'Shipping address for the order',
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
    description: 'Billing address for the order',
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

  @ApiProperty({ example: 'credit_card', description: 'Payment method', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ example: 19.99, description: 'Tax amount', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiProperty({ example: 9.99, description: 'Shipping cost', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping?: number;

  @ApiProperty({ example: 'Please handle with care', description: 'Order notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

