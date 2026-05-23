'use client';

import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Package, UploadCloud, Check, Plus, Edit2, Trash2, Battery, Monitor, Cpu, Users, ShoppingCart, Tag } from 'lucide-react';
import Image from 'next/image';
import { useProductStore, Product } from '@/store/useProductStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'customers' | 'orders'>('upload');
  
  // Zustand store integration
  const products = useProductStore(state => state.products);
  const addProduct = useProductStore(state => state.addProduct);
  const updateProduct = useProductStore(state => state.updateProduct);
  const deleteProduct = useProductStore(state => state.deleteProduct);
  const toggleStock = useProductStore(state => state.toggleStock);

  // Password Protection Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Prevent Next.js hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const activeProducts = isMounted ? products : [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data State
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Orders Filtering & Pagination State
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [orderProductFilter, setOrderProductFilter] = useState('');
  const [orderMobileFilter, setOrderMobileFilter] = useState('');
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  // Inventory Search and Edit State
  const [inventorySearch, setInventorySearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Independent Edit Form State for Comprehensive Modal Edit Access
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editBrand, setEditBrand] = useState('HP');
  const [editModel, setEditModel] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editProcessorModel, setEditProcessorModel] = useState('Intel Core i5');
  const [editCustomProcessorModel, setEditCustomProcessorModel] = useState('');
  const [editProcessorGen, setEditProcessorGen] = useState('11th Gen');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [editBatteryHealth, setEditBatteryHealth] = useState(85);
  const [editDisplayGrade, setEditDisplayGrade] = useState('Grade A (Minor signs of use)');
  const [editHardwareIntegrity, setEditHardwareIntegrity] = useState('40-Point Motherboard & Keyboard Stress Test Passed');
  const [editSelectedTaglines, setEditSelectedTaglines] = useState<string[]>([]);

  // Upload Form State
  const [brand, setBrand] = useState('HP');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [processorModel, setProcessorModel] = useState('Intel Core i5');
  const [customProcessorModel, setCustomProcessorModel] = useState('');
  const [processorGen, setProcessorGen] = useState('11th Gen');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [batteryHealth, setBatteryHealth] = useState(85);
  const [displayGrade, setDisplayGrade] = useState('Grade A (Minor signs of use)');
  const [hardwareIntegrity, setHardwareIntegrity] = useState('40-Point Motherboard & Keyboard Stress Test Passed');
  const [selectedTaglines, setSelectedTaglines] = useState<string[]>(['Corporate']);

  useEffect(() => {
    if (activeTab === 'customers' && customers.length === 0) {
      setIsLoading(true);
      fetch('/api/admin/customers')
        .then(res => res.json())
        .then(data => setCustomers(data.customers || []))
        .finally(() => setIsLoading(false));
    } else if (activeTab === 'orders' && orders.length === 0) {
      setIsLoading(true);
      fetch('/api/admin/orders')
        .then(res => res.json())
        .then(data => setOrders(data.orders || []))
        .finally(() => setIsLoading(false));
    }
  }, [activeTab, customers.length, orders.length]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              uploadedUrls.push(data.url);
            }
          }
        } catch (error) {
          console.error('Error uploading file to server:', error);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setImages(prev => [...prev, ...uploadedUrls]);
      }
      setIsUploading(false);
    }
  };

  const handlePublish = () => {
    if (!model.trim() || !price || !originalPrice) {
      alert('Please fill in Model Name, Base Price, and Original MRP.');
      return;
    }

    const defaultImage = images[0] || '/hp.png'; // default fallback image
    const finalProcessorName = processorModel === 'Custom' ? customProcessorModel : processorModel;
    const finalProcessorFull = processorGen === 'Not Applicable' ? finalProcessorName : `${finalProcessorName} ${processorGen}`;

    addProduct({
      brand,
      model,
      processor: finalProcessorName || 'Intel Core i5',
      ram: '16GB', // default config values
      storage: '512GB SSD', // default config values
      condition: displayGrade.includes('Pristine') ? 'Like New' : displayGrade.includes('Grade A') ? 'Grade A' : 'Grade B',
      price: Number(price),
      basePrice: Number(price),
      originalPrice: Number(originalPrice),
      description: description || `Certified Refurbished ${brand} ${model} laptop. Sourced from corporate environments, it represents peak performance and durability.`,
      image: defaultImage,
      images: images.length > 0 ? images : [defaultImage, '/hp.png', '/lenovo.png'],
      tags: [
        displayGrade.includes('Pristine') ? 'Like New' : displayGrade.includes('Grade A') ? 'Grade A' : 'Grade B',
        ...selectedTaglines
      ],
      specs: {
        processor: finalProcessorFull || 'Intel Core i5 11th Gen',
        display: displayGrade,
        graphics: 'Intel Integrated Graphics',
        os: 'Windows 11 Pro'
      },
      tests: {
        battery: batteryHealth,
        display: displayGrade,
        hardware: hardwareIntegrity
      },
      stock: true
    });

    // Reset Form State
    setBrand('HP');
    setModel('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setProcessorModel('Intel Core i5');
    setCustomProcessorModel('');
    setProcessorGen('11th Gen');
    setImages([]);
    setBatteryHealth(85);
    setDisplayGrade('Grade A (Minor signs of use)');
    setHardwareIntegrity('40-Point Motherboard & Keyboard Stress Test Passed');
    setSelectedTaglines(['Corporate']);

    alert('Product published successfully!');
    // Redirect to Inventory Tab
    setActiveTab('inventory');
  };

  // Comprehensive Inventory Editing & Modal Customization Handlers
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditBrand(product.brand);
    setEditModel(product.model);
    setEditPrice(String(product.price));
    setEditOriginalPrice(String(product.originalPrice));
    setEditDescription(product.description || '');
    
    // Parse processor model & gen
    const proc = product.processor || 'Intel Core i5';
    if (['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Ryzen 5', 'Ryzen 7', 'Apple M1'].includes(proc)) {
      setEditProcessorModel(proc);
      setEditCustomProcessorModel('');
    } else {
      setEditProcessorModel('Custom');
      setEditCustomProcessorModel(proc);
    }
    
    // Parse specs processor gen
    const specProc = product.specs?.processor || '';
    const genMatch = specProc.match(/\b(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th|13th)\s*Gen\b/i);
    if (genMatch) {
      setEditProcessorGen(genMatch[1] + ' Gen');
    } else {
      setEditProcessorGen('Not Applicable');
    }
    
    setEditImages(product.images || [product.image]);
    setEditBatteryHealth(product.tests?.battery || 85);
    
    // Parse display grade cleanly from product.condition
    const cond = product.condition || 'Grade A';
    if (cond === 'Like New' || cond.includes('A++') || cond.includes('Pristine')) {
      setEditDisplayGrade('Pristine (No scratches, No bleeding)');
    } else if (cond === 'Grade A' || cond.includes('Grade A')) {
      setEditDisplayGrade('Grade A (Minor signs of use)');
    } else {
      setEditDisplayGrade('Grade B (Visible wear)');
    }
    
    // Parse taglines cleanly matching our 5 standard values
    const possibleTaglines = ['Budget', 'Corporate', 'Bestseller', 'Gaming', 'Coding'];
    const currentTags = product.tags || [];
    const matchedTaglines = currentTags.filter(tag => 
      possibleTaglines.some(pt => pt.toLowerCase() === tag.toLowerCase())
    ).map(tag => 
      possibleTaglines.find(pt => pt.toLowerCase() === tag.toLowerCase()) || tag
    );
    setEditSelectedTaglines(matchedTaglines);

    setEditHardwareIntegrity(product.tests?.hardware || '40-Point Motherboard & Keyboard Stress Test Passed');
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsEditUploading(true);
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              uploadedUrls.push(data.url);
            }
          }
        } catch (error) {
          console.error('Error uploading file to server during edit:', error);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setEditImages(prev => [...prev, ...uploadedUrls]);
      }
      setIsEditUploading(false);
    }
  };

  const handleSaveEdit = (id: number) => {
    if (!editModel.trim() || !editPrice || !editOriginalPrice) {
      alert('Please fill in Model Name, Base Price, and Original MRP.');
      return;
    }

    const defaultImage = editImages[0] || '/hp.png';
    const finalProcessorName = editProcessorModel === 'Custom' ? editCustomProcessorModel : editProcessorModel;
    const finalProcessorFull = editProcessorGen === 'Not Applicable' ? finalProcessorName : `${finalProcessorName} ${editProcessorGen}`;

    updateProduct(id, {
      brand: editBrand,
      model: editModel,
      processor: finalProcessorName || 'Intel Core i5',
      ram: '16GB', 
      storage: '512GB SSD', 
      condition: editDisplayGrade.includes('Pristine') ? 'Like New' : editDisplayGrade.includes('Grade A') ? 'Grade A' : 'Grade B',
      price: Number(editPrice),
      basePrice: Number(editPrice),
      originalPrice: Number(editOriginalPrice),
      description: editDescription || `Certified Refurbished ${editBrand} ${editModel} laptop. Sourced from corporate environments, it represents peak performance and durability.`,
      image: defaultImage,
      images: editImages.length > 0 ? editImages : [defaultImage, '/hp.png', '/lenovo.png'],
      tags: [
        editDisplayGrade.includes('Pristine') ? 'Like New' : editDisplayGrade.includes('Grade A') ? 'Grade A' : 'Grade B',
        ...editSelectedTaglines
      ],
      specs: {
        processor: finalProcessorFull || 'Intel Core i5 11th Gen',
        display: editDisplayGrade,
        graphics: 'Intel Integrated Graphics',
        os: 'Windows 11 Pro'
      },
      tests: {
        battery: editBatteryHealth,
        display: editDisplayGrade,
        hardware: editHardwareIntegrity
      }
    });

    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Inventory filter
  const filteredInventory = activeProducts.filter(item => {
    const searchStr = `${item.brand} ${item.model}`.toLowerCase();
    return searchStr.includes(inventorySearch.toLowerCase());
  });

  // Orders Filter logic
  const filteredOrders = orders.filter(o => {
    // Date filter
    if (orderDateFilter) {
      const orderDateStr = new Date(o.date).toISOString().split('T')[0];
      if (orderDateStr !== orderDateFilter) return false;
    }
    // Product filter
    if (orderProductFilter) {
      if (!o.items.toLowerCase().includes(orderProductFilter.toLowerCase())) return false;
    }
    // Mobile filter
    if (orderMobileFilter) {
      if (!o.customerMobile.includes(orderMobileFilter)) return false;
    }
    return true;
  });

  // Orders Pagination
  const totalOrdersCount = filteredOrders.length;
  const totalPages = Math.ceil(totalOrdersCount / ordersPerPage) || 1;
  const currentOrdersPage = Math.min(Math.max(1, ordersPage), totalPages);
  const startIndex = (currentOrdersPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  if (isMounted && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-white font-heading">Admin Access Required</h2>
            <p className="text-slate-400 text-sm mt-1">Kartik Computers Portal Security</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput.trim() === 'Krishna') {
              setIsAuthenticated(true);
              sessionStorage.setItem('admin_auth', 'true');
            } else {
              setError('Incorrect Password. Please try again.');
            }
          }} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter password..."
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                autoFocus
              />
              {error && (
                <p className="text-rose-400 text-xs mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>
                  {error}
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-98"
            >
              Verify & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-ice min-h-[calc(100vh-80px)]">
      {/* Admin Header */}
      <div className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage inventory, upload products, and monitor sales.</p>
          </div>
          <div className="flex bg-white/10 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'upload' ? 'bg-white text-secondary' : 'text-gray-300 hover:text-white'}`}
            >
              <UploadCloud className="w-4 h-4 inline mr-2" /> Upload
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'inventory' ? 'bg-white text-secondary' : 'text-gray-300 hover:text-white'}`}
            >
              <Package className="w-4 h-4 inline mr-2" /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-secondary' : 'text-gray-300 hover:text-white'}`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" /> Orders
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'customers' ? 'bg-white text-secondary' : 'text-gray-300 hover:text-white'}`}
            >
              <Users className="w-4 h-4 inline mr-2" /> Customers
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="font-heading text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Product Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Brand</label>
                    <select 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                      <option>HP</option><option>Dell</option><option>Lenovo</option><option>Apple</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Model Name</label>
                    <input 
                      type="text" 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="e.g. EliteBook 840 G8" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Selling Base Price (₹)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="32500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Original MRP (₹)</label>
                    <input 
                      type="number" 
                      value={originalPrice} 
                      onChange={(e) => setOriginalPrice(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                      placeholder="85000" 
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-secondary mb-1">Detailed Description</label>
                  <textarea 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    placeholder="Enter product description, condition, and highlights..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Processor Type</label>
                    <select
                      value={processorModel}
                      onChange={(e) => setProcessorModel(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-secondary"
                    >
                      <option value="Intel Core i3">Intel Core i3</option>
                      <option value="Intel Core i5">Intel Core i5</option>
                      <option value="Intel Core i7">Intel Core i7</option>
                      <option value="Intel Core i9">Intel Core i9</option>
                      <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                      <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                      <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                      <option value="Apple Silicon">Apple Silicon</option>
                      <option value="Custom">Custom (Type below)</option>
                    </select>
                    {processorModel === 'Custom' && (
                      <input 
                        type="text" 
                        value={customProcessorModel} 
                        onChange={(e) => setCustomProcessorModel(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none mt-2 text-secondary" 
                        placeholder="e.g. Intel Core i3" 
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Processor Generation</label>
                    <select
                      value={processorGen}
                      onChange={(e) => setProcessorGen(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-secondary"
                    >
                      <option value="1st Gen">1st Gen</option>
                      <option value="2nd Gen">2nd Gen</option>
                      <option value="3rd Gen">3rd Gen</option>
                      <option value="4th Gen">4th Gen</option>
                      <option value="5th Gen">5th Gen</option>
                      <option value="6th Gen">6th Gen</option>
                      <option value="7th Gen">7th Gen</option>
                      <option value="8th Gen">8th Gen</option>
                      <option value="9th Gen">9th Gen</option>
                      <option value="10th Gen">10th Gen</option>
                      <option value="11th Gen">11th Gen</option>
                      <option value="12th Gen">12th Gen</option>
                      <option value="13th Gen">13th Gen</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="font-heading text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4 flex items-center justify-between">
                  Product Gallery
                  <span className="text-xs text-gray-500 font-normal">First image will be the cover</span>
                </h2>
                
                <div 
                  className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="font-semibold text-secondary text-sm">Uploading images permanently to server...</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-secondary mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">SVG, PNG, JPG or WEBP (max. 800x400px)</p>
                    </>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-6">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                        <Image src={img} alt="Preview" fill className="object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setImages(images.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Test Metrics */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-heading text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Test Metrics</h2>
                
                <div className="space-y-6">
                  {/* Battery Health */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-semibold text-secondary mb-2">
                      <span className="flex items-center"><Battery className="w-4 h-4 mr-2 text-primary" /> Battery Health</span>
                      <span className="text-primary">{batteryHealth}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                  </div>

                  {/* Display Grade */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-secondary mb-2">
                      <Monitor className="w-4 h-4 mr-2 text-primary" /> Display Grade
                    </label>
                    <select 
                      value={displayGrade} 
                      onChange={(e) => setDisplayGrade(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                      <option>Pristine (No scratches, No bleeding)</option>
                      <option>Grade A (Minor signs of use)</option>
                      <option>Grade B (Visible wear)</option>
                    </select>
                  </div>

                  {/* Hardware Integrity */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-secondary mb-2">
                      <Cpu className="w-4 h-4 mr-2 text-primary" /> Hardware Integrity
                    </label>
                    <textarea 
                      rows={3} 
                      value={hardwareIntegrity} 
                      onChange={(e) => setHardwareIntegrity(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" 
                      placeholder="e.g. 40-Point Motherboard & Keyboard Stress Test Passed"
                    ></textarea>
                  </div>

                  {/* Product Taglines Checkboxes / Badge selectors */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-secondary mb-2">
                      <Tag className="w-4 h-4 mr-2 text-primary" /> Product Taglines
                    </label>
                    <p className="text-[11px] text-gray-500 mb-3">Select one or more marketing taglines to enable catalog matching and sidebar filters.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Budget', 'Corporate', 'Bestseller', 'Gaming', 'Coding'].map(tag => {
                        const isSelected = selectedTaglines.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSelectedTaglines(prev => 
                                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${isSelected ? 'bg-primary text-white border-primary shadow-sm scale-102' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Publish Product
              </button>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
              <h2 className="font-heading text-xl font-bold text-secondary">Active Inventory</h2>
              <div className="relative">
                <input 
                  type="text" 
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search by model or brand..." 
                  className="border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:border-primary outline-none w-64" 
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="p-4">ID</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Model</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">MRP</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-secondary text-sm">
                  {filteredInventory.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-500">No products in inventory matching search.</td></tr>
                  ) : filteredInventory.map(item => {
                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-gray-500">#{item.id}</td>
                        <td className="p-4 font-semibold">{item.brand}</td>
                        <td className="p-4">{item.model}</td>
                        <td className="p-4 font-medium text-primary">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-gray-500 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleStock(item.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${item.stock ? 'bg-tertiary' : 'bg-gray-300'}`}
                          >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${item.stock ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                          <span className={`ml-2 text-xs font-semibold ${item.stock ? 'text-tertiary' : 'text-gray-500'}`}>
                            {item.stock ? 'IN STOCK' : 'OUT OF STOCK'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1.5 justify-end">
                              <button 
                                onClick={() => { deleteProduct(item.id); setDeleteConfirmId(null); }}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded transition-colors font-bold"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-secondary text-xs px-2.5 py-1.5 rounded transition-colors font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleStartEdit(item)}
                                className="text-gray-400 hover:text-primary transition-colors p-1"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 text-sm text-gray-500 text-center">
              Showing {filteredInventory.length} products
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-heading text-xl font-bold text-secondary">Customer Database</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Default Address</th>
                    <th className="p-4 text-center">Total Orders</th>
                  </tr>
                </thead>
                <tbody className="text-secondary text-sm">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading customers...</td></tr>
                  ) : customers.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td></tr>
                  ) : customers.map((c, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-semibold">{c.name}</td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4 font-mono">{c.mobile}</td>
                      <td className="p-4 max-w-xs truncate">{c.address}</td>
                      <td className="p-4 text-center font-bold text-primary">{c.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="font-heading text-xl font-bold text-secondary">Recent Orders</h2>
              
              {/* Filtering Controls */}
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">Filter by Date</label>
                  <input 
                    type="date"
                    value={orderDateFilter}
                    onChange={(e) => {
                      setOrderDateFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">Filter by Product</label>
                  <input 
                    type="text"
                    value={orderProductFilter}
                    onChange={(e) => {
                      setOrderProductFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    placeholder="Product (e.g. HP, Lenovo)"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none w-48 md:w-56"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">Filter by Mobile</label>
                  <input 
                    type="text"
                    value={orderMobileFilter}
                    onChange={(e) => {
                      setOrderMobileFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    placeholder="Mobile number"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none w-36"
                  />
                </div>
                {(orderDateFilter || orderProductFilter || orderMobileFilter) && (
                  <button 
                    onClick={() => {
                      setOrderDateFilter('');
                      setOrderProductFilter('');
                      setOrderMobileFilter('');
                      setOrdersPage(1);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold mt-5 h-9"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Items</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-secondary text-sm">
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td></tr>
                  ) : paginatedOrders.map((o, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">
                        <div>{o.customerName}</div>
                        <div className="text-xs text-gray-400 font-normal mt-1">{o.customerAddress}</div>
                      </td>
                      <td className="p-4 font-mono">{o.customerMobile}</td>
                      <td className="p-4 text-xs max-w-xs truncate">{o.items}</td>
                      <td className="p-4 text-right font-bold text-primary">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center">
                        <select 
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-bold outline-none cursor-pointer border ${
                            o.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' : 
                            o.status === 'PAID' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                            'bg-orange-100 text-orange-700 border-orange-200'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                        {o.razorpayPaymentId && (
                          <div className="text-[10px] text-gray-500 mt-1 font-mono">{o.razorpayPaymentId}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <span className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + ordersPerPage, totalOrdersCount)} of {totalOrdersCount} orders
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentOrdersPage === 1}
                    onClick={() => setOrdersPage(p => p - 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold text-secondary">
                    Page {currentOrdersPage} of {totalPages}
                  </span>
                  <button 
                    disabled={currentOrdersPage === totalPages}
                    onClick={() => setOrdersPage(p => p + 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {totalPages === 1 && paginatedOrders.length > 0 && (
              <div className="p-4 border-t border-gray-100 text-sm text-gray-500 text-center">
                Showing all {totalOrdersCount} orders
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Edit Modal Overlay for Comprehensive Product Specifications Access */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary text-white rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold font-heading">Edit Product Specs</h3>
                <p className="text-xs text-gray-300">Modifying #{editingProduct.id} — {editingProduct.brand} {editingProduct.model}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="text-gray-300 hover:text-white text-lg font-bold p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors px-3 py-1"
              >
                Close
              </button>
            </div>

            {/* Modal Body: Two-Column Form */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">Brand</label>
                      <select 
                        value={editBrand} 
                        onChange={(e) => setEditBrand(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-2.5 outline-none bg-white text-secondary"
                      >
                        <option>HP</option><option>Dell</option><option>Lenovo</option><option>Apple</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">Model Name</label>
                      <input 
                        type="text" 
                        value={editModel} 
                        onChange={(e) => setEditModel(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-2.5 outline-none text-secondary" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">Selling Base Price (₹)</label>
                      <input 
                        type="number" 
                        value={editPrice} 
                        onChange={(e) => setEditPrice(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-2.5 outline-none text-secondary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">Original MRP Price (₹)</label>
                      <input 
                        type="number" 
                        value={editOriginalPrice} 
                        onChange={(e) => setEditOriginalPrice(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg p-2.5 outline-none text-secondary" 
                      />
                    </div>
                  </div>

                  {/* Processor Spec Customizer */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Processor Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select 
                        value={editProcessorModel}
                        onChange={(e) => setEditProcessorModel(e.target.value)}
                        className="border border-gray-200 rounded-lg p-2.5 bg-white text-secondary outline-none w-full"
                      >
                        <option>Intel Core i3</option>
                        <option>Intel Core i5</option>
                        <option>Intel Core i7</option>
                        <option>Ryzen 5</option>
                        <option>Ryzen 7</option>
                        <option>Apple M1</option>
                        <option value="Custom">Custom CPU Model...</option>
                      </select>
                      {editProcessorModel === 'Custom' && (
                        <input 
                          type="text"
                          value={editCustomProcessorModel}
                          onChange={(e) => setEditCustomProcessorModel(e.target.value)}
                          placeholder="Write CPU (e.g. Ryzen 9, M2 Max)"
                          className="border border-gray-200 rounded-lg p-2.5 outline-none text-secondary w-full"
                        />
                      )}
                    </div>
                  </div>

                  {/* Processor Generation Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Processor Generation</label>
                    <select 
                      value={editProcessorGen}
                      onChange={(e) => setEditProcessorGen(e.target.value)}
                      className="border border-gray-200 rounded-lg p-2.5 bg-white text-secondary outline-none w-full"
                    >
                      <option>1st Gen</option>
                      <option>2nd Gen</option>
                      <option>3rd Gen</option>
                      <option>4th Gen</option>
                      <option>5th Gen</option>
                      <option>6th Gen</option>
                      <option>7th Gen</option>
                      <option>8th Gen</option>
                      <option>9th Gen</option>
                      <option>10th Gen</option>
                      <option>11th Gen</option>
                      <option>12th Gen</option>
                      <option>13th Gen</option>
                      <option>Not Applicable</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Short Marketing Description</label>
                    <textarea 
                      rows={3} 
                      value={editDescription} 
                      onChange={(e) => setEditDescription(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 outline-none resize-none text-secondary" 
                    />
                  </div>
                </div>

                {/* Specs / Uploads Column */}
                <div className="space-y-6">
                  {/* Slider for Battery Health */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-secondary">Battery Health Status</label>
                      <span className="text-sm font-bold text-primary flex items-center gap-1"><Battery className="w-4 h-4 text-green-500" /> {editBatteryHealth}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={editBatteryHealth} 
                      onChange={(e) => setEditBatteryHealth(Number(e.target.value))} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <span className="text-[10px] text-gray-400">Guaranteed min 80% for Certified Premium refurbished laptops.</span>
                  </div>

                  {/* Grade Display */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Display Grade & Cosmetics</label>
                    <select 
                      value={editDisplayGrade} 
                      onChange={(e) => setEditDisplayGrade(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 outline-none bg-white text-secondary"
                    >
                      <option>Pristine (No scratches, No bleeding)</option>
                      <option>Grade A (Minor signs of use)</option>
                      <option>Grade B (Visible wear)</option>
                    </select>
                  </div>

                  {/* Hardware Integrity status field */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Hardware Stress Test Status</label>
                    <input 
                      type="text" 
                      value={editHardwareIntegrity} 
                      onChange={(e) => setEditHardwareIntegrity(e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 outline-none text-secondary" 
                    />
                  </div>

                  {/* Product Taglines Checkboxes / Badge selectors */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Product Taglines</label>
                    <p className="text-[10px] text-gray-400 mb-2">Select marketing tags to label this laptop and filter it in the catalog.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Budget', 'Corporate', 'Bestseller', 'Gaming', 'Coding'].map(tag => {
                        const isSelected = editSelectedTaglines.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setEditSelectedTaglines(prev => 
                                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${isSelected ? 'bg-primary text-white border-primary shadow-sm scale-102' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Product Image Gallery */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1">Product Images</label>
                    <div 
                      onClick={() => {
                        const fileInput = document.getElementById('edit-image-upload') as HTMLInputElement;
                        fileInput?.click();
                      }}
                      className="border-2 border-dashed border-gray-200 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-blue-50/10 group mb-3 relative text-secondary"
                    >
                      <input 
                        type="file" 
                        id="edit-image-upload"
                        className="hidden" 
                        multiple 
                        accept="image/*"
                        onChange={handleEditImageUpload} 
                      />
                      <UploadCloud className="w-8 h-8 text-gray-400 mx-auto group-hover:text-primary transition-colors" />
                      {isEditUploading ? (
                        <p className="text-xs text-primary font-medium mt-1 animate-pulse">Uploading new images permanently...</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">Click to browse or upload images</p>
                      )}
                    </div>

                    {/* Previews & Image Removal */}
                    {editImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {editImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded border bg-gray-50 flex-shrink-0 group overflow-hidden">
                            <Image src={img} alt="Preview" fill className="object-contain p-1" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditImages(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button 
                onClick={() => setEditingProduct(null)} 
                className="bg-gray-200 hover:bg-gray-300 text-secondary font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveEdit(editingProduct.id)} 
                className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick hack for the missing X icon
const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
