import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role, RoleName } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleName, ...userData } = createUserDto;
    
    let role: Role;
    if (roleName) {
      role = await this.rolesRepository.findOne({ where: { name: roleName } });
    } else {
      // Default to USER role
      role = await this.rolesRepository.findOne({ where: { name: RoleName.USER } });
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...userData,
      role,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role'],
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    if (updateUserDto.roleName) {
      const role = await this.rolesRepository.findOne({
        where: { name: updateUserDto.roleName },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      user.role = role;
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async createRole(name: RoleName, description?: string, permissions?: string[]): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = this.rolesRepository.create({
      name,
      description,
      permissions,
    });

    return this.rolesRepository.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
