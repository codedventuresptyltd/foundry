---
sidebar_position: 7
title: Pricing Engine
---

# Pricing Engine

**Sophisticated Multi-Stage Price Calculation**

The Pricing Engine is a core component of CommerceBridge that handles complex, multi-stage price calculations with support for volume breaks, customer-specific pricing, delivery zones, and custom modifiers.

---

## What It Does

The Pricing Engine calculates final prices by:

1. **Starting with base price** — Product-level base price
2. **Applying volume breaks** — Quantity-based discounts
3. **Applying customer pricing** — Customer-specific rates and rules
4. **Applying delivery zone adjustments** — Location-based pricing
5. **Applying custom modifiers** — Tenant-specific pricing logic
6. **Caching results** — Performance optimization

All stages are transparent and auditable.

---

## Key Features

### Multi-Stage Price Modifiers

Prices flow through a modifier chain:

```
Base Price
  ↓
Volume Break Modifier (if applicable)
  ↓
Customer Discount Modifier (if applicable)
  ↓
Delivery Zone Modifier (if applicable)
  ↓
Custom Modifiers (tenant-specific)
  ↓
Final Price
```

Each modifier:
- Has a **type** (what it is)
- Has a **value** (the adjustment amount)
- Has an **operation** (multiply, add, subtract)
- Has a **reason** (why it's applied)
- Has a **priority** (order of application)

### Delivery Zone-Based Pricing

Prices adjust based on delivery location:

- Remote areas may have upcharges
- Urban zones may have different pricing
- Cross-border deliveries may have adjustments
- Zone-specific logistics costs included

### Quantity Breaks and Volume Discounts

Automatic tier-based pricing:

- Buy 1-9: $10 each
- Buy 10-49: $9 each (10% discount)
- Buy 50-99: $8.50 each (15% discount)
- Buy 100+: $8 each (20% discount)

### Customer-Specific Pricing Rules

Individual customers can have:

- Custom price lists
- Contract pricing
- Negotiated rates
- Account-level discounts
- Payment term discounts

### Real-Time Calculation and Caching

Prices are:

- Calculated on-demand when needed
- Cached for performance
- Invalidated when underlying data changes
- Recalculated when cache expires

---

## How It Works

### Basic Price Calculation

**Input:**
- Product ID
- Quantity
- Customer ID
- Delivery zone
- Unit of measure

**Process:**
1. Retrieve base price from product
2. Check for volume breaks based on quantity
3. Check for customer-specific pricing
4. Check for delivery zone modifiers
5. Apply modifiers in priority order
6. Cache result

**Output:**
- Base price
- List of modifiers applied
- Final price
- Currency
- Cache key

### Price Modifier Application

Modifiers are applied sequentially:

**Multiply modifiers:**
- Volume discount: base * 0.85 (15% off)
- Result: $100 * 0.85 = $85

**Add/Subtract modifiers:**
- Delivery zone upcharge: +$5
- Result: $85 + $5 = $90

**Chain multiple modifiers:**
- Base: $100
- Volume discount (15%): $100 * 0.85 = $85
- Customer discount (5%): $85 * 0.95 = $80.75
- Zone upcharge (+$5): $80.75 + $5 = $85.75
- Final: $85.75

---

## Caching Strategy

### What Gets Cached

- Base product prices
- Customer-specific prices
- Calculated final prices
- Volume break thresholds
- Zone modifiers

### Cache Keys

Prices are cached with composite keys:

**Format:** `price:{tenantId}:{productId}:{customerId}:{quantity}:{zone}:{uom}`

**Example:** `price:acme:prod-123:cust-456:100:US-MIDWEST:case`

### Cache Invalidation

Caches are invalidated when:

- Product base price changes
- Customer pricing rules change
- Volume break tiers change
- Delivery zone modifiers change
- Tenant pricing config changes

### Cache TTL

Different cache durations:

- **Base prices:** 1 hour (rarely change)
- **Customer prices:** 30 minutes (can change)
- **Calculated prices:** 15 minutes (most volatile)
- **Zone modifiers:** 1 hour (stable)

---

## Multi-Tenant Pricing

Each tenant can have completely different pricing logic:

### Tenant A (Simple)
- Base price + volume breaks
- No zone modifiers
- No customer-specific pricing

### Tenant B (Complex)
- Base price + volume breaks
- Customer contract pricing
- Delivery zone modifiers
- Payment term discounts
- Promotional pricing
- Custom business rules

The pricing engine adapts to each tenant's requirements.

---

## Price Snapshots

Historical pricing is preserved:

- **Why:** Audit trail, price change analysis
- **What:** Base price, modifiers, final price at time of calculation
- **When:** Snapshot taken when price is locked (order confirmed)
- **Where:** Stored in MongoDB for historical reference

This ensures you can always see what price was quoted and why.

---

## Integration Points

### From Touchpoint UI

User adds item to cart:
1. UI calls pricing endpoint
2. Pricing engine calculates in real-time
3. Result displayed to user
4. Cached for subsequent views

### From Workers

Order processor needs pricing:
1. Worker calls bridge pricing function
2. Pricing engine calculates
3. Result returned and cached
4. Used in engagement

### From Experience Layer

API endpoint requests price:
1. API calls bridge pricing function
2. Pricing engine calculates
3. Result returned with modifier breakdown
4. Client displays pricing details

---

## Transparency

All pricing calculations are transparent:

**Input visible:**
- Base price shown
- Each modifier listed with reason
- Final price clearly calculated

**Breakdown available:**
- Step-by-step calculation
- Each modifier's impact
- Before and after each stage

**Auditable:**
- All calculations logged
- Historical snapshots preserved
- Price changes tracked

---

## Performance Optimization

### Strategies

1. **Aggressive caching** — Cache calculated prices
2. **Batch calculations** — Calculate multiple items together
3. **Pre-warming** — Cache common price requests
4. **Incremental updates** — Only recalculate what changed
5. **Background jobs** — Pre-calculate likely requests

### Metrics

The pricing engine tracks:

- Cache hit rate (target: over 90%)
- Average calculation time (target: under 50ms)
- Cache invalidation frequency
- Most expensive calculations

---

**Pricing Engine: Sophisticated, fast, and transparent.**

