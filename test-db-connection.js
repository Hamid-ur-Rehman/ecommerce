const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Sailor1234!',
  database: 'postgres' // Connect to default postgres database first
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Check if ecommerce database exists
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'ecommerce'");
    
    if (result.rows.length === 0) {
      console.log('Creating ecommerce database...');
      await client.query('CREATE DATABASE ecommerce');
      console.log('✅ Database "ecommerce" created successfully!');
    } else {
      console.log('✅ Database "ecommerce" already exists!');
    }
    
    await client.end();
    console.log('✅ Database setup completed!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\nPossible solutions:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify the password is correct');
    console.log('3. Make sure PostgreSQL is installed and configured');
  }
}

testConnection();
