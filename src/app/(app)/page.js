/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, TrendingUp, Award, Package, Truck, Shield, Star, ArrowRight, Play, CheckCircle } from "lucide-react";
import { useState } from "react";
import FAQSections from "@/components/home-page/faq-section";

const LandingPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Package,
      title: "Premium Products",
      description: "Authentic Indonesian tempeh made with traditional fermentation methods",
      color: "from-amber-50 to-amber-100",
      iconColor: "bg-blue-500",
    },
    {
      icon: Users,
      title: "Affiliate Program",
      description: "Join our ranking system and earn competitive commissions",
      color: "from-amber-50 to-amber-100",
      iconColor: "bg-green-500",
    },
    {
      icon: Truck,
      title: "Global Export",
      description: "Reliable international shipping with cold chain management",
      color: "from-amber-50 to-amber-100",
      iconColor: "bg-purple-500",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Export-grade certification and food safety standards",
      color: "from-amber-50 to-amber-100",
      iconColor: "bg-amber-500",
    },
  ];

  const stats = [
    { number: "10+", label: "Product Varieties", icon: Package },
    { number: "50+", label: "Countries Served", icon: Truck },
    { number: "1000+", label: "Happy Customers", icon: Users },
    { number: "5★", label: "Average Rating", icon: Star },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Health Food Store Owner",
      location: "California, USA",
      text: "The quality of tempeh from Tempeh Nusantara is exceptional. My customers love the authentic taste and the wholesale program makes it profitable for my business.",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Affiliate Partner",
      location: "Singapore",
      text: "The affiliate program with ranking system is motivating. I've been able to build a steady income stream while promoting products I genuinely believe in.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Restaurant Chef",
      location: "Mexico City, Mexico",
      text: "Using their tempeh in our plant-based menu has been a game-changer. The consistency and flavor profile is perfect for our dishes.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-primary">
      {/* Hero Section */}
      <section
        className="relative bg-primary text-secondary overflow-hidden"
        style={{
          backgroundImage: 'linear-linear(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url("/images/hero-image.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-secondary bg-opacity-20 rounded-full backdrop-blur-sm mb-6">
              <Award className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm text-primary font-medium">Premium Indonesian Tempeh</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Export Quality
              <br />
              <span className="">Tempeh</span> Worldwide
            </h1>

            <p className="text-base md:text-medium text-secondary/80 max-w-3xl mx-auto leading-relaxed mb-10">
              Discover authentic Indonesian tempeh crafted with traditional methods. Join our global network of customers and affiliates in bringing premium plant-based protein to the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Products
              </Button>
              <Button size="lg" className="border border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-primary">
                <Users className="w-5 h-5 mr-2" />
                Join Affiliate Program
              </Button>
            </div>

            {/* Hero Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary">{stat.number}</div>
                  <div className="text-sm text-secondary/70">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Built for Global Success</h2>
            <p className="text-lg text-primary/70 max-w-3xl mx-auto">From premium products to affiliate opportunities, we provide everything you need to succeed in the plant-based market</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${hoveredFeature === index ? "scale-105" : ""}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className={`p-6 bg-linear-to-br ${feature.color} border-0`}>
                  <div className={`w-12 h-12 ${feature.iconColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-primary/70 leading-relaxed">{feature.description}</p>
                  <ArrowRight className={`w-4 h-4 mt-4 text-primary/40 transition-transform duration-300 ${hoveredFeature === index ? "translate-x-2" : ""}`} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-linear-to-br from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-4">Our Products</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Authentic Indonesian Tempeh</h2>
              <p className="text-lg text-primary/70 mb-8">
                Made from the finest non-GMO soybeans using traditional fermentation methods passed down through generations. Each batch is crafted with care to deliver authentic taste and superior nutrition.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-primary">100% Natural Fermentation Process</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-primary">Non-GMO Certified Soybeans</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-primary">Export Quality Standards</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-primary">Multiple Variety Options</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Package className="w-5 h-5 mr-2" />
                  View All Products
                </Button>
                <Button size="lg" variant="outline">
                  Request Samples
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="w-full h-32 bg-linear-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-primary text-sm">Raw Tempeh</h4>
                    <p className="text-xs text-primary/60">Original Flavor</p>
                  </Card>

                  <Card className="p-4">
                    <div className="w-full h-32 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-primary text-sm">Marinated</h4>
                    <p className="text-xs text-primary/60">Ready to Cook</p>
                  </Card>

                  <Card className="p-4">
                    <div className="w-full h-32 bg-linear-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-primary text-sm">Organic</h4>
                    <p className="text-xs text-primary/60">Certified</p>
                  </Card>

                  <Card className="p-4">
                    <div className="w-full h-32 bg-linear-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-primary text-sm">Spiced</h4>
                    <p className="text-xs text-primary/60">Traditional</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Program */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-linear-to-br from-blue-100 to-indigo-200 rounded-2xl p-8">
                <Card className="p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-primary">Monthly Leaderboard</h4>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-linear-to-r from-yellow-50 to-yellow-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</div>
                        <span className="font-medium text-primary">Alex Johnson</span>
                      </div>
                      <span className="text-green-600 font-bold">$2,450</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</div>
                        <span className="font-medium text-primary">Maria Garcia</span>
                      </div>
                      <span className="text-green-600 font-bold">$1,890</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-linear-to-r from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">3</div>
                        <span className="font-medium text-primary">David Kim</span>
                      </div>
                      <span className="text-green-600 font-bold">$1,620</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="bg-green-100 text-green-800 mb-4">Affiliate Program</Badge>

              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Join Our Ranking System & Earn</h2>
              <p className="text-lg text-primary/70 mb-8">
                Become part of our competitive affiliate program with transparent ranking system. Earn commissions, compete with others, and build your income stream while promoting premium tempeh products.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Register & Get Approved</h4>
                    <p className="text-primary/60 text-sm">Quick registration with admin approval process</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Get Your Unique Link</h4>
                    <p className="text-primary/60 text-sm">Receive your personalized referral URL</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Track & Compete</h4>
                    <p className="text-primary/60 text-sm">Monitor your progress and climb the leaderboard</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Earn Commissions</h4>
                    <p className="text-primary/60 text-sm">Receive monthly payouts based on performance</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Become Affiliate
                </Button>
                <Button size="lg" variant="outline">
                  View Leaderboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-linear-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Partners Say</h2>
            <p className="text-base md:text-medium text-primary/70 max-w-3xl mx-auto">From wholesalers to affiliates, hear from our global network of satisfied partners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-primary/70 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-primary/60">{testimonial.role}</p>
                    <p className="text-xs text-primary/50">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">Whether you're looking for premium tempeh products or want to join our affiliate program, we're here to support your success in the plant-based market.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
            <Button size="lg" className="border border-secondary text-secondary hover:bg-secondary hover:text-primary">
              <Users className="w-5 h-5 mr-2" />
              Join Affiliate Program
            </Button>
            <Button size="lg" className="border border-secondary text-secondary hover:bg-secondary hover:text-primary">
              <Package className="w-5 h-5 mr-2" />
              Wholesale Inquiry
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Global export capability</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>24/7 support available</span>
            </div>
          </div>
        </div>
      </section>

      <FAQSections />

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-primary hover:bg-secondary text-secondary hover:text-primary p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 hover:shadow-xl"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default LandingPage;
