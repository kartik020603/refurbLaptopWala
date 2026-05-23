'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, AlertCircle, MessageCircle, Mail } from 'lucide-react';
import Image from 'next/image';

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (status === 'unauthenticated') {
      window.location.href = '/';
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-ice flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface-ice min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-secondary mb-2">My Orders</h1>
            <p className="text-gray-500">Track your purchases and expected delivery dates.</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="https://wa.me/918410617268" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg font-medium transition-colors border border-green-200"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Support
            </a>
            <a 
              href="mailto:ravikartikcomputers@gmail.com" 
              className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200"
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-secondary mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link href="/products" className="inline-block bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt);
              const expectedDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
              
              const isDelivered = order.status === 'DELIVERED';
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs uppercase font-semibold">Order Placed</span>
                        <span className="font-medium text-secondary">{orderDate.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase font-semibold">Total</span>
                        <span className="font-medium text-secondary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase font-semibold">Order #</span>
                        <span className="font-mono text-xs mt-0.5 block bg-gray-200 px-2 py-0.5 rounded text-gray-700">{order.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                      {isDelivered ? (
                        <div className="flex items-center text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Delivered
                        </div>
                      ) : (
                        <div className="flex items-center text-orange-600 font-bold bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                          <Clock className="w-5 h-5 mr-2" /> Expected by {expectedDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-secondary">{item.brand} {item.model}</h4>
                              <p className="text-sm text-gray-500 font-mono mt-0.5">{item.ram} | {item.storage}</p>
                              <div className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50/50 p-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <AlertCircle className="w-4 h-4 mr-1.5 text-blue-500" /> Need help with this order? 
                    </div>
                    {(() => {
                      const productsText = order.items.map((i: any) => `${i.brand} ${i.model} (${i.quantity}x)`).join(', ');
                      const messageText = `Hi, I would like to raise a concern regarding my order.\nName: ${session?.user?.name || 'Customer'}\nOrder ID: ${order.id}\nProducts: ${productsText}\nAmount: ₹${order.totalAmount}\nPurchase Date: ${orderDate.toLocaleDateString()}`;
                      const waLink = `https://wa.me/918410617268?text=${encodeURIComponent(messageText)}`;
                      return (
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                          Raise a concern
                        </a>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
