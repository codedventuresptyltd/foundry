---
sidebar_position: 3
title: Architecture
---

# Architecture
**Use when:** Understanding how CommerceBridge components work together.

## System Overview

CommerceBridge follows a distributed architecture with clear separation of concerns across four primary layers.

```mermaid
flowchart TB
    subgraph "Presentation Layer"
        UI[Touchpoint UI]
    end
    
    subgraph "API Layer"
        EXP[Experience Endpoints]
    end
    
    subgraph "Orchestration Layer"
        BRIDGE[Bridge]
    end
    
    subgraph "Processing Layer"
        W1[Worker Type A]
        W2[Worker Type B]
        W3[Worker Type C]
    end
    
    subgraph "Data Layer"
        CACHE[(Cache)]
        STORE[(Data Store)]
        SEARCH[(Search Engine)]
    end
    
    subgraph "Integration Layer"
        QUEUE[Message Queue]
        EXT[External Systems]
    end
    
    UI --> EXP
    EXP --> BRIDGE
    BRIDGE --> QUEUE
    BRIDGE --> CACHE
    BRIDGE --> STORE
    BRIDGE --> SEARCH
    QUEUE --> W1
    QUEUE --> W2
    QUEUE --> W3
    W1 --> BRIDGE
    W2 --> BRIDGE
    W3 --> BRIDGE
    BRIDGE --> EXT
```

## Core Layers

### 1. Admin and Monitoring Layer
- Manages communities and workers
- Provides community monitoring
- Provides the configuration framework for Touchpoint
- Manages datastores and data syncing

### 2. API Layer (Experience Endpoints)
- REST APIs for UI consumption
- Request validation and routing
- Session management
- Bridge coordination

### 3. Orchestration Layer (Bridge)
- State management and coordination
- Business logic enforcement
- Multi-tenant resource management
- Integration hub

### 4. Processing Layer (Workers)
- Async task execution
- Stateless, scalable processors
- Message queue consumers
- Business task specialization

### 5. Data Layer
- **Datastore:** Persistent data sinks used as a data abstraction layer
- **Common Data Models:** Used across CommerceBridge, Touchpoint and Eidos

### 6. Integration Layer
- **Message Queue:** Worker task distribution
- **External Systems:** ERP, payment, shipping, etc. (via Bridge extensions)
- **Search Engine:** Full-text and spatial queries

## Communication Patterns

### Synchronous Operations

```mermaid
sequenceDiagram
    participant UI
    participant API
    participant Bridge
    participant Cache
    
    UI->>API: GET /products?zone=chicago
    API->>Bridge: searchProducts(query, zone)
    Bridge->>Cache: Check cached results
    Cache-->>Bridge: Cache hit
    Bridge-->>API: Products
    API-->>UI: JSON response
```

**Use for:**
- Data queries (products, pricing, availability)
- Read operations
- Cache-backed requests
- Real-time UI updates

### Asynchronous Operations

```mermaid
sequenceDiagram
    participant UI
    participant API
    participant Bridge
    participant Queue
    participant Worker
    
    UI->>API: POST /orders
    API->>Bridge: createEngagement(order)
    Bridge->>Queue: Publish job card
    Bridge-->>API: Engagement created
    API-->>UI: 202 Accepted
    
    Queue->>Worker: Deliver job card
    Worker->>Bridge: Process order
    Worker->>Bridge: Update engagement
    Bridge->>Queue: Publish next task
```

**Use for:**
- Order processing
- Inventory allocation
- External system sync
- Notifications
- Complex workflows

## Design Patterns

### 1. Extension Over Modification

**Problem:** Need to add integrations without modifying core code.

**Solution:** Extend the base Bridge class:

```ts
export class TenantBridge extends BaseBridge {
  // Add your integrations
  async customIntegration() { }
}
```

### 2. Queue-Based Decoupling

**Problem:** Tight coupling between services.

**Solution:** All async communication through message queues:

- APIs publish job cards
- Workers consume job cards
- No direct service-to-service calls
- Natural retry and fault tolerance

### 3. Stateless between Workers, Stateful Within a Worker

**Problem:** Scaling stateful services is complex.

**Solution:** Workers maintain state only within the cycle:

- Workers are disposable
- Scale by adding instances
- Deploy new versions alongside old
- Some state between jobs and job tasks processed within the same worker can be held to increase efficiency

### 4. Multi-Tenant Isolation

**Problem:** Securely isolate tenant data.

**Solution:** Tenant context enforced at every layer:

- Data namespaced by tenant
- Cache keys prefixed with tenant ID
- Job cards include tenant context
- Workers validate tenant access

## Do / Don't

### ✅ Do

- Use message queues for async operations
- Keep workers stateless and focused
- Extend the Bridge for custom integrations
- Enforce tenant context everywhere
- Use Mermaid diagrams to explain flows
- Design for horizontal scaling

### ❌ Don't

- Create direct worker-to-worker communication
- Store state in workers
- Create side-services outside Bridge/Worker pattern
- Mix tenant-specific logic in base components
- Hardcode infrastructure details
- Bypass the orchestration layer

## Deployment Model

```mermaid
flowchart LR
    subgraph "Version N+1 (New)"
        B2[Bridge v2]
        W2A[Worker A v2]
        W2B[Worker B v2]
    end
    
    subgraph "Version N (Old)"
        B1[Bridge v1]
        W1A[Worker A v1]
        W1B[Worker B v1]
    end
    
    QUEUE[Message Queue]
    
    NEW[New Traffic] --> B2
    OLD[Existing Work] --> B1
    
    B2 --> QUEUE
    B1 --> QUEUE
    
    QUEUE --> W2A
    QUEUE --> W2B
    QUEUE -.Draining.-> W1A
    QUEUE -.Draining.-> W1B
```

**Philosophy:** "Starve old workers, evolve ecosystems"

- Deploy new versions alongside old
- Route new work to new workers
- Let old workers finish their jobs
- No rolling restarts needed
- Zero-downtime deployments

## IP Safety

This documentation describes:
- **Public:** Architecture patterns, component interactions, design principles
- **Private (not shown):** Specific queue names, database schemas, infrastructure configurations, deployment scripts

---

**Architecture: Distributed by design, simple by principle.**
