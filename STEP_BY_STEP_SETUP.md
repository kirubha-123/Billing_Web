# 📋 STEP-BY-STEP SETUP GUIDE

Follow these exact steps in order. Complete each section before moving to the next.

---

## ⏱️ TIME ESTIMATE
- **MongoDB Setup**: 5 minutes
- **Backend Setup**: 5 minutes
- **Frontend Setup**: 5 minutes
- **First Test**: 5 minutes
- **Total**: ~20 minutes

---

# PART 1: MongoDB Setup (5 minutes)

## Step 1.1: Create MongoDB Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (top right)
3. Enter your email and create password
4. Click **"Create Account"**
5. Check your email for verification link and click it

## Step 1.2: Create MongoDB Project
1. After login, click **"Create a Project"** (or skip org creation)
2. Name it: `billing-app-project`
3. Click **"Create Project"**

## Step 1.3: Create MongoDB Cluster
1. Click **"Create Deployment"** (or "Build a Cluster")
2. Select **"FREE"** tier (important!)
3. Select region close to you
4. Click **"Create Deployment"**
5. Wait 2-3 minutes for cluster creation

## Step 1.4: Create Database User
1. On the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Set Username: `billpro_user`
4. Set Password: `Use_Strong_Password_123!`
5. Click **"Add User"**
6. **Save this username and password!**

## Step 1.5: Allow Your IP
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - In production: Add your server's IP only
4. Click **"Confirm"**

## Step 1.6: Get Connection String
1. Go to **"Databases"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"**
4. Select **"Node.js"** and version **"5.0 or later"**
5. Copy the connection string
6. It looks like: `mongodb+srv://billpro_user:PASSWORD@cluster...`
7. **Replace PASSWORD with your actual password**

**Example final connection string:**
```
mongodb+srv://billpro_user:Use_Strong_Password_123!@cluster0.xxxxx.mongodb.net/billing_db?retryWrites=true&w=majority
```

✅ **MongoDB is ready!** Keep the connection string handy.

---

# PART 2: Backend Setup (5 minutes)

## Step 2.1: Open Terminal in Backend Folder
1. Open **PowerShell** or **Command Prompt**
2. Navigate to backend:
   ```bash
   cd C:\Users\kirubhakaran\billing-web-app\backend
   ```
3. Verify you see: `package.json` in the current folder
   ```bash
   ls
   ```

## Step 2.2: Install Dependencies
```bash
npm install
```
**This will take 1-2 minutes.** You'll see packages being downloaded.

✅ When done, you'll see `added X packages`

## Step 2.3: Edit .env File
1. In your editor, open: `backend/.env`
2. You'll see:
   ```
   FAST2SMS_API_KEY=ZljiY4uCmavsBtW1k6xMy90OnhLKAp7Sz5FRVEceQfrG8PgTobsv6tQkzOp7I0q2VebY8WPHliLnwS5u
   ```
3. Add MongoDB connection string **above** the FAST2SMS line:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://billpro_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/billing_db?retryWrites=true&w=majority
   FAST2SMS_API_KEY=ZljiY4uCmavsBtW1k6xMy90OnhLKAp7Sz5FRVEceQfrG8PgTobsv6tQkzOp7I0q2VebY8WPHliLnwS5u
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

**Replace:**
- `YOUR_PASSWORD` with actual password (from Step 1.4)
- `cluster0.xxxxx` with your cluster name (from Step 1.6)

✅ **Save the file** (Ctrl+S)

## Step 2.4: Start Backend Server
```bash
npm start
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

**Important:** Keep this terminal open! Don't close it.

✅ **Backend is running!** Leave this terminal running.

---

# PART 3: Frontend Setup (5 minutes)

## Step 3.1: Open New Terminal for Frontend
1. Open **another PowerShell/Command Prompt** (keep backend running)
2. Navigate to frontend:
   ```bash
   cd C:\Users\kirubhakaran\billing-web-app\frontend
   ```
3. Verify you see `package.json`:
   ```bash
   ls
   ```

## Step 3.2: Install Dependencies
```bash
npm install
```
**This will take 2-3 minutes.** Wait for completion.

✅ When done, you'll see `added X packages`

## Step 3.3: Check Frontend Environment
The file `.env.local` should already have:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=BillPro
NEXT_PUBLIC_APP_VERSION=2.0.0
```

