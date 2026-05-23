'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore(state => state.items);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-heading font-bold text-2xl text-primary tracking-tight">RefurbLaptop<span className="text-secondary">Wala</span></span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            <Link href="/products" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Shop Laptops</Link>
            <Link href="/about" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">About Us</Link>
            <Link href="/warranty" className="flex items-center gap-1.5 text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
              Warranty Terms
            </Link>
            <Link href="/contact" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
            
            {/* Google Auth */}
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="h-7 w-7 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-secondary" />
                  )}
                  <span className="font-medium text-sm text-secondary">{session.user.name}</span>
                </div>
                <Link href="/orders" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                  My Orders
                </Link>
                <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => router.push('/login')} className="flex items-center space-x-2 bg-surface-ice hover:bg-gray-100 text-secondary px-4 py-2 rounded-lg font-medium border border-gray-200 transition-colors">
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
            
            {/* Cart */}
            <Link href="/checkout" className="flex items-center space-x-1 text-secondary hover:text-primary transition-colors p-2">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tertiary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div className="flex items-center sm:hidden">
            {/* Mobile Cart */}
            <Link href="/checkout" className="relative mr-2 text-secondary hover:text-primary p-2">
              <ShoppingCart className="h-6 w-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">Home</Link>
            <Link href="/products" className="block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">Shop Laptops</Link>
            <Link href="/about" className="block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">About Us</Link>
            <Link href="/warranty" className="flex items-center gap-2 px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">
              <ShieldCheck className="w-4 h-4 text-tertiary" /> Warranty Terms
            </Link>
            <Link href="/contact" className="block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">Contact</Link>
            {session?.user ? (
              <>
                <Link href="/orders" className="block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 border-b border-gray-100">My Orders</Link>
                <button onClick={() => signOut()} className="w-full text-left block px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50">Logout ({session.user.name})</button>
              </>
            ) : (
              <button onClick={() => router.push('/login')} className="w-full text-left block px-4 py-3 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50">Login / Register</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
