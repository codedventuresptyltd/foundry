---
sidebar_position: 6
title: Customization
---

# Customization
**Pattern:** Adapting Touchpoint for specific industries and workflows.

## Customization Layers

### 1. Theme Customization

Visual branding and styling:

```scss
// Tenant-specific theme
:root {
  --primary-color: #your-brand-color;
  --accent-color: #your-accent;
  --font-family: 'Your Brand Font';
}
```

### 2. Slot Configuration

Which slots render and how:

```ts
const tenantConfig = {
  productDetailSlot: {
    showInventory: true,
    showDetailedPricing: true,
    layout: 'detailed'
  },
  checkoutSlot: {
    steps: ['cart', 'delivery', 'payment', 'confirm'],
    requireAccountReview: true
  }
}
```

### 3. Workflow Configuration

Industry-specific flows:

```ts
const workflows = {
  checkout: ['cart', 'approval', 'payment', 'confirm'],  // Added approval step
  productConfig: ['select-base', 'configure', 'validate', 'pricing'],
  returns: ['request', 'approval', 'shipping', 'refund']
}
```

### 4. Feature Flags

Enable/disable features per tenant:

```ts
const features = {
  advancedSearch: true,
  configurableProducts: true,
  multiWarehouse: true,
  recurringOrders: false
}
```

## Customization Examples

### Manufacturing Industry

```ts
const manufacturingConfig = {
  productSlots: {
    showLeadTime: true,
    showSpecifications: true,
    enableConfiguration: true
  },
  checkoutWorkflow: ['cart', 'configuration-review', 'quote-request', 'approval'],
  features: {
    configurableProducts: true,
    quotingWorkflow: true
  }
}
```

### Food Service

```ts
const foodServiceConfig = {
  productSlots: {
    showUOM: true,  // Each, case, pallet
    showTemperatureReqs: true,
    showDeliveryWindows: true
  },
  checkoutWorkflow: ['cart', 'delivery-window', 'payment', 'confirm'],
  features: {
    scheduledDelivery: true,
    temperatureTracking: true
  }
}
```

### Trade Distribution

```ts
const distributionConfig = {
  productSlots: {
    showBulkPricing: true,
    showWarehouseStock: true,
    showDeliveryZones: true
  },
  checkoutWorkflow: ['cart', 'bulk-discount-review', 'delivery', 'payment'],
  features: {
    bulkOrdering: true,
    multiWarehouse: true
  }
}
```

## Extension Points

### Custom Components

Replace default components with custom implementations:

```ts
// Register custom component
componentRegistry.register('product-configurator', {
  tenant: 'tenant-alpha',
  component: CustomProductConfigurator
})
```

### Custom Validators

Add industry-specific validation:

```ts
export class CustomValidator {
  async validateOrder(engagement: Engagement) {
    // Your validation logic
    if (engagement.total < this.minimumOrder) {
      throw new ValidationError('Below minimum order')
    }
  }
}
```

## IP Safety

This describes:
- **Public:** Customization patterns, configuration approach, extension points
- **Private (not shown):** Specific customizations, tenant themes, component implementations

---

**Customization: Make it yours.**
