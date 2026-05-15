"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Share2, Copy, Check } from "lucide-react";
import Link from "next/link";

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  total: number;
  createdAt: string;
  notes?: string;
}

interface ShopDetails {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

export default function InvoiceViewPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const routeParams = useParams();
  const id = (routeParams as any)?.id || (params && params.id);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        
        // Fetch invoice
        const invoiceRes = await fetch(`${backendUrl}/api/invoices/${id}`);
        if (!invoiceRes.ok) {
          throw new Error('Invoice not found');
        }
        const invoiceData = await invoiceRes.json();
        setInvoice(invoiceData);

        // Fetch shop details
        const shopRes = await fetch(`${backendUrl}/api/shop`);
        if (shopRes.ok) {
          const shopData = await shopRes.json();
          setShopDetails(shopData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/invoice-view/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareOnTelegram = () => {
    const link = `${window.location.origin}/invoice-view/${id}`;
    const text = `Check out invoice #${invoice?.invoiceNumber}: ${link}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 dark:text-red-400 text-center mb-6">
          <p className="text-2xl font-bold">❌ Invoice Not Found</p>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{error || 'The invoice you are looking for does not exist.'}</p>
        </div>
        <Link href="/" className="text-blue-600 hover:text-blue-700 font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/" className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Print/PDF</span>
            </button>
            <button
              onClick={handleShareOnTelegram}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-900/50 font-medium transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 print:shadow-none print:rounded-none print:bg-white print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{shopDetails?.name || 'Invoice'}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                <p>{shopDetails?.address}</p>
                <p>Phone: {shopDetails?.phone}</p>
                <p>GST: {shopDetails?.gstNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-white text-lg">Invoice: {invoice.invoiceNumber}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Date: {invoiceDate}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Bill To</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{invoice.customerName || 'Customer'}</p>
              <p className="text-slate-600 dark:text-slate-400">{invoice.customerPhone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  <th className="px-4 py-3 text-left font-semibold">Item Description</th>
                  <th className="px-4 py-3 text-center font-semibold">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{item.name}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax ({invoice.taxPercentage}%)</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center text-xl font-bold text-slate-900 dark:text-white">
                <span>Total Due</span>
                <span className="text-blue-600 dark:text-blue-400">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Thank you for your business!</p>
            <p className="mt-2 print:hidden">
              Share this invoice: <span className="font-mono text-xs">{window.location.origin}/invoice-view/{id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
