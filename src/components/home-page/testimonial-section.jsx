import { MapPin, Quote, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Ibu Sarah Wijaya",
      role: "Restoran Owner",
      avatar: "/avatars/avatar1.jpg",
      rating: 5,
      comment: "Kualitas tempe sangat bagus dan konsisten! Pelanggan saya selalu puas. Sudah order berkali-kali dan tidak pernah mengecewakan.",
      location: "Jakarta",
    },
    {
      name: "Bapak Ahmad Reza",
      role: "Distributor",
      avatar: "/avatars/avatar2.jpg",
      rating: 5,
      comment: "Sebagai distributor, saya sangat terbantu dengan sistem bulk order mereka. Harga kompetitif dan kualitas export. Recommended!",
      location: "Surabaya",
    },
    {
      name: "Ms. Jennifer Kim",
      role: "International Buyer",
      avatar: "/avatars/avatar3.jpg",
      rating: 5,
      comment: "Best Indonesian tempeh supplier! Quality is consistent and they handle international shipping very professionally.",
      location: "Singapore",
    },
  ];
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Testimoni</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Kata Pelanggan Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Kepuasan pelanggan adalah prioritas utama kami</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.comment}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
