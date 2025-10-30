import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: number, minPrice?: number, maxPrice?: number, isActive?: boolean, isFeatured?: boolean): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    updateStock(id: number, quantity: number): Promise<Product>;
    getLowStockProducts(): Promise<Product[]>;
    getFeaturedProducts(limit?: number): Promise<Product[]>;
}
