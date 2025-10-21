"use client";

import React, { useState } from "react";

export default function ProblemSolutionTabs() {
  const [activeTab, setActiveTab] = useState("problem1");

  const tabsData = {
    problem1: {
      category: "GLOBAL PROBLEM",
      title: "Environmental Impact of Animal Protein",
      icon: "🌍",
      stats: [
        { value: "14%", label: "Of global greenhouse gas emissions" },
        { value: "20kg", label: "CO₂-e per kg of beef production" },
        { value: "59%", label: "Emissions reduction with plant-based diet" },
      ],
      content:
        "Animal-based protein is expensive and environmentally damaging, responsible for about 14% of global greenhouse gas emissions — mainly from beef and dairy production. The supply chain also contributes to deforestation, excessive water use, and soil degradation, making it unsustainable in the long run.",
      details: "Data shows beef production alone generates over 20 kg CO₂-e/kg, far higher than chicken or plant-based alternatives. Shifting to a plant-based diet can cut emissions by up to 59% compared to a non-vegetarian diet.",
      source: "FAO (2021), WHO (2020), mygreentoddler.com (2022 infographic)",
      bgColor: "bg-red-50",
      accentColor: "text-red-600",
      borderColor: "border-red-200",
    },
    problem2: {
      category: "MARKET OPPORTUNITY",
      title: "Explosive Growth in Plant-Based Market",
      icon: "📈",
      stats: [
        { value: "$103.75B", label: "Projected market size by 2034" },
        { value: "8.5-14%", label: "CAGR growth rate" },
        { value: "$46.7B", label: "Current market value (2024)" },
      ],
      content: "The plant-based protein market is booming, driven by health-conscious consumers and sustainability concerns. Valued at USD 46.7 billion in 2024, it is projected to more than double, reaching USD 103.75 billion by 2034.",
      details: "This reflects a strong CAGR of 8.5%–14%, making plant-based protein one of the fastest-growing segments in the global food industry.",
      source: "Precedence Research (2024), Future Market Insights (2023)",
      bgColor: "bg-blue-50",
      accentColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    problem3: {
      category: "CONSUMER DEMAND",
      title: "Rising Demand for Healthy Alternatives",
      icon: "🥗",
      stats: [
        { value: "$22.7B", label: "Projected market by 2031" },
        { value: "5.7%", label: "CAGR (2021-2031)" },
        { value: "Global", label: "Shift toward sustainability" },
      ],
      content:
        "The demand for plant-based protein continues to accelerate as more consumers adopt vegan and health-focused diets. By 2031, the plant-based protein market is projected to reach USD 22.7 billion, growing at a 5.7% CAGR (2021–2031).",
      details: "This trend reflects a global shift toward healthy, sustainable, and innovative food alternatives, creating strong momentum for products like tempeh.",
      source: "Transparency Market Research (2022)",
      bgColor: "bg-green-50",
      accentColor: "text-green-600",
      borderColor: "border-green-200",
    },
    solution: {
      category: "OUR SOLUTION",
      title: "Authentic Indonesian Superfood",
      icon: "🌱",
      stats: [
        { value: "Premium", label: "Frozen packaging quality" },
        { value: "Healthy", label: "Sustainable & affordable" },
        { value: "Perfect", label: "Fit for global market" },
      ],
      content: "Authentic Indonesian superfood with global taste.",
      details: "Premium frozen packaging ensures freshness & quality. Healthy, sustainable, and affordable plant-based protein. Perfect fit for the booming global market & consumer demand.",
      source: "Our commitment to excellence",
      bgColor: "bg-primary/5",
      accentColor: "text-primary",
      borderColor: "border-primary/20",
    },
  };

  const tabs = [
    { key: "problem1", label: "Environmental Crisis", color: "border-red-500" },
    { key: "problem2", label: "Market Growth", color: "border-blue-500" },
    { key: "problem3", label: "Consumer Demand", color: "border-green-500" },
    { key: "solution", label: "Our Solution", color: "border-primary" },
  ];

  const currentData = tabsData[activeTab];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-gray-900 mb-6">
            The Global Challenge
            <br />
            <span className="text-primary">& Our Solution</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Understanding the environmental and market forces driving the plant-based protein revolution — and how Indonesian tempeh fits perfectly into this landscape.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-4 text-base font-medium transition-all duration-300 relative ${activeTab === tab.key ? `text-gray-900 border-b-2 ${tab.color}` : "text-gray-600 hover:text-gray-900"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 p-8 lg:p-12">
              <div className="space-y-8">
                {/* Category Badge */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{currentData.icon}</span>
                  <span className={`px-4 py-2 ${currentData.accentColor} bg-gray-50 text-xs font-semibold tracking-wider uppercase rounded-full`}>{currentData.category}</span>
                </div>

                {/* Title */}
                <h3 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{currentData.title}</h3>

                {/* Main Content */}
                <p className="text-gray-700 text-lg leading-relaxed">{currentData.content}</p>

                {/* Additional Details */}
                <p className="text-gray-600 leading-relaxed">{currentData.details}</p>

                {/* Solution Features (only for solution tab) */}
                {activeTab === "solution" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <div className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                      <div className="text-3xl mb-3">🥶</div>
                      <div className="font-semibold text-gray-900 mb-1">Premium Frozen</div>
                      <div className="text-sm text-gray-600">Freshness & Quality</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                      <div className="text-3xl mb-3">🌿</div>
                      <div className="font-semibold text-gray-900 mb-1">Healthy & Sustainable</div>
                      <div className="text-sm text-gray-600">Plant-Based Protein</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                      <div className="text-3xl mb-3">🎯</div>
                      <div className="font-semibold text-gray-900 mb-1">Global Market Fit</div>
                      <div className="text-sm text-gray-600">Consumer Demand</div>
                    </div>
                  </div>
                )}

                {/* Source */}
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-500 italic">Source: {currentData.source}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center">
              <h4 className="font-playfair text-xl font-semibold text-gray-900 mb-10 text-center">Key {activeTab === "solution" ? "Features" : "Statistics"}</h4>

              <div className="space-y-8">
                {currentData.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-4xl lg:text-5xl font-bold ${currentData.accentColor} mb-3`}>{stat.value}</div>
                    <div className="text-sm text-gray-600 leading-tight font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mt-10 flex justify-center space-x-2">
                {tabs.map((tab) => (
                  <div key={tab.key} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTab === tab.key ? currentData.accentColor.replace("text-", "bg-") : "bg-gray-300"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-8 text-lg">Ready to be part of the solution?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 text-base font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">Learn More About Tempeh</button>
            <button className="border-2 border-primary text-primary px-8 py-4 text-base font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300">Request Samples</button>
          </div>
        </div>
      </div>
    </section>
  );
}
