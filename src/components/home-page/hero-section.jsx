"use client";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/button";

const HeroSection = () => {
  const handleGetQuote = () => {
    // Your quote logic here
    console.log("Get quote clicked");
  };

  const handleDownloadCatalog = () => {
    // Your download logic here
    console.log("Download catalog clicked");
  };

  return (
    <section className="relative min-h-screen bg-primary overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-image.png" alt="Harika Charcoal Hero Background" fill className="object-cover" priority />

        {/* Dark overlay untuk readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-start">
        <div className="text-start max-w-4xl">
          {/* Main Heading */}
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-wide text-white mb-6">
            Tempeh Nusantara :
            <br />
            Superfood from Indonesia
          </motion.h1>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg mb-8 max-w-2xl leading-relaxed">
            At Tempeh Nusantara, we ensure every product is crafted in a world-class hygienic facility, combining traditional Indonesian heritage with modern innovation. Our premium vacuum-packed tempeh is carefully produced,
            quality-checked, and tasted to guarantee a healthy, sustainable, and delicious superfood for the global market.{" "}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-row gap-4 justify-start items-center">
            <Link href="/mailto:charcoal@harikanusantara" target="_blank" rel="noopener noreferrer">
              <Button variant="secondaryOutline" size="large" onClick={handleGetQuote}>
                Get Price Quote
              </Button>
            </Link>

            <Button variant="primary" size="large" onClick={handleDownloadCatalog}>
              Download Catalog
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
