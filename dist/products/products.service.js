"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(createProductDto) {
        const { categoryId, ...productData } = createProductDto;
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const product = this.productsRepository.create({
            ...productData,
            category,
        });
        return this.productsRepository.save(product);
    }
    async findAll(page = 1, limit = 10, search, categoryId, minPrice, maxPrice, isActive, isFeatured) {
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.orderItems', 'orderItems');
        if (search) {
            queryBuilder.andWhere('(product.name LIKE :search OR product.description LIKE :search OR product.brand LIKE :search)', { search: `%${search}%` });
        }
        if (categoryId) {
            queryBuilder.andWhere('product.category.id = :categoryId', { categoryId });
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                minPrice,
                maxPrice,
            });
        }
        else if (minPrice !== undefined) {
            queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
        }
        else if (maxPrice !== undefined) {
            queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
        }
        if (isActive !== undefined) {
            queryBuilder.andWhere('product.isActive = :isActive', { isActive });
        }
        if (isFeatured !== undefined) {
            queryBuilder.andWhere('product.isFeatured = :isFeatured', { isFeatured });
        }
        const total = await queryBuilder.getCount();
        const products = await queryBuilder
            .orderBy('product.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            products,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'orderItems'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.categoryId) {
            const category = await this.categoriesRepository.findOne({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            product.category = category;
        }
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        if (product.stock + quantity < 0) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        product.stock += quantity;
        return this.productsRepository.save(product);
    }
    async getLowStockProducts() {
        return this.productsRepository
            .createQueryBuilder('product')
            .where('product.stock <= product.minStock')
            .andWhere('product.isActive = :isActive', { isActive: true })
            .getMany();
    }
    async getFeaturedProducts(limit = 10) {
        return this.productsRepository.find({
            where: { isFeatured: true, isActive: true },
            relations: ['category'],
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map