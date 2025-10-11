---
sidebar_position: 5
title: Core Bridge API
---

# Core Bridge API
**Reference:** Foundational functions available in the base Bridge implementation.

## What It Provides

The Core Bridge is the base class that all ecosystem-specific bridges extend. It provides essential commerce operations without any tenant-specific integrations.

**Philosophy:** The core provides **patterns and infrastructure**, not integrations. You extend it to add your external systems and business logic.

## Function Categories

### Engagement Management

Lifecycle operations for commerce conversations.

| Operation | Purpose |
|-----------|---------|
| `createEngagement` | Create new engagement |
| `getEngagement` | Retrieve engagement |
| `updateEngagement` | Update engagement state |
| `finalizeEngagement` | Finalize and close |
| `getEngagementHistory` | Get history/audit trail |

**Example usage:**

```ts
const engagement = await bridge.createEngagement({
  customerId: 'customer-123',
  type: 'order'
})

await bridge.updateEngagement(engagement.id, {
  status: 'processing'
})
```

---

### Pricing Operations

Price calculation with multi-stage modifiers.

| Operation | Purpose |
|-----------|---------|
| `calculatePrice` | Calculate final price |
| `applyPriceModifiers` | Apply modifier chain |
| `getCustomerPricing` | Get customer-specific pricing |
| `getPriceSnapshot` | Get historical price |

**Example usage:**

```ts
const pricing = await bridge.calculatePrice({
  productId: 'product-456',
  quantity: 100,
  customerId: 'customer-123',
  deliveryZone: 'midwest'
})

console.log(pricing.finalPrice) // After all modifiers
console.log(pricing.modifiers)  // Breakdown of adjustments
```

---

### Fulfillment Operations

Inventory and delivery management.

| Operation | Purpose |
|-----------|---------|
| `allocateInventory` | Allocate inventory |
| `checkAvailability` | Check availability |
| `optimizeFulfillment` | Optimize allocation |
| `releaseInventory` | Release reservation |
| `getWarehousesByZone` | Get warehouses by zone |

**Example usage:**

```ts
const allocation = await bridge.allocateInventory(
  'engagement-123',
  lineItems
)

if (!allocation.success) {
  // Handle insufficient inventory
}
```

---

### Cache Operations

Distributed caching for performance.

| Operation | Purpose |
|-----------|---------|
| `cacheData` | Store in cache |
| `getFromCache` | Retrieve from cache |
| `invalidateCache` | Invalidate single key |
| `invalidateCachePattern` | Invalidate by pattern |
| `warmCache` | Pre-warm cache |

**Example usage:**

```ts
// Cache engagement
await bridge.cacheData(
  `engagement:${id}`,
  engagement,
  3600 // 1 hour TTL
)

// Invalidate on update
await bridge.invalidateCache(`engagement:${id}`)
```

---

### Queue Operations

Message queue for worker coordination.

| Operation | Purpose |
|-----------|---------|
| `publishTask` | Publish job card |
| `fetchJobsFromQueue` | Fetch jobs (used by workers) |
| `acknowledgeJob` | Acknowledge job completion |
| `publishHeartbeat` | Publish heartbeat |

**Example usage:**

```ts
await bridge.publishTask('order-processing', {
  id: generateId(),
  task: 'process-order',
  payload: { orderId: 'order-123' },
  priority: 5,
  tenantId: 'tenant-alpha'
})
```

---

### Product Operations

Product catalog queries.

| Operation | Purpose |
|-----------|---------|
| `getProduct` | Get product by ID |
| `getProductBySku` | Get product by SKU |
| `searchProducts` | Search products |
| `getProductsByCategory` | Get by category |

**Example usage:**

```ts
// Get product details
const product = await bridge.getProduct('product-456')

// Search with filters
const results = await bridge.searchProducts({
  query: 'steel pipe',
  category: 'plumbing',
  zone: 'midwest',
  limit: 20
})
```

---

### Customer Operations

Customer data management.

| Operation | Purpose |
|-----------|---------|
| `getCustomer` | Get customer details |
| `getCustomerPricingRules` | Get customer pricing rules |
| `getCustomerAddresses` | Get delivery addresses |
| `getCustomerHistory` | Get order history |

**Example usage:**

```ts
// Get customer with pricing
const customer = await bridge.getCustomer('customer-123')
const pricingRules = await bridge.getCustomerPricingRules('customer-123')

// Get delivery addresses
const addresses = await bridge.getCustomerAddresses('customer-123')

// Get order history
const history = await bridge.getCustomerHistory('customer-123', {
  limit: 10,
  startDate: '2025-01-01'
})
```

---

### Tenant Operations

Multi-tenant configuration.

| Operation | Purpose |
|-----------|---------|
| `getTenantConfig` | Get tenant configuration |
| `checkTenantFeature` | Check feature flag |
| `getTenantSettings` | Get tenant settings |

**Example usage:**

```ts
// Get tenant configuration
const config = await bridge.getTenantConfig('tenant-alpha')

// Check feature availability
const hasAdvancedPricing = await bridge.checkTenantFeature(
  'tenant-alpha',
  'advanced-pricing'
)

// Get specific settings
const settings = await bridge.getTenantSettings('tenant-alpha')
console.log(settings.defaultCurrency) // 'USD'
console.log(settings.timezone)        // 'America/Chicago'
```

---

## Example: Complete Flow

```ts
import { BaseBridge } from '@commercebridge/core'

const bridge = new BaseBridge(config)

// 1. Create engagement
const engagement = await bridge.createEngagement({
  customerId: 'customer-123',
  type: 'order',
  lineItems: [
    { productId: 'product-456', quantity: 100, uom: 'each' }
  ]
})

// 2. Calculate pricing
const pricing = await bridge.calculatePrice({
  productId: 'product-456',
  quantity: 100,
  customerId: 'customer-123'
})

// 3. Check availability
const availability = await bridge.checkAvailability({
  productId: 'product-456',
  quantity: 100,
  deliveryZone: 'midwest'
})

// 4. Allocate inventory
const allocation = await bridge.allocateInventory(
  engagement.id,
  engagement.lineItems
)

// 5. Update engagement
await bridge.updateEngagement(engagement.id, {
  status: 'processing',
  pricing,
  allocation
})

// 6. Publish async task
await bridge.publishTask('order-confirmation', {
  id: generateId(),
  task: 'confirm-order',
  payload: { engagementId: engagement.id },
  tenantId: engagement.tenantId
})
```

## Extension Pattern

Extend the base Bridge to add your functionality:

```ts
import { BaseBridge } from '@commercebridge/core'

export class MyBridge extends BaseBridge {
  // All core functions inherited automatically
  
  // Add your custom functions
  async syncToErp(order: Order) {
    // Your ERP integration
  }
  
  async sendNotification(customerId: string, template: string) {
    // Your messaging integration
  }
  
  async processPayment(amount: number, method: string) {
    // Your payment integration
  }
}
```

## Configuration

```ts
interface BridgeConfig {
  // Data store connection
  dataStore: {
    uri: string
    database: string
  }
  
  // Cache connection
  cache: {
    host: string
    port: number
  }
  
  // Queue connection
  queue: {
    url: string
  }
  
  // Search engine
  search: {
    url: string
  }
  
  // Tenant context
  tenantId: string
  
  // Custom config (for your extensions)
  custom?: Record<string, unknown>
}
```

## IP Safety

This documentation describes:
- **Public:** Function signatures, interfaces, usage patterns
- **Private (not shown):** Implementation details, database queries, cache structures, queue topics

---

**Core Bridge: The foundation you extend.**
