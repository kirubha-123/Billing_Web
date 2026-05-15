# Quick Start Guide

## One-Click Setup (Recommended)

### 1. Backend Setup (5 minutes)

```bash
cd backend
npm install
# Wait for installation to complete
```

#### MongoDB Setup (Choose One)

**Option A: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a project and cluster
4. Get connection string
5. Update `.env` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billing_db?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/billing_db
   ```

#### Start Backend
```bash
npm start
# You should see: 🚀 Server running on http://localhost:5000
```

### 2. Frontend Setup (5 minutes)

In a new terminal:
```bash
cd frontend
npm install
# Wait for installation to complete
npm run dev
# You should see: ▲ Next.js running on http://localhost:3000
```

### 3. Open in Browser
- Visit http://localhost:3000
- You should see the dashboard

## Troubleshooting Quick Fixes

### ❌ "Cannot find module 'mongoose'"
```bash
cd backend
npm install mongoose
npm start
```

### ❌ "Port 5000 already in use"
```bash
# Check what's using port 5000
netstat -ano | findstr :5000
# Kill the process or use different port:
PORT=5001 npm start
```

### ❌ "Cannot connect to MongoDB"
1. Check connection string in `.env`
2. Verify MongoDB is running
3. Check internet connection (for MongoDB Atlas)
4. Check firewall settings

### ❌ "Frontend shows blank page"
1. Check browser console (F12)
2. Check if backend is running on port 5000
3. Check NEXT_PUBLIC_BACKEND_URL in frontend/.env.local

### ❌ "Products not loading"
1. Start backend first
2. Check if MongoDB is connected
3. Check network tab in browser DevTools
4. Check backend console for errors

## First Steps

### 1. Add Your First Product
- Go to Products page (http://localhost:3000/products)
- Click "Add Product"
- Enter name, price, barcode
- Click Save

### 2. Test Billing
- Go to Billing (http://localhost:3000/billing)
- Search for your product or scan barcode
- Add to cart
- View cart with taxes

### 3. Create Invoice
- Go to Invoice (http://localhost:3000/invoice)
- Add customer details
- Select billing items
- Generate invoice
- (Optional) Send SMS

### 4. Configure Shop
- Go to Settings (http://localhost:3000/settings)
- Enter shop name, address, phone
- Enter GST number
- Save settings

## Testing Barcode Scanner

### Use Sample Barcodes
- Product 1: `8901234567890`
- Product 2: `8901234567891`
- Product 3: `8901234567892`

### Generate Test Barcodes
1. Go to https://barcode.tec-it.com/
2. Generate your own barcode
3. Use in products

## SMS Testing

### Setup SMS
1. Get API key from https://www.fast2sms.com/
2. Add to backend/.env:
   ```
   FAST2SMS_API_KEY=your_key_here
   ```
3. Test in Invoice page

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Products not showing | Restart backend, check MongoDB connection |
| Cart empty after refresh | Products saved to DB, need to reload page |
| SMS not sending | Check Fast2SMS API key, internet connection |
| Barcode scanner not working | Allow camera permission, use HTTPS in production |
| Theme not persisting | Clear browser cache, check localStorage |

## Database Reset

### Clear All Data
```bash
# Connect to MongoDB
# Drop database "billing_db"
# Data will reset
```

### Reset to Defaults
Frontend will create default products on first load if database is empty.

## Next Steps

1. ✅ Complete setup above
2. ✅ Add your products
3. ✅ Create test invoices
4. ✅ Customize shop details
5. 🔜 Deploy to cloud (Vercel + Railway)
6. 🔜 Add user authentication
7. 🔜 Setup email notifications

## Production Deployment

### Backend Deployment (Railway.app)
1. Push to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Connect GitHub repo
2. Set environment variables
3. Deploy

See main README.md for detailed deployment guide.

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Fast2SMS**: https://www.fast2sms.com/dev

---

**You're all set! 🎉 Start creating invoices!**
