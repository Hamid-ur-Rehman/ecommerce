import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsObject, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Latest iPhone with advanced features', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1099.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiProperty({ example: 'IPHONE15PRO-128GB', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: { color: 'Space Black', storage: '128GB' }, required: false })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 200, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({ example: '15.5 x 7.6 x 0.8 cm', required: false })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({ example: 'Apple', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'iPhone 15 Pro - Best Phone', required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ example: 'Buy the latest iPhone 15 Pro with advanced features', required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}