If not, add these lines.

✅ **Save if you made changes** (Ctrl+S)

## Step 3.4: Start Frontend Server
```bash
npm run dev
```

**You should see:**
```
▲ Next.js running on http://localhost:3000
```

**Important:** Keep this terminal open too!

✅ **Frontend is running!**

---

# PART 4: Open in Browser (2 minutes)

## Step 4.1: Open Browser
1. Open **Chrome, Firefox, or Edge**
2. Go to: http://localhost:3000
3. You should see the **BillPro Dashboard**

✅ **App is loaded!**

## Step 4.2: Verify Everything Works
- [ ] Page loads without blank screen
- [ ] You see navigation menu (Navbar)
- [ ] You see "Products", "Billing", "Invoice", "Settings" links
- [ ] Dark mode toggle works (top right)
- [ ] No error messages

✅ **App is working!**

---

# PART 5: Create Your First Product (3 minutes)

## Step 5.1: Go to Products Page
1. In browser at http://localhost:3000
2. Click **"Products"** in the navigation menu
3. You should see empty products list

## Step 5.2: Add a Product
1. Click **"Add Product"** button
2. Fill in the form:
   ```
   Name: Premium Widget
   Price: 99.99
   Barcode: 8901234567890
   Category: Electronics
   Stock: 50
   ```
3. Click **"Save Product"** button

**You should see:**
- Green success message: "Product added successfully!"
- Product appears in the list

✅ **Product created!**

## Step 5.3: Verify in Database
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **"Database"** → your cluster
3. Click **"Collections"**
4. You should see:
   - Database: `billing_db`
   - Collection: `products`
   - Your product is listed

✅ **Product is in MongoDB!**

---

# PART 6: Test Complete Workflow (5 minutes)

## Step 6.1: Go to Billing
1. Click **"Billing"** in navigation
2. In search box, type: `Premium Widget`
3. Click **"Add to Cart"** button
4. Product appears in cart

## Step 6.2: Verify Cart
1. Look at top right of page
2. You should see cart count increased (e.g., "Cart: 1")
3. In billing page, you should see:
   - Product quantity: 1
   - Price: 99.99
   - Tax (10%): 9.99
   - Total: 109.98

✅ **Billing works!**

## Step 6.3: Create Invoice
1. Click **"Invoice"** in navigation
2. Fill customer info:
   ```
   Name: John Doe
   Phone: +919876543210
   Email: john@example.com
   ```
3. Click **"Generate Invoice"**
4. You should see:
   - Invoice number auto-filled
   - All items listed
   - Total calculated correctly

✅ **Invoice works!**

## Step 6.4: Check Invoice in Database
1. MongoDB Atlas → Collections
2. Look for `invoices` collection
3. Your invoice should be saved

✅ **Data is persisted!**

---

# PART 7: Test Settings (2 minutes)

## Step 7.1: Go to Settings
1. Click **"Settings"** in navigation
2. Update shop details:
   ```
   Shop Name: My Awesome Store
   Address: 123 Main Street, City
   Phone: +1234567890
   GST Number: GST123456789
   ```
3. Click **"Save Settings"**

✅ **Settings saved!**

## Step 7.2: Verify Settings Persist
1. Refresh the page (F5)
2. Go back to Settings
3. Your settings should still be there

✅ **Settings are persistent!**

---

# PART 8: Test Dark Mode (1 minute)

## Step 8.1: Toggle Dark Mode
1. Click the moon icon (top right)
2. Page should turn dark
3. Click sun icon to toggle back

✅ **Dark mode works!**

---

# 🎉 COMPLETE! Everything is Working!

You should now have:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected and storing data
- ✅ Products working
- ✅ Billing working
- ✅ Invoices working
- ✅ Settings working
- ✅ Dark mode working

---

