# PostgreSQL Setup Guide

## Option 1: Local PostgreSQL Installation

1. **Download and Install PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15+
   - Install with default settings
   - Set password for 'postgres' user (remember this!)

2. **Create Database:**
   - Open pgAdmin (comes with PostgreSQL)
   - Right-click "Servers" → "Create" → "Server"
   - Name: "Ecommerce Server"
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: [your password]
   - Click "Save"

3. **Create Database:**
   - Right-click "Ecommerce Server" → "Create" → "Database"
   - Name: "ecommerce"
   - Click "Save"

## Option 2: Using Cursor Database Extension

1. **Install Extension:**
   - Open Cursor
   - Ctrl+Shift+X (Extensions)
   - Search "PostgreSQL" or "Database Client"
   - Install "PostgreSQL" extension

2. **Connect:**
   - Ctrl+Shift+P
   - Type "PostgreSQL: New Query"
   - Click "PostgreSQL: Add Connection"
   - Enter:
     - Host: localhost
     - Port: 5432
     - Database: ecommerce
     - Username: postgres
     - Password: [your password]

## Option 3: Free Online PostgreSQL

1. **Sign up for free PostgreSQL:**
   - Visit: https://www.elephantsql.com/ (free tier available)
   - Or: https://www.supabase.com/ (free tier available)
   - Create account and database

2. **Update environment variables:**
   - Copy the connection details
   - Update your .env file with the provided credentials

## Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

## Test Connection

Once PostgreSQL is running, start your application:

```bash
npm run start:dev
```

The application will automatically create all necessary tables.
