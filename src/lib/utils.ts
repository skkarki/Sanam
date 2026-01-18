import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice).replace('NPR', 'Rs.');
}

// Simple Dynamic Pricing Algorithm
export function calculateDynamicPrice(
  basePrice: number,
  demandFactor: number = 1,
  timeFactor: number = 1,
  inventoryLevel: number = 100,
  competitorPrices?: number[]
): number {
  let finalPrice = basePrice;
  
  // Apply demand factor (higher demand = higher price)
  finalPrice *= demandFactor;
  
  // Apply time-based factor (could be for flash sales, seasonal adjustments)
  finalPrice *= timeFactor;
  
  // Apply inventory factor (low inventory = higher price, high inventory = lower price)
  if (inventoryLevel < 10) {
    // Very low inventory - increase price
    finalPrice *= 1.2;
  } else if (inventoryLevel < 50) {
    // Low inventory - slight increase
    finalPrice *= 1.05;
  } else if (inventoryLevel > 200) {
    // High inventory - decrease price
    finalPrice *= 0.95;
  }
  
  // Apply competitor pricing adjustment if provided
  if (competitorPrices && competitorPrices.length > 0) {
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const priceRatio = basePrice / avgCompetitorPrice;
    
    // If our price is significantly higher than competitors, reduce it
    if (priceRatio > 1.2) {
      finalPrice *= 0.95; // Reduce by 5%
    } 
    // If our price is significantly lower than competitors, we could increase it
    else if (priceRatio < 0.8) {
      finalPrice *= 1.05; // Increase by 5%
    }
  }
  
  return Number(finalPrice.toFixed(2));
}

// Simple Recommendation Algorithm
export function simpleRecommendationAlgorithm(
  userId: string,
  currentProductId: string,
  userPurchaseHistory: string[],
  userViewHistory: string[],
  productCatalog: Array<{
    id: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    tags: string[];
  }>,
  limit: number = 4
): string[] {
  // Initialize scores for each product
  const productScores: { [key: string]: number } = {};
  
  // Get the current product details
  const currentProduct = productCatalog.find(p => p.id === currentProductId);
  if (!currentProduct) return [];
  
  // Score each product based on various factors
  productCatalog.forEach(product => {
    // Skip the current product
    if (product.id === currentProductId) return;
    
    let score = 0;
    
    // Factor 1: Same category (high score)
    if (product.category === currentProduct.category) {
      score += 30;
    }
    
    // Factor 2: Same brand (medium score)
    if (product.brand === currentProduct.brand) {
      score += 20;
    }
    
    // Factor 3: Similar price range (low-medium score)
    const priceDiff = Math.abs(product.price - currentProduct.price);
    const maxPrice = Math.max(product.price, currentProduct.price);
    if (maxPrice > 0) {
      const priceSimilarity = 1 - (priceDiff / maxPrice);
      score += priceSimilarity * 15;
    }
    
    // Factor 4: Shared tags (low score)
    const sharedTags = product.tags.filter(tag => currentProduct.tags.includes(tag));
    score += sharedTags.length * 5;
    
    // Factor 5: User's purchase history (high score)
    if (userPurchaseHistory.includes(product.id)) {
      score += 40;
    }
    
    // Factor 6: User's view history (medium score)
    if (userViewHistory.includes(product.id)) {
      score += 25;
    }
    
    // Factor 7: Other items bought by users who bought current product (collaborative)
    // This would typically come from a database of co-purchased items
    // For simplicity, we'll add a small boost if it's in the same general price range
    if (Math.abs(product.price - currentProduct.price) < currentProduct.price * 0.5) {
      score += 10;
    }
    
    productScores[product.id] = score;
  });
  
  // Sort products by score and return top N
  return Object.entries(productScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => productId);
}
