---
sidebar_position: 1
title: CommerceBridge
---

# CommerceBridge

**The Framework That Orchestrates Commerce**

CommerceBridge is a sophisticated orchestration layer that models commerce as **engagements**, not just orders. It's the central nervous system for modern B2B commerce operations, coordinating between distributed workers, managing state, handling integrations, and providing intelligent routing for complex commerce workflows.

---

## Why CommerceBridge?

Traditional commerce systems treat orders as the primary entity. CommerceBridge takes a different approach:

- **Engagement-First** — commerce is a conversation, not just a transaction
- **Distributed by Design** — built for worker ecosystems and elastic scale
- **Integration Hub** — centralized, reusable integrations for multi-tenant systems
- **State Management** — sophisticated caching and state orchestration
- **AI-Ready** — built to leverage intelligent agents and automation

---

## Core Components

### The Bridge

The Bridge is the **single, common service layer** in the system. It provides:

- Centralized integration management (messaging, payments, shipping, etc.)
- Multi-tenant resource coordination
- Shared business logic and validation
- State caching and persistence
- API gateway and routing

**Rule:** All shared, reusable integrations must live in the Bridge.

[Learn more about Bridge Architecture →](/commercebridge/bridge)

### Engagements

Engagements are the heart of CommerceBridge. An engagement represents the full lifecycle of a commerce interaction:

- Customer inquiry and quoting
- Cart building and pricing
- Order placement and confirmation
- Fulfillment tracking
- Post-order updates and modifications

Each engagement maintains its own state, history, and context across the entire journey.

[Learn more about Engagements →](/commercebridge/engagement)

### Workers

Workers are **stateless, replaceable processing engines**. They:

- Execute tasks, jobs, or messages
- Scale elastically (replicate, specialize, or retire as needed)
- Consume data primarily through the Bridge
- Can implement client-specific integrations in dedicated service files

**Philosophy:** Workers are ephemeral. "Starve old workers, evolve ecosystems."

[Learn more about Workers →](/commercebridge/workers)

---

## Architecture Principles

### 1. Base Bridge Model

The core Bridge provides **foundational functions and patterns**, not specific integrations. It includes:

- Engagement management
- State orchestration
- Pricing calculations
- Fulfillment allocation
- Cache management
- Queue communication

**Important:** The Bridge does NOT include integrations for public/external users. These are tenant-specific and must be implemented by extending the Bridge.

### 2. Extending the Bridge

Users extend the base Bridge model to add their own functionality. This pattern allows complete flexibility while maintaining core functionality.

[Learn how to extend the Bridge →](/commercebridge/bridge)

### 3. No Side Services

**Don't create or suggest standalone side-services** outside of the Bridge or Workers. This keeps the architecture clean and maintainable.

### 4. Queue-Based Orchestration

Workers communicate through message queues (RabbitMQ, Kafka), not direct HTTP calls. This enables:

- Asynchronous processing
- Retry logic and fault tolerance
- Load balancing and scaling
- Clear service boundaries

---

## Key Features

### Multi-Tenant Architecture

CommerceBridge is built for multi-tenancy from the ground up:

- Isolated data per tenant
- Shared infrastructure with tenant-level customization
- Per-tenant configuration and feature flags
- Secure tenant isolation at every layer

### Pricing Engine

Sophisticated pricing logic with:

- Multi-stage price modifiers
- Delivery zone-based pricing
- Quantity breaks and volume discounts
- Customer-specific pricing rules
- Real-time calculation and caching

### Fulfillment Orchestration

Intelligent fulfillment management:

- Multi-warehouse inventory allocation
- Delivery zone optimization
- Carrier selection and routing
- Split shipment handling
- Real-time availability checking

### State Management

Advanced caching and state management:

- Redis-based caching layers
- MongoDB for persistent storage
- OpenSearch for full-text and spatial queries
- Optimistic locking and conflict resolution

---

## Core Bridge Functions

The base Bridge provides foundational operations that all ecosystems inherit.

[View complete Core Bridge API →](/commercebridge/core-bridge)

Quick examples:

```typescript
// Engagement management
await bridge.createEngagement(params);
await bridge.getEngagement(engagementId);

// Pricing calculations
await bridge.calculatePrice(product, quantity, context);

// Fulfillment allocation
await bridge.allocateInventory(engagementId, lineItems);

// State and caching
await bridge.cacheEngagement(engagement);

// Queue operations
await bridge.publishToQueue(queueName, message);
```

---

## Extension Patterns

### Extending for Your Ecosystem

```typescript
// Create your ecosystem-specific Bridge
export class AcmeCommerceBridge extends BaseBridge {
  // Add external system integrations
  async syncToErp(order: Order) {
    const erpClient = new AcmeErpClient(this.config);
    return await erpClient.createOrder(order);
  }
  
  // Add custom business logic
  async applyAcmeDiscounts(engagement: Engagement) {
    // Your specific discount logic
  }
  
  // Add messaging integrations
  async sendSms(customerId: string, message: string) {
    const twilioClient = new TwilioClient(this.config);
    return await twilioClient.send(customerId, message);
  }
}
```

### Using Extended Bridge in Workers

```typescript
// Workers use your extended Bridge
export const orderProcessorWorker = async (message: OrderMessage) => {
  const bridge = new AcmeCommerceBridge(config);
  
  const engagement = await bridge.getEngagement(message.engagementId);
  await bridge.allocateInventory(engagement.id, engagement.lineItems);
  
  // Use your custom functions
  await bridge.syncToErp(engagement.order);
  await bridge.sendSms(engagement.customerId, 'Order confirmed!');
};
```

---

**CommerceBridge: Where commerce orchestration meets engineering craft.**

