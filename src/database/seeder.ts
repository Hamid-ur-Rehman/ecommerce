import { DataSource } from 'typeorm';
import { Role, RoleName } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import * as bcrypt from 'bcryptjs';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('Starting database seeding...');

    // Seed roles
    await this.seedRoles();

    // Seed users
    await this.seedUsers();

    // Seed categories
    await this.seedCategories();

    // Seed products
    await this.seedProducts();

    console.log('Database seeding completed!');
  }

  private async seedRoles() {
    const roleRepository = this.dataSource.getRepository(Role);

    const roles = [
      {
        name: RoleName.ADMIN,
        description: 'Administrator with full access',
        permissions: ['*'],
      },
      {
        name: RoleName.MODERATOR,
        description: 'Moderator with limited admin access',
        permissions: ['products:manage', 'orders:manage', 'users:view'],
      },
      {
        name: RoleName.USER,
        description: 'Regular user',
        permissions: ['orders:create', 'profile:manage'],
      },
    ];

    for (const roleData of roles) {
      const existingRole = await roleRepository.findOne({ where: { name: roleData.name } });
      if (!existingRole) {
        const role = roleRepository.create(roleData);
        await roleRepository.save(role);
        console.log(`Created role: ${roleData.name}`);
      }
    }
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const roleRepository = this.dataSource.getRepository(Role);

    const adminRole = await roleRepository.findOne({ where: { name: RoleName.ADMIN } });
    const userRole = await roleRepository.findOne({ where: { name: RoleName.USER } });

    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: adminRole,
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'user@example.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User',
        role: userRole,
        isActive: true,
        isEmailVerified: true,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = userRepository.create({
          ...userData,
          password: hashedPassword,
        });
        await userRepository.save(user);
        console.log(`Created user: ${userData.email}`);
      }
    }
  }

  private async seedCategories() {
    const categoryRepository = this.dataSource.getRepository(Category);

    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        slug: 'home-garden',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        slug: 'books',
        isActive: true,
        sortOrder: 4,
      },
    ];

    for (const categoryData of categories) {
      const existingCategory = await categoryRepository.findOne({ where: { name: categoryData.name } });
      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`Created category: ${categoryData.name}`);
      }
    }
  }

  private async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Category);

    const electronicsCategory = await categoryRepository.findOne({ where: { name: 'Electronics' } });
    const clothingCategory = await categoryRepository.findOne({ where: { name: 'Clothing' } });

    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
        price: 999.99,
        originalPrice: 1099.99,
        stock: 50,
        minStock: 10,
        sku: 'IPHONE15PRO-128GB',
        images: ['iphone15pro-1.jpg', 'iphone15pro-2.jpg'],
        attributes: { color: 'Space Black', storage: '128GB', brand: 'Apple' },
        isActive: true,
        isFeatured: true,
        weight: 200,
        dimensions: '15.5 x 7.6 x 0.8 cm',
        brand: 'Apple',
        category: electronicsCategory,
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        price: 899.99,
        originalPrice: 999.99,
        stock: 30,
        minStock: 5,
        sku: 'GALAXYS24-256GB',
        images: ['galaxys24-1.jpg', 'galaxys24-2.jpg'],
        attributes: { color: 'Titanium Gray', storage: '256GB', brand: 'Samsung' },
        isActive: true,
        isFeatured: true,
        weight: 180,
        dimensions: '15.2 x 7.1 x 0.7 cm',
        brand: 'Samsung',
        category: electronicsCategory,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 100,
        minStock: 20,
        sku: 'COTTON-TSHIRT-M',
        images: ['tshirt-1.jpg', 'tshirt-2.jpg'],
        attributes: { size: 'M', color: 'White', material: '100% Cotton' },
        isActive: true,
        isFeatured: false,
        weight: 150,
        brand: 'Generic',
        category: clothingCategory,
      },
    ];

    for (const productData of products) {
      const existingProduct = await productRepository.findOne({ where: { name: productData.name } });
      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`Created product: ${productData.name}`);
      }
    }
  }
}
