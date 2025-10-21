"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ProductSection() {
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      id: 1,
      name: "Premium Original Tempeh",
      category: "CLASSIC",
      description: "Our flagship product made from organic soybeans, fermented using traditional Indonesian methods for authentic taste and maximum nutrition.",
      image: "/images/tempeh-premium.png",
      features: ["100% Organic Soybeans", "Traditional Fermentation", "20g Protein per 100g", "Zero Preservatives"],
      nutrition: { protein: "20g", fiber: "9g", calories: "193", fat: "11g" },
      certifications: ["Organic", "Non-GMO", "Halal"],
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      id: 2,
      name: "Seasoned Tempeh Strips",
      category: "READY-TO-COOK",
      description: "Pre-marinated tempeh strips with traditional Indonesian spices, ready to cook in minutes for busy lifestyles.",
      image: "/images/tempeh-original.png",
      features: ["Pre-Marinated", "Traditional Spices", "Quick Cook", "Authentic Flavors"],
      nutrition: { protein: "18g", fiber: "8g", calories: "210", fat: "12g" },
      certifications: ["Halal", "Natural"],
      bgGradient: "from-red-50 to-pink-50",
    },
    {
      id: 3,
      name: "Tempeh Protein Cubes",
      category: "FITNESS",
      description: "High-protein tempeh cubes perfect for fitness enthusiasts and health-conscious consumers seeking plant-based protein.",
      image: "/images/tempeh-premium.png",
      features: ["High Protein", "Low Carb", "Fitness Optimized", "Easy Preparation"],
      nutrition: { protein: "25g", fiber: "7g", calories: "180", fat: "9g" },
      certifications: ["Organic", "Fitness Approved"],
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      id: 4,
      name: "Multi-Grain Tempeh",
      category: "PREMIUM",
      description: "Artisanal blend of soybeans, quinoa, and ancient grains for enhanced nutrition and unique texture experience.",
      image: "/images/tempeh-original.png",
      features: ["Ancient Grains Blend", "Enhanced Nutrition", "Unique Texture", "Artisanal Quality"],
      nutrition: { protein: "22g", fiber: "12g", calories: "205", fat: "10g" },
      certifications: ["Organic", "Non-GMO", "Artisanal"],
      bgGradient: "from-purple-50 to-indigo-50",
    },
  ];

  const currentProduct = products[activeProduct];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-600">OUR PRODUCTS</p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-black mb-6 leading-tight">
            Premium Tempeh
            <br />
            <span className="text-primary">Collection</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">Discover our range of premium frozen tempeh products, each crafted with traditional Indonesian methods and modern quality standards.</p>
        </div>

        {/* Main Product Display */}
        <div className={`bg-gradient-to-br ${currentProduct.bgGradient} rounded-3xl overflow-hidden shadow-2xl`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
            {/* Product Image */}
            <div className="relative order-1 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent z-10"></div>
              <Image src={currentProduct.image} alt={currentProduct.name} fill className="object-cover" quality={90} />

              {/* Floating Certifications */}
              <div className="absolute top-6 left-6 z-20 flex flex-col space-y-2">
                {currentProduct.certifications.map((cert, index) => (
                  <span key={index} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary shadow-lg">
                    ✓ {cert}
                  </span>
                ))}
              </div>

              {/* Product Category Badge */}
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide">{currentProduct.category}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-2">
              <div className="space-y-8">
                {/* Product Title */}
                <div>
                  <h3 className="font-playfair text-3xl lg:text-4xl font-normal text-black mb-4 leading-tight">{currentProduct.name}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{currentProduct.description}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-medium text-black mb-4">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div className="bg-white/70 rounded-2xl p-6">
                  <h4 className="font-medium text-black mb-4 text-center">Nutrition Facts (per 100g)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">{currentProduct.nutrition.protein}</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">{currentProduct.nutrition.fiber}</div>
                      <div className="text-xs text-gray-600">Fiber</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">{currentProduct.nutrition.calories}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">{currentProduct.nutrition.fat}</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-colors rounded-lg flex-1">Request Sample</button>
                  <button className="border-2 border-primary text-primary px-8 py-3 text-sm font-medium hover:bg-primary hover:text-white transition-colors rounded-lg flex-1">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Thumbnails */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <button
              key={product.id}
              onClick={() => setActiveProduct(index)}
              className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${activeProduct === index ? "ring-4 ring-primary shadow-xl scale-105" : "hover:scale-102 hover:shadow-lg"}`}
            >
              <Image src={product.image} alt={product.name} fill className="object-cover" quality={80} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-white text-sm font-medium text-left">{product.name}</div>
                <div className="text-white/80 text-xs text-left">{product.category}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="font-playfair text-2xl text-black mb-4">Ready to Experience Premium Tempeh?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join thousands of satisfied customers worldwide who have made the switch to sustainable, healthy protein with our premium tempeh collection.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 text-sm font-medium hover:bg-primary/90 transition-colors rounded-lg">Order Now</button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 text-sm font-medium hover:bg-gray-100 transition-colors rounded-lg">Download Catalog</button>
          </div>
        </div>
      </div>
    </section>
  );
}
