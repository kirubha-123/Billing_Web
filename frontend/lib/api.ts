const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const api = {
  // Shop endpoints
  async getShop() {
    const res = await fetch(`${BACKEND_URL}/api/shop`);
    if (!res.ok) throw new Error('Failed to fetch shop');
    return res.json();
  },

  async updateShop(shopData) {
    const res = await fetch(`${BACKEND_URL}/api/shop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData),
    });
    if (!res.ok) throw new Error('Failed to update shop');
    return res.json();
  },

  // Product endpoints
  async getProducts() {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  async searchProductByBarcode(barcode) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/search/barcode/${barcode}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  // Invoice endpoints
  async getInvoices() {
    const res = await fetch(`${BACKEND_URL}/api/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  async getInvoice(id) {
    const res = await fetch(`${BACKEND_URL}/api/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return res.json();
  },

  async createInvoice(invoiceData) {
    const res = await fetch(`${BACKEND_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },

  // SMS endpoint
  async sendSMS(phoneNumber, message) {
    const res = await fetch(`${BACKEND_URL}/api/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message }),
    });
    if (!res.ok) throw new Error('Failed to send SMS');
    return res.json();
  },

  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};
