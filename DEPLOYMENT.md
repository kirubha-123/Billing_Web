# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Railway.app account (for backend)
- MongoDB Atlas account (for database)

## Backend Deployment (Railway.app)

### Step 1: Prepare Backend
```bash
cd backend
# Ensure all files are committed to Git
git add .
git commit -m "Ready for deployment"
```

### Step 2: Setup Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your billing-web-app repository

### Step 3: Configure Environment Variables
In Railway dashboard:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/billing_db
FAST2SMS_API_KEY=your_key_here
JWT_SECRET=your_secure_secret_key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Step 4: Deploy
- Railway will automatically deploy
- Get the production URL (e.g., https://backend-production-xxx.railway.app)

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
# Ensure all files are committed
git add .
git commit -m "Ready for production"
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the frontend folder

### Step 3: Configure Environment Variables
In Vercel dashboard, add:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-railway-url.railway.app
NEXT_PUBLIC_APP_NAME=BillPro
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### Step 4: Deploy
- Vercel will automatically build and deploy
- Your app is now live!

## MongoDB Setup

### Create MongoDB Atlas Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create new project
4. Create cluster (free tier available)
5. Create database user
6. Get connection string
7. Add to environment variables

### Database Backups
- MongoDB Atlas provides automatic backups
- Configure backup schedules
- Test restore procedures

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Can view products
- [ ] Can create products (check MongoDB)
- [ ] Can generate invoices
- [ ] SMS sending works
- [ ] Settings persist
- [ ] Theme switching works
- [ ] Barcode scanner works
- [ ] Mobile responsive layout
- [ ] No console errors

## Troubleshooting Deployments

### Backend won't start
```
Check logs in Railway dashboard
Verify all environment variables are set
Check MongoDB connection string
```

### Frontend shows blank page
```
Check NEXT_PUBLIC_BACKEND_URL
Verify backend is accessible from frontend
Check browser console errors
```

### Database connection fails
```
Verify MongoDB URI is correct
Check IP whitelist in MongoDB Atlas
Ensure database user credentials are right
```

### Slow performance
```
Enable caching
Optimize images
Use CDN for static files
Add database indexes
```

## Custom Domain Setup

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Wait for verification

### Add Custom Domain to Railway
1. Go to Project Settings → Custom Domain
2. Add your domain
3. Update DNS CNAME records

## SSL/HTTPS Setup

- Vercel: Automatically provides SSL
- Railway: Automatically provides SSL
- MongoDB Atlas: Requires secure connection

## Monitoring & Logs

### Vercel Analytics
- Go to Analytics tab
- Monitor performance metrics
- Check error logs

### Railway Logs
- Real-time logs visible in dashboard
- Can filter by time range
- Download logs for analysis

## Environment-Specific Configuration

### Development (.env)
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/billing_db
CORS_ORIGIN=http://localhost:3000
```

### Production (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-domain.com
```

## Database Migration (if needed)

```bash
# Backup current database
mongodump --uri="mongodb+srv://user:pass@cluster..." --out=./backup

# Restore to new database
mongorestore --uri="mongodb+srv://user:pass@newcluster..." ./backup
```

## Update Deployment

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update feature"
git push
# Vercel auto-deploys
```

### Update Backend
```bash
cd backend
git add .
git commit -m "Update feature"
git push
# Railway auto-deploys
```

## Security Best Practices

- Use environment variables for secrets
- Enable two-factor authentication
- Regularly update dependencies
- Monitor for vulnerabilities
- Keep API keys rotated
- Use HTTPS everywhere
- Validate all user inputs
- Rate limit API endpoints

## Cost Optimization

### Free Tier Resources
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month
- **MongoDB Atlas**: 512MB storage

### Estimated Monthly Cost
- Backend: $7-20 (Railway)
- Frontend: Free (Vercel)
- Database: Free (MongoDB Atlas)
- **Total**: ~$7-20/month

## Continuous Integration/Deployment

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
      - name: Deploy to Railway
        run: railway up
```

## Rollback Procedures

### Revert Vercel Deployment
1. Go to Deployments tab
2. Select previous deployment
3. Click "Promote to Production"

### Revert Railway Deployment
1. Go to Deployments tab
2. Select previous deployment
3. Click "Set as Current"

---

**Your app is now live to the world!** 🚀
