# Algorithm Documentation for Sanam International E-commerce Platform

## Table of Contents
1. [Introduction](#introduction)
2. [Simple Dynamic Pricing Algorithm](#simple-dynamic-pricing-algorithm)
3. [Simple Recommendation Algorithm](#simple-recommendation-algorithm)

## Introduction
This document describes the algorithms implemented in the Sanam International e-commerce platform. The system incorporates two primary algorithms: a Simple Dynamic Pricing Algorithm for adjusting product prices based on market conditions and a Simple Recommendation Algorithm for suggesting relevant products to users.

## Simple Dynamic Pricing Algorithm

The Simple Dynamic Pricing Algorithm adjusts product prices based on multiple factors including demand, inventory levels, time-based trends, and competitor pricing. This algorithm enables the platform to respond dynamically to market conditions and optimize revenue.

### Steps for Simple Dynamic Pricing Algorithm

**Step 1: Input**
- Retrieve the base price of the product (from database)
- Obtain external factors:
  - `demandFactor`: A multiplier based on current demand for the product (default: 1.0)
  - `timeFactor`: A multiplier based on time-based trends (seasonality, promotions) (default: 1.0)
  - `inventoryLevel`: Current inventory count for the product (default: 100)
  - `competitorPrices`: Array of competitor prices for similar products (optional)

**Step 2: Initialize**
- Start with the base price of the product
- Set the initial `finalPrice` equal to the base price

**Step 3: Apply Demand Factor**
- Multiply `finalPrice` by `demandFactor`
- Higher demand increases price, lower demand decreases price

**Step 4: Apply Time-Based Factor**
- Multiply `finalPrice` by `timeFactor`
- Allows for seasonal adjustments, flash sales, or promotional periods

**Step 5: Apply Inventory Level Adjustment**
- Check the inventory level:
  - If inventory level < 10 (very low):
    - Multiply `finalPrice` by 1.2 (increase by 20%)
  - Else if inventory level < 50 (low):
    - Multiply `finalPrice` by 1.05 (increase by 5%)
  - Else if inventory level > 200 (high):
    - Multiply `finalPrice` by 0.95 (decrease by 5%)

**Step 6: Apply Competitor Pricing Adjustment**
- If competitor prices are provided:
  - Calculate average competitor price
  - Compare base price to average competitor price
  - If our price is 20% higher than competitors:
    - Reduce price by 5%
  - If our price is 20% lower than competitors:
    - Increase price by 5%

**Step 7: Round and Return**
- Round the final price to 2 decimal places
- Return the calculated dynamic price

### Example:
Suppose a product has a base price of Rs. 1000, with a high demand factor of 1.3, a time factor of 1.1 (seasonal demand), and low inventory (20 units):

1. Input:
   - Base price: Rs. 1000
   - Demand factor: 1.3
   - Time factor: 1.1
   - Inventory level: 20

2. Initialize:
   - finalPrice = 1000

3. Apply demand factor:
   - finalPrice = 1000 × 1.3 = 1300

4. Apply time factor:
   - finalPrice = 1300 × 1.1 = 1430

5. Apply inventory adjustment:
   - Since inventory level is 20 (< 50), multiply by 1.05
   - finalPrice = 1430 × 1.05 = 1501.5

6. No competitor prices provided, so skip step 6

7. Round and return:
   - Return Rs. 1501.50

## Simple Recommendation Algorithm

The Simple Recommendation Algorithm suggests relevant products to users based on their browsing and purchasing history, as well as product characteristics. The algorithm scores products based on multiple factors to determine relevance to the user.

### Steps for Simple Recommendation Algorithm

**Step 1: Input**
- Retrieve user ID
- Get the current product ID being viewed
- Obtain user's purchase history (array of product IDs)
- Obtain user's view history (array of product IDs)
- Get the product catalog with details (ID, name, category, brand, price, tags)
- Specify the number of recommendations to return (limit, default: 4)

**Step 2: Initialize Scoring System**
- Create a dictionary to store scores for each product
- Get details of the current product being viewed

**Step 3: Score Each Product**
For each product in the catalog (excluding the current product):
- Initialize score to 0

- **Factor 1: Same Category (Weight: 30 points)**
  - If product category matches current product category:
    - Add 30 points to score

- **Factor 2: Same Brand (Weight: 20 points)**
  - If product brand matches current product brand:
    - Add 20 points to score

- **Factor 3: Similar Price Range (Weight: up to 15 points)**
  - Calculate price similarity (1 - |price_diff| / max_price)
  - Add (price_similarity × 15) points to score

- **Factor 4: Shared Tags (Weight: 5 points per tag)**
  - Count shared tags between products
  - Add (shared_tags_count × 5) points to score

- **Factor 5: User Purchase History (Weight: 40 points)**
  - If user purchased this product:
    - Add 40 points to score

- **Factor 6: User View History (Weight: 25 points)**
  - If user viewed this product:
    - Add 25 points to score

- **Factor 7: Price Range Proximity (Weight: 10 points)**
  - If product price is within 50% of current product price:
    - Add 10 points to score

**Step 4: Sort and Select**
- Sort products by score in descending order
- Take the top N products (where N is the specified limit)

**Step 5: Output**
- Return the list of recommended product IDs ordered by relevance

### Example:
Suppose a user is viewing a "Nike Men's Sports T-Shirt" and the algorithm needs to recommend 3 products:

1. Input:
   - UserId: "user123"
   - Current product: Nike Men's Sports T-Shirt (category: "Clothing", brand: "Nike", price: 1200, tags: ["sports", "cotton"])
   - User purchase history: ["prod456", "prod789"]
   - User view history: ["prod321", "prod654"]
   - Limit: 3

2. Initialize:
   - Get current product details
   - Initialize scores dictionary

3. Score products in catalog:
   - Product A: Adidas Men's Sports T-Shirt (same category: +30, sports tag: +5, similar price: +12) = 47 points
   - Product B: Nike Men's Shorts (same brand: +20, sports tag: +5) = 25 points
   - Product C: Puma Men's Sports T-Shirt (same category: +30, sports tag: +5) = 35 points
   - Product D: Nike Women's T-Shirt (same brand: +20) = 20 points

4. Sort and select:
   - Sorted: Product A (47), Product C (35), Product B (25), Product D (20)
   - Top 3: Product A, Product C, Product B

5. Output:
   - Return: ["prodA", "prodC", "prodB"]

### API Endpoints

#### Dynamic Pricing API
- **POST** `/api/pricing/dynamic`
- **GET** `/api/pricing/dynamic`
- Parameters: productId, demandFactor, timeFactor, inventoryLevel, competitorPrices

#### Recommendation API
- **POST** `/api/recommendations/simple`
- **GET** `/api/recommendations/simple`
- Parameters: userId, currentProductId, limit