'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Compose a WhatsApp message with the form data and open WhatsApp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600)); // brief UX delay
    const text = `Hi Kartik Computers,\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/918410617268?text=${encodeURIComponent(text)}`, '_blank');
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 8410617268',
      href: 'tel:+918410617268',
      color: 'bg-blue-50 text-primary border-blue-100',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'ravikartikcomputers@gmail.com',
      href: 'mailto:ravikartikcomputers@gmail.com',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'Shanti Dham Complex, Mau Road, Khandari, Agra, UP',
      href: 'https://maps.app.goo.gl/DGciuJD6z93tYUKy6',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      icon: Clock,
      label: 'Hours',
      value: 'Mon – Sat: 10 AM – 8 PM\nSunday: 11 AM – 5 PM',
      href: null,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  return (
    <div className="bg-surface-ice min-h-screen">

      {/* Hero */}
      <section className="bg-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <MessageCircle className="w-9 h-9 text-tertiary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, need a quote, or want to visit us? We&apos;re here to help — reach out any way you prefer.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Left — Contact Info */}
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-secondary text-lg mb-5">Contact Details</h2>
              <div className="space-y-4">
                {contactDetails.map(({ icon: Icon, label, value, href, color }) => (
                  <div key={label} className={`flex items-start gap-4 p-3 rounded-xl border ${color}`}>
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-secondary hover:text-primary transition-colors font-medium break-words"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-secondary font-medium whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-secondary text-lg mb-4">Quick Contact</h2>
              <div className="space-y-3">
                <a
                  href="https://wa.me/918410617268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:+918410617268"
                  className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a
                  href="mailto:ravikartikcomputers@gmail.com"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-secondary font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Right — Map + Form */}
          <div className="lg:col-span-3 space-y-5">

            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-secondary text-sm">Find Us on the Map</span>
              </div>
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.2!2d78.0!3d27.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEyJzAwLjAiTiA3OMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin&q=Kartik+Computers+Shanti+Dham+Complex+Mau+Road+Khandari+Agra"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kartik Computers Location"
                />
              </div>
              <div className="p-3 bg-gray-50 text-center">
                <a
                  href="https://maps.app.goo.gl/DGciuJD6z93tYUKy6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-secondary text-lg mb-5">Send Us a Message</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
                  <h3 className="font-heading font-bold text-secondary text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Your message has been sent via WhatsApp. We&apos;ll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-primary font-semibold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 focus:bg-white transition-all"
                      >
                        <option value="">Select a topic…</option>
                        <option value="Laptop Enquiry">Laptop Enquiry</option>
                        <option value="Warranty Claim">Warranty Claim</option>
                        <option value="CCTV / Surveillance">CCTV / Surveillance</option>
                        <option value="Desktop / Accessories">Desktop / Accessories</option>
                        <option value="Order Support">Order Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you…"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}
                  >
                    {sending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send via WhatsApp</>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    This will open WhatsApp with your message pre-filled. We typically reply within a few hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
