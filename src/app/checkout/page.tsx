'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { signIn, useSession } from 'next-auth/react';
import { User, MapPin, CreditCard, CheckCircle2, ChevronRight, AlertCircle, Trash2, Zap, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
  const cartItems = useCartStore(state => state.items);
  const cartTotal = useCartStore(state => state.getTotalPrice());
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const [activeTab, setActiveTab] = useState(1);
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;
  const widgetRendered = useRef(false);
  const [isPayingNow, setIsPayingNow] = useState(false);

  // Form states
  const [authData, setAuthData] = useState({ mobile: '' });
  const [addressData, setAddressData] = useState({
    fullName: '',
    pincode: '',
    houseNo: '',
    locality: '',
    landmark: '',
    city: '',
    state: '',
    instructions: '',
    isDefault: false
  });
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setIsFetchingProfile(true);
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.mobile) setAuthData({ mobile: data.mobile });
          if (data.address) {
            setAddressData({
              fullName: data.address.fullName || '',
              pincode: data.address.pincode || '',
              houseNo: data.address.houseNo || '',
              locality: data.address.locality || '',
              landmark: data.address.landmark || '',
              city: data.address.city || '',
              state: data.address.state || '',
              instructions: data.address.instructions || '',
              isDefault: data.address.isDefault || false
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsFetchingProfile(false));
    }
  }, [isSignedIn]);

  const handleProceedToPayment = async () => {
    if (isSignedIn) {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: authData.mobile,
          address: addressData
        })
      });
    }
    setActiveTab(3);
  };

  const handlePay = async () => {
    if (!isSignedIn) {
      alert('Please sign in first');
      return;
    }
    if (isPayingNow) return;
    setIsPayingNow(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: cartTotal,
          items: cartItems
        })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to create order. Please try again.");
        setIsPayingNow(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SqtVvz4THtOfLm",
        amount: data.amount,
        currency: data.currency,
        name: "Refurb Laptop Wala",
        description: "Test Transaction",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId
            })
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Redirecting...");
            // Clear cart
            useCartStore.getState().clearCart();
            window.location.href = '/';
          } else {
            alert("Payment verification failed.");
            setIsPayingNow(false);
          }
        },
        prefill: {
          name: addressData.fullName,
          email: session?.user?.email,
          contact: authData.mobile
        },
        theme: {
          color: "#2563EB"
        },
        modal: {
          ondismiss: () => setIsPayingNow(false)
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
        setIsPayingNow(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsPayingNow(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-surface-ice min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <h2 className="font-heading text-2xl font-bold text-secondary mb-4">Your Cart is Empty</h2>
        <Link href="/products" className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
          Browse Laptops
        </Link>
      </div>
    );
  }

  const TabHeader = ({ step, title, icon: Icon }: { step: number, title: string, icon: any }) => {
    const isActive = activeTab === step;
    const isCompleted = activeTab > step;
    
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${isActive ? 'border-primary bg-blue-50 text-primary' : isCompleted ? 'border-tertiary bg-tertiary text-white' : 'border-gray-200 text-gray-400'}`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <span className={`ml-3 font-medium hidden sm:block ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-secondary' : 'text-gray-400'}`}>{title}</span>
        {step < 3 && <div className="mx-4 sm:mx-6 w-12 sm:w-24 h-px bg-gray-200"></div>}
      </div>
    );
  };

  return (
    <>
      {/* Razorpay Checkout SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Razorpay Affordability Widget SDK */}
      <Script
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Render affordability widget when on payment tab and script is loaded
          if (activeTab === 3 && !widgetRendered.current && (window as any).RazorpayAffordabilitySuite) {
            const widgetConfig = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SqtVvz4THtOfLm',
              amount: cartTotal * 100, // in paise
            };
            const rzpAffordability = new (window as any).RazorpayAffordabilitySuite(widgetConfig);
            rzpAffordability.render();
            widgetRendered.current = true;
          }
        }}
      />
      <div className="bg-surface-ice min-h-[calc(100vh-80px)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-heading text-3xl font-bold text-secondary mb-8 text-center">Secure Checkout</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            <TabHeader step={1} title="Account" icon={User} />
            <TabHeader step={2} title="Address" icon={MapPin} />
            <TabHeader step={3} title="Payment" icon={CreditCard} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Account Verification */}
            {activeTab === 1 && (
              <motion.div
                key="tab1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 sm:p-10"
              >
                <h2 className="font-heading text-2xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Account Verification</h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-center">
                  {!isSignedIn ? (
                    <>
                      <p className="text-gray-600 mb-4 font-medium">To proceed with your order securely, please sign in with Google.</p>
                      
                      <button onClick={() => signIn('google')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 mx-auto w-full sm:w-auto shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-2 text-tertiary font-medium">
                        <CheckCircle2 className="w-6 h-6" />
                        Successfully signed in
                      </div>
                      <div className="text-sm font-medium text-secondary bg-gray-100 py-1.5 px-4 rounded-full">
                        {session?.user?.name} ({session?.user?.email})
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-heading font-semibold text-secondary">Mandatory Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="flex-shrink-0 bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-600 font-medium">+91</span>
                    <input 
                      type="tel" 
                      placeholder="Enter 10-digit mobile number" 
                      value={authData.mobile}
                      onChange={(e) => setAuthData({...authData, mobile: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-gray-500">We will use this to send order updates and tracking links.</p>
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={() => setActiveTab(2)}
                    disabled={!authData.mobile || !isSignedIn}
                    className="bg-primary hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Continue to Address <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Shipping Address */}
            {activeTab === 2 && (
              <motion.div
                key="tab2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 sm:p-10"
              >
                <h2 className="font-heading text-2xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({...addressData, fullName: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="First and Last name" 
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Pincode</label>
                    <input 
                      type="text" 
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="6-digit pincode" 
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">House / Shop No.</label>
                    <input 
                      type="text" 
                      value={addressData.houseNo}
                      onChange={(e) => setAddressData({...addressData, houseNo: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="Flat, House no., Building, Company, Apartment" 
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Locality / Area / Street</label>
                    <input 
                      type="text" 
                      value={addressData.locality}
                      onChange={(e) => setAddressData({...addressData, locality: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="Area, Street, Sector, Village" 
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Landmark</label>
                    <input 
                      type="text" 
                      value={addressData.landmark}
                      onChange={(e) => setAddressData({...addressData, landmark: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="E.g. Near Apollo Hospital" 
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Town / City</label>
                    <input 
                      type="text" 
                      value={addressData.city}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">State</label>
                    <select 
                      value={addressData.state}
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                      <option>Uttar Pradesh</option>
                      <option>Delhi</option>
                      <option>Haryana</option>
                      <option>Rajasthan</option>
                      <option>Madhya Pradesh</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-2">
                    <label className="block text-sm font-heading font-semibold text-secondary mb-1">Delivery Instructions (Optional)</label>
                    <textarea 
                      rows={3} 
                      className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="e.g. Please call before arriving, or leave with security guard."
                    ></textarea>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium text-secondary">Make this my default address</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 sm:relative sm:p-0 sm:bg-transparent sm:border-t-0 sm:z-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:shadow-none">
                  <button 
                    onClick={() => setActiveTab(1)}
                    className="text-gray-500 hover:text-secondary font-medium py-2 px-2 sm:px-4 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleProceedToPayment}
                    className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-4 sm:px-8 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    Proceed to Payment <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Order Summary & Payment */}
            {activeTab === 3 && (
              <motion.div
                key="tab3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 sm:p-10"
              >
                <h2 className="font-heading text-2xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 relative bg-white border border-gray-200 rounded overflow-hidden">
                            <Image src={item.image} alt={item.model} fill className="object-contain p-1" />
                          </div>
                          <div>
                            <h4 className="font-heading font-semibold text-secondary">{item.brand} {item.model}</h4>
                            <p className="text-sm text-gray-500 font-mono mb-2">{item.ram} | {item.storage}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-gray-200 rounded bg-white">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors">-</button>
                                <span className="w-6 text-center text-xs font-bold text-secondary">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors">+</button>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-medium">
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-primary">₹{(item.finalPrice * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-tertiary">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% Included)</span>
                      <span>₹{(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                    <span className="font-heading font-bold text-lg text-secondary">Total Amount</span>
                    <span className="font-bold text-2xl text-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* RAZORPAY AFFORDABILITY WIDGET */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">EMI &amp; Pay Later Options</p>
                  {/* Widget renders itself into this div */}
                  <div id="razorpay-affordability-widget"></div>
                </div>

                {/* PAY BUTTON */}
                <div className="bg-blue-50 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-secondary text-sm">Secure Payment Gateway</h3>
                      <p className="text-xs text-gray-500">256-bit SSL encrypted · Powered by Razorpay</p>
                    </div>
                  </div>
                  <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 sm:relative sm:p-0 sm:bg-transparent sm:border-t-0 sm:z-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:shadow-none">
                    <button
                      onClick={handlePay}
                      disabled={isPayingNow}
                      className="relative w-full overflow-hidden bg-tertiary text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 sm:shadow-[0_4px_14px_0_rgba(13,214,136,0.39)] transition-all duration-300"
                    >
                      {/* Ripple wave */}
                      {isPayingNow && (
                        <motion.span
                          className="absolute inset-0 rounded-xl bg-white/20"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      )}

                      {/* Shimmer sweep */}
                      {isPayingNow && (
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 0.8, ease: 'easeInOut', repeat: Infinity }}
                        />
                      )}

                      {/* Progress bar */}
                      {isPayingNow && (
                        <motion.span
                          className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                      )}

                      {/* Label */}
                      <AnimatePresence mode="wait">
                        {isPayingNow ? (
                          <motion.div
                            key="paying"
                            className="flex items-center gap-2 relative z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Connecting to Payment Gateway...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="idle"
                            className="flex items-center gap-2 relative z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Zap className="w-5 h-5" />
                            Pay ₹{cartTotal.toLocaleString('en-IN')} Securely
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-start pb-20 sm:pb-0">
                  <button 
                    onClick={() => setActiveTab(2)}
                    className="text-gray-500 hover:text-secondary font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Back to Address
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
    </>
  );
}
