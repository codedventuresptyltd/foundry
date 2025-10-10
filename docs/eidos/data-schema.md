---
sidebar_position: 3
title: Data Schema
---

# Data Schema
**Concept:** Schema-driven product modeling.

## Approach

Eidos uses schemas to define product structure:

### 1. Type Definitions

Define attribute types:
- String, Number, Boolean
- Enum (fixed values)
- Object (nested structure)
- Array (multiple values)

### 2. Product Schemas

Define product-specific structures:
- Which attributes exist
- What types they are
- Whether they're required
- Valid value ranges

### 3. Validation Rules

Define constraints:
- Required fields
- Value ranges
- Conditional requirements
- Cross-attribute dependencies

## Schema Example

```ts
const productSchema = {
  id: 'industrial-valve',
  version: '1.0',
  attributes: {
    size: {
      type: 'enum',
      values: ['1-inch', '2-inch', '4-inch'],
      required: true
    },
    material: {
      type: 'enum',
      values: ['brass', 'stainless-steel'],
      required: true
    },
    pressure-rating: {
      type: 'number',
      min: 100,
      max: 3000,
      unit: 'PSI',
      required: true
    },
    certification: {
      type: 'enum',
      values: ['ANSI', 'API', 'ASME'],
      required: false
    }
  },
  constraints: [
    {
      if: { material: 'brass' },
      then: { 'pressure-rating': { max: 1500 } },
      reason: 'Brass limited to 1500 PSI'
    }
  ]
}
```

## Benefits

### No Code Deployments

Change product definitions without deploying code:
1. Update schema in admin interface
2. Schema saved to data store
3. Changes take effect immediately
4. All systems use new schema

### Consistency

Single source of truth:
- UI renders from schema
- Validation uses schema
- Pricing consults schema
- All systems synchronized

### Versioning

Schema versions tracked:
- Products reference schema version
- Can update schema without breaking existing configurations
- Migration paths defined

## IP Safety

This describes:
- **Public:** Schema concept, validation approach, versioning model
- **Private (not shown):** Actual product schemas, storage structure

---

**Schemas: Define structure, enforce consistency.**
