export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    minStock?: number;
    sku?: string;
    images?: string[];
    attributes?: Record<string, any>;
    isActive?: boolean;
    isFeatured?: boolean;
    weight?: number;
    dimensions?: string;
    brand?: string;
    seoTitle?: string;
    seoDescription?: string;
    categoryId: number;
}
