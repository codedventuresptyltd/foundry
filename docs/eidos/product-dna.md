---
sidebar_position: 2
title: Product DNA
---

# Product DNA
**Concept:** Defining the genetic code of products.

## What It Is

Product DNA is the complete definition of what makes a product:
- Its attributes and options
- Valid configurations
- How it behaves in different contexts
- How it relates to other products

## Structure

### Attributes

The characteristics that define the product:

```ts
interface ProductDNA {
  attributes: {
    material: {
      type: 'enum'
      values: ['steel', 'aluminum', 'composite']
      required: true
    }
    finish: {
      type: 'enum'
      values: ['powder-coated', 'anodized', 'bare']
      required: false
    }
    dimensions: {
      type: 'object'
      schema: {
        length: 'number'
        width: 'number'
        height: 'number'
      }
    }
  }
}
```

### Constraints

Rules about valid combinations:

```ts
constraints: [
  {
    condition: { material: 'composite' },
    then: { finish: { in: ['powder-coated'] } },
    message: 'Composite only supports powder-coated finish'
  }
]
```

### Behaviors

How configuration affects other systems:

```ts
behaviors: {
  pricing: [
    {
      when: { material: 'composite' },
      modifier: { type: 'upcharge', value: 1.25 }
    }
  ],
  fulfillment: [
    {
      when: { material: 'steel', finish: 'powder-coated' },
      leadTime: { add: 3, unit: 'days' }
    }
  ]
}
```

## Use in Systems

### Pricing

Eidos rules affect price calculation:

```ts
// User configures product
const config = {
  material: 'composite',
  finish: 'powder-coated'
}

// Eidos provides pricing behavior
const behavior = eidos.getPricingBehavior(productId, config)
// Returns: { modifier: 1.25 upcharge }

// Pricing engine applies
const price = basePrice * 1.25
```

### Fulfillment

Eidos rules affect lead times:

```ts
const behavior = eidos.getFulfillmentBehavior(productId, config)
// Returns: { leadTime: +3 days }

const estimatedShip = today + standardLeadTime + 3
```

### UI

Eidos drives dynamic forms:

```ts
// Get schema
const schema = eidos.getProductSchema(productId)

// Render form fields
for (const [key, attr] of Object.entries(schema.attributes)) {
  renderField(key, attr.type, attr.values)
}

// Validate on change
const errors = await eidos.validate(productId, configuration)
```

## Extension Points

Define custom attribute types:

```ts
// Register custom type
eidos.registerAttributeType('temperature-range', {
  validate: (value) => value.min < value.max,
  display: (value) => `${value.min}-${value.max}°F`
})
```

## IP Safety

This describes:
- **Public:** DNA concept, attribute patterns, behavior model
- **Private (not shown):** Specific product schemas, actual business rules

---

**Product DNA: Define once, use everywhere.**
