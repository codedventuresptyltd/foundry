---
sidebar_position: 1
title: Eidos
---

# Eidos

**Structured Knowledge for Configurable Products**

Eidos is a system for defining the **genetic makeup** of products. It models product DNA, business rules, and configuration logic, enabling sophisticated product configuration, pricing, and fulfillment behaviors.

---

## Why Eidos?

Complex products need more than just attributes and SKUs. They need:

- **Structured Knowledge** — formal definitions of what makes a product
- **Rule-Based Configuration** — what combinations are valid
- **Dynamic Behavior** — how configuration affects pricing, fulfillment, and display
- **Extensibility** — new product types without code changes
- **Versioning** — evolve product definitions over time

Eidos provides this foundation, allowing products to "know themselves" and their rules.

---

## Core Concepts

### Product DNA

Every product has a "genetic code" defined by:

- **Attributes** — the characteristics that define the product
- **Constraints** — rules about valid configurations
- **Behaviors** — how the product responds to context
- **Relationships** — how it connects to other products or systems

```json
{
  "productDNA": {
    "type": "ConfigurableProduct",
    "attributes": {
      "material": {
        "type": "enum",
        "values": ["steel", "aluminum", "composite"],
        "required": true
      },
      "finish": {
        "type": "enum",
        "values": ["powder-coated", "anodized", "bare"],
        "constraints": {
          "if": { "material": "aluminum" },
          "then": { "values": ["anodized", "bare"] }
        }
      },
      "dimensions": {
        "type": "object",
        "schema": { "length": "number", "width": "number", "height": "number" }
      }
    },
    "pricing": {
      "basePrice": "computed",
      "modifiers": ["material_upcharge", "finish_upcharge", "custom_dimensions"]
    }
  }
}
```

[Learn more about Product DNA →](/eidos/product-dna)

### Data Schema Model

Eidos uses a **schema-driven approach** where:

1. **Schemas define structure** — what attributes exist and their types
2. **Rules define validity** — what combinations are allowed
3. **Behaviors define outcomes** — how configuration affects other systems

This separation allows:

- Schema changes without code deployment
- Rule updates by business users
- Testing and validation before activation
- Versioning and rollback capabilities

[Learn more about Data Schema →](/eidos/data-schema)

---

## Integration with CommerceBridge

Eidos integrates deeply with CommerceBridge to influence:

### Pricing

Product configurations drive pricing logic:

```typescript
// Eidos configuration affects price calculation
const configuration = {
  material: 'steel',
  finish: 'powder-coated',
  dimensions: { length: 120, width: 60, height: 80 }
};

// CommerceBridge pricing engine uses Eidos rules
const pricing = await bridge.pricing.calculate({
  product,
  configuration,
  quantity: 100,
  deliveryZone: 'US-MIDWEST'
});
```

### Fulfillment

Configuration affects fulfillment behavior:

- Lead times based on material availability
- Manufacturing location based on capabilities
- Packaging requirements based on dimensions
- Shipping restrictions based on configuration

### Presentation

Touchpoint uses Eidos to render configuration UIs:

- Dynamic form generation from schemas
- Real-time validation of configurations
- Contextual help and documentation
- Visual previews when available

[Learn more about CommerceBridge Integration →](/eidos/commercebridge-integration)

---

## Use Cases

### Configurable Manufacturing

**Example: Custom industrial equipment**

- Customer selects base model
- Configures options (motor size, controls, accessories)
- Eidos validates compatibility
- Pricing updates in real-time
- Lead time calculated based on configuration

### Complex Bundles

**Example: Service packages**

- Multiple products bundled together
- Rules about valid combinations
- Dependency management
- Bundle-level pricing rules

### Variable Products

**Example: Materials with custom dimensions**

- Base product (e.g., steel plate)
- Custom dimensions within constraints
- Material properties affect pricing
- Weight and shipping calculations

---

## Rule Sets

Eidos uses declarative rule sets to define business logic:

### Validation Rules

```json
{
  "rules": [
    {
      "name": "finish_compatible_with_material",
      "condition": {
        "if": { "material": "composite" },
        "then": { "finish": { "in": ["powder-coated"] } }
      },
      "message": "Composite materials only support powder-coated finish"
    }
  ]
}
```

### Pricing Rules

```json
{
  "pricingRules": [
    {
      "name": "custom_dimension_upcharge",
      "condition": {
        "dimensions.length": { "gt": 100 }
      },
      "action": {
        "modifier": "multiply",
        "value": 1.15,
        "reason": "Oversized fabrication fee"
      }
    }
  ]
}
```

### Fulfillment Rules

```json
{
  "fulfillmentRules": [
    {
      "name": "composite_material_lead_time",
      "condition": {
        "material": "composite"
      },
      "action": {
        "leadTime": { "add": 7, "unit": "days" },
        "reason": "Composite materials require special processing"
      }
    }
  ]
}
```

[Learn more about Rule Sets →](/eidos/rule-sets)

---

## Extensibility

Eidos is designed to be extended without code changes:

### Custom Attribute Types

Define new attribute types:

```typescript
// Register a custom attribute type
eidos.registerAttributeType('temperature-range', {
  validate: (value) => {
    return value.min < value.max && value.unit in ['C', 'F'];
  },
  serialize: (value) => `${value.min}-${value.max}°${value.unit}`,
  parse: (str) => { /* parsing logic */ }
});
```

### Custom Validators

Add domain-specific validation:

```typescript
// Custom validator for industry standards
eidos.registerValidator('astm-compliant', {
  validate: async (product, configuration) => {
    // Check against ASTM standards database
    return await astmService.validate(configuration);
  }
});
```

### Custom Behaviors

Define how configurations affect systems:

```typescript
// Custom behavior for specialized fulfillment
eidos.registerBehavior('requires-heat-treatment', {
  onConfigurationChange: async (config) => {
    if (config.material === 'steel' && config.hardness > 50) {
      return { requiresHeatTreatment: true, additionalLeadTime: 3 };
    }
  }
});
```

---

## Architecture

Eidos is implemented as:

1. **Schema Storage** — MongoDB for schema definitions
2. **Rule Engine** — JavaScript-based rule evaluation
3. **Validation Service** — Real-time configuration validation
4. **Integration Layer** — Hooks into CommerceBridge events

```
┌─────────────┐
│   Eidos     │ (Schema & Rules)
│   Engine    │
└──────┬──────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────┐              ┌─────────────┐
│   Pricing   │              │ Fulfillment │
│   Engine    │              │   Engine    │
└─────────────┘              └─────────────┘
       │                              │
       └──────────┬───────────────────┘
                  ▼
          ┌─────────────┐
          │ Touchpoint  │ (UI)
          └─────────────┘
```

---

**Eidos: Where products know themselves.**

