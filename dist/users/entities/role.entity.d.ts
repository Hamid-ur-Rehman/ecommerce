import { User } from './user.entity';
export declare enum RoleName {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}
export declare class Role {
    id: number;
    name: RoleName;
    description: string;
    permissions: string[];
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
