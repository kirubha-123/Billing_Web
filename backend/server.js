const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Build an allow-list from comma-separated env values.
// Supports both CORS_ORIGINS and legacy CORS_ORIGIN.
const rawCorsOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = rawCorsOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  // Non-browser requests may not send an Origin header.
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  const allowVercelPreviews = String(process.env.CORS_ALLOW_VERCEL_PREVIEWS ?? 'true').toLowerCase();

  // Allow Vercel preview deployments when enabled.
  if ((allowVercelPreviews === 'true' || allowVercelPreviews === '1') && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

  return false;
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️  MongoDB URI not configured, running in demo mode');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing in demo mode without database');
  }
};

connectDB();

// Import Models
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');
const Shop = require('./models/Shop');

const PORT = process.env.PORT || 5000;

// Helper: determine local LAN IPv4 address
const os = require('os');
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

// Return server's LAN IP so local QR links can point to the dev machine
app.get('/api/local-ip', (req, res) => {
  try {
    const ip = getLocalIp();
    if (!ip) return res.status(404).json({ error: 'No LAN IP found' });
    res.json({ ip });
  } catch (err) {
    console.error('Failed to determine local IP', err);
    res.status(500).json({ error: 'Failed to determine local IP' });
  }
});

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ========== SHOP ROUTES ==========
app.get('/api/shop', async (req, res) => {
  try {
    const shop = await Shop.findOne().exec();
    if (!shop) {
      return res.json({
        name: 'My Awesome Shop',
        address: '123 Main Street, City, Country',
        phone: '+1 234 567 890',
        gstNumber: 'GST123456789',
        taxPercentage: 10,
      });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
});

app.post('/api/shop', async (req, res) => {
  try {
    const { name, address, phone, email, gstNumber, taxPercentage } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Shop name is required' });
    }

    let shop = await Shop.findOne().exec();
    if (shop) {
      shop.name = name;
      shop.address = address;
      shop.phone = phone;
      shop.email = email;
      shop.gstNumber = gstNumber;
      shop.taxPercentage = taxPercentage || 10;
      shop.updatedAt = new Date();
    } else {
      shop = new Shop({ name, address, phone, email, gstNumber, taxPercentage: taxPercentage || 10 });
    }

    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shop details' });
  }
});

// ========== PRODUCT ROUTES ==========
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, barcode, category, stock, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const product = new Product({
      name,
      price,
      barcode,
      category,
      stock,
      description,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Barcode already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, barcode, category, stock, description } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, barcode, category, stock, description, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Barcode already exists' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Search product by barcode
app.get('/api/products/search/barcode/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode }).exec();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search product' });
  }
});

