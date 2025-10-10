---
sidebar_position: 9
title: SDK Reference
---

# SDK Reference
**Reference:** Public interfaces for integrating with CommerceBridge.

## Overview

This SDK reference documents the public-safe interfaces available when building with or extending CommerceBridge. All examples use generic pseudo-code that represents the pattern without exposing implementation details.

**Note:** Actual SDK implementation details, schemas, and infrastructure specifics are not documented here for IP protection.

---

## Installation Pattern

```bash
# Generic pattern - not actual package name
npm install @your-org/commercebridge-sdk
```

## Initialization

```ts
import { Bridge } from '@your-org/commercebridge-sdk'

const bridge = new Bridge({
  endpoint: 'your-bridge-endpoint',
  authentication: { /* auth config */ },
  tenantId: 'your-tenant-id'
})
```

---

## Engagement API

### Create Engagement

```ts
const engagement = await bridge.createEngagement({
  customerId: 'customer-123',
  type: 'order',
  lineItems: [
    {
      productId: 'product-456',
      quantity: 100,
      uom: 'each'
    }
  ]
})
```

### Retrieve Engagement

```ts
const engagement = await bridge.getEngagement('engagement-id')
```

### Update Engagement

```ts
await bridge.updateEngagement('engagement-id', {
  status: 'processing',
  lineItems: updatedItems
})
```

### Finalize Engagement

```ts
await bridge.finalizeEngagement('engagement-id')
```

---

## Pricing API

### Calculate Price

```ts
const pricing = await bridge.calculatePrice({
  productId: 'product-456',
  quantity: 100,
  customerId: 'customer-123',
  deliveryZone: 'midwest'
})

console.log(pricing.finalPrice)
console.log(pricing.modifiers) // Breakdown
```

### Get Customer Pricing

```ts
const customerPrice = await bridge.getCustomerPricing(
  'customer-123',
  'product-456'
)
```

---

## Fulfillment API

### Check Availability

```ts
const availability = await bridge.checkAvailability({
  productId: 'product-456',
  quantity: 100,
  deliveryZone: 'midwest'
})

if (availability.available) {
  console.log(`${availability.quantityAvailable} units available`)
  console.log(`Delivery: ${availability.estimatedDelivery}`)
}
```

### Allocate Inventory

```ts
const allocation = await bridge.allocateInventory(
  'engagement-id',
  lineItems
)

if (allocation.success) {
  console.log(`Reservation: ${allocation.reservationId}`)
  console.log(`Split shipment: ${allocation.splitShipment}`)
}
```

---

## Product API

### Get Product

```ts
const product = await bridge.getProduct('product-456')
```

### Search Products

```ts
const results = await bridge.searchProducts({
  query: 'steel plate',
  filters: {
    category: 'materials',
    inStock: true
  },
  deliveryZone: 'midwest'
})
```

---

## Extension SDK

For building extended bridges:

```ts
import { BaseBridge } from '@commercebridge/core'

export class MyBridge extends BaseBridge {
  // Inherit all base functions
  
  // Add your custom functions
  async myCustomOperation(data: unknown) {
    // Your logic
  }
}
```

---

## Authentication

SDK uses token-based authentication with tenant context:

```ts
const bridge = new Bridge({
  authentication: {
    token: 'your-api-token',
    tenantId: 'your-tenant-id'
  }
})
```

All requests automatically include tenant context for multi-tenant isolation.

---

## Error Handling

```ts
try {
  await bridge.allocateInventory(engagementId, items)
} catch (error) {
  if (error.code === 'INSUFFICIENT_INVENTORY') {
    // Handle out of stock
  } else if (error.code === 'INVALID_ENGAGEMENT') {
    // Handle invalid engagement
  }
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| `INSUFFICIENT_INVENTORY` | Not enough stock available |
| `INVALID_ENGAGEMENT` | Engagement not found or invalid state |
| `PRICING_ERROR` | Price calculation failed |
| `ZONE_NOT_SERVICEABLE` | Delivery zone not available |
| `TENANT_LIMIT_EXCEEDED` | Rate limit or quota exceeded |

---

## IP Safety

This SDK reference shows:
- **Public:** Interface patterns, function signatures, usage examples
- **Private (not shown):** Actual package names, endpoint URLs, authentication mechanisms, error schemas

---

**SDK Reference: Public-safe integration patterns.**
