import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: number, minPrice?: number, maxPrice?: number, isActive?: boolean, isFeatured?: boolean): Promise<{
        products: import("./entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getFeatured(limit?: number): Promise<import("./entities/product.entity").Product[]>;
    getLowStock(): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
    updateStock(id: string, quantity: number): Promise<import("./entities/product.entity").Product>;
}
