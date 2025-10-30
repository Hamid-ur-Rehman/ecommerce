import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
    seoTitle: string;
    seoDescription: string;
    parent: Category;
    children: Category[];
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
    get isParent(): boolean;
    get isLeaf(): boolean;
}
