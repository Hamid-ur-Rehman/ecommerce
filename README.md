# Ecommerce Backend API

A comprehensive ecommerce backend built with NestJS, TypeORM, and MySQL, featuring robust admin functionality and role-based access control.

## Features

### Core Ecommerce Features
- **Product Management**: Full CRUD operations for products with categories, inventory tracking, and SEO support
- **Category Management**: Hierarchical category system with tree structure support
- **Order Management**: Complete order lifecycle with status tracking and payment management
- **User Management**: User registration, authentication, and profile management
- **Inventory Management**: Stock tracking with low-stock alerts

### Admin Features
- **Dashboard Analytics**: Comprehensive statistics and KPIs
- **User Management**: Admin controls for user accounts and roles
- **Product Administration**: Full product lifecycle management
- **Order Administration**: Order processing and status management
- **Analytics & Reports**: Sales analytics, top-selling products, revenue tracking
- **Low Stock Alerts**: Automated inventory monitoring

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Moderator, and User roles
- **Password Hashing**: Secure password storage with bcrypt
- **Input Validation**: Comprehensive data validation with class-validator
- **CORS Support**: Configurable cross-origin resource sharing

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=ecommerce

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   - Create a MySQL database named `ecommerce`
   - The application will automatically create tables on first run

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **API Base URL**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users` - Get all users (Admin/Moderator only)
- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID (Admin/Moderator only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Products
- `GET /products` - Get all products with filters
- `GET /products/featured` - Get featured products
- `GET /products/low-stock` - Get low stock products (Admin/Moderator only)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin/Moderator only)
- `PATCH /products/:id` - Update product (Admin/Moderator only)
- `PATCH /products/:id/stock` - Update product stock (Admin/Moderator only)
- `DELETE /products/:id` - Delete product (Admin only)

### Categories
- `GET /categories` - Get all categories
- `GET /categories/tree` - Get categories as tree structure
- `GET /categories/active` - Get active categories only
- `GET /categories/:id` - Get category by ID
- `GET /categories/:id/products` - Get category with products
- `POST /categories` - Create category (Admin/Moderator only)
- `PATCH /categories/:id` - Update category (Admin/Moderator only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Orders
- `GET /orders` - Get all orders (Admin/Moderator only)
- `GET /orders/my-orders` - Get current user orders
- `GET /orders/stats` - Get order statistics (Admin/Moderator only)
- `GET /orders/:id` - Get order by ID
- `GET /orders/number/:orderNumber` - Get order by order number
- `POST /orders` - Create order
- `PATCH /orders/:id` - Update order (Admin/Moderator only)
- `PATCH /orders/:id/status` - Update order status (Admin/Moderator only)
- `PATCH /orders/:id/payment-status` - Update payment status (Admin/Moderator only)
- `PATCH /orders/:id/cancel` - Cancel order
- `DELETE /orders/:id` - Delete order (Admin only)

### Admin
- `GET /admin/dashboard` - Get dashboard statistics (Admin/Moderator only)
- `GET /admin/recent-orders` - Get recent orders (Admin/Moderator only)
- `GET /admin/top-selling-products` - Get top selling products (Admin/Moderator only)
- `GET /admin/low-stock-products` - Get low stock products (Admin/Moderator only)
- `GET /admin/order-status-distribution` - Get order status distribution (Admin/Moderator only)
- `GET /admin/payment-status-distribution` - Get payment status distribution (Admin/Moderator only)
- `GET /admin/monthly-revenue` - Get monthly revenue data (Admin/Moderator only)
- `GET /admin/user-growth` - Get user growth data (Admin/Moderator only)

## User Roles

### Admin
- Full access to all endpoints
- User management
- Product management
- Order management
- Analytics and reporting

### Moderator
- Limited admin access
- Product management
- Order management
- User viewing (read-only)
- Analytics and reporting

### User
- Create and manage orders
- View products and categories
- Manage own profile

## Database Schema

### Users
- User accounts with role-based access
- Profile information and contact details
- Email verification and password reset

### Products
- Product catalog with categories
- Inventory tracking and stock management
- SEO optimization fields
- Product attributes and images

### Categories
- Hierarchical category structure
- SEO optimization
- Active/inactive status

### Orders
- Order management with status tracking
- Payment status tracking
- Shipping and billing addresses
- Order items with product details

## Development

### Available Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run seed` - Run database seeder
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Project Structure
```
src/
├── auth/                 # Authentication module
├── users/               # User management
├── products/            # Product management
├── categories/          # Category management
├── orders/              # Order management
├── admin/               # Admin functionality
├── config/              # Configuration files
├── database/            # Database seeding
└── main.ts             # Application entry point
```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control is implemented
- Input validation is enforced
- CORS is properly configured
- Environment variables are used for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
