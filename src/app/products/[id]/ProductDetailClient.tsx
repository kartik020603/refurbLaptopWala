'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BatteryCharging, Monitor, Cpu, ShieldCheck, Check, ShoppingCart, Zap, ChevronRight, ChevronLeft, Star, X, ZoomIn, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore, Product } from '@/store/useProductStore';

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  
  // Zustand product store
  const storeProducts = useProductStore(state => state.products);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync with store if changes happen, otherwise use initialProduct from server
  const product = useMemo(() => {
    if (!isMounted) return initialProduct;
    const matched = storeProducts.find(p => String(p.id) === String(initialProduct.id));
    return matched || initialProduct;
  }, [storeProducts, initialProduct, isMounted]);

  // Gallery State
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = (product.images || [product.image || '/hp.png']) as string[];
  const totalImages = images.length;

  const goPrev = () => setActiveImage(i => (i - 1 + totalImages) % totalImages);
  const goNext = () => setActiveImage(i => (i + 1) % totalImages);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, totalImages]);

  // Configuration Engine State
  const [selectedRam, setSelectedRam] = useState<'8GB' | '16GB'>('8GB');
  const [selectedStorage, setSelectedStorage] = useState<'256GB' | '512GB'>('256GB');
  const [quantity, setQuantity] = useState(1);
  
  // Animation States
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Dynamic Price Calculation
  const finalPrice = useMemo(() => {
    let price = product.basePrice || product.price;
    if (selectedRam === '16GB') price += 4000;
    if (selectedStorage === '512GB') price += 3500;
    return price;
  }, [product.basePrice, product.price, selectedRam, selectedStorage]);

  // Razorpay Affordability Widget — re-render whenever price changes
  const widgetRef = useRef<any>(null);
  useEffect(() => {
    if (!isMounted) return;
    const initWidget = () => {
      if (!(window as any).RazorpayAffordabilitySuite) return;
      // Destroy previous instance if exists
      if (widgetRef.current) {
        try { widgetRef.current.destroy?.(); } catch {}
      }
      const widgetConfig = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SqtVvz4THtOfLm',
        amount: finalPrice * 100, // in paise
      };
      widgetRef.current = new (window as any).RazorpayAffordabilitySuite(widgetConfig);
      widgetRef.current.render();
    };
    // If script already loaded, run immediately; else it will run via onLoad
    if ((window as any).RazorpayAffordabilitySuite) {
      initWidget();
    } else {
      (window as any).__rzpWidgetInit = initWidget;
    }
  }, [finalPrice, isMounted]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      productId: product.id,
      brand: product.brand,
      model: product.model,
      image: images[0],
      basePrice: product.basePrice || product.price,
      finalPrice,
      ram: selectedRam,
      storage: selectedStorage,
      quantity: quantity
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    if (isBuyingNow) return;
    handleAddToCart();
    setIsBuyingNow(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 750);
  };

  if (!isMounted) {
    return (
      <div className="bg-surface-ice min-h-screen flex items-center justify-center py-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-heading font-semibold text-secondary text-lg mb-1">Loading Details</h3>
          <p className="text-gray-500 text-sm">Please wait while we secure certified specifications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).__rzpWidgetInit) {
            (window as any).__rzpWidgetInit();
          }
        }}
      />
      <div className="bg-surface-ice min-h-screen py-8 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-primary cursor-pointer">Home</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <Link href="/products" className="hover:text-primary cursor-pointer">Laptops</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-secondary font-medium">{product.brand} {product.model}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-10 xl:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-start lg:sticky lg:top-20 lg:self-start">
              {/* Main Image with Prev/Next + Click to Enlarge */}
              <div className="relative aspect-[4/3] bg-gray-50 rounded-xl mb-4 overflow-hidden group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={images[activeImage]} 
                      alt={product.model} 
                      fill 
                      className="object-contain p-8" 
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Zoom hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-sm text-secondary text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                  </div>
                </div>

                {/* Prev Arrow */}
                {totalImages > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-secondary" />
                  </button>
                )}

                {/* Next Arrow */}
                {totalImages > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); goNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-secondary" />
                  </button>
                )}

                {/* Dot Indicators */}
                {totalImages > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={e => { e.stopPropagation(); setActiveImage(idx); }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${activeImage === idx ? 'bg-primary w-5' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all duration-200 ${activeImage === idx ? 'border-primary shadow-sm scale-105' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info & Configurator */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-10 xl:p-12">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className="bg-blue-100 text-primary text-xs font-bold px-2 py-1 rounded">CERTIFIED REFURBISHED</span>
                <span className="flex items-center text-xs font-medium text-tertiary mr-2">
                  <Star className="w-3 h-3 fill-current mr-1" /> 4.9/5 Rating
                </span>
                {product.tags && (product.tags as string[]).filter((t: string) => !['Like New', 'Grade A', 'Grade B'].includes(t)).map((tag: string) => {
                  let tagStyle = 'bg-gray-100 text-gray-600 border border-gray-200';
                  if (tag.toLowerCase() === 'gaming') tagStyle = 'bg-rose-50 text-rose-700 border border-rose-100';
                  else if (tag.toLowerCase() === 'coding') tagStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                  else if (tag.toLowerCase() === 'bestseller') tagStyle = 'bg-amber-50 text-amber-700 border border-amber-200';
                  else if (tag.toLowerCase() === 'budget') tagStyle = 'bg-teal-50 text-teal-700 border border-teal-100';
                  else if (tag.toLowerCase() === 'corporate') tagStyle = 'bg-indigo-50 text-indigo-700 border border-indigo-100';

                  return (
                    <span key={tag} className={`text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide uppercase shadow-sm ${tagStyle}`}>
                      {tag}
                    </span>
                  );
                })}
              </div>
              
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-2 leading-tight">{product.brand} {product.model}</h1>
              
              {/* Premium Core Specs Badge Strip */}
              <div className="flex flex-wrap gap-2.5 mb-5 mt-3">
                <span className="bg-gray-100/80 border border-gray-200/50 text-secondary text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> 
                  <span className="text-gray-500 font-normal">Processor:</span> 
                  {product.specs?.processor || product.processor}
                </span>
                <span className="bg-gray-100/80 border border-gray-200/50 text-secondary text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Monitor className="w-3.5 h-3.5 text-primary" /> 
                  <span className="text-gray-500 font-normal">Display:</span> 
                  {product.specs?.display || '14" Certified Display'}
                </span>
                <span className="bg-gray-100/80 border border-gray-200/50 text-secondary text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 
                  <span className="text-gray-500 font-normal">Grade:</span> 
                  {product.condition}
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Price Display */}
              <div className="bg-blue-50/50 rounded-xl p-5 sm:p-6 mb-4 border border-blue-100">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">₹{finalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-xs sm:text-sm font-medium text-tertiary bg-green-100 px-2 py-0.5 rounded ml-auto sm:ml-2">Save {Math.round((1 - finalPrice/product.originalPrice) * 100)}%</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Includes 18% GST and Free Shipping.</p>
              </div>

              {/* Razorpay Affordability Widget */}
              <div id="razorpay-affordability-widget" className="mb-6"></div>

              {/* Configuration Engine */}
              <div className="mb-8 space-y-6">
                <h3 className="font-heading font-semibold text-secondary text-lg border-b border-gray-100 pb-2">Customize Specification</h3>
                
                {/* RAM Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Memory (RAM)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedRam('8GB')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedRam === '8GB' ? 'border-primary bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {selectedRam === '8GB' && <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />}
                      <span className="block font-semibold text-secondary">8GB RAM</span>
                      <span className="text-sm text-gray-500">Base Configuration</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedRam('16GB')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedRam === '16GB' ? 'border-primary bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {selectedRam === '16GB' && <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />}
                      <span className="block font-semibold text-secondary">16GB RAM</span>
                      <span className="text-sm text-tertiary font-medium">+ ₹4,000</span>
                    </button>
                  </div>
                </div>

                {/* Storage Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Storage (SSD)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedStorage('256GB')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedStorage === '256GB' ? 'border-primary bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {selectedStorage === '256GB' && <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />}
                      <span className="block font-semibold text-secondary">256GB NVMe</span>
                      <span className="text-sm text-gray-500">Base Configuration</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedStorage('512GB')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedStorage === '512GB' ? 'border-primary bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {selectedStorage === '512GB' && <Check className="absolute top-3 right-3 w-5 h-5 text-primary" />}
                      <span className="block font-semibold text-secondary">512GB NVMe</span>
                      <span className="text-sm text-tertiary font-medium">+ ₹3,500</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-lg w-32 bg-white">
                  <button 
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors rounded-l-lg text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-secondary">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors rounded-r-lg text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions - Sticky on Mobile */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 sm:relative sm:p-0 sm:bg-transparent sm:border-t-0 sm:z-0 flex flex-row gap-3 sm:gap-4 mb-0 sm:mb-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:shadow-none">
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 relative overflow-hidden bg-white border-2 border-primary text-primary font-bold text-sm sm:text-lg py-3 sm:py-4 rounded-xl transition-colors hover:bg-blue-50 flex justify-center items-center group"
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-1 sm:gap-2 text-tertiary"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Added
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-1 sm:gap-2 group-hover:-translate-y-0.5 transition-transform"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                
                <button 
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="flex-1 relative overflow-hidden bg-primary text-white font-bold text-sm sm:text-lg py-3 sm:py-4 rounded-xl flex justify-center items-center group"
                >
                  {/* Pulse ring - only when idle */}
                  {!isBuyingNow && (
                    <span className="absolute inset-0 rounded-xl bg-primary animate-ping opacity-20 duration-1000" />
                  )}

                  {/* Ripple on click */}
                  {isBuyingNow && (
                    <motion.span
                      className="absolute inset-0 rounded-xl bg-white/20"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  )}

                  {/* Progress sweep bar */}
                  {isBuyingNow && (
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-white/70"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Shimmer sweep */}
                  {isBuyingNow && (
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Button label */}
                  <AnimatePresence mode="wait">
                    {isBuyingNow ? (
                      <motion.div
                        key="processing"
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 relative z-10"
                      >
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Processing...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1 sm:gap-2 relative z-10 group-hover:scale-105 transition-transform"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> Buy Now
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Testing Integrity Dashboard */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-heading font-semibold text-secondary text-lg mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Certified Integrity Report
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium flex items-center gap-2 text-secondary"><BatteryCharging className="w-4 h-4 text-tertiary" /> Battery Health</span>
                      <span className="text-sm font-bold text-tertiary">{product.tests?.battery || 80}% Guaranteed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${product.tests?.battery || 80}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-tertiary h-2.5 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-secondary">Display Quality</p>
                      <p className="text-sm text-gray-600">{product.tests?.display || 'Certified Quality'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-secondary">Hardware Integrity</p>
                      <p className="text-sm text-gray-600">{product.tests?.hardware || '40-Point passed'}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
              {activeImage + 1} / {totalImages}
            </div>

            {/* Prev Arrow */}
            {totalImages > 1 && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next Arrow */}
            {totalImages > 1 && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* Lightbox Image */}
            <motion.div
              className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16 my-16"
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeImage]}
                    alt={`${product.model} - Image ${activeImage + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail Strip */}
            {totalImages > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={e => { e.stopPropagation(); setActiveImage(idx); }}
                    className={`relative w-14 h-14 rounded-lg border-2 overflow-hidden transition-all duration-200 flex-shrink-0 ${
                      activeImage === idx ? 'border-primary scale-110' : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/60'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
