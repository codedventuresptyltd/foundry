---
slug: linked-data-migration
title: Product Linked Data - Eliminating Duplication in Engagements
authors: [codedventures]
tags: [engagement, data-model, migration, optimization]
---

# Product Linked Data - Eliminating Duplication in Engagements

We're migrating product data from inline duplication in every line item to a linked data model where products are stored once and referenced. This is about efficiency, consistency, and future flexibility.

<!-- truncate -->

## The Problem

Right now, when you add a product to an engagement, we copy the entire product record into `lineItem.good`:

```typescript
const lineItem = {
  good: {
    id: "product_123",
    title: "Timber 90x45 2.4m",
    unit_price: 25.50,
    specifications: {...},
    uomConfiguration: {...}  // ← Duplicated for every line item
  }
};
```

Order 100 units of the same product across 5 line items? That's **5 copies** of the same product data.

**The issues:**
- Duplication increases engagement size
- Updates require changing multiple places
- Memory usage scales with line item count
- Cache efficiency suffers from redundant data

## The Solution

Store products once in `engagement.linked_data`, reference from line items:

```typescript
const engagement = {
  lineItems: [
    {
      good: {
        id: "product_123",        // ← Reference only
        productId: "product_123"  // ← Reference only
      }
    }
  ],
  linked_data: [
    {
      id: "product_123",
      type: "product",
      data: {
        // Full product data stored once
        title: "Timber 90x45 2.4m",
        unit_price: 25.50,
        specifications: {...},
        uomConfiguration: {...}
      }
    }
  ]
};
```

**Benefits:**
- Single source of truth per product
- Smaller engagement payloads
- Update once, affects all line items
- Better cache utilization

## Linked Data as a Pattern

This isn't just about products. `linked_data` is becoming our **universal reference store**:

- Products (now)
- Locations (future)
- Orders (future)
- Pricing snapshots (future)
- Fulfillment plans (future)

**The principle:** Store heavy, reusable data once. Reference it from where it's needed.

## Migration Strategy

We're not flipping a switch. This is a gradual, backward-compatible migration:

### Phase 1: Dual Storage

During migration, store data in **both places**:

```typescript
// Keep existing structure
lineItem.good.title = "Timber 90x45 2.4m";

// Also add to linked_data
engagement.linked_data.push({
  id: "product_123",
  type: "product",
  data: fullProduct
});
```

This ensures **zero breaking changes** while we migrate.

### Phase 2: Feature Flags

Control the rollout with flags:

```typescript
if (FEATURE_FLAGS.USE_LINKED_DATA_PRODUCTS) {
  return engagement.getLinkedProduct(productId);
} else {
  return lineItem.good; // Fallback
}
```

**Test in production** with a small percentage of traffic. Validate behavior, measure performance, iterate.

### Phase 3: Full Migration

Once validated, remove duplicate data:

```typescript
const lineItem = {
  good: {
    id: "product_123",        // ← Reference only
    productId: "product_123"  // ← Reference only
    // No more: title, unit_price, uomConfiguration
  }
};
```

Update all access points to fetch from `linked_data`. Remove feature flags. Clean up.

## Implementation Details

### EngagementModel Methods

We're adding linked data methods to the engagement model:

```typescript
class EngagementModel {
  getLinkedProduct(productId: string): ProductModel | null
  addLinkedProduct(product: ProductModel): void
  removeLinkedProduct(productId: string): void
  updateLinkedProduct(productId: string, updates: Partial<ProductModel>): void
}
```

**Encapsulation matters** — the model knows how to manage its own linked data.

### ProductService

A new service handles product operations:

```typescript
class ProductService {
  async getProductWithUom(productId: string): Promise<ProductModel>
  addProductToEngagement(engagement: EngagementModel, product: ProductModel): void
  getProductFromEngagement(engagement: EngagementModel, productId: string): ProductModel | null
}
```

**Single responsibility** — one service, one concern: products.

### Bridge Integration

The Bridge gets new product methods:

