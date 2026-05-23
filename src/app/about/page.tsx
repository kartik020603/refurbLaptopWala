import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, Cpu, Camera, Monitor, Mouse, Award, Users, Clock, MapPin, Phone, Mail, ChevronRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Kartik Computers — RefurbLaptopWala',
  description: 'Kartik Computers is a 20-year-old trusted computer firm in Agra dealing in refurbished laptops, CCTV cameras, new laptops, assembled desktops, and computer accessories.',
};

const services = [
  {
    icon: Monitor,
    title: 'Refurbished Laptops',
    desc: 'Premium corporate-grade refurbished laptops, fully tested and certified with warranty.',
    color: 'bg-blue-50 text-primary border-blue-100',
  },
  {
    icon: Camera,
    title: 'CCTV Camera Systems',
    desc: 'Complete CCTV surveillance solutions for home, office, and commercial spaces.',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    icon: Cpu,
    title: 'New Laptops',
    desc: 'Latest brand-new laptops from leading brands at competitive prices.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: Monitor,
    title: 'Assembled Desktops',
    desc: 'Custom-built desktop computers configured as per your performance and budget needs.',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: Mouse,
    title: 'Computer Accessories',
    desc: 'Keyboards, mice, headphones, webcams, hard drives, RAM, and more.',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
];

const stats = [
  { value: '20+', label: 'Years in Business', icon: Clock },
  { value: '5000+', label: 'Happy Customers', icon: Users },
  { value: '100%', label: 'Certified Devices', icon: ShieldCheck },
  { value: '3 Mo', label: 'Complete Warranty', icon: Award },
];

const milestones = [
  { year: '2004', event: 'Kartik Computers founded in Agra, specialising in computer sales & service.' },
  { year: '2010', event: 'Expanded into refurbished corporate laptops, becoming a trusted source in the region.' },
  { year: '2015', event: 'Added CCTV camera installation and surveillance services.' },
  { year: '2020', event: 'Launched online presence and started serving customers across Agra, Mathura, Firozabad, Etah & Etawah.' },
  { year: '2024', event: 'Introduced RefurbLaptopWala — a dedicated platform for premium refurbished laptops.' },
];

export default function AboutPage() {
  return (
    <div className="bg-surface-ice min-h-screen">

      {/* Hero */}
      <section className="bg-secondary text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-tertiary blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 border border-white/20 text-tertiary text-sm font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            Est. 2004 · Agra, UP
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-5 leading-tight">
            20 Years of Trust.<br />One Name — Kartik Computers.
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            From a small computer shop in Agra to a complete technology solution provider — we&apos;ve been serving families, students, and businesses for over two decades.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-heading font-bold text-3xl text-secondary">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Our Story</p>
            <h2 className="font-heading text-3xl font-bold text-secondary mb-5 leading-snug">
              A Local Business Built on Honesty
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Kartik Computers was established in <strong>2004</strong> in Agra, Uttar Pradesh with a simple mission — provide reliable computers and technology products at fair prices. What started as a computer sales and repair shop quickly grew into a multi-product technology hub.
              </p>
              <p>
                Over the past <strong>20 years</strong>, we have served thousands of students, professionals, small businesses, and households across Agra and surrounding regions. Our reputation is built on transparent pricing, genuine products, and after-sales support that actually works.
              </p>
              <p>
                Today, we are proud to operate <strong>RefurbLaptopWala</strong> — bringing our offline expertise online so customers across the region can access certified refurbished laptops with confidence.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-heading font-bold text-secondary text-lg mb-6">Our Journey</h3>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{m.year}</span>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">What We Offer</p>
            <h2 className="font-heading text-3xl font-bold text-secondary">Our Products &amp; Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`bg-white rounded-2xl border shadow-sm p-6 border-gray-100 hover:shadow-md transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-secondary mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Why Us</p>
            <h2 className="font-heading text-3xl font-bold text-secondary">Why Customers Trust Kartik Computers</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: '20+ Years of Experience', desc: 'Two decades of hands-on expertise in computer sales, repairs, and technology services.' },
              { title: '100% Tested & Certified', desc: 'Every refurbished laptop passes a strict 30-point quality check before it reaches you.' },
              { title: '3-Month Complete Warranty', desc: 'Full parts and labour warranty with a 1-year no-service-charge guarantee for peace of mind.' },
              { title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay — always.' },
              { title: 'Local Support, Always Available', desc: 'Visit our store or call us anytime. Real humans answer, not bots.' },
              { title: 'Wide Product Range', desc: 'Laptops, desktops, CCTV, accessories — everything tech under one roof.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary text-sm">{title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Visit Us or Shop Online</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto text-sm leading-relaxed">
            Come visit Kartik Computers at our Agra store, or browse our certified refurbished laptops right here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Shop Laptops
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
