---
sidebar_position: 4
title: The Bridge
---

# The Bridge

**Single, Common Service Layer**

The Bridge is the **single, common service layer** in CommerceBridge. It serves as the orchestration hub, state manager, and integration point for the entire commerce system.

---

## What the Bridge Is

The Bridge is a **foundational service layer** that provides:

### 1. Orchestration Hub

The Bridge coordinates all commerce operations:

- Routes requests to appropriate handlers
- Manages workflow state across distributed workers
- Coordinates multi-step processes
- Ensures consistency across the system

### 2. State Manager

The Bridge owns all state in the system:

- **Redis** — Hot caches, session state, engagement state
- **MongoDB** — Persistent storage, historical data
- **OpenSearch** — Full-text search, spatial queries, aggregations

Workers are stateless. The Bridge maintains state.

### 3. Integration Point

The Bridge is where integrations live:

- **For users:** Extend the Bridge to add your integrations (ERP, messaging, payments)
- **For workers:** Access all data and integrations through the Bridge
- **For APIs:** Bridge provides the backend for experience layer endpoints

### 4. Multi-Tenant Coordinator

The Bridge enforces tenant isolation:

- All operations are tenant-scoped
- Data is isolated per tenant
- Configuration is tenant-specific
- No cross-tenant data leakage

---

## What the Bridge Does

### Engagement Lifecycle Management

The Bridge manages the full lifecycle of commerce engagements:

```typescript
// Create engagement
const engagement = await bridge.createEngagement({
  customerId: 'customer-123',
  type: 'order',
  tenantId: 'acme-corp'
});

// Track throughout lifecycle
await bridge.updateEngagement(engagement.id, { status: 'processing' });
await bridge.updateEngagement(engagement.id, { status: 'confirmed' });
await bridge.finalizeEngagement(engagement.id);
```

### Price Calculation

The Bridge handles sophisticated pricing logic:

- Multi-stage modifier application
- Customer-specific pricing rules
- Delivery zone adjustments
- Volume break calculations
- Price caching and invalidation

```typescript
const pricing = await bridge.calculatePrice({
  productId: 'prod-123',
  quantity: 100,
  customerId: 'customer-456',
  deliveryZone: 'US-MIDWEST'
});
```

### Inventory Allocation

The Bridge orchestrates inventory across multiple warehouses:

- Real-time availability checking
- Multi-warehouse allocation
- Delivery zone optimization
- Split shipment handling
- Reservation management

```typescript
const allocation = await bridge.allocateInventory(
  engagementId,
  lineItems
);
```

### State Caching

The Bridge provides intelligent caching:

- Hot data in Redis
- Cache invalidation on updates
- Automatic cache warming
- Pattern-based bulk invalidation

```typescript
await bridge.cacheEngagement(engagement);
await bridge.invalidateCache(`engagement:${id}`);
```

### Queue Management

The Bridge manages message queues for worker communication:

- Publish tasks to worker queues
- Handle queue priorities
- Manage delayed jobs
- Track queue metrics

```typescript
await bridge.publishToQueue('order-processing', jobCard);
```

---

## Key Principle

> **All shared, reusable integrations must live in the Bridge.**

This keeps the architecture clean and prevents integration logic from being scattered across workers.

**Important:** The base Bridge does NOT include tenant-specific or external system integrations. These must be added by extending the Bridge for your ecosystem.

---

## Core Functions Available

The base Bridge provides these foundational functions that all extended bridges inherit:

- **Engagement Management** — Create, read, update, finalize engagements
- **Pricing** — Calculate prices, apply modifiers, customer pricing
- **Fulfillment** — Allocate inventory, check availability, optimize
- **State Management** — Cache operations, invalidation, retrieval
- **Queue Operations** — Publish, consume, queue management
- **Product Operations** — Get products, search, SKU lookup
- **Customer Operations** — Get customers, pricing rules, addresses
- **Tenant Operations** — Config, feature flags, settings

See [Core Bridge API Reference →](/commercebridge/core-bridge) for complete function documentation with parameters, return types, and examples.

---

## Extending the Bridge

Users extend the base Bridge model to add their own functionality:

```typescript
// Extend the base Bridge for your tenant/ecosystem
import { BaseBridge } from '@commercebridge/core';

export class MyEcosystemBridge extends BaseBridge {
  // Add your own functions
  async integrateWithExternalSystem(data: any) {
    // Your custom integration logic
  }
  
  // Add tenant-specific business logic
  async processCustomWorkflow(engagement: Engagement) {
    // Your workflow implementation
  }
}
```

### Extension Examples

#### External System Integration

