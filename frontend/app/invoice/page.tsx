"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileCheck, CheckCircle2, AlertCircle, Loader2, Copy, Check, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface InvoiceResponse {
  _id: string;
  invoiceNumber: string;
}

export default function InvoicePage() {
  const { cart, clearCart, shopDetails } = useAppContext();
  const router = useRouter();
  
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [invoiceDate] = useState(new Date().toLocaleDateString());
  const [invoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [invoiceLink, setInvoiceLink] = useState<string>('');
  const [detectedIp, setDetectedIp] = useState<string | null>(null);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = cartTotal * 0.1;
  const finalTotal = cartTotal + tax;

  

  // Save invoice to DB and show QR/link without sending SMS
  const handleSaveAndShare = async () => {
    setError(null);
    setIsSending(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const invoiceResponse = await fetch(`${backendUrl}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invoiceNumber,
          customerName: customerName,
          customerPhone: customerPhone,
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal: cartTotal,
          taxAmount: tax,
          taxPercentage: 10,
          total: finalTotal,
          notes: ''
        }),
      });

      const invoiceData: InvoiceResponse = await invoiceResponse.json();

      if (!invoiceResponse.ok || !invoiceData._id) {
        throw new Error('Failed to save invoice');
      }

      setSavedInvoiceId(invoiceData._id);
      // mark as sent so UI shows QR/link (we're not sending SMS here)
      setIsSent(true);
      // build invoice link after save - prefer env `NEXT_PUBLIC_BASE_URL`, else try LAN detection when origin is localhost
      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        const envBase = process.env.NEXT_PUBLIC_BASE_URL || '';
        if (envBase) {
          setInvoiceLink(`${envBase.replace(/\/$/,'')}/invoice-view/${invoiceData._id}`);
          try { const u = new URL(envBase); setDetectedIp(u.hostname); } catch (e) { /* ignore */ }
        } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const resp = await fetch(`${backendUrl}/api/local-ip`);
            if (resp.ok) {
              const data = await resp.json();
              if (data.ip) {
                setDetectedIp(data.ip);
                setInvoiceLink(`${window.location.protocol}//${data.ip}:3000/invoice-view/${invoiceData._id}`);
              } else {
                setInvoiceLink(`${origin}/invoice-view/${invoiceData._id}`);
              }
            } else {
              setInvoiceLink(`${origin}/invoice-view/${invoiceData._id}`);
            }
          } catch (e) {
            setInvoiceLink(`${origin}/invoice-view/${invoiceData._id}`);
          }
        } else {
          setInvoiceLink(`${origin}/invoice-view/${invoiceData._id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSending(false);
    }
  };

  

  if (cart.length === 0 && !isSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <FileCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No items to invoice</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Add some products to your cart first.</p>
        <button
          onClick={() => router.push('/billing')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Billing</span>
        </button>
      </div>
    );
  }

  if (isSent && savedInvoiceId) {
    const displayLink = invoiceLink || (typeof window !== 'undefined' ? window.location.origin + `/invoice-view/${savedInvoiceId}` : '');
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500 py-12">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-500">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Invoice Created Successfully!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
          Invoice #{invoiceNumber} has been saved. Share it with your customer or print it.
        </p>

        {/* QR Code Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 mb-8">
          <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white mb-4">Share This Invoice</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* QR Code */}
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
              <QRCodeCanvas value={displayLink} size={200} level="H" />
            </div>

            {/* Share Options */}
            <div className="space-y-4 w-full sm:w-auto">
              {/* Detected LAN IP or manual override */}
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {detectedIp ? (
                  <div>Detected LAN IP: <span className="font-mono">{detectedIp}</span></div>
                ) : (
                  <div>
                    No LAN IP detected. If scanning shows localhost on your phone, enter your PC's LAN IP below and click "Use Host".
                  </div>
                )}
              </div>
              {/* No manual host input — automatic detection or env fallback only */}
              {/* Copy Link */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Invoice Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(displayLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-3 py-2 rounded font-medium transition-all flex items-center gap-2 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
                >
                  🖨️ Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => { clearCart(); router.push('/billing'); }}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <span>New Order</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Invoice Preview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review details and save & share the invoice.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{shopDetails.name}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm whitespace-pre-line">
                  {shopDetails.address}{'\n'}
                  Phone: {shopDetails.phone}{'\n'}
                  GST: {shopDetails.gstNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-900 dark:text-white">Invoice: {invoiceNumber}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">Date: {invoiceDate}</div>
              </div>
            </div>

            {/* Customer Details Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Customer Name (Optional):</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number (Optional):</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            

            {/* Items Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm border-y border-slate-100 dark:border-slate-700">
                    <th className="py-3 px-4 font-medium">Item Description</th>
                    <th className="py-3 px-4 font-medium text-center">Qty</th>
                    <th className="py-3 px-4 font-medium text-right">Price</th>
                    <th className="py-3 px-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-800 dark:text-slate-200">
                  {cart.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">{item.name}</td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Summary</h3>

              <div className="flex justify-between items-center text-slate-300">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pb-4 border-b border-slate-700">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-2">
                <span>Total Due</span>
                <span className="text-blue-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <button
                onClick={handleSaveAndShare}
                disabled={isSending}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed text-white/80 shadow-none"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95"
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Save & Share (QR)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
