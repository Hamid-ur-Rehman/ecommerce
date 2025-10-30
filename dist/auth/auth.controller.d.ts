import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/role.entity").Role;
            isActive: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/role.entity").Role;
            isActive: boolean;
        };
    }>;
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
}
