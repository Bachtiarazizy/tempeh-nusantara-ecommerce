/* eslint-disable import/no-anonymous-default-export */
// products.js - Complete product data module

export const products = [
  {
    id: 1,
    name: "Raw Tempeh Original",
    slug: "raw-tempeh-original",
    price: 55,
    originalPrice: 65,
    weight: "500g",
    image: null,
    category: "Fresh",
    rating: 4.5,
    reviewCount: 124,
    isNew: true,
    isOnSale: true,
    discount: 15,
    description:
      "Our Raw Tempeh Original is crafted from the finest non-GMO soybeans using traditional Indonesian fermentation methods. Rich in protein and probiotics, it offers a nutty flavor and firm texture perfect for various cooking applications.",
    longDescription:
      "This premium raw tempeh is made using authentic Indonesian techniques passed down through generations. Each piece is carefully fermented for 24-48 hours to achieve the perfect balance of flavor and nutrition. The natural fermentation process creates beneficial probiotics while maintaining the tempeh's distinctive taste and texture.",
    variants: ["Original", "Spicy", "Herbs & Spices"],
    weights: [
      { label: "250g Pack", value: "250g", price: 35, selected: false },
      { label: "500g Pack", value: "500g", price: 55, selected: true },
      { label: "1kg Bulk", value: "1kg", price: 95, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 193,
      protein: 19.5,
      carbs: 7.6,
      fat: 10.8,
      fiber: 9.4,
      sodium: 9,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter Culture", "Water"],
    allergens: ["Soy"],
    storageInstructions: "Keep refrigerated at 2-4°C. Use within 7 days of opening.",
    cookingInstructions: "Can be steamed, fried, grilled, or crumbled into dishes. Cook thoroughly before consumption.",
    tags: ["Organic", "High Protein", "Probiotic", "Vegan", "Gluten-Free"],
    inStock: true,
    stockQuantity: 150,
    shippingWeight: 0.6,
    dimensions: { length: 15, width: 10, height: 3 },
    relatedProducts: [2, 3, 4],
  },
  {
    id: 2,
    name: "Frozen Tempeh Premium",
    slug: "frozen-tempeh-premium",
    price: 58,
    originalPrice: null,
    weight: "500g",
    image: null,
    category: "Frozen",
    rating: 4.2,
    reviewCount: 89,
    isNew: false,
    isOnSale: false,
    discount: 0,
    description: "Our Premium Frozen Tempeh maintains all the nutritional benefits while extending shelf life. Flash-frozen at peak freshness to preserve texture and flavor.",
    longDescription:
      "This premium frozen tempeh is processed using advanced flash-freezing technology that preserves the integrity of the fermentation cultures and maintains the original texture. Perfect for meal prep and bulk cooking, it can be stored for up to 6 months without losing nutritional value.",
    variants: ["Original", "Marinated", "Seasoned"],
    weights: [
      { label: "300g Pack", value: "300g", price: 38, selected: false },
      { label: "500g Pack", value: "500g", price: 58, selected: true },
      { label: "1kg Family Pack", value: "1kg", price: 105, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 190,
      protein: 19.2,
      carbs: 7.8,
      fat: 10.5,
      fiber: 9.2,
      sodium: 12,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter Culture", "Water", "Natural Preservatives"],
    allergens: ["Soy"],
    storageInstructions: "Keep frozen at -18°C. Once thawed, use within 3 days.",
    cookingInstructions: "Thaw completely before cooking. Can be cooked from frozen if needed.",
    tags: ["Frozen", "High Protein", "Long Shelf Life", "Vegan", "Gluten-Free"],
    inStock: true,
    stockQuantity: 200,
    shippingWeight: 0.65,
    dimensions: { length: 16, width: 12, height: 4 },
    relatedProducts: [1, 3, 5],
  },
  {
    id: 3,
    name: "Packaged Tempeh Ready-to-Cook",
    slug: "packaged-tempeh-ready-cook",
    price: 48,
    originalPrice: 55,
    weight: "300g",
    image: null,
    category: "Packaged",
    rating: 4.8,
    reviewCount: 203,
    isNew: false,
    isOnSale: true,
    discount: 13,
    description: "Pre-seasoned tempeh ready for quick cooking. Perfect for busy lifestyles, simply heat and serve.",
    longDescription:
      "Our ready-to-cook packaged tempeh comes pre-seasoned with authentic Indonesian spices. Each package is vacuum-sealed to maintain freshness and comes with easy cooking instructions. Perfect for stir-fries, salads, or as a protein addition to any meal.",
    variants: ["Teriyaki", "Sweet & Sour", "Spicy Sambal", "Curry"],
    weights: [
      { label: "200g Single", value: "200g", price: 35, selected: false },
      { label: "300g Pack", value: "300g", price: 48, selected: true },
      { label: "600g Double", value: "600g", price: 85, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 205,
      protein: 18.8,
      carbs: 9.2,
      fat: 11.2,
      fiber: 8.9,
      sodium: 380,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter", "Soy Sauce", "Coconut Sugar", "Garlic", "Ginger", "Spices"],
    allergens: ["Soy", "May contain traces of nuts"],
    storageInstructions: "Keep refrigerated. Use by date on package.",
    cookingInstructions: "Pan-fry for 3-4 minutes each side or microwave for 2 minutes.",
    tags: ["Ready-to-Cook", "Pre-Seasoned", "Quick Meal", "Vegan", "Indonesian Spices"],
    inStock: true,
    stockQuantity: 180,
    shippingWeight: 0.4,
    dimensions: { length: 18, width: 12, height: 2 },
    relatedProducts: [1, 2, 6],
  },
  {
    id: 4,
    name: "Premium Artisan Tempeh",
    slug: "premium-artisan-tempeh",
    price: 75,
    originalPrice: null,
    weight: "400g",
    image: null,
    category: "Premium",
    rating: 4.9,
    reviewCount: 67,
    isNew: true,
    isOnSale: false,
    discount: 0,
    description: "Hand-crafted premium tempeh made with heirloom soybeans and traditional fermentation techniques. The finest quality available.",
    longDescription:
      "Our Premium Artisan Tempeh represents the pinnacle of tempeh craftsmanship. Made with rare heirloom soybeans sourced directly from Indonesian farmers, each batch is hand-crafted by master fermenters using techniques refined over centuries. The extended fermentation process creates complex flavors and exceptional nutritional density.",
    variants: ["Heirloom Original", "Black Soybean", "Mixed Grain", "Walnut Infused"],
    weights: [
      { label: "200g Artisan", value: "200g", price: 45, selected: false },
      { label: "400g Premium", value: "400g", price: 75, selected: true },
      { label: "800g Master", value: "800g", price: 135, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 210,
      protein: 21.2,
      carbs: 6.8,
      fat: 12.5,
      fiber: 10.2,
      sodium: 6,
    },
    ingredients: ["Heirloom Organic Soybeans", "Traditional Tempeh Starter", "Mountain Spring Water"],
    allergens: ["Soy", "May contain nuts"],
    storageInstructions: "Keep refrigerated at 2-4°C. Best consumed within 5 days.",
    cookingInstructions: "Gentle cooking recommended to preserve artisan flavors. Steam or lightly sauté.",
    tags: ["Artisan", "Heirloom", "Premium", "Small Batch", "Traditional", "Gourmet"],
    inStock: true,
    stockQuantity: 50,
    shippingWeight: 0.5,
    dimensions: { length: 14, width: 10, height: 3.5 },
    relatedProducts: [5, 1, 6],
  },
  {
    id: 5,
    name: "Organic Certified Tempeh",
    slug: "organic-certified-tempeh",
    price: 85,
    originalPrice: 95,
    weight: "500g",
    image: null,
    category: "Organic",
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    isOnSale: true,
    discount: 11,
    description: "100% organic certified tempeh made from sustainably grown soybeans. No chemicals, no GMOs, pure nutrition.",
    longDescription:
      "Our Organic Certified Tempeh is made exclusively from USDA organic certified soybeans grown without pesticides, herbicides, or synthetic fertilizers. Every step of production is certified organic, from the soybeans to the starter culture, ensuring the purest possible product for health-conscious consumers.",
    variants: ["Pure Organic", "Organic Multigrain", "Organic Herb", "Organic Spiced"],
    weights: [
      { label: "250g Organic", value: "250g", price: 48, selected: false },
      { label: "500g Certified", value: "500g", price: 85, selected: true },
      { label: "1kg Family", value: "1kg", price: 155, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 195,
      protein: 20.1,
      carbs: 7.2,
      fat: 10.9,
      fiber: 9.8,
      sodium: 8,
    },
    ingredients: ["100% Organic Soybeans", "Organic Tempeh Starter Culture", "Filtered Water"],
    allergens: ["Soy"],
    storageInstructions: "Refrigerate immediately. Use within 7 days of opening.",
    cookingInstructions: "Suitable for all cooking methods. Organic flavors shine with simple preparation.",
    tags: ["USDA Organic", "Non-GMO", "Sustainable", "Chemical-Free", "Premium Organic"],
    inStock: true,
    stockQuantity: 120,
    shippingWeight: 0.6,
    dimensions: { length: 15, width: 11, height: 3.2 },
    relatedProducts: [4, 1, 2],
  },
  {
    id: 6,
    name: "Spiced Indonesian Tempeh",
    slug: "spiced-indonesian-tempeh",
    price: 65,
    originalPrice: null,
    weight: "450g",
    image: null,
    category: "Flavored",
    rating: 4.3,
    reviewCount: 92,
    isNew: false,
    isOnSale: false,
    discount: 0,
    description: "Traditional Indonesian tempeh infused with authentic spices. Experience the true taste of Indonesia in every bite.",
    longDescription:
      "Our Spiced Indonesian Tempeh brings you the authentic flavors of Indonesia with a carefully curated blend of traditional spices. Each batch is infused with galangal, lemongrass, candlenuts, and other aromatic Indonesian spices, creating a complex flavor profile that's both familiar and exotic.",
    variants: ["Rendang Spice", "Gado-Gado", "Sambal Oelek", "Bumbu Base"],
    weights: [
      { label: "225g Taste", value: "225g", price: 38, selected: false },
      { label: "450g Traditional", value: "450g", price: 65, selected: true },
      { label: "900g Family", value: "900g", price: 115, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 215,
      protein: 18.5,
      carbs: 10.2,
      fat: 11.8,
      fiber: 8.7,
      sodium: 420,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter", "Galangal", "Lemongrass", "Candlenuts", "Turmeric", "Coriander", "Indonesian Spices"],
    allergens: ["Soy", "Tree Nuts"],
    storageInstructions: "Keep refrigerated. Spices may intensify over time.",
    cookingInstructions: "Best when grilled or pan-fried to release aromatic spices.",
    tags: ["Indonesian Spices", "Traditional Recipe", "Aromatic", "Authentic", "Spiced"],
    inStock: true,
    stockQuantity: 95,
    shippingWeight: 0.55,
    dimensions: { length: 16, width: 10, height: 3.8 },
    relatedProducts: [3, 1, 4],
  },
  {
    id: 7,
    name: "Smoked Tempeh Deluxe",
    slug: "smoked-tempeh-deluxe",
    price: 72,
    originalPrice: 78,
    weight: "400g",
    image: null,
    category: "Flavored",
    rating: 4.6,
    reviewCount: 134,
    isNew: true,
    isOnSale: true,
    discount: 8,
    description: "Naturally smoked tempeh with rich, deep flavors. Perfect for BBQs and grilled dishes.",
    longDescription:
      "Our Smoked Tempeh Deluxe is cold-smoked using traditional Indonesian smoking techniques with aromatic woods. The smoking process imparts a deep, complex flavor while maintaining the tempeh's nutritional integrity. Perfect for adding smoky depth to any dish.",
    variants: ["Oak Smoked", "Cherry Wood", "Hickory", "Indonesian Coconut"],
    weights: [
      { label: "200g Sample", value: "200g", price: 42, selected: false },
      { label: "400g Deluxe", value: "400g", price: 72, selected: true },
      { label: "800g BBQ Pack", value: "800g", price: 128, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 208,
      protein: 19.8,
      carbs: 8.1,
      fat: 11.5,
      fiber: 9.1,
      sodium: 380,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter", "Natural Smoke", "Sea Salt"],
    allergens: ["Soy"],
    storageInstructions: "Refrigerate after opening. Smoky flavor may intensify over time.",
    cookingInstructions: "Excellent grilled, pan-fried, or added to stews and soups.",
    tags: ["Smoked", "BBQ Ready", "Gourmet", "Rich Flavor", "Traditional Smoking"],
    inStock: true,
    stockQuantity: 75,
    shippingWeight: 0.48,
    dimensions: { length: 15, width: 9, height: 4 },
    relatedProducts: [6, 4, 8],
  },
  {
    id: 8,
    name: "Marinated Tempeh Strips",
    slug: "marinated-tempeh-strips",
    price: 52,
    originalPrice: 58,
    weight: "350g",
    image: null,
    category: "Packaged",
    rating: 4.4,
    reviewCount: 178,
    isNew: false,
    isOnSale: true,
    discount: 10,
    description: "Pre-marinated tempeh strips ready for quick cooking. Ideal for stir-fries and salads.",
    longDescription: "These convenient tempeh strips come pre-marinated in our signature blend of soy sauce, rice vinegar, and Asian spices. Cut into perfect strips for easy cooking, they're ideal for busy weeknight meals and meal prep.",
    variants: ["Teriyaki", "Sweet Chili", "Garlic Ginger", "Five Spice"],
    weights: [
      { label: "175g Mini", value: "175g", price: 32, selected: false },
      { label: "350g Standard", value: "350g", price: 52, selected: true },
      { label: "700g Value", value: "700g", price: 92, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 198,
      protein: 18.2,
      carbs: 9.8,
      fat: 10.5,
      fiber: 8.4,
      sodium: 450,
    },
    ingredients: ["Organic Soybeans", "Soy Sauce", "Rice Vinegar", "Sesame Oil", "Garlic", "Ginger", "Spices"],
    allergens: ["Soy", "Sesame"],
    storageInstructions: "Keep refrigerated. Use within 5 days of opening.",
    cookingInstructions: "Pan-fry for 2-3 minutes or add directly to stir-fries.",
    tags: ["Pre-Cut", "Marinated", "Quick Cook", "Meal Prep", "Asian Flavors"],
    inStock: true,
    stockQuantity: 140,
    shippingWeight: 0.42,
    dimensions: { length: 17, width: 11, height: 2.5 },
    relatedProducts: [3, 9, 6],
  },
  {
    id: 9,
    name: "Tempeh Crumbles",
    slug: "tempeh-crumbles",
    price: 45,
    originalPrice: null,
    weight: "300g",
    image: null,
    category: "Packaged",
    rating: 4.1,
    reviewCount: 87,
    isNew: false,
    isOnSale: false,
    discount: 0,
    description: "Pre-crumbled tempeh perfect for tacos, pasta sauces, and quick meals.",
    longDescription:
      "Our Tempeh Crumbles save you time in the kitchen with pre-crumbled tempeh that's perfect for any recipe calling for ground protein. Versatile and quick-cooking, they absorb flavors beautifully and cook in just minutes.",
    variants: ["Plain", "Seasoned", "Spicy", "Italian Herbs"],
    weights: [
      { label: "150g Trial", value: "150g", price: 28, selected: false },
      { label: "300g Standard", value: "300g", price: 45, selected: true },
      { label: "600g Bulk", value: "600g", price: 82, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 192,
      protein: 19.1,
      carbs: 7.9,
      fat: 10.6,
      fiber: 9.2,
      sodium: 15,
    },
    ingredients: ["Organic Soybeans", "Tempeh Starter Culture", "Water"],
    allergens: ["Soy"],
    storageInstructions: "Refrigerate after opening. Use within 7 days.",
    cookingInstructions: "Sauté for 3-4 minutes until golden. Perfect for tacos, pasta, and more.",
    tags: ["Pre-Crumbled", "Versatile", "Quick Cook", "Ground Alternative", "Time Saver"],
    inStock: true,
    stockQuantity: 110,
    shippingWeight: 0.35,
    dimensions: { length: 14, width: 10, height: 2.8 },
    relatedProducts: [8, 3, 1],
  },
  {
    id: 10,
    name: "Tempeh Burger Patties",
    slug: "tempeh-burger-patties",
    price: 68,
    originalPrice: 75,
    weight: "480g",
    image: null,
    category: "Packaged",
    rating: 4.7,
    reviewCount: 245,
    isNew: true,
    isOnSale: true,
    discount: 9,
    description: "Ready-to-cook tempeh burger patties. Perfect for BBQs and quick dinners.",
    longDescription:
      "Our Tempeh Burger Patties are specially formulated to provide the perfect burger experience. Each patty is made from premium tempeh blended with vegetables and spices, then formed into the ideal burger shape. They hold together beautifully when cooked and deliver satisfying flavor and texture.",
    variants: ["Classic", "BBQ", "Spicy Jalapeño", "Mushroom Swiss"],
    weights: [
      { label: "240g (2 patties)", value: "240g", price: 38, selected: false },
      { label: "480g (4 patties)", value: "480g", price: 68, selected: true },
      { label: "960g (8 patties)", value: "960g", price: 125, selected: false, disabled: false },
    ],
    nutritionPer100g: {
      calories: 220,
      protein: 17.8,
      carbs: 12.5,
      fat: 12.2,
      fiber: 7.8,
      sodium: 520,
    },
    ingredients: ["Tempeh", "Onions", "Breadcrumbs", "Carrots", "Celery", "Garlic", "Herbs", "Spices"],
    allergens: ["Soy", "Gluten", "May contain eggs"],
    storageInstructions: "Keep frozen until ready to cook. Can be refrigerated for up to 3 days once thawed.",
    cookingInstructions: "Grill, pan-fry, or bake for 4-5 minutes each side until heated through.",
    tags: ["Burger Patties", "BBQ Ready", "Formed", "Quick Meal", "Family Favorite"],
    inStock: true,
    stockQuantity: 85,
    shippingWeight: 0.55,
    dimensions: { length: 18, width: 13, height: 3 },
    relatedProducts: [7, 8, 3],
  },
];

export const categories = [
  { value: "all", label: "All Categories", count: products.length },
  { value: "Fresh", label: "Fresh Tempeh", count: products.filter((p) => p.category === "Fresh").length },
  { value: "Frozen", label: "Frozen Tempeh", count: products.filter((p) => p.category === "Frozen").length },
  { value: "Packaged", label: "Packaged Tempeh", count: products.filter((p) => p.category === "Packaged").length },
  { value: "Premium", label: "Premium Tempeh", count: products.filter((p) => p.category === "Premium").length },
  { value: "Organic", label: "Organic Tempeh", count: products.filter((p) => p.category === "Organic").length },
  { value: "Flavored", label: "Flavored Tempeh", count: products.filter((p) => p.category === "Flavored").length },
];

// Helper functions
export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id));
};

export const getProductBySlug = (slug) => {
  return products.find((product) => product.slug === slug);
};

export const getRelatedProducts = (productId, limit = 4) => {
  const product = getProductById(productId);
  if (!product || !product.relatedProducts) return [];

  return product.relatedProducts
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, limit);
};

export const getProductsByCategory = (category) => {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const searchProducts = (query, category = "all", sortBy = "name") => {
  let filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase()) || product.description.toLowerCase().includes(query.toLowerCase()) || product.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew - a.isNew;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filtered;
};

export const filterProductsByPrice = (minPrice, maxPrice) => {
  return products.filter((product) => product.price >= minPrice && product.price <= maxPrice);
};

export const getNewProducts = (limit = 6) => {
  return products.filter((product) => product.isNew).slice(0, limit);
};

export const getSaleProducts = (limit = 6) => {
  return products.filter((product) => product.isOnSale).slice(0, limit);
};

export const getFeaturedProducts = (limit = 8) => {
  return products
    .filter((product) => product.rating >= 4.5 || product.isNew)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Product availability checker
export const isProductAvailable = (productId, quantity = 1) => {
  const product = getProductById(productId);
  return product && product.inStock && product.stockQuantity >= quantity;
};

// Price calculator with variants
export const calculatePrice = (productId, weight, quantity = 1) => {
  const product = getProductById(productId);
  if (!product) return 0;

  const weightOption = product.weights.find((w) => w.value === weight);
  const basePrice = weightOption ? weightOption.price : product.price;

  return basePrice * quantity;
};

export default {
  products,
  categories,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  getProductsByCategory,
  searchProducts,
  filterProductsByPrice,
  getNewProducts,
  getSaleProducts,
  getFeaturedProducts,
  isProductAvailable,
  calculatePrice,
};
