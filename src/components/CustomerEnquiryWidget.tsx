'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerEnquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    requirement: '',
    message: ''
  });

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I am ${formData.name}. Mobile: ${formData.mobile}. Requirement: ${formData.requirement}. Message: ${formData.message}`;
    const url = `https://wa.me/918410617268?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-tertiary hover:bg-green-600 text-white p-4 rounded-full shadow-[0_12px_32px_-4px_rgba(0,102,62,0.3)] transition-transform hover:scale-105 flex items-center justify-center group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-3 font-medium">
          Talk to an Agra Tech Expert
        </span>
      </button>

      {/* Popover Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] bg-white rounded-xl shadow-[0_12px_32px_-4px_rgba(26,43,60,0.12)] border border-gray-100 overflow-hidden"
          >
            <div className="bg-secondary p-4 flex justify-between items-center">
              <h3 className="text-white font-heading font-semibold">Talk to an Expert</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleWhatsApp} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-heading font-semibold text-secondary mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-secondary mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="+91"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-secondary mb-1">Laptop Requirement</label>
                <select
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-white"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Coding">Coding / Programming</option>
                  <option value="Office">Office / Business</option>
                  <option value="Student">Student / Online Classes</option>
                  <option value="Gaming">Gaming / High Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-secondary mb-1">Custom Message (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="I am looking for an i5 laptop..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-tertiary hover:bg-green-600 text-white rounded-lg p-3 font-medium flex items-center justify-center space-x-2 transition-colors mt-2"
              >
                <Send className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
