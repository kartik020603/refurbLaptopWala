'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, Check, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/store/useProductStore';

const FILTERS = {
  brands: ['HP', 'Dell', 'Lenovo', 'Apple'],
  processors: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Ryzen 5', 'Ryzen 7', 'Apple M1'],
  generations: ['1st Gen', '2nd Gen', '3rd Gen', '4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen'],
  ram: ['8GB', '16GB', '32GB'],
  storage: ['256GB SSD', '512GB SSD', '1TB SSD'],
  taglines: ['Budget', 'Corporate', 'Bestseller', 'Gaming', 'Coding']
};

export default function ProductsPage() {
  const router = useRouter();
  const storeProducts = useProductStore(state => state.products);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const handleNavigate = useCallback((productId: number) => {
    if (loadingProductId !== null) return;
    setLoadingProductId(productId);
    setTimeout(() => {
      router.push(`/products/${productId}`);
    }, 650);
  }, [loadingProductId, router]);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Parse tagline from URL search parameter (e.g. ?tagline=coding) and auto-apply filter
    const params = new URLSearchParams(window.location.search);
    const taglineParam = params.get('tagline');
    if (taglineParam) {
      const validTaglines = ['Budget', 'Corporate', 'Bestseller', 'Gaming', 'Coding'];
      const matched = validTaglines.find(t => t.toLowerCase() === taglineParam.toLowerCase());
      if (matched) {
        setSelectedFilters(prev => ({
          ...prev,
          taglines: [matched]
        }));
      }
    }
  }, []);

  const products = isMounted ? storeProducts : [];

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    brands: [],
    processors: [],
    generations: [],
    ram: [],
    storage: [],
    taglines: []
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ brands: [], processors: [], generations: [], ram: [], storage: [], taglines: [] });
  };

  // Robust client-side filtering logic matching substring specifications
  const filteredProducts = products.filter(product => {
    if (selectedFilters.brands.length && !selectedFilters.brands.includes(product.brand)) return false;
    
    if (selectedFilters.processors.length) {
      const match = selectedFilters.processors.some(proc => 
        product.processor?.toLowerCase().includes(proc.toLowerCase()) || 
        product.specs?.processor?.toLowerCase().includes(proc.toLowerCase())
      );
      if (!match) return false;
    }
    
    if (selectedFilters.generations.length) {
      const match = selectedFilters.generations.some(gen => 
        product.specs?.processor?.toLowerCase().includes(gen.toLowerCase())
      );
      if (!match) return false;
    }
    
    if (selectedFilters.ram.length) {
      const match = selectedFilters.ram.some(ram => 
        product.ram?.toLowerCase().includes(ram.toLowerCase())
      );
      if (!match) return false;
    }
    
    if (selectedFilters.storage.length) {
      const match = selectedFilters.storage.some(st => 
        product.storage?.toLowerCase().includes(st.toLowerCase())
      );
      if (!match) return false;
    }

    if (selectedFilters.taglines?.length) {
      const match = selectedFilters.taglines.some(tagline => 
        product.tags?.some(tag => tag.toLowerCase() === tagline.toLowerCase())
      );
      if (!match) return false;
    }
    
    return true;
  });

  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      return a.price - b.price;
    }
    if (sortBy === 'Price: High to Low') {
      return b.price - a.price;
    }
    if (sortBy === 'Newest Arrivals') {
      return b.id - a.id;
    }
    return 0;
  });

  const FilterSection = ({ title, category, options }: { title: string, category: string, options: string[] }) => (
    <div className="mb-6">
      <h3 className="font-heading font-semibold text-secondary mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={selectedFilters[category]?.includes(option) || false} 
              onChange={() => toggleFilter(category, option)} 
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedFilters[category]?.includes(option) ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
              {selectedFilters[category]?.includes(option) && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-gray-600 group-hover:text-secondary">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-surface-ice min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">Laptops Collection</h1>
          <p className="text-gray-300 max-w-2xl">Browse our premium selection of certified refurbished laptops. Filter by brand, specs, or condition to find your perfect match.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="font-medium text-secondary">{filteredProducts.length} Products Found</span>
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex items-center gap-2 text-primary font-medium"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="font-heading font-bold text-lg text-secondary flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" /> Filters</h2>
                <button onClick={clearFilters} className="text-xs text-primary hover:underline font-medium">Clear All</button>
              </div>

              <FilterSection title="Brand" category="brands" options={FILTERS.brands} />
              <FilterSection title="Processor" category="processors" options={FILTERS.processors} />
              <FilterSection title="Generation" category="generations" options={FILTERS.generations} />
              <FilterSection title="RAM" category="ram" options={FILTERS.ram} />
              <FilterSection title="SSD" category="storage" options={FILTERS.storage} />
              <FilterSection title="Taglines" category="taglines" options={FILTERS.taglines} />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <span className="text-gray-600 font-medium hidden md:inline">{filteredProducts.length} Products Found</span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary bg-white text-secondary"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest Arrivals">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {sortedAndFilteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
                <h3 className="text-xl font-heading font-semibold text-secondary mb-2">No laptops found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
                <button onClick={clearFilters} className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {sortedAndFilteredProducts.map(product => {
                    let priceAdjustment = 0;
                    let ramLabel = '8GB RAM';
                    let ssdLabel = '256GB SSD';

                    if (selectedFilters.ram.includes('16GB')) {
                      priceAdjustment += 4000;
                      ramLabel = '16 gb';
                    } else if (selectedFilters.ram.includes('32GB')) {
                      priceAdjustment += 8000;
                      ramLabel = '32 GB';
                    }

                    if (selectedFilters.storage.includes('512GB SSD')) {
                      priceAdjustment += 3500;
                      ssdLabel = '512 gb ssd';
                    } else if (selectedFilters.storage.includes('1TB SSD')) {
                      priceAdjustment += 7000;
                      ssdLabel = '1TB SSD';
                    } else if (selectedFilters.storage.includes('256GB SSD')) {
                      ssdLabel = '256GB SSD';
                    }

                    const displayPrice = product.price + priceAdjustment;
                    const displayOriginalPrice = product.originalPrice + priceAdjustment;

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={product.id} 
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
                      >
                        {/* Clickable Image Area */}
                        <Link href={`/products/${product.id}`} className="block relative aspect-square p-4 bg-white flex items-center justify-center border-b border-gray-50 cursor-pointer overflow-hidden">
                          <Image src={product.image} alt={product.model} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                            {product.tags.map(tag => {
                              let tagStyle = 'bg-gray-100 text-gray-600 border border-gray-200';
                              if (tag === 'Like New') tagStyle = 'bg-tertiary text-white shadow-sm';
                              else if (tag === 'Grade A') tagStyle = 'bg-blue-50 text-blue-700 border border-blue-100';
                              else if (tag === 'Grade B') tagStyle = 'bg-gray-100 text-gray-600 border border-gray-200';
                              else if (tag.toLowerCase() === 'gaming') tagStyle = 'bg-rose-50 text-rose-700 border border-rose-100';
                              else if (tag.toLowerCase() === 'coding') tagStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                              else if (tag.toLowerCase() === 'bestseller') tagStyle = 'bg-amber-50 text-amber-700 border border-amber-200';
                              else if (tag.toLowerCase() === 'budget') tagStyle = 'bg-teal-50 text-teal-700 border border-teal-100';
                              else if (tag.toLowerCase() === 'corporate') tagStyle = 'bg-indigo-50 text-indigo-700 border border-indigo-100';

                              return (
                                <span key={tag} className={`text-[10px] font-bold px-2.5 py-0.5 rounded transition-all duration-200 tracking-wide uppercase shadow-sm ${tagStyle}`}>
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                        </Link>

                        <div className="p-5 flex flex-col flex-grow">
                          {/* Clickable title + specs */}
                          <Link href={`/products/${product.id}`} className="block mb-2 group/title">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                            <h3 className="font-heading font-bold text-lg text-secondary leading-tight group-hover/title:text-primary transition-colors">{product.brand} {product.model}</h3>
                          </Link>
                          
                          <Link href={`/products/${product.id}`} className="block text-sm text-gray-600 space-y-1 mb-6 flex-grow text-left hover:text-gray-800 transition-colors">
                            <p>• {product.processor}</p>
                            <p>• {ramLabel}</p>
                            <p>• {ssdLabel}</p>
                          </Link>
                          
                          <div className="mt-auto border-t border-gray-100 pt-4">
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-primary font-bold text-2xl">₹{displayPrice.toLocaleString('en-IN')}</span>
                              <span className="text-gray-400 line-through text-sm">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            
                            {/* Animated View Details button */}
                            <button
                              onClick={() => handleNavigate(product.id)}
                              disabled={loadingProductId !== null}
                              className="relative block w-full text-center font-medium py-2.5 rounded-lg overflow-hidden transition-all duration-300"
                              style={{ background: loadingProductId === product.id ? '#1d4ed8' : undefined }}
                            >
                              {/* Base gradient background */}
                              <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                                loadingProductId === product.id
                                  ? 'bg-blue-700'
                                  : 'bg-primary group-hover:bg-blue-700'
                              }`} />

                              {/* Ripple wave on click */}
                              {loadingProductId === product.id && (
                                <motion.span
                                  className="absolute inset-0 rounded-lg bg-white/20"
                                  initial={{ scale: 0, opacity: 1 }}
                                  animate={{ scale: 2.5, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                              )}

                              {/* Animated progress bar at bottom */}
                              {loadingProductId === product.id && (
                                <motion.span
                                  className="absolute bottom-0 left-0 h-0.5 bg-white/60"
                                  initial={{ width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                                />
                              )}

                              {/* Button text */}
                              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                <AnimatePresence mode="wait">
                                  {loadingProductId === product.id ? (
                                    <motion.span
                                      key="loading"
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -8 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Opening...
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="idle"
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -8 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      View Details
                                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
