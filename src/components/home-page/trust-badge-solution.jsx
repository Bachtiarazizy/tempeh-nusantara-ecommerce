import { Award, Clock, Globe, MessageCircle, Shield } from "lucide-react";
import React from "react";

export const TrustBadgeSolution = () => {
  return (
    <section className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">SSL Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">ISO 9001:2015</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Export Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Fast Response</span>
          </div>
        </div>
      </div>
    </section>
  );
};
