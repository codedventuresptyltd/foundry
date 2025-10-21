---
slug: translator-framework-shipped
title: The Translator Framework - Static Services Over Factories
authors: [codedventures]
tags: [translator, cxml, architecture, implementation]
---

# The Translator Framework - Static Services Over Factories

We just shipped the Translator Framework — a registry-driven system for converting Engagements into external formats like cXML, EDI, and UBL. What started as a factory pattern spec evolved into something more aligned with our existing patterns.

<!-- truncate -->

## The Problem

B2B commerce means talking to dozens of external systems, each with their own format:
- Ariba wants cXML
- Government portals want UBL
- ERPs want custom XML or EDI
- Partners want specific JSON schemas

Without a framework, you end up with scattered transformation logic, no way to override field mappings per client, and breaking changes whenever your internal models evolve.

## The Solution

We built a three-part system:

1. **Config** — Declarative field mappings stored in code or MongoDB
2. **Transformer** — TypeScript classes that extract and format data
3. **Template** — Output structure with placeholder interpolation

The key decision? **Static service class** instead of instantiated factories.

## Why Static?

The original spec called for a factory pattern:

```typescript
const factory = new TranslatorFactory();
factory.register('cxml.punchout.orderMessage', definition);
```

We implemented it as a static service:

```typescript
TranslatorService.register('cxml.punchout.orderMessage', definition);
```

**Why?** Consistency. Our pricing module already uses this pattern. One less thing to instantiate, one less dependency to inject, same mental model across the codebase.

## Config-Driven Field Mapping

Here's where it gets interesting. Each translator has a default config:

```typescript
export const orderMessageConfig = {
  mappings: {
    "buyerCookie": "actors[0].attributes.accountId",
    "shipTo.name": "actors[2].attributes.shipping_address.first_name"
  },
  defaults: {
    "currency": "USD",
    "uom": "piece"
  }
};
```

But clients can override these mappings via MongoDB. Change field paths without touching code. Deploy mapping changes independently.

This is **configuration as infrastructure** — the system adapts to client needs without custom code.

## Template Engine Simplicity

We kept the template engine deliberately simple:

- Placeholder replacement: `{{field}}`
- Nested properties: `{{user.address.city}}`
- Safe null handling

**No loops yet.** For templates with iterations, transformers implement custom rendering functions. We'll add loops when we need them, not before.

This is **YAGNI in practice** — ship what works, evolve based on real requirements.

## Hard Imports, No File I/O

Another deviation from the spec: we use hard imports instead of runtime file reading.

**Spec approach:**
```typescript
const template = readFileSync('template.xml');
```

**Implemented:**
```typescript
import { template } from './template';
```

**Benefits:**
- Compile-time validation
- Bundle-friendly
- No runtime file system dependencies
- Works in any environment

## Bridge Integration

Translators are exposed through the Bridge as a property:

```typescript
const bridge = new meshBridgeModel('my-service');
const xml = bridge.translators.run('cxml.punchout.orderMessage', engagement);
```

This follows our **Bridge as abstraction layer** pattern — everything goes through the Bridge, nothing talks directly to underlying services.

## MongoDB Config Storage

We added a MongoDB module for storing and retrieving translator configs:

```typescript
await bridge.integrations.mongoDb.module_translator
  .translator_getConfigByName('client_custom_mappings');
```

This wasn't in the original spec, but it emerged naturally from the config-driven design. Store client-specific mappings in the database, merge them at runtime.

**Evolution over specification** — we let implementation details guide us toward better patterns.

## Admin Testing Interface

We also built admin API endpoints for testing:

- List registered translators
- Get config structure
- Run translator with real engagement data

This provides a **testing interface without writing code** — essential for validating client-specific mappings.

## Performance Characteristics

The benchmarks are promising:

- Translation: 1-2ms per operation
- Registry lookup: O(1) via Map
- No runtime file I/O
- Stateless transformers

**Fast by design** — simple lookups, minimal overhead, no I/O bottlenecks.

## What We Learned

### 1. Match Existing Patterns
The static service pattern works because it matches what we already do elsewhere. Consistency matters more than theoretical purity.

### 2. Config as First-Class
Making field mappings configurable from day one means clients can adapt without custom code. This scales.

### 3. Hard Imports Win
Compile-time imports are cleaner, safer, and more portable than runtime file reading. Choose explicitness.

### 4. Ship Simple, Evolve Based on Need
We could have built a full template engine with loops and conditionals. Instead, we shipped placeholders and custom functions. That's enough for now.

### 5. Let Implementation Guide Design
The MongoDB config storage emerged during implementation. The admin API emerged from testing needs. Let reality inform your design.

## What's Next

The translator framework is production-ready and handling cXML punchout orders. Next up:

- Additional cXML message types (invoices, order confirmations)
- UBL format support for government procurement
- Template engine enhancements (loops, conditionals)
- Translator versioning system

But we'll add these **when clients need them**, not because we think they might be useful.

## The Principle

**Build systems that adapt to client needs through configuration, not customization.**

The Translator Framework embodies this — same code, different configs, diverse outputs. That's how you scale without fracturing your codebase.

---

**Translator Framework: One model, infinite formats.**


