import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import SearchPageContent from "@/components/shared/search-page-component";

// Loading skeleton component
function SearchLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
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
  title: "Pencarian Produk - Tempe Premium",
  description: "Temukan produk tempe berkualitas tinggi sesuai kebutuhan Anda",
};

// Main server component
export default function SearchPage({ searchParams }) {
  return (
    <Suspense fallback={<SearchLoadingSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}