```typescript
export class AcmeCommerceBridge extends BaseBridge {
  private erpClient: AcmeErpClient;
  
  constructor(config: BridgeConfig) {
    super(config);
    this.erpClient = new AcmeErpClient(config.erpUrl);
  }
  
  // Add ERP integration
  async syncOrderToErp(order: Order) {
    const erpOrder = this.transformToErpFormat(order);
    return await this.erpClient.createOrder(erpOrder);
  }
  
  // Add inventory sync
  async syncInventoryFromErp() {
    const erpInventory = await this.erpClient.getInventory();
    return await this.updateInventoryCache(erpInventory);
  }
}
```

#### Messaging Integration

```typescript
export class AcmeCommerceBridge extends BaseBridge {
  private twilioClient: TwilioClient;
  private mailgunClient: MailgunClient;
  
  // Add SMS notifications
  async sendSmsNotification(customerId: string, message: string) {
    const customer = await this.getCustomer(customerId);
    return await this.twilioClient.send(customer.phone, message);
  }
  
  // Add email notifications
  async sendEmailNotification(customerId: string, template: string, data: any) {
    const customer = await this.getCustomer(customerId);
    return await this.mailgunClient.sendTemplate(customer.email, template, data);
  }
}
```

#### Custom Business Logic

```typescript
export class AcmeCommerceBridge extends BaseBridge {
  // Add custom discount logic
  async applyAcmeDiscounts(engagement: Engagement) {
    // Your specific discount calculation
    const customerTier = await this.getCustomerTier(engagement.customerId);
    const discountRate = this.calculateTierDiscount(customerTier);
    
    return this.applyPriceModifiers(engagement.pricing.basePrice, [
      { type: 'tier-discount', value: discountRate }
    ]);
  }
  
  // Add custom workflow
  async processAcmeApprovalWorkflow(engagement: Engagement) {
    if (engagement.pricing.finalPrice > 10000) {
      await this.publishToQueue('approvals', {
        type: 'approval.required',
        engagementId: engagement.id
      });
    }
  }
}
```

---

## Using Extended Bridge

### In Workers

Workers use your extended Bridge implementation:

```typescript
export const orderProcessorWorker = async (message: OrderMessage) => {
  // Instantiate your extended Bridge
  const bridge = new AcmeCommerceBridge(config);
  
  // Use core functions (inherited from BaseBridge)
  const engagement = await bridge.getEngagement(message.engagementId);
  await bridge.allocateInventory(engagement.id, engagement.lineItems);
  
  // Use your custom functions
  await bridge.syncOrderToErp(engagement.order);
  await bridge.sendSmsNotification(
    engagement.customerId, 
    'Your order has been confirmed!'
  );
};
```

### In Experience Layer

API endpoints use your extended Bridge:

```typescript
export const createOrderEndpoint = async (req: Request, res: Response) => {
  const bridge = new AcmeCommerceBridge(config);
  
  // Create engagement (core function)
  const engagement = await bridge.createEngagement(req.body);
  
  // Apply custom business logic
  await bridge.applyAcmeDiscounts(engagement);
  await bridge.processAcmeApprovalWorkflow(engagement);
  
  res.json(engagement);
};
```

---

## Extension Pattern Benefits

### Complete Flexibility

- Add any external system integration
- Implement tenant-specific business logic
- Customize workflows and validations
- Integrate with bespoke systems

### Maintain Core Functionality

- Inherit all base Bridge functions
- Leverage built-in caching and state management
- Use queue operations and orchestration
- Benefit from multi-tenant architecture

### Clean Architecture

- No scattered integration code
- Single source of truth for business logic
- Easy to test and maintain
- Clear separation of concerns

---

## Configuration

Your extended Bridge receives configuration at initialization:

```typescript
const bridge = new AcmeCommerceBridge({
  // Core Bridge config
  mongodb: { uri: process.env.MONGODB_URI },
  redis: { host: process.env.REDIS_HOST },
  queue: { url: process.env.RABBITMQ_URL },
  
  // Your custom config
  erpUrl: process.env.ACME_ERP_URL,
  erpApiKey: process.env.ACME_ERP_KEY,
  twilioAccountSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_TOKEN,
  mailgunApiKey: process.env.MAILGUN_KEY,
  
  // Tenant context
  tenantId: 'acme-corp'
});
```

---

## Best Practices

### Do:

✅ Extend the base Bridge for your ecosystem  
✅ Add external system integrations in your extended Bridge  
✅ Keep integrations multi-tenant aware  
✅ Use dependency injection for external clients  
✅ Document your custom functions  

### Don't:

❌ Modify the base Bridge directly  
❌ Create side-services for integrations  
❌ Mix tenant-specific logic in base Bridge  
❌ Hardcode credentials in your Bridge  
❌ Bypass the Bridge in Workers  

---

**The Bridge provides the foundation. You bring the integrations.**

