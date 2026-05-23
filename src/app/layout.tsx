import type { Metadata } from "next";
import { Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerEnquiryWidget from "@/components/CustomerEnquiryWidget";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refurbished Laptops & Second Hand Laptops in Agra, Mathura | Kartik Computers",
  description: "Buy premium corporate refurbished laptops, second-hand laptops, and certified purana laptops at half prices. 3 months warranty and 40+ quality tests. Serving Agra, Mathura, Firozabad, Etah, Etawah, Fatehabad.",
  keywords: "refurbished laptop agra, second hand laptop mathura, purana laptop firozabad, old computer etah, used laptop etawah, refurbished laptop fatehabad, kartik computers agra, second hand laptop store, purana laptop agra, cheap laptops",
  alternates: {
    canonical: "https://refurblaptopwala.com",
  },
  openGraph: {
    title: "Certified Refurbished & Second Hand Laptops - Kartik Computers",
    description: "Premium corporate laptops at a fraction of the cost. 3-month warranty. Serving Agra, Mathura, Firozabad, Etah, Etawah, Fatehabad.",
    url: "https://refurblaptopwala.com",
    siteName: "RefurbLaptopWala",
    locale: "en_IN",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  "name": "Kartik Computers (RefurbLaptopWala)",
  "alternateName": "RefurbLaptopWala",
  "image": "https://refurblaptopwala.com/hero-laptop.png",
  "@id": "https://refurblaptopwala.com/#localbusiness",
  "url": "https://refurblaptopwala.com",
  "telephone": "+918410617268",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shanti Dham Complex, Mau Road, Khandari",
    "addressLocality": "Agra",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "282002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 27.2144,
    "longitude": 78.0076
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "10:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "11:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://maps.app.goo.gl/DGciuJD6z93tYUKy6"
  ],
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Agra" },
    { "@type": "AdministrativeArea", "name": "Mathura" },
    { "@type": "AdministrativeArea", "name": "Firozabad" },
    { "@type": "AdministrativeArea", "name": "Etah" },
    { "@type": "AdministrativeArea", "name": "Etawah" },
    { "@type": "AdministrativeArea", "name": "Fatehabad" }
  ],
  "description": "Premium corporate refurbished laptops, second-hand laptops, and purana laptops with 3-month complete warranty. Sourced from corporate environments, rigorously tested, and certified."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hanken.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body bg-background text-secondary">
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          strategy="afterInteractive"
        />
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CustomerEnquiryWidget />
        </Providers>
      </body>
    </html>
  );
}

