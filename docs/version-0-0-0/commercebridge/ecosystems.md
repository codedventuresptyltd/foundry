---
sidebar_position: 7
title: Custom Ecosystems
---

# Custom Ecosystems
**Concept:** How to use and extend the Bridge.

## What is an Ecosystem?

An **ecosystem** is a self-contained deployment unit that combines:

- **Core Workers** — Standard workers from `@mesh/ecosystem`
- **Custom Workers** — Your business-specific processors
- **Actors** — Specialized workers that manage ecosystem operations (reaper, seeder, steward, ambassador)
- **Configuration** — Bridge configs defining integrations and behaviors

Think of it as a "worker community" — a coordinated group of workers that collectively handle a specific business domain.

### Ecosystem Structure

```
my-ecosystem/
├── ecosystem.ts          # Main entry point
├── package.json          # Dependencies (includes @mesh/ecosystem)
├── workers/             # Your custom workers
│   └── custom-worker.ts
├── configs/             # Bridge configurations
└── .env                 # Environment variables
```

### How Ecosystems Work

1. **Import Core** — Ecosystem imports the core framework (`@mesh/ecosystem`)
2. **Define Workers** — Register core and custom workers in a library
3. **Configure Actors** — Set up management actors (reaper, seeder, etc.)
4. **Spawn Embryo** — Initialize the ecosystem with worker and actor libraries

### Ecosystem Philosophy

CommerceBridge provides a **base framework** with core commerce operations. You extend it by creating ecosystems that add:

- External system integrations
- Custom business logic
- Tenant-specific workflows
- Industry-specific features

**Rule:** Extend, don't modify. Keep the core generic.

---

## Extension Patterns

### Pattern 1: External System Integration

Extend the Bridge to connect with external systems (ERPs, CRMs, etc.):

- Create a custom integration service
- Wrap it in a namespace for easy access
- Extend the WorkerBridge to include your namespace
- Workers access it via `this.bridge.myNamespace.method()`

### Pattern 2: Custom Validation

Add business-specific validation rules:

- Extend the Bridge with custom validation methods
- Validate before core operations
- Return helpful error messages
- Maintain multi-tenant safety

### Pattern 3: Workflow Customization

Customize workflows for your business:

- Add approval workflows
- Implement custom status transitions
- Add notification hooks
- Integrate with external approval systems

---

## Best Practices

### ✅ Do

- **Use inheritance** — Extend BaseBridge, don't fork it
- **Keep extensions focused** — One concern per extension
- **Document your additions** — Help future maintainers
- **Use dependency injection** — Pass clients via config
- **Maintain multi-tenant safety** — Always include tenant context
- **Test extensions independently** — Unit test your additions

### ❌ Don't

- **Modify base classes** — Always extend
- **Bypass core functions** — Use inherited methods
- **Hardcode configuration** — Use config injection
- **Mix concerns** — Keep integrations separate
- **Ignore tenant context** — Always scope operations
- **Create deep inheritance chains** — Keep it simple

---

## Configuration Pattern

Bridge configuration follows a structured model that separates concerns and integrations:

**Modules** map functional areas (queue, datastore, worker, etc.) to integration keys.

**Integrations** define the actual service connections (MongoDB, Kafka, etc.) with their configuration.

This two-level approach allows you to:
- Swap integrations without changing worker code
- Share integrations across multiple modules
- Configure per-environment (dev, staging, prod)

**Available Integration Types:**
- **Messaging:** Kafka, RabbitMQ
- **Data:** MongoDB
- **Search:** OpenSearch
- **Communication:** Twilio, Mailgun
- **Utility:** Crypto, OpenAI, Strapi

---

## Getting Started

For detailed implementation guidance, see:

- **[Creating Ecosystems Guide](/dev/patterns/creating-ecosystems)** — Step-by-step implementation
- **[Creating Integrations Guide](/dev/patterns/creating-integrations)** — Building custom integrations
- **[Worker Ecosystems](/core/worker-ecosystems)** — Understanding the worker model
- **[Bridge Architecture](/core/bridge-architecture)** — How the Bridge works

---

**Custom Ecosystems: Your workers, your community, our foundation.**
