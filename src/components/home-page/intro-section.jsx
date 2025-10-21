"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "../ui/button";

const DiscoverSection = () => {
  const handleLearnMore = () => {
    // Your learn more logic here
    console.log("Learn more clicked");
  };

  const handleContact = () => {
    // Your contact logic here
    console.log("Contact clicked");
  };

  return (
    <section className="bg-primary py-16 lg:py-24 min-h-screen flex items-center">
      <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8 order-2 lg:order-1">
            {/* Mission Statement */}
            <div className="space-y-4">
              <h3 className="font-playfair text-xl text-white font-bold tracking-wide">Our Mission</h3>
              <p className="text-white/80 text-base leading-relaxed max-w-lg">To empower global communities with healthier lives by introducing Indonesian tempeh as a premium superfood — sustainable, nutritious, and made for everyone.</p>
            </div>
            {/* Values Description */}
            <div className="space-y-4">
              <h3 className="font-playfair text-xl text-white font-bold tracking-wide">Our Values</h3>
              <p className="text-white/80 text-base leading-relaxed max-w-lg">We deliver premium frozen tempeh that is healthy, eco-friendly, and globally loved — the smart choice for modern lifestyles.</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-white/80 text-sm">Sustainable</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-white/80 text-sm">Nutritious</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-white/80 text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-white/80 text-sm">Globally Loved</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary" size="medium" onClick={handleLearnMore} className="text-sm font-medium border-secondary text-secondary hover:bg-secondary hover:text-primary transition-all duration-300">
                Learn More About Tempeh
              </Button>

              <Button variant="secondaryOutline" size="medium" onClick={handleContact} className="text-sm font-medium border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300">
                Contact Us
              </Button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Main Image */}
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/tempeh-premium.png" // Replace with your tempeh image
                  alt="Premium Indonesian Tempeh Superfood"
                  fill
                  className="object-cover"
                  quality={90}
                />

                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
              </div>

              {/* Floating Nutrition Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-secondary rounded-xl p-4 sm:p-6 shadow-xl backdrop-blur-sm border border-white/10"
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">20g</div>
                  <div className="text-xs sm:text-sm text-primary/80 font-medium">Protein per 100g</div>
                </div>
              </motion.div>

              {/* Sustainable Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-primary">100% Sustainable</span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            </div>

            {/* Additional Info Cards */}
            <div className="hidden lg:flex absolute -left-8 top-1/2 transform -translate-y-1/2 flex-col space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.9 }} viewport={{ once: true }} className="bg-white rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">0g</div>
                  <div className="text-xs text-gray-600">Cholesterol</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 1.1 }} viewport={{ once: true }} className="bg-white rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">High</div>
                  <div className="text-xs text-gray-600">Fiber</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
