import { DataSource } from 'typeorm';
export declare class DatabaseSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    seed(): Promise<void>;
    private seedRoles;
    private seedUsers;
    private seedCategories;
    private seedProducts;
}
