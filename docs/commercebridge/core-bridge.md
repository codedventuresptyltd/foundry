---
sidebar_position: 4
title: Core Bridge
---

# Core Bridge

**Foundational Functions and Patterns**

The Core Bridge provides the foundational functions that all ecosystem-specific bridges extend. It contains no tenant-specific integrations, only the essential operations for orchestrating commerce.

---

## Design Philosophy

The Core Bridge is intentionally minimal and focused:

- **No external integrations** — Twilio, ERPs, payment gateways, etc. are added by extending
- **Pure orchestration** — State management, queue coordination, and business logic
- **Multi-tenant ready** — Built for isolation and tenant-specific configuration
- **Extensible** — Designed to be inherited and augmented

---

## Core Functions

### Engagement Management

Create and manage the full lifecycle of commerce engagements.

```typescript
// Create a new engagement
const engagement = await bridge.createEngagement({
  customerId: 'customer-123',
  type: 'order',
  tenantId: 'acme-corp'
});

// Retrieve engagement
const engagement = await bridge.getEngagement(engagementId);

// Update engagement state
await bridge.updateEngagement(engagementId, {
  status: 'processing',
  lineItems: updatedItems
});

// Finalize engagement
await bridge.finalizeEngagement(engagementId);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createEngagement()` | `EngagementParams` | `Engagement` | Creates new engagement |
| `getEngagement()` | `engagementId: string` | `Engagement` | Retrieves engagement by ID |
| `updateEngagement()` | `engagementId, updates` | `Engagement` | Updates engagement state |
| `finalizeEngagement()` | `engagementId: string` | `void` | Marks engagement complete |
| `getEngagementHistory()` | `engagementId: string` | `EngagementEvent[]` | Returns audit trail |

---

### Pricing

Calculate prices with sophisticated multi-stage modifiers.

```typescript
// Calculate price with context
const pricing = await bridge.calculatePrice({
  productId: 'prod-123',
  quantity: 100,
  customerId: 'customer-123',
  deliveryZone: 'US-MIDWEST'
});

// Apply price modifiers
const finalPrice = await bridge.applyPriceModifiers(
  basePrice,
  [
    { type: 'volume-discount', value: 0.15 },
    { type: 'zone-upcharge', value: 0.05 }
  ]
);

// Get customer-specific pricing
const customerPrice = await bridge.getCustomerPricing(
  'customer-123',
  'prod-123'
);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `calculatePrice()` | `PricingContext` | `PricingResult` | Calculates final price |
| `applyPriceModifiers()` | `basePrice, modifiers[]` | `number` | Applies modifier chain |
| `getCustomerPricing()` | `customerId, productId` | `CustomerPrice` | Gets customer rates |
| `getPriceHistory()` | `productId, dateRange` | `PriceSnapshot[]` | Historical pricing |
| `cachePrice()` | `key, price, ttl` | `void` | Cache price result |

---

### Fulfillment

Orchestrate inventory allocation and delivery optimization.

```typescript
// Allocate inventory for engagement
const allocation = await bridge.allocateInventory(
  engagementId,
  lineItems
);

// Check availability by zone
const availability = await bridge.checkAvailability({
  productId: 'prod-123',
  quantity: 50,
  deliveryZone: 'US-MIDWEST'
});

// Optimize fulfillment across warehouses
const optimized = await bridge.optimizeFulfillment(engagement);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `allocateInventory()` | `engagementId, lineItems[]` | `AllocationResult` | Reserves inventory |
| `checkAvailability()` | `AvailabilityQuery` | `AvailabilityResult` | Checks stock levels |
| `optimizeFulfillment()` | `engagement` | `FulfillmentPlan` | Multi-warehouse optimization |
| `releaseInventory()` | `allocationId` | `void` | Releases reserved stock |
| `getWarehousesByZone()` | `deliveryZone` | `Warehouse[]` | Zone-filtered warehouses |

---

### State Management

Manage distributed state with Redis caching and MongoDB persistence.

```typescript
// Cache engagement state
await bridge.cacheEngagement(engagement, {
  ttl: 3600 // 1 hour
});

// Retrieve from cache
const cached = await bridge.getFromCache('engagement:123');

// Invalidate cache
await bridge.invalidateCache('engagement:123');

// Batch invalidation
await bridge.invalidateCachePattern('engagement:*');
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `cacheEngagement()` | `engagement, options` | `void` | Cache engagement state |
| `getFromCache()` | `key: string` | `any` | Retrieve cached value |
| `invalidateCache()` | `key: string` | `void` | Remove cache entry |
| `invalidateCachePattern()` | `pattern: string` | `number` | Bulk invalidation |
| `warmCache()` | `keys: string[]` | `void` | Preload cache entries |

---

### Queue Operations

Publish and consume messages for asynchronous worker communication.

```typescript
// Publish message to queue
await bridge.publishToQueue('order-processing', {
  type: 'order.created',
  engagementId: 'eng-123',
  timestamp: Date.now()
});

// Consume from queue
await bridge.consumeFromQueue('order-processing', async (message) => {
  // Process message
  console.log('Processing:', message);
});

