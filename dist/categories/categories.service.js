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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async create(createCategoryDto) {
        const { parentId, ...categoryData } = createCategoryDto;
        let parent = null;
        if (parentId) {
            parent = await this.categoriesRepository.findOne({
                where: { id: parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        const category = this.categoriesRepository.create({
            ...categoryData,
            parent,
        });
        return this.categoriesRepository.save(category);
    }
    async findAll() {
        return this.categoriesRepository.find({
            relations: ['parent', 'children', 'products'],
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }
    async findTree() {
        const treeRepository = this.categoriesRepository.manager.getTreeRepository(category_entity_1.Category);
        return treeRepository.findTrees();
    }
    async findOne(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent', 'children', 'products'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.parentId) {
            const parent = await this.categoriesRepository.findOne({
                where: { id: updateCategoryDto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            category.parent = parent;
        }
        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        if (category.children && category.children.length > 0) {
            throw new common_1.ConflictException('Cannot delete category with children. Please delete children first.');
        }
        if (category.products && category.products.length > 0) {
            throw new common_1.ConflictException('Cannot delete category with products. Please move or delete products first.');
        }
        await this.categoriesRepository.remove(category);
    }
    async getActiveCategories() {
        return this.categoriesRepository.find({
            where: { isActive: true },
            relations: ['parent', 'children'],
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }
    async getCategoryWithProducts(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['products', 'parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map