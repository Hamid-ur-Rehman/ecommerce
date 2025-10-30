import { RoleName } from '../entities/role.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    isActive?: boolean;
    roleName?: RoleName;
}
