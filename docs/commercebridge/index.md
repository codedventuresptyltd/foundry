---
sidebar_position: 1
title: CommerceBridge
---

# CommerceBridge

**The Framework That Orchestrates Commerce**

CommerceBridge is a composable orchestration framework that models commerce as **engagements**, not just orders.  
It acts as the central nervous system for modern B2B commerce — coordinating distributed workers, managing state, handling integrations, and intelligently routing complex workflows between systems.

---

## Why CommerceBridge?

Traditional commerce systems treat orders as the primary entity. CommerceBridge flips that model.

- **Engagement-First** — commerce is a conversation, not just a transaction  
- **Distributed by Design** — built for elastic worker ecosystems and real-time scaling  
- **Integration Hub** — unified service layer for shared integrations and tenant-specific logic  
- **Stateful by Nature** — orchestrates state transitions across multiple systems with consistency  
- **AI-Ready** — designed for intelligent agents, adaptive pricing, and automation

CommerceBridge isn’t a single application — it’s the connective tissue that lets applications and services work together as one.

---

## Core Components

### The Bridge

The **Bridge** is the common service layer for every ecosystem. It defines the foundational language and runtime patterns used across integrations.

**Responsibilities:**
- Centralized integration management (ERP, pricing, messaging, payments, logistics)
- Multi-tenant coordination and validation
- State caching and persistence
- Message routing and queue abstraction
- Shared business logic for engagement and order lifecycles

> **Rule:** All shared or reusable integrations live inside the Bridge layer.  
> External systems integrate *through* the Bridge — never around it.

[Learn more about Bridge Architecture →](/commercebridge/bridge)

---

### Engagements

An **Engagement** represents the entire lifecycle of a commercial interaction — from quote to completion.

**Example flow:**
1. Customer builds a cart or requests a quote  
2. Pricing is resolved through integrated bridges  
3. Orders are created and dispatched  
4. Fulfillment and shipment updates are synchronized  
5. Post-order modifications and reconciliations are managed

Each engagement maintains its own **state**, **history**, and **context** — giving visibility across all related orders, communications, and decisions.

[Learn more about Engagements →](/commercebridge/engagement)

---

### Workers

**Workers** are stateless processors that execute defined tasks.  
They form an elastic execution layer around CommerceBridge.

**Key traits:**
- Stateless and replaceable — no persistence inside workers  
- Task-based execution (consume → process → exit)  
- Scalable and specialized — replicate or retire automatically  
- Operate exclusively through Bridge interfaces

> **Philosophy:** Workers are ephemeral. *Starve old workers, evolve ecosystems.*

[Learn more about Workers →](/commercebridge/workers)

---

## Architecture Principles

### 1. Base Bridge Model
The base Bridge defines the **foundation and patterns** every ecosystem inherits — engagement management, state orchestration, pricing, fulfillment, and message handling.  
It provides shared primitives, not specific business integrations.

> **Note:** Public instances of the Bridge should never include tenant or client-specific integrations.

---

### 2. Extending the Bridge
Every deployment can extend the base Bridge to add its own logic, integrations, and workflows — while preserving the common framework.

This gives ecosystems full flexibility while maintaining shared compatibility.

[Learn how to extend the Bridge →](/commercebridge/bridge)

---

### 3. No Side Services
Avoid standalone microservices that duplicate Bridge responsibilities.  
All persistent or shared business logic should live inside the Bridge or be executed via Workers.  
This principle keeps ecosystems maintainable and auditable.

---

### 4. Queue-Based Orchestration
CommerceBridge uses message queues for inter-service communication — enabling:

- Asynchronous and event-driven workflows  
- Retry and fault-tolerant execution  
- Load-balanced scaling across worker pools  
- Clean separation of concerns between Bridge and Workers

---

## Key Features

### Multi-Tenant Architecture
CommerceBridge supports full multi-tenancy from the ground up:
- Isolated tenant data with shared infrastructure
- Configurable integrations per tenant
- Dynamic feature flags and pricing models
- Strict isolation between ecosystems

---

### Pricing Engine
Flexible, rule-based pricing framework supporting:
- Tiered or quantity-based pricing  
- Customer and supplier-specific rules  
- Configurable modifiers and adjustments  
- Real-time calculation and caching  

---

### Fulfillment Orchestration
Adaptive fulfillment engine for distributed supply networks:
- Multi-warehouse and zone allocation  
- Carrier and route optimization  
- Split order and partial fulfillment handling  
- Live synchronization with external systems  

---

### State Management
Centralized state orchestration ensures data consistency and traceability:
- Cached operational state for performance  
- Persistent history for audit and reconciliation  
- Versioned and immutable lifecycle events  
- Conflict detection and optimistic updates  

---

## Core Bridge Functions

The base Bridge exposes high-level operations shared across all ecosystems.

```typescript
// Engagement management
await bridge.createEngagement(params);
await bridge.getEngagement(engagementId);

// Pricing calculations
await bridge.calculatePrice(product, quantity, context);

// Fulfillment allocation
await bridge.allocateInventory(engagementId, lineItems);

// State management
await bridge.cacheEngagement(engagement);

// Queue operations
await bridge.publishToQueue(queueName, message);
