import { Noto_Sans, Gloock, Montserrat, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const gloock = Playfair_Display({
  variable: "--font-gloock",
  weight: ["400"],
  subsets: ["latin"],
});

const notoSans = Montserrat({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tempeh Nusantara | Premium Tempeh Products from Indonesia",
  description: "Discover the authentic taste of Indonesia with our premium tempeh products, crafted for health-conscious consumers worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gloock.variable} ${notoSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
