'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { 
  ShieldCheck, CheckCircle, RefreshCw, Truck, Code, Briefcase, 
  GraduationCap, Gamepad2, ArrowRight, MapPin, Award, Clock, 
  ChevronDown, CreditCard, Headphones
} from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';

const taglines = [
  "Premium Corporate Laptops. Fractional Prices. 100% Certified.",
  "Naya Kyun Khareedna? Jab Naye Jaisa Laptop Mile Aadhi Keemat Par!",
  "Agra Ka Sabse Bharosemand Refurbished Laptop Store – 3 month Complete Warranty ke Sath."
];

const locations = [
  { name: 'Agra', type: 'Experience Center & Express Delivery', time: 'Same-day delivery / Pickup available', cod: 'Cash on Delivery', keyword: 'refurbished laptop agra' },
  { name: 'Mathura', type: 'Express Insured Shipping', time: '1-2 Days Delivery', cod: 'Cash on Delivery', keyword: 'second hand laptop mathura' },
  { name: 'Firozabad', type: 'Express Insured Shipping', time: '1-2 Days Delivery', cod: 'Cash on Delivery', keyword: 'purana laptop firozabad' },
  { name: 'Etah', type: 'Standard Delivery & Warranty pickup', time: '2-3 Days Delivery', cod: 'Cash on Delivery', keyword: 'old laptop etah' },
  { name: 'Etawah', type: 'Standard Delivery & Warranty pickup', time: '2-3 Days Delivery', cod: 'Cash on Delivery', keyword: 'used laptop etawah' },
  { name: 'Fatehabad', type: 'Express Insured Shipping', time: '1-2 Days Delivery', cod: 'Cash on Delivery', keyword: 'refurbished laptop fatehabad' },
];

