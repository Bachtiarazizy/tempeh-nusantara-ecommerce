import React from "react";

export default function ValueSection() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 items-center px-4 sm:px-6 lg:px-16 font-noto-sans">
      {/* Header Section */}
      {/* <div className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-6 leading-tight">ABOUT US</h1>
      </div> */}

      {/* Main Content Grid */}
      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Large Card */}
        <div className="bg-white border border-gray-300 overflow-hidden shadow-lg rounded-2xl">
          <div className="flex flex-col h-full">
            {/* Text Content */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-4 text-gray-600">Explore</p>
                <h2 className="font-playfair text-2xl md:text-3xl font-normal text-black mb-4 leading-tight">Empowering Indonesian farmers through fair trade and sustainable income.</h2>
              </div>
              <button className="flex items-center text-black font-medium text-sm hover:text-primary transition-colors">
                Learn
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="h-32 md:h-48 lg:h-64 w-full">
              <img src="/images/hero-image.png" alt="Sliced tempeh pieces" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Right Card */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8 md:p-10">
            <p className="text-xs font-medium tracking-widest uppercase mb-4 text-gray-600">Explore</p>
            <h2 className="font-playfair text-2xl md:text-3xl font-normal text-black mb-4 leading-tight">Supporting the local agricultural economy across Indonesia.</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center text-black font-medium text-sm hover:text-primary transition-colors">
                Start
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Right - Two Column Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quality Card */}
            <div className="bg-white border border-gray-300 p-6 shadow-lg rounded-2xl md:p-8">
              <div className="w-12 h-8 bg-black mb-6 flex items-center justify-center">
                <span className="text-white text-xs font-bold">HD</span>
              </div>
              <h3 className="font-playfair text-lg md:text-xl font-normal text-black mb-3 leading-tight">Promoting tempeh as a global superfood, rich in protein and probiotics.</h3>
              <button className="flex items-center text-black font-medium text-sm hover:text-primary transition-colors">
                Discover
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Community Card */}
            <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-6 md:p-8">
              <div className="w-12 h-8 mb-6 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 border-2 border-black rounded-full"></div>
                  <div className="w-3 h-3 border-2 border-black rounded-full"></div>
                </div>
              </div>
              <h3 className="font-playfair text-lg md:text-xl font-normal text-black mb-3 leading-tight">Improving global health with affordable, plant-based nutrition and food heritage.</h3>
              <button className="flex items-center text-black font-medium text-sm hover:text-primary transition-colors">
                Connect
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
