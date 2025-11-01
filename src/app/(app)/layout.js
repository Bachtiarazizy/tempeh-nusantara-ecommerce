// src/app/(app)/layout.js

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar/navbar";

export const metadata = {
  title: "Tempeh Nusantara",
  description: "Discover the authentic taste of Indonesia with our premium tempeh products, crafted for health-conscious consumers worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
