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

```ts
// Create new engagement
createEngagement(params: EngagementParams): Promise<Engagement>

// Retrieve engagement
getEngagement(id: string): Promise<Engagement>

// Update engagement state
updateEngagement(id: string, updates: Partial<Engagement>): Promise<Engagement>

// Finalize and close
finalizeEngagement(id: string): Promise<void>

// Get history/audit trail
getEngagementHistory(id: string): Promise<EngagementEvent[]>
```

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

```ts
// Calculate final price
calculatePrice(context: PricingContext): Promise<PricingResult>

// Apply modifier chain
applyPriceModifiers(base: number, modifiers: Modifier[]): Promise<number>

// Get customer-specific pricing
getCustomerPricing(customerId: string, productId: string): Promise<CustomerPrice>

// Get historical price
getPriceSnapshot(productId: string, date: Date): Promise<PriceSnapshot>
```

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

```ts
// Allocate inventory
allocateInventory(engagementId: string, items: LineItem[]): Promise<AllocationResult>

// Check availability
checkAvailability(query: AvailabilityQuery): Promise<AvailabilityResult>

// Optimize allocation
optimizeFulfillment(engagementId: string): Promise<FulfillmentPlan>

// Release reservation
releaseInventory(reservationId: string): Promise<void>

// Get warehouses by zone
getWarehousesByZone(zone: string): Promise<Warehouse[]>
```

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

```ts
// Store in cache
cacheData(key: string, value: unknown, ttl?: number): Promise<void>

// Retrieve from cache
getFromCache(key: string): Promise<unknown>

// Invalidate single key
invalidateCache(key: string): Promise<void>

// Invalidate by pattern
invalidateCachePattern(pattern: string): Promise<number>

// Pre-warm cache
warmCache(keys: string[]): Promise<void>
```

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

```ts
// Publish job card
publishTask(queue: string, job: JobCard): Promise<void>

// Fetch jobs (used by workers)
fetchJobsFromQueue(queue: string, batchSize: number): Promise<JobCard[]>

// Acknowledge job completion
acknowledgeJob(jobId: string): Promise<void>

// Publish heartbeat
publishHeartbeat(worker: WorkerStatus): Promise<void>
```

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

```ts
// Get product by ID
getProduct(id: string): Promise<Product>

// Get product by SKU
getProductBySku(sku: string): Promise<Product>

// Search products
searchProducts(query: SearchQuery): Promise<SearchResult>

// Get by category
getProductsByCategory(category: string): Promise<Product[]>
```

---

### Customer Operations

Customer data management.

```ts
// Get customer details
getCustomer(id: string): Promise<Customer>

// Get customer pricing rules
getCustomerPricingRules(customerId: string): Promise<PricingRule[]>

// Get delivery addresses
getCustomerAddresses(customerId: string): Promise<Address[]>

// Get order history
getCustomerHistory(customerId: string): Promise<Order[]>
```

---

### Tenant Operations

Multi-tenant configuration.

```ts
// Get tenant configuration
getTenantConfig(tenantId: string): Promise<TenantConfig>

// Check feature flag
checkTenantFeature(tenantId: string, feature: string): Promise<boolean>

// Get tenant settings
getTenantSettings(tenantId: string): Promise<Settings>
```

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
