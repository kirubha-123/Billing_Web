# API Usage Examples

## Using the API with cURL

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Widget",
    "price": 99.99,
    "barcode": "1234567890123",
    "category": "Electronics",
    "stock": 50
  }'
```

### Search Product by Barcode
```bash
curl http://localhost:5000/api/products/search/barcode/1234567890123
```

### Update Product
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Widget",
    "price": 89.99
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID
```

### Create Invoice
```bash
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-001",
    "customerName": "John Doe",
    "customerPhone": "+919876543210",
    "items": [
      {
        "productName": "Widget",
        "quantity": 2,
        "price": 99.99,
        "total": 199.98
      }
    ],
    "subtotal": 199.98,
    "taxAmount": 19.998,
    "taxPercentage": 10,
    "total": 219.978
  }'
```

### Send SMS
```bash
curl -X POST http://localhost:5000/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "message": "Your invoice INV-001 for amount Rs. 219.98 has been generated."
  }'
```

### Get Shop Details
```bash
curl http://localhost:5000/api/shop
```

### Update Shop Details
```bash
curl -X POST http://localhost:5000/api/shop \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Store",
    "address": "123 Main Street",
    "phone": "+1234567890",
    "email": "store@example.com",
    "gstNumber": "GST123456789",
    "taxPercentage": 10
  }'
```

## Using the API with JavaScript/Fetch

### Basic Setup
```javascript
const BACKEND_URL = 'http://localhost:5000';

// Create product
async function createProduct() {
  const response = await fetch(`${BACKEND_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Product Name',
      price: 99.99,
      barcode: '1234567890123',
      category: 'Electronics'
    })
  });
  return response.json();
}

// Get all products
async function getProducts() {
  const response = await fetch(`${BACKEND_URL}/api/products`);
  return response.json();
}

// Search by barcode
async function searchByBarcode(barcode) {
  const response = await fetch(
    `${BACKEND_URL}/api/products/search/barcode/${barcode}`
  );
  return response.ok ? response.json() : null;
}

// Create invoice
async function createInvoice(invoiceData) {
  const response = await fetch(`${BACKEND_URL}/api/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData)
  });
  return response.json();
}

// Send SMS
async function sendSMS(phoneNumber, message) {
  const response = await fetch(`${BACKEND_URL}/api/sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, message })
  });
  return response.json();
}
```

## Using the API Library (Frontend)

```typescript
import { api } from '@/lib/api';

// Get all products
const products = await api.getProducts();

// Create product
const newProduct = await api.createProduct({
  name: 'Product Name',
  price: 99.99,
  barcode: '1234567890123'
});

// Search by barcode
const product = await api.searchProductByBarcode('1234567890123');

// Update product
const updated = await api.updateProduct(productId, {
  name: 'Updated Name',
  price: 89.99
});

// Delete product
await api.deleteProduct(productId);

// Get all invoices
const invoices = await api.getInvoices();

// Create invoice
const invoice = await api.createInvoice({
  invoiceNumber: 'INV-001',
  customerName: 'John Doe',
  items: [...],
  total: 219.98
});

// Send SMS
const result = await api.sendSMS('+919876543210', 'Bill: Rs. 219.98');

// Get shop details
const shop = await api.getShop();

// Update shop
await api.updateShop({
  name: 'My Store',
  gstNumber: 'GST123456789'
});
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Product Object
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Premium Widget",
  "price": 99.99,
  "barcode": "1234567890123",
  "category": "Electronics",
  "stock": 50,
  "description": "A high-quality widget",
  "createdAt": "2024-05-15T10:30:00Z",
  "updatedAt": "2024-05-15T10:30:00Z"
}
```

### Invoice Object
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "invoiceNumber": "INV-001",
  "customerName": "John Doe",
  "customerPhone": "+919876543210",
  "items": [
    {
      "productName": "Widget",
      "quantity": 2,
      "price": 99.99,
      "total": 199.98
    }
  ],
  "subtotal": 199.98,
  "taxAmount": 19.998,
  "taxPercentage": 10,
  "total": 219.978,
  "status": "completed",
  "createdAt": "2024-05-15T10:30:00Z"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

## Testing with Postman

1. Import API endpoints
2. Set base URL: `http://localhost:5000`
3. Create requests for each endpoint
4. Test with sample data
5. Check responses

---

For more examples and documentation, check the API endpoints in the main README.