const faqs = [
  {
    q: "Where is Kartik Computers located in Agra, and can I visit?",
    a: "Kartik Computers is located at Shanti Dham Complex, Mau Road, Khandari, Agra, Uttar Pradesh. You are welcome to visit our experience center to test and verify any refurbished laptop, check its hardware, and inspect specifications in person before buying. We have been Agra's most trusted second-hand computer store since 2004."
  },
  {
    q: "Do you deliver second hand laptops to Mathura, Firozabad, or Etawah?",
    a: "Yes! We provide free insured shipping and Cash on Delivery (COD) for second hand and corporate refurbished laptops to Mathura, Firozabad, Etawah, Etah, Fatehabad, and all neighboring districts in Western Uttar Pradesh."
  },
  {
    q: "What is the difference between a refurbished laptop and a typical purana laptop?",
    a: "A typical 'purana laptop' (old/used laptop) is sold as-is with all its wear, tear, and potential internal faults. A certified refurbished laptop from Kartik Computers undergoes a strict 40+ point quality inspection, including motherboard diagnostics, battery health restore, screen test, and keyboard checks. It looks and performs like a new laptop but costs a fraction of the price, plus you get a 3-month complete warranty."
  },
  {
    q: "How do I get warranty support if I am located in Etah or Fatehabad?",
    a: "For customers in Etah, Fatehabad, Mathura, and surrounding areas, we offer a hassle-free pickup-and-drop warranty service. If any hardware issue occurs within the 3-month warranty period, we arrange transit, repair the laptop at our service center in Agra, and ship it back to you at no extra cost."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

export default function Home() {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const storeProducts = useProductStore(state => state.products);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const products = isMounted ? storeProducts : [];
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="afterInteractive"
      />

      {/* Hero Section */}
      <section className="bg-secondary text-white pt-20 pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="h-[160px] flex items-center mb-6">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={currentTagline}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
                    >
                      {taglines[currentTagline]}
                    </motion.h1>
                  </AnimatePresence>
                </div>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Experience tier-one performance without the premium markup. Meticulously refurbished, thoroughly tested, and backed by a comprehensive warranty.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products" className="w-full sm:w-auto justify-center bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 text-center text-sm sm:text-base">
                    Shop Laptops <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="#categories" className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-8 rounded-lg transition-colors flex items-center text-center text-sm sm:text-base">
                    Explore Workstations
                  </Link>
                </div>

                {/* Kartik Computers Branding */}
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary/20 border border-tertiary/30 shrink-0">
                    <Award className="w-5 h-5 text-tertiary" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Kartik Computers — Est. 2004</p>
                    <p className="text-gray-400 text-xs">20+ years of trust · Agra&apos;s most reliable tech store</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                   <Image src="/hero-laptop.png" alt="Premium Refurbished Laptop" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                   <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-b border-gray-100 relative -mt-16 z-20 max-w-7xl mx-auto rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 py-8 mb-16 w-[calc(100%-2rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-primary"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-secondary">3-Month Warranty</h3>
              <p className="text-sm text-gray-500">Comprehensive coverage on parts and labor.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-primary"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-secondary">40+ Quality Checks</h3>
              <p className="text-sm text-gray-500">Rigorous testing for guaranteed performance.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-primary"><RefreshCw className="w-6 h-6" /></div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-secondary">7-Day Replacement</h3>
              <p className="text-sm text-gray-500">Hassle-free returns if you're not satisfied.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-primary"><Truck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-secondary">Free Fast Shipping</h3>
              <p className="text-sm text-gray-500">Insured delivery directly to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kartik Computers Trust Strip */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">Backed by</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">Kartik Computers</h2>
              <p className="text-blue-200 text-sm mt-1">Shanti Dham Complex, Mau Road, Khandari, Agra · Est. 2004</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {[
                { icon: Clock, label: '20+ Years', sub: 'In Business' },
                { icon: Award, label: '5000+', sub: 'Happy Customers' },
                { icon: ShieldCheck, label: '100%', sub: 'Certified Devices' },
                { icon: MapPin, label: 'Agra', sub: 'Based & Trusted' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg leading-none">{label}</p>
                    <p className="text-blue-200 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="shrink-0 bg-white text-primary hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-2"
            >
              Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories by Workflow */}
      <section id="categories" className="py-16 bg-surface-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-secondary mb-4">Select Your Workflow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Select a category based on your primary workflow. We've curated the best refurbished models for every need.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <Code className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-xl text-secondary mb-3">Coding & Development</h3>
              <p className="text-gray-600 text-sm mb-6">High RAM, multi-core processors for seamless compiling.</p>
              <Link href="/products?tagline=coding" className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Explore Workstations <ArrowRight className="w-4 h-4" /></Link>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <Briefcase className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-xl text-secondary mb-3">Office & Productivity</h3>
              <p className="text-gray-600 text-sm mb-6">Reliable ultrabooks for meetings, emails, and spreadsheets.</p>
              <Link href="/products?tagline=corporate" className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Shop Ultrabooks <ArrowRight className="w-4 h-4" /></Link>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <GraduationCap className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-xl text-secondary mb-3">Students</h3>
              <p className="text-gray-600 text-sm mb-6">Lightweight, affordable laptops with great battery life.</p>
              <Link href="/products?tagline=budget" className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Budget Friendly <ArrowRight className="w-4 h-4" /></Link>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <Gamepad2 className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-xl text-secondary mb-3">Gaming & Design</h3>
              <p className="text-gray-600 text-sm mb-6">Dedicated GPUs for rendering, editing, and gaming.</p>
              <Link href="/products?tagline=gaming" className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Dedicated GPUs <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-secondary mb-4">Featured Collection</h2>
              <p className="text-gray-600">Handpicked selection of our top-performing machines at unbeatable prices.</p>
            </div>
            <Link href="/products" className="hidden sm:flex text-primary font-medium items-center gap-2 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="relative aspect-square p-4 bg-white flex items-center justify-center border-b border-gray-100">
                  <Image src={product.image || product.images[0] || '/hp.png'} alt={`${product.brand} ${product.model}`} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 25vw" />
                  <span className="absolute top-4 left-4 bg-tertiary text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    {product.condition || 'Grade A'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-secondary mb-1">{product.brand} {product.model}</h3>
                  <p className="text-sm text-gray-500 mb-4 font-mono">{product.processor} / {product.ram} / {product.storage}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 line-through text-sm">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-primary font-bold text-xl">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link href={`/products/${product.id}`} className="block w-full text-center bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 rounded transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations We Serve Section */}
      <section className="py-16 bg-surface-ice border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-secondary mb-4 flex items-center justify-center gap-2">
              <MapPin className="text-primary w-7 h-7" /> Regions We Serve
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Providing certified refurbished, second-hand, and premium corporate laptops across Western Uttar Pradesh. Check delivery times and support below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <motion.div 
                key={loc.name}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading font-bold text-xl text-secondary">{loc.name}</h3>
                  <span className="text-[10px] bg-blue-50 text-primary font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                    {loc.keyword}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4 font-medium">{loc.type}</p>
                <div className="space-y-2 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck className="w-4 h-4 text-tertiary shrink-0" />
                    <span>{loc.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="w-4 h-4 text-tertiary shrink-0" />
                    <span>{loc.cod}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-primary shrink-0"><Headphones className="w-6 h-6" /></div>
              <div>
                <h4 className="font-heading font-bold text-lg text-secondary">Looking for a specific specification?</h4>
                <p className="text-sm text-gray-500">Contact our Agra Khandari Store directly for custom orders and wholesale inquiries.</p>
              </div>
            </div>
            <Link 
              href="/contact" 
              className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm shrink-0"
            >
              Contact Local Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm sm:text-base">Everything you need to know about purchasing second-hand and refurbished laptops in the Agra region.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-heading font-semibold text-secondary text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="p-5 border-t border-gray-200 text-sm sm:text-base text-gray-600 bg-white leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

