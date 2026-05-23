import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Wrench, Clock, CheckCircle2, XCircle, Phone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warranty Terms | RefurbLaptopWala',
  description: '3-month complete warranty and 1-year service warranty on all refurbished laptops purchased from Kartik Computers, Agra.',
};

const included3Month = [
  'Hardware defects and manufacturing faults',
  'Screen issues (dead pixels, backlight failure)',
  'Keyboard and trackpad malfunctions',
  'Battery replacement (if faulty at time of purchase)',
  'Port and connectivity failures',
  'Motherboard defects',
  'RAM and storage failures',
];

const includedService = [
  'Free diagnosis and inspection',
  'Free labour / service charges on all repairs',
  'Software troubleshooting and OS reinstallation',
  'Cleaning and maintenance service',
  'Driver and firmware updates',
];

const notCovered = [
  'Physical damage caused by drops, spills, or mishandling',
  'Damage due to power surges or improper charging',
  'Cosmetic damage (scratches, dents) after purchase',
  'Unauthorised repairs or modifications',
  'Theft or loss',
  'Consumables (charger cable wear, keycap wear)',
];

export default function WarrantyPage() {
  return (
    <div className="bg-surface-ice min-h-screen">

      {/* Hero */}
      <section className="bg-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <ShieldCheck className="w-9 h-9 text-tertiary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Warranty Terms</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Every laptop sold by Kartik Computers comes with industry-leading warranty coverage so you can buy with complete confidence.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* Two plan cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* 3-Month Complete Warranty */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">3-Month Complete Warranty</span>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Full parts + service coverage for the first 3 months from your date of purchase. Zero cost — no surprises.
              </p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">What&apos;s covered</p>
              <ul className="space-y-3">
                {included3Month.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Parts &amp; Labour — both FREE for 3 months
              </div>
            </div>
          </div>

          {/* 1-Year Service Warranty */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-tertiary/80 to-emerald-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">1-Year Service Warranty</span>
              </div>
              <p className="text-emerald-50 text-sm leading-relaxed">
                After 3 months, your labour/service charges remain FREE for a full year from purchase. You only pay for replacement parts if needed.
              </p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">What&apos;s included (months 4–12)</p>
              <ul className="space-y-3">
                {includedService.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                Service FREE · Parts at actual cost (months 4–12)
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-heading text-xl font-bold text-secondary mb-8 text-center">Warranty Timeline at a Glance</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {[
                { label: 'Day 1 – Month 3', title: 'Full Coverage', desc: 'Parts + service both free. Any defect fixed at zero cost.', color: 'bg-primary', textColor: 'text-primary', bg: 'bg-blue-50 border-blue-200' },
                { label: 'Month 4 – Month 12', title: 'Service Free', desc: 'Labour & service charges waived. Only pay for parts if replaced.', color: 'bg-tertiary', textColor: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                { label: 'After 12 Months', title: 'Standard Rates', desc: 'Competitive service rates apply. Trusted service always available.', color: 'bg-gray-400', textColor: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
              ].map((step) => (
                <div key={step.label} className={`border rounded-xl p-5 ${step.bg}`}>
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-center text-gray-500 font-semibold uppercase tracking-widest mb-1">{step.label}</p>
                  <h3 className={`font-heading font-bold text-center text-lg mb-2 ${step.textColor}`}>{step.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Not Covered */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-heading text-xl font-bold text-secondary mb-6">What Is Not Covered</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {notCovered.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* How to Claim */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-heading text-xl font-bold text-secondary mb-6">How to Claim Warranty</h2>
          <ol className="space-y-5">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call or WhatsApp us at +91 8410617268 or email ravikartikcomputers@gmail.com with your order details.' },
              { step: '02', title: 'Bring the Laptop', desc: 'Visit our store at Kartik Computers, Shanti Dham Complex, Mau Road, Khandari, Agra with your purchase receipt.' },
              { step: '03', title: 'Diagnosis', desc: 'Our technicians will inspect the device and confirm if the issue falls under warranty coverage — free of charge.' },
              { step: '04', title: 'Repair / Replacement', desc: 'We will repair or replace the defective component at no labour cost (parts cost may apply after 3 months).' },
            ].map((s) => (
              <li key={s.step} className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 font-heading">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary mb-0.5">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-secondary rounded-2xl p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold mb-3">Have a Warranty Query?</h2>
          <p className="text-gray-300 mb-6 text-sm">Our team is available 7 days a week to help you with any concerns.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918410617268"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-tertiary hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-opacity"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
            <a
              href="tel:+918410617268"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              <Phone className="w-5 h-5" /> Call +91 8410617268
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
