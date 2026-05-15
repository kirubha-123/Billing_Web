# BillPro - Professional Billing & Invoice Management System

A modern, full-stack billing and invoice management web application built with **Next.js**, **Express.js**, **MongoDB**, and **Tailwind CSS**.

## Features

### ✨ Core Features
- **Product Management** — Add, edit, delete products with names, prices, and barcodes
- **Barcode Scanning** — Real-time camera scanning with fallback to manual entry
- **Smart Search** — Filter products by name or barcode instantly
- **Shopping Cart** — Add/remove items, adjust quantities on the fly
- **Invoice Generation** — Create professional invoices with customer details
- **SMS Notifications** — Send bill details to customer via SMS (Fast2SMS integration)
- **Shop Configuration** — Manage shop name, address, phone, GST details
- **Dark Mode** — Theme toggle with persistence
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **Data Persistence** — Products and invoices stored in MongoDB database

### 🎨 UI/UX
- Modern, clean interface with Tailwind CSS
- Real-time cart updates
- Toast notifications for user feedback
- Loading states for better UX
- Accessible components with proper accessibility features

## Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **Lucide React** — Icon library
- **Barcode Scanning** — @zxing/library, html5-qrcode
- **PDF Export** — jspdf

### Backend
- **Express.js 5** — Node.js web framework
- **MongoDB** — NoSQL database
- **Mongoose** — ODM for MongoDB
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment configuration

### Services
- **Fast2SMS** — SMS delivery service

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Fast2SMS API key

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your credentials**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billing_db
   FAST2SMS_API_KEY=your_api_key
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   # Check .env.local file, update if needed
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_APP_NAME=BillPro
   ```

3. **Start frontend development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Visit `http://localhost:3000`

## API Documentation

### Health Check
```
GET /api/health
```

### Shop Endpoints
```
GET    /api/shop                    - Get shop details
POST   /api/shop                    - Update shop details
```

### Product Endpoints
```
GET    /api/products                - Get all products
POST   /api/products                - Create product
GET    /api/products/:id            - Get product
PUT    /api/products/:id            - Update product
DELETE /api/products/:id            - Delete product
GET    /api/products/search/barcode/:barcode - Search by barcode
```

### Invoice Endpoints
```
GET    /api/invoices                - Get all invoices
POST   /api/invoices                - Create invoice
GET    /api/invoices/:id            - Get invoice
```

### SMS Endpoint
```
POST   /api/sms                     - Send SMS notification
```

## Usage

### 1. Dashboard
- View statistics: total products, cart items, cart value
- Quick navigation to all features

### 2. Products
- Add new products with name, price, barcode, category
- Edit existing products
- Delete products
- View product list with all details

### 3. Billing
- Search products by name or scan barcode
- Add products to cart
- Adjust quantities
- View cart total with 10% tax

### 4. Invoice
- Enter customer details (name, phone, email)
- Select products from cart
- Generate professional invoice
- Send SMS to customer with bill details
- Export as PDF (optional)

### 5. Settings
- Configure shop name
- Add shop address
- Set phone number
- Enter GST number
- Customize tax percentage

## Project Structure

```
billing-web-app/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Invoice.js
│   │   └── Shop.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           (Dashboard)
│   │   ├── products/page.tsx  (Products)
│   │   ├── billing/page.tsx   (Billing)
│   │   ├── invoice/page.tsx   (Invoice)
│   │   ├── settings/page.tsx  (Settings)
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── Toast.tsx
│   │   └── Loading.tsx
│   │
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── package.json
│   ├── tailwind.config.mjs
│   └── .env.local
```

## Database Schema

### Product
```
{
  _id: ObjectId,
  name: String,
  price: Number,
  barcode: String,
  category: String,
  stock: Number,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice
```
{
  _id: ObjectId,
  invoiceNumber: String,
  customerName: String,
  customerPhone: String,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  taxAmount: Number,
  taxPercentage: Number,
  total: Number,
  paymentMethod: String,
  status: String,
  createdAt: Date
}
```

### Shop
```
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String,
  gstNumber: String,
  taxPercentage: Number,
  theme: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Backend connection issues
1. Ensure MongoDB is running and connection string is correct
2. Check FAST2SMS_API_KEY is valid
3. Run `npm start` in backend folder
4. Check if port 5000 is available

### Frontend not fetching data
1. Ensure backend is running on port 5000
2. Check NEXT_PUBLIC_BACKEND_URL in .env.local
3. Check browser console for errors
4. Verify CORS is properly configured

### Barcode scanner not working
1. Check browser permissions for camera
2. Ensure page is served over HTTPS (in production)
3. Try manual barcode entry

### SMS not sending
1. Verify Fast2SMS API key
2. Ensure phone number format is correct
3. Check internet connection
4. Review Fast2SMS dashboard for delivery status

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Database indexing for fast queries
- Caching strategies for products
- Minified CSS with Tailwind

## Security Considerations

- Use environment variables for sensitive data
- Validate all inputs on backend
- Use HTTPS in production
- Implement JWT authentication (future)
- Rate limiting for API endpoints
- Secure SMS delivery with API keys

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Advanced reporting and analytics
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Inventory tracking and alerts
- [ ] Email receipts alongside SMS
- [ ] Multi-language support
- [ ] Mobile app with React Native
- [ ] Cloud backup and sync

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

MIT License - feel free to use this project

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors
- Enable debug logging in backend

---

**Built with ❤️ for modern billing management**
