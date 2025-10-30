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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
let UsersService = class UsersService {
    constructor(usersRepository, rolesRepository) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
    }
    async create(createUserDto) {
        const { roleName, ...userData } = createUserDto;
        let role;
        if (roleName) {
            role = await this.rolesRepository.findOne({ where: { name: roleName } });
        }
        else {
            role = await this.rolesRepository.findOne({ where: { name: role_entity_1.RoleName.USER } });
        }
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const user = this.usersRepository.create({
            ...userData,
            role,
        });
        return this.usersRepository.save(user);
    }
    async findAll() {
        return this.usersRepository.find({
            relations: ['role'],
        });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.roleName) {
            const role = await this.rolesRepository.findOne({
                where: { name: updateUserDto.roleName },
            });
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            user.role = role;
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }
    async createRole(name, description, permissions) {
        const existingRole = await this.rolesRepository.findOne({ where: { name } });
        if (existingRole) {
            throw new common_1.ConflictException('Role already exists');
        }
        const role = this.rolesRepository.create({
            name,
            description,
            permissions,
        });
        return this.rolesRepository.save(role);
    }
    async findAllRoles() {
        return this.rolesRepository.find();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map