# ⚠️ TROUBLESHOOTING

## Backend Won't Start

### Error: "Cannot find module 'mongoose'"
```bash
cd backend
npm install mongoose
npm start
```

### Error: "Port 5000 already in use"
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Use different port
PORT=5001 npm start
```

### Error: "MongoDB connection failed"
1. Check `.env` has correct MONGODB_URI
2. Verify username and password are correct
3. Check MongoDB Atlas IP whitelist includes your IP
4. Ensure internet connection is working

**Fix:**
```bash
# Re-check connection string in MongoDB Atlas
# Copy fresh connection string
# Paste in .env
# Restart backend
npm start
```

---

## Frontend Won't Connect to Backend

### Blank Page or Errors in Console

Check browser console (F12):
- Look at "Console" tab
- Look at "Network" tab

**Solutions:**
1. Check NEXT_PUBLIC_BACKEND_URL in `frontend/.env.local`
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

2. Verify backend is running
   ```bash
   # In backend terminal, check if it says "Server running on http://localhost:5000"
   ```

3. Restart frontend
   ```bash
   # Stop frontend (Ctrl+C in frontend terminal)
   npm run dev
   ```

---

## Products Not Appearing

### Issue: Added product but can't see it

1. Check MongoDB connection
   - Go to MongoDB Atlas dashboard
   - Check if product is in database

2. Restart backend
   ```bash
   # In backend terminal
   Ctrl+C
   npm start
   ```

3. Refresh browser (F5)

---

## Cannot Access http://localhost:3000

### Issue: Browser says "Cannot reach server"

1. Check if frontend is running
   ```bash
   # You should see in terminal:
   # ▲ Next.js running on http://localhost:3000
   ```

2. Start frontend if not running
   ```bash
   cd frontend
   npm run dev
   ```

3. Wait 5 seconds and try again

---

# 📞 NEED HELP?

### Check These Files First
1. **README.md** - Complete documentation
2. **QUICK_REFERENCE.md** - Common commands
3. **API_EXAMPLES.md** - API usage

### Common Issues
- See "TROUBLESHOOTING" section above
- Check your `.env` file configuration
- Verify both backend and frontend terminals show "running"

---

# ✅ SUCCESS CHECKLIST

Print this and check off as you go:

```
PART 1: MongoDB
☐ MongoDB account created
☐ Cluster created (free tier)
☐ Database user created (username: billpro_user)
☐ IP whitelisted
☐ Connection string copied

PART 2: Backend
☐ Dependencies installed (npm install completed)
☐ .env file updated with MongoDB URI
☐ Backend started (npm start)
☐ See "Server running on http://localhost:5000"

PART 3: Frontend
☐ Dependencies installed (npm install completed)
☐ .env.local verified
☐ Frontend started (npm run dev)
☐ See "Next.js running on http://localhost:3000"

PART 4: Browser
☐ Open http://localhost:3000
☐ App loads without errors
☐ See dashboard page
☐ Navigation menu visible

PART 5: First Product
☐ Go to Products page
☐ Add a product
☐ See success message
☐ Verify in MongoDB database

PART 6: Workflow
☐ Go to Billing page
☐ Search for product
☐ Add to cart
☐ Cart count increases
☐ Go to Invoice page
☐ See all items
☐ Create invoice

PART 7: Settings
☐ Go to Settings
☐ Update shop details
☐ Save changes
☐ Refresh page - settings persist

PART 8: Dark Mode
☐ Toggle dark mode
☐ Page changes to dark
☐ Toggle back to light

🎉 ALL DONE! 🎉
```

---

# 🚀 WHAT'S NEXT?

After setup is complete:

1. **Add More Products** - Practice creating products
2. **Create Test Invoices** - Test the workflow
3. **Optional: Setup SMS** - If you want SMS notifications
4. **Read Documentation** - Understand the architecture
5. **Deploy** - When ready, follow DEPLOYMENT.md

---

**Congratulations! Your billing app is now running! 🎊**

Have questions? Check QUICK_REFERENCE.md or TROUBLESHOOTING section above.
