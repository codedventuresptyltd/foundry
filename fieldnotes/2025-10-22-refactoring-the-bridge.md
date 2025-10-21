---
slug: refactoring-the-bridge
title: Refactoring the Bridge - Modular Architecture & Security by Isolation
authors: [codedventures]
tags: [bridge, architecture, refactoring, security]
---

# Refactoring the Bridge - Modular Architecture & Security by Isolation

The Bridge has served us well as our central integration layer, but it's time for evolution. We're refactoring from a monolithic `meshBridgeModel` into specialized bridges with clear boundaries and security isolation.

<!-- truncate -->

## The Current State

Right now, `meshBridgeModel` does everything:

- Manages all database connections
- Handles queue operations
- Processes engagement data
- Manages worker lifecycle
- Provides admin operations
- Integrates with external services

It works, but it has problems:

**Security**: Workers have access to admin functions they should never touch.

**Complexity**: One massive class handling dozens of concerns.

**Testing**: Hard to mock or test individual components.

**Coupling**: Workers instantiate their own bridge, creating duplicate connections.

## The Vision

We're moving to a modular bridge architecture:

```
BridgeBase (Central connections)
  ├── WorkerBridge (Lifecycle operations)
  ├── CycleBridge (Queue operations)
  ├── EngagementBridge (Data operations)
  ├── CustomClientBridge (Tenant-specific logic)
  └── AdminBridge (Privileged operations)
```

Each bridge has a **single, clear responsibility**. Each exposes only what's needed for its domain. Admin functions are isolated in `AdminBridge` and never injected into workers.

## Principle of Least Privilege

This is fundamentally about **security through isolation**.

Workers don't need admin functions. They shouldn't have them. If they don't have them, they can't accidentally (or maliciously) use them.

**Before:**
```typescript
const bridge = new meshBridgeModel();
// Worker now has access to dropCommunity(), truncateQueues(), etc.
```

**After:**
```typescript
const workerBridge = new WorkerBridge(bridgeBase);
const cycleBridge = new CycleBridge(bridgeBase);
// Worker only has lifecycle and queue operations
```

This is **security by design** — make it impossible to do the wrong thing, not just hard.

## Connection Centralization

Another key change: connections are owned by `BridgeBase` and shared.

**Before:**
```typescript
// Each worker creates its own bridge
const worker1Bridge = new meshBridgeModel();
const worker2Bridge = new meshBridgeModel();
// Two database connections, two queue connections
```

**After:**
```typescript
// One BridgeBase, shared connections
const bridgeBase = new BridgeBase(config);
const worker1Bridge = new WorkerBridge(bridgeBase);
const worker2Bridge = new WorkerBridge(bridgeBase);
// One database connection, one queue connection, reused
```

**Why it matters:**
- Connection pooling actually works
- Resource limits respected
- Easier to monitor and debug
- Better performance under load

## Bridge Roles

### EmbryoBridge

Used only during worker initialization:

- Connects to ecosystem DB with minimal privileges
- Creates seed records
- Registers worker in ecosystem
- **Then it's discarded**

This follows **temporal privilege** — elevated access only exists when needed, then gone.

### BridgeBase

The foundation:

- Owns all shared connections (DB, queues, APIs)
- Manages connection lifecycle
- Provides health checks
- **Never instantiated directly by workers**

This is the **single source of truth** for all connections.

### WorkerBridge

Worker lifecycle operations:

- `spawn()` - Create new worker record
- `callHome()` - Report vitals
- `kill()` - Graceful shutdown

**That's it.** No data operations, no admin functions, just lifecycle.

### CycleBridge

Queue operations:

- Fetch job batches
- Commit completed jobs
- Handle workflow queues

**Nothing else.** No database writes, no admin operations, just queue management.

### EngagementBridge

Data operations:

- Load engagement records
- Update engagement state
- Query engagement data

Created **per-cycle** if needed. Lightweight, focused, disposable.

### CustomClientBridge

Client-specific integrations:

- External API credentials
- Custom endpoints
- Tenant-specific rules

Configured with client ID to **scope all behavior**. One bridge instance per client, isolated concerns.

### AdminBridge

The dangerous stuff:

- Drop communities
- Truncate queues
- Force resets
- System-wide operations

**Only injected into admin processes.** Never available to workers. If it's not there, it can't be used.

## Migration Strategy

We're not doing a big-bang rewrite. This is gradual:

1. **Introduce BridgeBase** — centralize connections
2. **Extract WorkerBridge** — lifecycle methods first
3. **Extract CycleBridge** — queue operations next
4. **Extract EngagementBridge** — data operations
5. **Add CustomClientBridge** — tenant integrations
6. **Add AdminBridge** — privileged operations
7. **Deprecate meshBridgeModel** — once everything's migrated

Each step is **independently deployable**. Workers can use old bridge or new bridges. Gradual migration, continuous deployment, no downtime.

## Testing Benefits

Modularity means **mockability**:

```typescript
// Mock just the connection layer
const mockBase = new MockBridgeBase();

// Test WorkerBridge in isolation
const workerBridge = new WorkerBridge(mockBase);
await workerBridge.spawn();

// Verify only expected calls happened
expect(mockBase.ecosystem.insert).toHaveBeenCalledOnce();
```

No more giant mocks. No more testing side effects. **Test what matters, mock what doesn't.**

## Performance Implications

Surprisingly, this makes things **faster**:

- Connection reuse reduces overhead
- Smaller classes load faster
- Less memory per worker instance
- Better garbage collection patterns

**Modular doesn't mean slow** — it means efficient.

## The Philosophy

This refactor embodies several principles:

### Single Responsibility
Each bridge does one thing well. Easy to understand, easy to maintain, easy to test.

### Explicit Dependencies
Workers declare what they need. No hidden assumptions, no surprise connections.

### Security by Design
Privilege isolation isn't enforced by policy, it's enforced by structure. Can't access what isn't there.

### Gradual Evolution
No big rewrites. Ship incremental improvements, validate each step, iterate.

## What We're Learning

### 1. Monoliths Are Convenient Until They're Not
The unified bridge was great early on. As the system grew, the convenience became a liability.

### 2. Security Through Structure
Access control policies can fail. Type systems can be subverted. But if the dangerous function literally doesn't exist on the object, it can't be called.

### 3. Share Connections, Not State
Multiple bridge instances can share connections safely. This is **resource pooling done right**.

### 4. Migration Over Rewrite
We could rebuild from scratch. Instead, we're extracting piece by piece. Less risk, continuous value delivery.

## What's Next

We're starting with `WorkerBridge` extraction. It's the smallest, most isolated piece. Once that's proven, we'll tackle `CycleBridge`, then the rest.

Each extraction is a pull request. Each PR is reviewed, tested, deployed. **Incremental progress, not grand visions.**

## The Pattern

**Modular architecture isn't about theoretical purity. It's about practical maintainability.**

When you can test a component in isolation, understand its boundaries at a glance, and reason about its security properties, you've achieved something valuable.

The Bridge refactor is about making our system **clearer, safer, and more maintainable**. Not because architecture diagrams look nice, but because code reviews get easier and production bugs get rarer.

---

**Building systems that are obvious, not clever.**


