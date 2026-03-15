// Final comprehensive end-to-end API test for Smart Canteen
const BASE = 'http://localhost:5000';

async function test() {
  const results = [];
  const log = (label, ok, detail) => {
    results.push({ label, ok, detail });
    console.log(`${ok ? '✅' : '❌'} ${label}: ${detail}`);
  };

  // 1. REGISTER
  let studentToken;
  try {
    const r = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'FinalTest User', email: `final_${Date.now()}@test.com`, password: 'test123' })
    });
    const d = await r.json();
    studentToken = d.token;
    log('1. Register', !!d.token, d.token ? `name=${d.name}, role=${d.role}` : d.message);
  } catch (e) { log('1. Register', false, e.message); }

  // 2. LOGIN admin
  let adminToken;
  try {
    const r = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@canteen.com', password: 'password123' })
    });
    const d = await r.json();
    adminToken = d.token;
    log('2. Login Admin', d.role === 'admin', `role=${d.role}`);
  } catch (e) { log('2. Login Admin', false, e.message); }

  // 3. GET menu
  let firstItemId;
  try {
    const r = await fetch(`${BASE}/api/menu`);
    const d = await r.json();
    firstItemId = d[0]?._id;
    log('3. Get Menu', d.length > 0, `${d.length} items, first: ${d[0]?.name}`);
  } catch (e) { log('3. Get Menu', false, e.message); }

  // 4. Filter menu by category
  try {
    const r = await fetch(`${BASE}/api/menu?category=Snacks`);
    const d = await r.json();
    const allSnacks = d.every(i => i.category === 'Snacks');
    log('4. Filter Menu', allSnacks && d.length > 0, `${d.length} Snacks items`);
  } catch (e) { log('4. Filter Menu', false, e.message); }

  // 5. ADD to cart
  try {
    const r = await fetch(`${BASE}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ foodItemId: firstItemId, quantity: 2 })
    });
    const d = await r.json();
    log('5. Add to Cart', r.status === 200 && d.items?.length > 0, `${d.items?.length} item(s) in cart`);
  } catch (e) { log('5. Add to Cart', false, e.message); }

  // 6. GET cart
  try {
    const r = await fetch(`${BASE}/api/cart`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const d = await r.json();
    log('6. Get Cart', d.items?.length > 0, `${d.items?.length} item(s), qty=${d.items[0]?.quantity}`);
  } catch (e) { log('6. Get Cart', false, e.message); }

  // 7. UPDATE cart qty
  try {
    const r = await fetch(`${BASE}/api/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ foodItemId: firstItemId, quantity: 5 })
    });
    const d = await r.json();
    const updatedQty = d.items?.find(i => (i.foodItemId?._id || i.foodItemId) === firstItemId)?.quantity;
    log('7. Update Cart Qty', updatedQty === 5, `qty now = ${updatedQty}`);
  } catch (e) { log('7. Update Cart Qty', false, e.message); }

  // 8. PLACE ORDER (should also clear backend cart)
  let orderId;
  try {
    const cartRes = await fetch(`${BASE}/api/cart`, { headers: { 'Authorization': `Bearer ${studentToken}` } });
    const cart = await cartRes.json();
    
    const orderedItems = cart.items.map(i => ({
      foodItemId: i.foodItemId._id || i.foodItemId,
      name: i.foodItemId.name || 'Item',
      quantity: i.quantity,
      price: i.foodItemId.price || 10
    }));
    const totalPrice = orderedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    
    const r = await fetch(`${BASE}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ orderedItems, totalPrice })
    });
    const d = await r.json();
    orderId = d._id;
    log('8. Place Order', r.status === 201 && d.orderStatus === 'Received', `total=₹${d.totalPrice}, status=${d.orderStatus}`);
  } catch (e) { log('8. Place Order', false, e.message); }

  // 9. VERIFY cart was cleared after order
  try {
    const r = await fetch(`${BASE}/api/cart`, { headers: { 'Authorization': `Bearer ${studentToken}` } });
    const d = await r.json();
    log('9. Cart Cleared After Order', d.items?.length === 0, `items remaining: ${d.items?.length}`);
  } catch (e) { log('9. Cart Cleared After Order', false, e.message); }

  // 10. GET user orders
  try {
    const r = await fetch(`${BASE}/api/orders/user`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const d = await r.json();
    log('10. Get User Orders', d.length > 0, `${d.length} order(s)`);
  } catch (e) { log('10. Get User Orders', false, e.message); }

  // 11. GET admin orders
  try {
    const r = await fetch(`${BASE}/api/orders/admin`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const d = await r.json();
    log('11. Get Admin Orders', d.length > 0, `${d.length} order(s), has userId.name=${!!d[0]?.userId?.name}`);
  } catch (e) { log('11. Get Admin Orders', false, e.message); }

  // 12. UPDATE order status (Received → Preparing → Ready)
  try {
    let r = await fetch(`${BASE}/api/order/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ orderId, orderStatus: 'Preparing' })
    });
    let d = await r.json();
    log('12a. Status → Preparing', d.orderStatus === 'Preparing', `status=${d.orderStatus}`);

    r = await fetch(`${BASE}/api/order/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ orderId, orderStatus: 'Ready' })
    });
    d = await r.json();
    log('12b. Status → Ready', d.orderStatus === 'Ready', `status=${d.orderStatus}`);
  } catch (e) { log('12. Update Status', false, e.message); }

  // 13. ADMIN add menu item (with availability=false)
  let testItemId;
  try {
    const r = await fetch(`${BASE}/api/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Test Dosa', price: 50, category: 'Meals', description: 'Crispy south indian crepe', image: 'https://placehold.co/300x200?text=Dosa', availability: false })
    });
    const d = await r.json();
    testItemId = d._id;
    log('13. Admin Add Item', !!d._id && d.availability === false, `name=${d.name}, avail=${d.availability}`);
  } catch (e) { log('13. Admin Add Item', false, e.message); }

  // 14. ADMIN update menu item
  try {
    const r = await fetch(`${BASE}/api/menu/${testItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ price: 65, availability: true })
    });
    const d = await r.json();
    log('14. Admin Update Item', d.price === 65 && d.availability === true, `price=${d.price}, avail=${d.availability}`);
  } catch (e) { log('14. Admin Update Item', false, e.message); }

  // 15. ADMIN delete menu item
  try {
    const r = await fetch(`${BASE}/api/menu/${testItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const d = await r.json();
    log('15. Admin Delete Item', r.status === 200, d.message);
  } catch (e) { log('15. Admin Delete Item', false, e.message); }

  // 16. CLEAR cart endpoint
  try {
    // Add something to cart first
    await fetch(`${BASE}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}` },
      body: JSON.stringify({ foodItemId: firstItemId, quantity: 1 })
    });
    const r = await fetch(`${BASE}/api/cart/clear`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const d = await r.json();
    log('16. Clear Cart API', r.status === 200, d.message);
  } catch (e) { log('16. Clear Cart API', false, e.message); }

  // 17. VITE PROXY
  try {
    const r = await fetch('http://localhost:5173/api/menu');
    const d = await r.json();
    log('17. Vite Proxy', Array.isArray(d), `proxied ${d.length} items`);
  } catch (e) { log('17. Vite Proxy', false, e.message); }

  // 18. AUTH guard (should reject without token)
  try {
    const r = await fetch(`${BASE}/api/cart`);
    log('18. Auth Guard', r.status === 401, `status=${r.status} (expected 401)`);
  } catch (e) { log('18. Auth Guard', false, e.message); }

  // Summary
  const passed = results.filter(r => r.ok).length;
  const total = results.length;
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`FINAL RESULTS: ${passed}/${total} tests passed`);
  if (passed < total) {
    console.log('\nFAILED:');
    results.filter(r => !r.ok).forEach(r => console.log(`  ❌ ${r.label}: ${r.detail}`));
  } else {
    console.log('🎉 ALL TESTS PASSED — Project is bug-free!');
  }
}

test().catch(console.error);
