"use client";

import React, { useState } from "react";

export default function TestimonialSections() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      position: "Health & Wellness Coach",
      company: "VitalLife Nutrition",
      image: "/images/testimonial-sarah.jpg",
      rating: 5,
      quote: "TEMPEH NUSANTARAS PRODUCTS HAVE TRANSFORMED OUR MENU. THE QUALITY AND FLAVOR ARE UNMATCHED!",
    },
    {
      id: 2,
      name: "Marcus Chen",
      position: "Executive Chef",
      company: "Green Garden Restaurant",
      image: "/images/testimonial-marcus.jpg",
      rating: 5,
      quote: "THE AUTHENTIC TASTE AND PERFECT TEXTURE MAKE THIS THE BEST TEMPEH I'VE EVER WORKED WITH IN MY KITCHEN.",
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",
      position: "Nutritionist",
      company: "Plant-Based Research Institute",
      image: "/images/testimonial-elena.jpg",
      rating: 5,
      quote: "FROM A NUTRITIONAL STANDPOINT, THIS TEMPEH EXCEEDS ALL EXPECTATIONS. SUPERIOR QUALITY AND HEALTH BENEFITS.",
    },
    {
      id: 4,
      name: "James Thompson",
      position: "Procurement Manager",
      company: "Whole Foods Market",
      image: "/images/testimonial-james.jpg",
      rating: 5,
      quote: "CONSISTENT QUALITY AND RELIABLE DELIVERY. OUR CUSTOMERS LOVE THIS BRAND AND SALES HAVE INCREASED 40%.",
    },
    {
      id: 5,
      name: "Aisha Patel",
      position: "Fitness Influencer",
      company: "@FitWithAisha",
      image: "/images/testimonial-aisha.jpg",
      rating: 5,
      quote: "PERFECT PROTEIN SOURCE FOR FITNESS ENTHUSIASTS. MY FOLLOWERS LOVE THE MEAL PREP IDEAS WITH THIS TEMPEH.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTest = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Stars */}
        <div className="flex justify-center mb-8">
          {[...Array(currentTest.rating)].map((_, i) => (
            <svg key={i} className="w-6 h-6 text-black fill-current mx-1" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>

        {/* Main Content with Side Navigation */}
        <div className="relative">
          {/* Previous Button - Left */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button - Right */}
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Quote */}
          <div className="text-center mb-12">
            <p className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">"{currentTest.quote}"</p>
          </div>

          {/* Customer Info */}
          <div className="flex items-center justify-center mb-12">
            <img src={currentTest.image} alt={currentTest.name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div className="text-center">
              <h4 className="text-black font-semibold text-sm">{currentTest.name}</h4>
              <p className="text-gray-600 text-sm">
                {currentTest.position}, {currentTest.company}
              </p>
            </div>
          </div>
        </div>

        {/* Dots Indicator - Bottom */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-2 h-2 rounded-full transition-colors ${currentTestimonial === index ? "bg-black" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
