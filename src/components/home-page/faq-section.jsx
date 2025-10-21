"use client";

import React, { useState } from "react";

export default function FAQSections() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What is tempeh and how is it different from tofu?",
      answer:
        "Tempeh is a traditional Indonesian fermented food made from soybeans. Unlike tofu, tempeh undergoes a natural fermentation process that creates a firm, nutty-flavored protein with visible soybean pieces. It contains more protein, fiber, and probiotics than tofu, making it a superior nutritional choice.",
    },
    {
      question: "How long does frozen tempeh last and how should I store it?",
      answer:
        "Our premium frozen tempeh lasts up to 12 months when stored properly in the freezer at -18°C (0°F). Once thawed, consume within 3-5 days and store in the refrigerator. Never refreeze thawed tempeh. For best quality, keep packaging sealed until ready to use.",
    },
    {
      question: "Is your tempeh suitable for vegans and those with dietary restrictions?",
      answer:
        "Yes! Our tempeh is 100% plant-based, making it perfect for vegans, vegetarians, and those following plant-based diets. It's also naturally gluten-free, non-GMO, and contains no artificial preservatives. All our products are certified organic and halal.",
    },
    {
      question: "How do I prepare and cook tempeh?",
      answer:
        "Tempeh is incredibly versatile! You can slice, cube, or crumble it. Popular methods include pan-frying, steaming, grilling, or baking. For best results, marinate for 15-30 minutes before cooking. It absorbs flavors beautifully and can be used in stir-fries, salads, sandwiches, or as a meat substitute in any recipe.",
    },
    {
      question: "What are the health benefits of eating tempeh?",
      answer:
        "Tempeh is a nutritional powerhouse! It provides complete protein (20g per 100g), essential amino acids, probiotics for gut health, fiber, and important minerals like magnesium and phosphorus. It may help lower cholesterol, support heart health, and aid digestion while being low in saturated fat.",
    },
    {
      question: "Do you ship internationally and what are the minimum order requirements?",
      answer:
        "Yes, we ship to over 50 countries worldwide with proper cold chain logistics. Minimum order varies by region - typically 50kg for individual customers and 500kg for wholesale/retail partners. Contact our export team for specific shipping costs, lead times, and import requirements for your country.",
    },
    {
      question: "Can I get samples before placing a large order?",
      answer:
        "Absolutely! We offer sample packages for potential customers and wholesale partners. Sample packs include 2-3 of our popular variants (500g each). There's a small fee to cover shipping and handling, which is refundable with your first commercial order above minimum quantity.",
    },
    {
      question: "What certifications and quality standards do you follow?",
      answer:
        "We maintain the highest quality standards with certifications including Organic (USDA/EU), Non-GMO Project Verified, Halal, HACCP, ISO 22000, and BRC Food Safety. Our facility undergoes regular third-party audits, and every batch is laboratory tested for quality, safety, and nutritional content.",
    },
  ];

  return (
    <div>
      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-base md:text-medium text-primary/70 max-w-3xl mx-auto">Get answers to the most common questions about our premium Indonesian tempeh products, from nutrition to shipping.</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <button onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)} className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none">
                  <h3 className="font-medium text-lg text-black pr-4">{faq.question}</h3>
                  <div className={`flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 ${openFAQ === index ? "rotate-45" : ""}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <div className="h-px bg-gray-100 mb-6"></div>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="font-playfair text-xl text-black mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6">Our team is here to help you with any specific questions about our tempeh products.</p>
            <button className="bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-colors rounded-lg">Contact Our Experts</button>
          </div>
        </div>
      </section>
    </div>
  );
}
