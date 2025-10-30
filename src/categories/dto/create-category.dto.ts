import { IsString, IsOptional, IsBoolean, IsNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Electronic devices and accessories', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'electronics', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'electronics.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ example: 'Electronics - Best Deals', required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ example: 'Shop the latest electronics at great prices', required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