```typescript
bridge.product_getProductWithUom(productId)
bridge.engagement_getEngagementWithProducts(engagementId)
```

This follows our **everything through the Bridge** pattern.

## Touchpoint Updates

The UI needs to adapt:

**Before:**
```typescript
// Full product data embedded in line item
const lineItem = {
  good: fullProduct
};
```

**After:**
```typescript
// Add product to linked_data
productService.addProductToEngagement(engagement, fullProduct);

// Line item just references it
const lineItem = {
  good: {
    id: product.id,
    productId: product.id
  }
};
```

The change is **transparent to users** — same functionality, different data structure.

## Worker Updates

Workers need to ensure products are in `linked_data`:

```typescript
async ensureProductsInLinkedData(engagement: EngagementModel) {
  const productIds = engagement.lineItems.map(li => li.good.id);
  
  for (const productId of productIds) {
    if (!engagement.getLinkedProduct(productId)) {
      const product = await bridge.product_getProductWithUom(productId);
      engagement.addLinkedProduct(product);
    }
  }
}
```

**Defensive programming** — assume data might be incomplete, ensure consistency.

## Performance Impact

Early testing shows:

**Engagement Size:**
- Before: ~250KB for 20-item order
- After: ~180KB for same order
- **28% reduction**

**Memory Usage:**
- Before: Multiple product copies in memory
- After: Single copy, multiple references
- **Scales better with line item count**

**Cache Efficiency:**
- Before: Cache entire engagement
- After: Cache products separately
- **Better hit rates, more granular invalidation**

## The Risks

### 1. Additional Lookups

Accessing product data requires a lookup:

```typescript
// Before: Direct access
const title = lineItem.good.title;

// After: Lookup required
const title = engagement.getLinkedProduct(lineItem.good.id)?.title;
```

**Mitigation:** Cache lookups, batch operations, optimize access patterns.

### 2. Migration Complexity

Dual storage adds complexity during migration.

**Mitigation:** Comprehensive testing, feature flags, gradual rollout, clear rollback plan.

### 3. Breaking Changes

Existing code expects `lineItem.good.title` to exist.

**Mitigation:** Backward compatibility period, update all access points, maintain sync during migration.

## What We're Learning

### 1. Normalize Early

Data duplication is technical debt. We're paying it now, but we're learning: **normalize from the start**.

### 2. Feature Flags Enable Confidence

Gradual rollout with flags means we can **test in production** safely. This is how you ship risky changes with confidence.

### 3. Encapsulation Matters

Adding methods like `getLinkedProduct()` to the model means **access patterns are consistent**. No ad-hoc queries, no scattered logic.

### 4. Migration Over Rewrite

We could have rebuilt the engagement model. Instead, we're **evolving it in place**. Less risk, continuous delivery.

## What's Next

### Phase 1: Infrastructure (Current)
- ✅ Update EngagementModel with linked data methods
- ✅ Create ProductService
- ✅ Add Bridge methods
- 🔄 Add feature flags

### Phase 2: UI Updates (Next Week)
- Update product search components
- Update trade ordering service
- Add data synchronization

### Phase 3: Worker Updates (Following Week)
- Update engagement recalculation worker
- Update order processing workers
- Add validation

### Phase 4: Full Migration (Next Month)
- Remove duplicate data
- Remove feature flags
- Update documentation
- Monitor performance

## The Pattern

**Start with references, not copies. Store centrally, access locally.**

This pattern applies beyond products:

- User data referenced from multiple contexts
- Configuration data linked from many places
- Catalog data shared across engagements

**Linked data is how you scale** without drowning in duplication.

## Why It Matters

This might seem like an internal optimization, but it has real impacts:

- **Faster load times** from smaller payloads
- **Lower bandwidth costs** from reduced data transfer
- **Better user experience** from snappier interfaces
- **Easier debugging** from single source of truth

**Performance isn't just about algorithms. It's about data structure.**

---

**Building systems that scale through structure, not brute force.**


