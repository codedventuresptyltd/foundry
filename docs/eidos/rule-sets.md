---
sidebar_position: 4
title: Rule Sets
---

# Rule Sets
**Concept:** Declarative business logic for products.

## What They Are

Rule sets define business logic declaratively:
- Validation rules (what's allowed)
- Pricing rules (how config affects price)
- Fulfillment rules (how config affects delivery)
- Display rules (how config affects UI)

## Rule Types

### Validation Rules

Ensure configurations are valid:

```ts
{
  name: 'material-finish-compatibility',
  condition: {
    if: { material: 'composite' },
    then: { finish: { in: ['powder-coated'] } }
  },
  message: 'Composite materials only support powder coating',
  severity: 'error'
}
```

### Pricing Rules

Affect price calculation:

```ts
{
  name: 'composite-material-upcharge',
  condition: { material: 'composite' },
  action: {
    modifier: 'multiply',
    value: 1.20,
    reason: '20% upcharge for composite material'
  }
}
```

### Fulfillment Rules

Affect delivery and inventory:

```ts
{
  name: 'custom-dimension-lead-time',
  condition: { 'dimensions.length': { gt: 100 } },
  action: {
    leadTime: { add: 7, unit: 'days' },
    reason: 'Custom fabrication required'
  }
}
```

### Display Rules

Control UI presentation:

```ts
{
  name: 'show-certification-for-high-pressure',
  condition: { 'pressure-rating': { gte: 2000 } },
  action: {
    display: { show: ['certification'] },
    required: ['certification']
  }
}
```

## Rule Engine

### Evaluation

Rules evaluated when:
- User changes configuration
- Pricing calculated
- Availability checked
- Order placed

### Priority

Rules have priority order:
1. Validation rules (first)
2. Display rules
3. Pricing rules
4. Fulfillment rules

### Cascading

Rules can trigger other rules:

```
User selects material=composite
  ↓
Validation rule: finish must be powder-coated
  ↓
Pricing rule: 20% upcharge
  ↓
Fulfillment rule: +5 days lead time
```

## Example Flow

```ts
// User configures product
const config = {
  material: 'composite',
  finish: 'anodized',  // Invalid!
  dimensions: { length: 120 }
}

// Eidos validates
const validation = await eidos.validate(productId, config)

// Returns errors:
// [
//   {
//     field: 'finish',
//     message: 'Composite materials only support powder coating',
//     rule: 'material-finish-compatibility'
//   }
// ]

// User fixes
config.finish = 'powder-coated'

// Eidos validates again
const validation = await eidos.validate(productId, config)
// Valid!

// Eidos applies pricing rules
const pricingRules = await eidos.getPricingRules(productId, config)
// Returns: [{ modifier: 1.20, reason: 'Composite upcharge' }]

// Eidos applies fulfillment rules
const fulfillmentRules = await eidos.getFulfillmentRules(productId, config)
// Returns: [{ leadTime: +5 days, reason: 'Composite processing' }]
```

## Benefits

### Declarative Logic

Business rules as data, not code:
- Non-developers can update
- Version controlled
- Easy to test
- Clear documentation

### Centralized Rules

Single place for product logic:
- No scattered validation
- Consistent behavior
- Easier auditing

### Dynamic Updates

Change rules without deployment:
- Update rules in admin
- Changes effective immediately
- No code deployment needed

## IP Safety

This describes:
- **Public:** Rule concept, rule types, evaluation pattern
- **Private (not shown):** Specific business rules, rule engine implementation

---

**Rule Sets: Business logic as data.**
