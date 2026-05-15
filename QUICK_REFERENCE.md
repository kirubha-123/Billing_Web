# Developer Quick Reference

## 🚀 Quick Start (Copy-Paste)

### Setup Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and Fast2SMS key
npm start
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

**Open:** http://localhost:3000

---

## 📁 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Product Model | Database schema | `backend/models/Product.js` |
| Invoice Model | Database schema | `backend/models/Invoice.js` |
| Shop Model | Database schema | `backend/models/Shop.js` |
| API Routes | All endpoints | `backend/server.js` |
| API Client | Frontend calls | `frontend/lib/api.ts` |
| Toast Component | Notifications | `frontend/components/Toast.tsx` |
| App Context | State management | `frontend/context/AppContext.tsx` |

---

## 🔌 API Endpoints Cheat Sheet

```bash
# Products
curl http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Item","price":99.99}'
curl http://localhost:5000/api/products/PRODUCT_ID
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID

# Search
curl "http://localhost:5000/api/products/search/barcode/1234567890"

# Invoices
curl http://localhost:5000/api/invoices
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"invoiceNumber":"INV-1","items":[]}'

# SMS
curl -X POST http://localhost:5000/api/sms \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","message":"Hello"}'

# Shop
curl http://localhost:5000/api/shop
curl -X POST http://localhost:5000/api/shop \
  -H "Content-Type: application/json" \
  -d '{"name":"My Store"}'
```

---

## 🎯 Common Tasks

### Add a New API Endpoint
1. Create route in `backend/server.js`
2. Add error handling
3. Use mongoose models
4. Add to `frontend/lib/api.ts`
5. Test with curl
6. Update documentation

### Add a New Component
1. Create file in `frontend/components/`
2. Use TypeScript with proper types
3. Make responsive (mobile-first)
4. Add to appropriate page
5. Test on mobile view

### Modify Database Schema
1. Update model in `backend/models/`
2. Add validation rules
3. Test with sample data
4. Update API endpoints if needed
5. Update documentation

### Deploy Changes
1. Test locally thoroughly
2. Commit to git
3. Push to GitHub
4. Railway/Vercel auto-deploys
5. Test in production

---

## 🐛 Debugging

### Backend Not Starting
```bash
# Check logs
npm start

# Check port availability
netstat -ano | findstr :5000

# Check MongoDB
# Verify URI in .env
```

### Frontend Can't Connect
```bash
# Check NEXT_PUBLIC_BACKEND_URL
echo $NEXT_PUBLIC_BACKEND_URL

# Check if backend is running
curl http://localhost:5000/api/health

# Check browser console (F12)
```

### Database Issues
```bash
# Test connection
# Use MongoDB Compass
# Connect with your URI

# Check data
# Go to MongoDB Atlas dashboard
```

---

## 📦 Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://...
FAST2SMS_API_KEY=...
JWT_SECRET=...
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=BillPro
NEXT_PUBLIC_APP_VERSION=2.0.0
```

---

## 🔧 Useful Commands

```bash
# Backend
npm start          # Start server
npm run dev        # Start with auto-reload
npm test           # Run tests

# Frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Check code quality
npm start          # Start production server

# Git
git add .
git commit -m "message"
git push

# Database
# MongoDB Compass for GUI access
# mongodump for backup
# mongorestore for restore
```

---

## 📊 Database Relationships

```
Shop (1) ──────────── (∞) Product
   │
   └──────────── (∞) Invoice
                   │
                   └──────────── (∞) InvoiceItems
```

---

## 🎨 Styling

### Tailwind Classes Used
```
Colors: bg-blue-500, text-green-600
Spacing: p-4, m-2, gap-3
Layout: flex, grid, w-full
Responsive: sm:, md:, lg:, xl:
```

### Add New Styling
1. Update in `.tsx` or `.tsx` file directly
2. Use Tailwind classes
3. Mobile-first approach
4. Test on mobile view

---

## 🧪 Testing Checklist

```
Before Commit:
☐ No console errors
☐ All pages load
☐ API endpoints work
☐ Database saves data
☐ Mobile responsive
☐ Dark mode works
☐ No TypeScript errors
```

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Full documentation |
| SETUP_GUIDE.md | Installation steps |
| API_EXAMPLES.md | API usage examples |
| DEPLOYMENT.md | Production guide |
| TESTING.md | Testing guide |
| UPGRADE_SUMMARY.md | What's new |
| QUICK_REFERENCE.md | This file |

---

## 🚨 Important Notes

1. **Never commit .env** - Use .env.example
2. **MongoDB Atlas is free** - 512MB storage
3. **Barcode format** - 13 digits typically
4. **Phone number format** - +91 for India
5. **Tax calculation** - 10% by default
6. **CORS enabled** - Localhost only for dev

---

## 💾 Backup & Recovery

### Backup Data
```bash
# Using MongoDB Compass
# Or MongoDB Atlas auto-backups
# Or use mongodump command
```

### Restore Data
```bash
# Using MongoDB Compass
# Or mongorestore command
```

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to your domain
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up MongoDB backups
- [ ] Configure monitoring
- [ ] Test all APIs
- [ ] Security audit
- [ ] Performance testing
- [ ] Load testing

---

## 🆘 Getting Help

1. Check the error message carefully
2. Review browser console (F12)
3. Check backend logs
4. Read relevant documentation
5. Google the error message
6. Check Stack Overflow
7. Ask on GitHub issues

---

## 📈 Performance Tips

- Use database indexes
- Cache frequently accessed data
- Optimize images
- Minify CSS/JS
- Use CDN for static assets
- Enable compression
- Monitor database queries

---

## 🔄 Version Control

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Clear message about changes"

# Push
git push origin main
```

**Commit messages should be:**
- Clear and descriptive
- Start with verb (Add, Fix, Update)
- Include ticket/issue number if applicable

---

## 📞 Quick Links

- **GitHub**: https://github.com/your-repo
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Railway.app**: https://railway.app
- **Vercel**: https://vercel.com
- **Fast2SMS**: https://www.fast2sms.com

---

**Keep this file handy for quick reference! 📌**
