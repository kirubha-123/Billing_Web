# Testing Guide

## Unit Testing Setup

### Frontend Testing (Jest + React Testing Library)

1. **Install dependencies**
   ```bash
   cd frontend
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. **Create jest.config.js**
   ```js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1',
     },
   };
   ```

3. **Sample Test**
   ```javascript
   // components/__tests__/Toast.test.tsx
   import { render, screen } from '@testing-library/react';
   import Toast from '@/components/Toast';

   test('renders toast message', () => {
     render(
       <Toast 
         message="Success!" 
         type="success" 
         onClose={() => {}} 
       />
     );
     expect(screen.getByText('Success!')).toBeInTheDocument();
   });
   ```

### Backend Testing (Jest + Supertest)

1. **Install dependencies**
   ```bash
   cd backend
   npm install --save-dev jest supertest
   ```

2. **Sample Test**
   ```javascript
   // __tests__/api.test.js
   const request = require('supertest');
   const app = require('../server');

   describe('Products API', () => {
     test('GET /api/products should return products', async () => {
       const res = await request(app).get('/api/products');
       expect(res.statusCode).toBe(200);
       expect(Array.isArray(res.body)).toBe(true);
     });
   });
   ```

## Manual Testing Checklist

### Frontend

#### Dashboard Page
- [ ] Title displays correctly
- [ ] Stats cards show (Products, Cart Items, Cart Value)
- [ ] Navigation links work
- [ ] Dark mode toggle works
- [ ] Mobile responsive

#### Products Page
- [ ] Products list displays
- [ ] Add Product button works
- [ ] Edit button opens form
- [ ] Delete button removes product
- [ ] Search filters products
- [ ] Form validation works
- [ ] Success/error messages appear

#### Billing Page
- [ ] Product search works
- [ ] Barcode scanner opens
- [ ] Manual barcode entry works
- [ ] Products add to cart
- [ ] Cart updates in real-time
- [ ] Quantity adjusts correctly
- [ ] Tax calculation correct (10%)
- [ ] Cart total updates
- [ ] Mobile keyboard doesn't break layout

#### Invoice Page
- [ ] Invoice form displays
- [ ] Customer fields editable
- [ ] Invoice items show
- [ ] Invoice number auto-generated
- [ ] Total calculation correct
- [ ] PDF export works
- [ ] SMS form shows
- [ ] Success message after SMS

#### Settings Page
- [ ] Shop settings display
- [ ] All fields editable
- [ ] Save updates details
- [ ] Theme setting persists
- [ ] Tax percentage configurable

### Backend

#### API Health
- [ ] GET /api/health returns status
- [ ] Server starts without errors
- [ ] CORS enabled
- [ ] JSON parsing works

#### Products API
- [ ] GET /api/products returns array
- [ ] POST /api/products creates product
- [ ] GET /api/products/:id returns product
- [ ] PUT /api/products/:id updates product
- [ ] DELETE /api/products/:id removes product
- [ ] Barcode uniqueness enforced
- [ ] Validation works

#### Invoices API
- [ ] POST /api/invoices creates invoice
- [ ] GET /api/invoices returns array
- [ ] GET /api/invoices/:id returns invoice
- [ ] Invoice numbers unique
- [ ] Totals calculated correctly

#### SMS API
- [ ] POST /api/sms sends message
- [ ] Validates phone number
- [ ] Error handling works
- [ ] Fast2SMS key validated

#### Shop API
- [ ] GET /api/shop returns details
- [ ] POST /api/shop updates details
- [ ] Persists to database

## Performance Testing

### Frontend Lighthouse Audit
```bash
cd frontend
npm run build
# Open in Chrome DevTools → Lighthouse
# Target: 90+ score
```

### Backend Load Testing
```bash
npm install -g loadtest
loadtest -n 1000 -c 100 http://localhost:5000/api/health
# Should handle concurrent requests
```

## Database Testing

### Connection Test
```javascript
// Test MongoDB connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Failed', err));
```

### Data Validation
```javascript
// Ensure data types
const product = await Product.findById(id);
expect(typeof product.price).toBe('number');
expect(typeof product.name).toBe('string');
expect(product.createdAt).toBeInstanceOf(Date);
```

## Barcode Scanner Testing

### Test Barcodes
- `8901234567890` - Product 1
- `8901234567891` - Product 2
- `1234567890123` - Custom

### Browser Permissions
1. Allow camera access
2. Check in DevTools
3. Test with actual barcodes

## SMS Testing

### Test Flow
1. Get Fast2SMS API key
2. Create invoice
3. Enter test phone number
4. Send SMS
5. Check delivery in Fast2SMS dashboard

### Test Phone Numbers
- Use your own number
- Check delivery within 30 seconds
- Verify message content

## End-to-End Testing

### Complete User Flow
1. ✅ Open dashboard
2. ✅ Add product to inventory
3. ✅ Go to billing
4. ✅ Search and add product to cart
5. ✅ Create invoice
6. ✅ Send SMS notification
7. ✅ Verify data in database

## Regression Testing

After each update, verify:
- [ ] All pages load
- [ ] No console errors
- [ ] All buttons functional
- [ ] Database operations work
- [ ] API responses correct
- [ ] No broken links
- [ ] Mobile responsive

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Accessibility Testing

```bash
npm install -g axe-core
# Test with axe DevTools Chrome extension
# Target: 0 violations
```

## Security Testing

### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protected
- [ ] File upload safe

### API Security
- [ ] No sensitive data in logs
- [ ] Rate limiting works
- [ ] CORS properly configured
- [ ] Environment variables protected

## Test Coverage Goals

- **Frontend**: 80%+ coverage
- **Backend**: 85%+ coverage
- **Critical Paths**: 100% coverage

## Continuous Testing

### GitHub Actions CI/CD
```yaml
- Run tests on every push
- Block merge if tests fail
- Generate coverage reports
- Deploy only if tests pass
```

---

**Regular testing ensures quality and reliability!**
