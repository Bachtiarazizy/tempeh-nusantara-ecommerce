import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ProductsPageContent from "@/components/shared/product-page-component";

// Loading skeleton component
function ProductsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Skeleton */}
        <Skeleton className="h-12 w-full max-w-3xl mb-6" />

        <div className="flex gap-6">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-48" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-24 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata
export const metadata = {
  title: "Produk - Tempe Premium Berkualitas",
  description: "Jelajahi koleksi lengkap produk tempe berkualitas tinggi dengan berbagai pilihan kategori dan harga terbaik",
};

// Main server component
export default function ProductsPage({ searchParams }) {
  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
