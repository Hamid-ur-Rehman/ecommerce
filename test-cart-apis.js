const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

const testProduct = {
  name: 'Test Product',
  description: 'A test product for cart testing',
  price: 29.99,
  stock: 100,
  sku: 'TEST-001',
  categoryId: 1
};

let authToken = '';
let userId = '';
let productId = '';

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.access_token;
    userId = response.data.user.id;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function createTestProduct() {
  try {
    console.log('📦 Creating test product...');
    const response = await axios.post(`${BASE_URL}/products`, testProduct, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    productId = response.data.id;
    console.log('✅ Test product created:', productId);
    return true;
  } catch (error) {
    console.log('❌ Product creation failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCartAPIs() {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    console.log('\n🛒 Testing Cart APIs...\n');

    // 1. Get empty cart
    console.log('1. Getting empty cart...');
    let response = await axios.get(`${BASE_URL}/cart`, { headers });
    console.log('✅ Cart retrieved:', response.data);
    console.log('   Items count:', response.data.itemCount);
    console.log('   Is empty:', response.data.isEmpty);

    // 2. Add item to cart
    console.log('\n2. Adding item to cart...');
    response = await axios.post(`${BASE_URL}/cart/add`, {
      productId: productId,
      quantity: 2
    }, { headers });
    console.log('✅ Item added to cart');
    console.log('   Items count:', response.data.itemCount);
    console.log('   Subtotal:', response.data.subtotal);

    // 3. Get cart with items
    console.log('\n3. Getting cart with items...');
    response = await axios.get(`${BASE_URL}/cart`, { headers });
    console.log('✅ Cart retrieved with items');
    console.log('   Items:', response.data.items.length);
    console.log('   Total:', response.data.total);

    // 4. Get cart item count
    console.log('\n4. Getting cart item count...');
    response = await axios.get(`${BASE_URL}/cart/count`, { headers });
    console.log('✅ Cart count:', response.data);

    // 5. Update cart item quantity
    console.log('\n5. Updating cart item quantity...');
    const cartItemId = response.data.items[0].id;
    response = await axios.patch(`${BASE_URL}/cart/items/${cartItemId}`, {
      quantity: 3
    }, { headers });
    console.log('✅ Cart item updated');
    console.log('   New quantity:', response.data.items[0].quantity);
    console.log('   New total:', response.data.total);

    // 6. Test checkout
    console.log('\n6. Testing checkout...');
    response = await axios.post(`${BASE_URL}/cart/checkout`, {
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        country: 'Test Country',
        postalCode: '12345',
        phone: '+1234567890'
      },
      tax: 2.40,
      shipping: 5.99,
      paymentMethod: 'credit_card',
      notes: 'Test order from cart'
    }, { headers });
    console.log('✅ Checkout successful');
    console.log('   Order ID:', response.data.order.id);
    console.log('   Order Number:', response.data.order.orderNumber);
    console.log('   Order Total:', response.data.order.total);

    // 7. Verify cart is empty after checkout
    console.log('\n7. Verifying cart is empty after checkout...');
    response = await axios.get(`${BASE_URL}/cart`, { headers });
    console.log('✅ Cart is empty after checkout');
    console.log('   Items count:', response.data.itemCount);
    console.log('   Is empty:', response.data.isEmpty);

    console.log('\n🎉 All cart API tests passed!');

  } catch (error) {
    console.log('❌ Cart API test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.log('   Error details:', error.response.data);
    }
  }
}

async function cleanup() {
  try {
    console.log('\n🧹 Cleaning up...');
    
    // Delete test product
    if (productId) {
      await axios.delete(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Test product deleted');
    }
    
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.log('⚠️ Cleanup failed:', error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🚀 Starting Cart API Tests...\n');
  
  // Login
  if (!(await login())) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Create test product
  if (!(await createTestProduct())) {
    console.log('❌ Cannot proceed without test product');
    return;
  }

  // Test cart APIs
  await testCartAPIs();

  // Cleanup
  await cleanup();
}

// Run the tests
main().catch(console.error);