// ========== INVOICE ROUTES ==========
app.post('/api/invoices', async (req, res) => {
  try {
    console.log('POST /api/invoices body:', JSON.stringify(req.body));
    const { invoiceNumber, customerName, customerPhone, items, subtotal, taxAmount, taxPercentage, total, notes } = req.body;

    if (!invoiceNumber || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invoice number and items are required' });
    }

    // Ensure we have a shopId to associate the invoice with
    let shop = await Shop.findOne().exec();
    if (!shop) {
      shop = new Shop({ name: 'My Awesome Shop' });
      await shop.save();
    }

    const invoice = new Invoice({
      invoiceNumber,
      shopId: shop._id,
      customerName,
      customerPhone,
      items,
      subtotal,
      taxAmount,
      taxPercentage: taxPercentage || 10,
      total,
      notes,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    // Handle duplicate invoiceNumber (unique index) with a clear 400 response
    if (error && error.code === 11000) {
      return res.status(400).json({ error: 'Invoice number already exists' });
    }
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).exec();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).exec();
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// ========== SMS ROUTES ==========
app.post('/api/sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ success: false, error: 'Phone number and message are required' });
    }

    // Allow disabling real SMS sending in development/local environments
    const smsEnabled = String(process.env.SMS_ENABLED ?? 'true').toLowerCase();
    if (smsEnabled === 'false' || smsEnabled === '0') {
      console.log('SMS sending disabled via SMS_ENABLED=false - sending via Telegram instead');
      
      // Send via Telegram instead
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      
      if (botToken && telegramChatId) {
        let fetchFn = global.fetch;
        if (!fetchFn) {
          fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        }

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramResp = await fetchFn(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: telegramChatId, 
            text: `📱 SMS to ${phoneNumber}:\n\n${message}`,
            parse_mode: 'HTML'
          }),
        });

        const telegramData = await telegramResp.json();
        if (telegramResp.ok && telegramData.ok) {
          return res.json({ success: true, method: 'telegram', data: { message: 'Message sent via Telegram (SMS disabled in dev)' } });
        }
      }
      
      // Fallback if Telegram not configured
      return res.json({ success: true, data: { simulated: true, message: 'SMS sending is disabled in this environment. Enable SMS_ENABLED or configure Telegram.' } });
    }

    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      console.error('FAST2SMS_API_KEY is not configured');
      return res.status(500).json({ success: false, error: 'SMS service is not configured. Set FAST2SMS_API_KEY in .env or disable SMS with SMS_ENABLED=false for local testing.' });
    }

    let fetchFn = global.fetch;
    if (!fetchFn) {
      fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    }

    const response = await fetchFn('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'TXTIND',
        message: message,
        language: 'english',
        flash: 0,
        numbers: phoneNumber,
      })
    });

    const data = await response.json();

    // Fast2SMS may require a first paid transaction before enabling API access. Detect and return a clear error.
    const providerMsg = data && data.message ? String(data.message).toLowerCase() : '';
    if (providerMsg.includes('complete one transaction') || providerMsg.includes('first transaction') || providerMsg.includes('recharge') || providerMsg.includes('top up') || providerMsg.includes('pay')) {
      console.error('Fast2SMS requires initial paid transaction:', data.message || data);
      return res.status(402).json({
        success: false,
        error: 'Fast2SMS requires an initial paid transaction (usually >= 100 INR) before API usage. Please top-up your Fast2SMS account or set SMS_ENABLED=false in your .env to disable SMS in development.',
        providerMessage: data.message || data,
        help: 'https://www.fast2sms.com/'
      });
    }

    if (!response.ok || data.return === false) {
      console.error('Fast2SMS Error:', data);
      return res.status(500).json({ success: false, error: data.message || 'Failed to send SMS' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('SMS error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========== TELEGRAM NOTIFICATIONS (Free) ==========
// Send messages via a Telegram Bot. Free for development and proofs-of-concept.
app.post('/api/notify/telegram', async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const defaultChat = process.env.TELEGRAM_CHAT_ID; // optional default

    if (!botToken) {
      return res.status(500).json({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured. Create a bot via BotFather and set TELEGRAM_BOT_TOKEN in .env' });
    }

    const targetChat = String(chatId || defaultChat || '').trim();
    if (!targetChat || !message) {
      return res.status(400).json({ success: false, error: 'chatId (or TELEGRAM_CHAT_ID) and message are required' });
    }

    let fetchFn = global.fetch;
    if (!fetchFn) {
      fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const resp = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: targetChat, text: message, parse_mode: 'HTML' }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      console.error('Telegram API error', data);
      return res.status(500).json({ success: false, error: 'Telegram API error', provider: data });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Telegram notify error', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ========== SEND INVOICE TO CUSTOMER TELEGRAM ==========
app.post('/api/send-to-customer-telegram', async (req, res) => {
  try {
    const { customerTelegramUsername, invoiceNumber, shopName, customerName, total, items } = req.body;

    if (!customerTelegramUsername || !invoiceNumber) {
      return res.status(400).json({ success: false, error: 'customerTelegramUsername and invoiceNumber are required' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured' });
    }

    let fetchFn = global.fetch;
    if (!fetchFn) {
      fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    }

    // Format invoice message for customer
    let itemsList = '';
    if (items && Array.isArray(items)) {
      itemsList = items.map(item => `  • ${item.name}: ₹${item.price} x ${item.quantity} = ₹${item.total}`).join('\n');
    }

    const invoiceMessage = `
📋 <b>Invoice from ${shopName || 'Shop'}</b>

<b>Invoice #:</b> ${invoiceNumber}
<b>Customer:</b> ${customerName || 'Valued Customer'}

<b>Items:</b>
${itemsList}

<b>Total Amount:</b> ₹${total}

Thank you for your business! 🙏
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const resp = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: customerTelegramUsername.startsWith('@') ? customerTelegramUsername : `@${customerTelegramUsername}`,
        text: invoiceMessage, 
        parse_mode: 'HTML'
      }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      console.error('Telegram send to customer error', data);
      return res.status(500).json({ success: false, error: 'Failed to send invoice to customer', detail: data.description });
    }

    return res.json({ success: true, message: `Invoice sent to customer (@${customerTelegramUsername})` });
  } catch (err) {
    console.error('Send to customer error', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📊 API Endpoints:`);
  console.log(`   GET  /api/health                           - Server status`);
  console.log(`   GET  /api/shop                             - Get shop details`);
  console.log(`   POST /api/shop                             - Update shop details`);
  console.log(`   GET  /api/products                         - Get all products`);
  console.log(`   POST /api/products                         - Create product`);
  console.log(`   GET  /api/products/:id                     - Get product`);
  console.log(`   PUT  /api/products/:id                     - Update product`);
  console.log(`   DELETE /api/products/:id                   - Delete product`);
  console.log(`   GET  /api/products/search/barcode/:barcode - Search by barcode`);
  console.log(`   GET  /api/invoices                         - Get all invoices`);
  console.log(`   POST /api/invoices                         - Create invoice`);
  console.log(`   GET  /api/invoices/:id                     - Get invoice`);
  console.log(`   POST /api/sms                              - Send SMS\n`);
});
