"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Star, Minus, Plus, ChevronDown, Heart, Share2, ShoppingCart, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Mock ProductCard component
const ProductCard = ({ id, name, price, image, badge, inStock, slug }) => (
  <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
    <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    {badge && <Badge className="mb-2">{badge}</Badge>}
    <h3 className="font-semibold text-sm mb-2">{name}</h3>
    <p className="text-green-600 font-bold mb-3">Rp {price.toLocaleString()}</p>
    <Button size="sm" className="w-full" disabled={!inStock}>
      {inStock ? "View Details" : "Out of Stock"}
    </Button>
  </div>
);

const ProductDetailsPage = ({ slug }) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product data from API
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // UI States
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!mounted || !slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }

        const { product: productData, relatedProducts: related } = data.data;

        setProduct(productData);
        setRelatedProducts(related);

        // Set defaults
        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }

        const defaultWeight = productData.weights?.find((w) => w.selected) || productData.weights?.[0];
        if (defaultWeight) {
          setSelectedWeight(defaultWeight.label);
          setCurrentPrice(defaultWeight.price || productData.price);
        } else {
          setCurrentPrice(productData.price);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [mounted, slug]);

  // Update price when weight changes
  useEffect(() => {
    if (product && selectedWeight) {
      const weightOption = product.weights?.find((w) => w.label === selectedWeight);
      setCurrentPrice(weightOption?.price || product.price);
    }
  }, [product, selectedWeight]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const weightOption = product.weights?.find((w) => w.label === selectedWeight);

      // Add to cart logic here
      console.log("Added to cart:", {
        productId: product.id,
        name: product.name,
        price: weightOption?.price || product.price,
        weight: selectedWeight,
        variant: selectedVariant,
        quantity,
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = "/checkout";
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : i < rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"}`} />);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Button onClick={() => (window.location.href = "/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Shop All", href: "/products" },
    { label: product.category, href: `/products?category=${product.category}` },
    { label: product.name, href: `/products/${product.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          {breadcrumbs.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <a href={item.href} className="hover:text-gray-900 transition-colors">
                {item.label}
              </a>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                {product.isOnSale && product.discount > 0 && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
              </div>

              <img src={product.images[selectedImageIndex] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Thumbnail images */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? "border-green-600" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                {product.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl font-bold text-gray-900">Rp {(currentPrice * quantity).toLocaleString()}</div>
                {product.originalPrice && product.originalPrice > currentPrice && <div className="text-xl text-gray-500 line-through">Rp {(product.originalPrice * quantity).toLocaleString()}</div>}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  ({product.rating}) • {product.reviewCount} reviews
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">{product.inStock ? <Badge className="bg-green-100 text-green-800">In Stock ({product.stockQuantity} available)</Badge> : <Badge variant="destructive">Out of Stock</Badge>}</div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Variant Selection */}
            <div className="space-y-4">
              {/* Variant Dropdown */}
              {product.variants?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Variant</label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Weight Selection */}
              {product.weights?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Weight</label>
                  <div className="flex flex-wrap gap-2">
                    {product.weights.map((weight) => (
                      <Button
                        key={weight.value}
                        variant={selectedWeight === weight.label ? "default" : "outline"}
                        size="sm"
                        disabled={weight.disabled}
                        onClick={() => setSelectedWeight(weight.label)}
                        className={`${selectedWeight === weight.label ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
                      >
                        {weight.label}
                        {weight.price && <span className="ml-1 text-xs">(Rp {weight.price.toLocaleString()})</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} disabled={quantity >= product.stockQuantity}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium" onClick={handleAddToCart} disabled={isAddingToCart || !product.inStock}>
                {isAddingToCart ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding to Cart...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - Rp {(currentPrice * quantity).toLocaleString()}
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-6 text-lg font-medium" onClick={handleBuyNow} disabled={!product.inStock}>
                Buy Now
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={() => setIsFavorited(!isFavorited)} className={`flex items-center space-x-2 ${isFavorited ? "text-red-500" : "text-gray-600"}`}>
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                <span>Add to Wishlist</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </Button>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-1 pt-6">
              <Separator />

              {/* Product Details */}
              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left hover:text-green-600 transition-colors">
                  <span className="font-semibold text-gray-900">Product Details</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDetailsOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pb-4 space-y-4">
                    <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium">Weight:</span> {product.weight}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {product.category}
                      </div>
                      <div>
                        <span className="font-medium">SKU:</span> {product.sku}
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span> {product.stockQuantity} units
                      </div>
                    </div>

                    {product.storageInstructions && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-sm mb-1">Storage:</p>
                        <p className="text-sm text-gray-700">{product.storageInstructions}</p>
                      </div>
                    )}

                    {product.cookingInstructions && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="font-medium text-sm mb-1">Cooking:</p>
                        <p className="text-sm text-gray-700">{product.cookingInstructions}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Nutrition Information */}
              {product.nutritionPer100g && (
                <>
                  <Collapsible open={isNutritionOpen} onOpenChange={setIsNutritionOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left hover:text-green-600 transition-colors">
                      <span className="font-semibold text-gray-900">Nutrition Information</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isNutritionOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pb-4">
                        <p className="text-sm text-gray-600 mb-3 font-medium">Per 100g serving:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                          {Object.entries(product.nutritionPer100g).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">
                                {value}
                                {key === "calories" ? " kcal" : key === "sodium" ? "mg" : "g"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Separator />
                </>
              )}

              {/* Ingredients */}
              {product.ingredients && (
                <Collapsible open={isIngredientsOpen} onOpenChange={setIsIngredientsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left hover:text-green-600 transition-colors">
                    <span className="font-semibold text-gray-900">Ingredients & Allergens</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isIngredientsOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pb-4 space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-sm mb-2">Ingredients:</p>
                        <p className="text-sm text-gray-700">{product.ingredients.join(", ")}</p>
                      </div>
                      {product.allergens && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <p className="font-medium text-sm mb-2 text-yellow-900">⚠️ Allergens:</p>
                          <p className="text-sm text-yellow-800">{product.allergens.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
