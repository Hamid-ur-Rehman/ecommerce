# Database Migrations

This document explains how to use the database migration system for the ecommerce backend.

## Overview

The project uses TypeORM migrations to manage database schema changes. Migrations are version-controlled scripts that can be applied or reverted to update the database schema.

## Available Commands

### Generate Migration
Generate a new migration based on entity changes:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

### Create Empty Migration
Create an empty migration file for custom SQL:
```bash
npm run migration:create -- src/migrations/MigrationName
```

### Run Migrations
Apply all pending migrations:
```bash
npm run migration:run
```

### Revert Migration
Revert the last migration:
```bash
npm run migration:revert
```

### Show Migration Status
View which migrations have been applied:
```bash
npm run migration:show
```

## Migration Files

### Initial Schema (1700000000000-InitialSchema.ts)
Creates the complete database schema including:
- `roles` table with enum constraints
- `users` table with foreign key to roles
- `categories` table with self-referencing parent-child relationship
- `products` table with foreign key to categories
- `orders` table with foreign key to users
- `order_items` table with foreign keys to orders and products
- All necessary indexes for performance

### Basic Seed Data (1700000000001-BasicSeedData.ts)
Inserts initial data including:
- Basic roles (admin, moderator, user)
- Sample categories and subcategories
- Sample products
- Default admin user (email: admin@example.com, password: admin123)

## Database Configuration

The migration system uses the configuration in `src/config/typeorm.config.ts` which reads from environment variables:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name (default: ecommerce)

## Production Deployment

In production, the application will:
1. Automatically run migrations on startup (`migrationsRun: true`)
2. Disable synchronize mode for safety
3. Use SSL connections when configured

## Development Workflow

1. **Initial Setup**: Run migrations to create the database schema
   ```bash
   npm run migration:run
   ```

2. **Making Changes**: When you modify entities:
   - Generate a new migration: `npm run migration:generate -- src/migrations/YourMigrationName`
   - Review the generated SQL
   - Run the migration: `npm run migration:run`

3. **Rolling Back**: If you need to undo changes:
   ```bash
   npm run migration:revert
   ```

## Important Notes

- Always backup your database before running migrations in production
- Test migrations on a copy of production data first
- Never edit existing migration files that have been applied to production
- Use descriptive names for your migrations
- Include both `up` and `down` methods for all migrations

## Troubleshooting

### Migration Fails
If a migration fails:
1. Check the error message
2. Fix the issue in the migration file
3. Revert the failed migration: `npm run migration:revert`
4. Fix and run again: `npm run migration:run`

### Database Connection Issues
Ensure your database is running and the connection parameters in your `.env` file are correct.

### Permission Issues
Make sure your database user has the necessary permissions to create tables, indexes, and foreign keys.