// Publish with delay
await bridge.publishToQueue('reminders', message, {
  delay: 3600000 // 1 hour
});
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `publishToQueue()` | `queue, message, options?` | `void` | Send message to queue |
| `consumeFromQueue()` | `queue, handler` | `void` | Subscribe to queue |
| `getQueueStats()` | `queue: string` | `QueueStats` | Queue metrics |
| `purgeQueue()` | `queue: string` | `number` | Clear queue messages |
| `createQueue()` | `name, options` | `Queue` | Initialize new queue |

---

### Product Operations

Query and manage product catalog data.

```typescript
// Get product details
const product = await bridge.getProduct('prod-123');

// Search products
const results = await bridge.searchProducts({
  query: 'steel plate',
  filters: {
    category: 'materials',
    inStock: true
  },
  deliveryZone: 'US-MIDWEST'
});

// Get product by SKU
const product = await bridge.getProductBySku('SKU-ABC-123');
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getProduct()` | `productId: string` | `Product` | Get product by ID |
| `getProductBySku()` | `sku: string` | `Product` | Get product by SKU |
| `searchProducts()` | `SearchQuery` | `SearchResult` | Full-text search |
| `getProductsByCategory()` | `category: string` | `Product[]` | Category filter |

---

### Customer Operations

Manage customer data and relationships.

```typescript
// Get customer details
const customer = await bridge.getCustomer('customer-123');

// Get customer pricing rules
const pricingRules = await bridge.getCustomerPricingRules('customer-123');

// Get delivery addresses
const addresses = await bridge.getCustomerAddresses('customer-123');
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getCustomer()` | `customerId: string` | `Customer` | Get customer details |
| `getCustomerPricingRules()` | `customerId: string` | `PricingRule[]` | Customer pricing |
| `getCustomerAddresses()` | `customerId: string` | `Address[]` | Delivery addresses |
| `getCustomerHistory()` | `customerId: string` | `Order[]` | Order history |

---

### Tenant Operations

Multi-tenant configuration and isolation.

```typescript
// Get tenant configuration
const config = await bridge.getTenantConfig('acme-corp');

// Check tenant feature flags
const hasFeature = await bridge.checkTenantFeature(
  'acme-corp',
  'advanced-pricing'
);

// Get tenant-specific settings
const settings = await bridge.getTenantSettings('acme-corp');
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getTenantConfig()` | `tenantId: string` | `TenantConfig` | Tenant configuration |
| `checkTenantFeature()` | `tenantId, feature` | `boolean` | Feature flag check |
| `getTenantSettings()` | `tenantId: string` | `Settings` | Tenant settings |
| `updateTenantConfig()` | `tenantId, updates` | `TenantConfig` | Update config |

---

## Configuration

The Core Bridge is initialized with configuration:

```typescript
import { BaseBridge } from '@commercebridge/core';

const bridge = new BaseBridge({
  // MongoDB connection
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: 'commercebridge'
  },
  
  // Redis cache
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379
  },
  
  // Queue (RabbitMQ/Kafka)
  queue: {
    type: 'rabbitmq',
    url: process.env.RABBITMQ_URL
  },
  
  // OpenSearch
  search: {
    node: process.env.OPENSEARCH_URL
  },
  
  // Tenant context
  tenantId: 'acme-corp'
});
```

---

## Extension Pattern

Users extend the Core Bridge to add their functionality:

```typescript
import { BaseBridge } from '@commercebridge/core';

export class MyEcosystemBridge extends BaseBridge {
  // All core functions are inherited
  // Add your custom functions:
  
  async syncToErp(order: Order) {
    // Your ERP integration
  }
  
  async sendSms(customerId: string, message: string) {
    // Your messaging integration
  }
}
```

See [Extending CommerceBridge →](/commercebridge/extending) for detailed extension patterns.

---

## Type Definitions

### Common Types

```typescript
interface Engagement {
  id: string;
  tenantId: string;
  customerId: string;
  type: 'quote' | 'order' | 'subscription';
  status: 'draft' | 'active' | 'processing' | 'complete' | 'cancelled';
  lineItems: LineItem[];
  pricing: PricingResult;
  fulfillment?: FulfillmentPlan;
  createdAt: Date;
  updatedAt: Date;
}

interface PricingResult {
  basePrice: number;
  modifiers: PriceModifier[];
  finalPrice: number;
  currency: string;
}

interface AllocationResult {
  success: boolean;
  allocations: {
    warehouseId: string;
    productId: string;
    quantity: number;
  }[];
  reservationId: string;
}
```

---

## Error Handling

The Core Bridge throws typed errors:

```typescript
try {
  await bridge.allocateInventory(engagementId, lineItems);
} catch (error) {
  if (error instanceof InsufficientInventoryError) {
    // Handle out of stock
  } else if (error instanceof InvalidEngagementError) {
    // Handle invalid engagement
  }
}
```

### Error Types

- `InsufficientInventoryError` — Not enough stock
- `InvalidEngagementError` — Engagement doesn't exist or invalid state
- `PricingError` — Price calculation failed
- `CacheError` — Cache operation failed
- `QueueError` — Message queue operation failed

---

**The Core Bridge provides the foundation. You bring the integrations.**

