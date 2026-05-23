import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="font-heading font-bold text-2xl text-white tracking-tight">RefurbLaptop<span className="text-primary-fixed-dim">Wala</span></span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Kartik Computers brings you premium corporate laptops at fractional prices. 100% certified with 3 months complete warranty.
            </p>
            <div className="flex items-center space-x-2 text-tertiary">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium text-sm">Certified Trusted Seller</span>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-gray-100">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Kartik Computers<br />Shanti Dham Complex, Mau Road,<br />Khandari, Agra</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+91 8410617268</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>ravikartikcomputers@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Shop Laptops</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/warranty" className="text-gray-400 hover:text-white transition-colors">Warranty Terms</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-gray-100">Regions We Serve</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Providing premium refurbished laptops in Agra, certified second-hand laptops in Mathura, corporate-series renewed laptops in Firozabad, wholesale laptops in Etah, and trusted used computers in Etawah.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} RefurbLaptopWala (Kartik Computers). All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
