---
sidebar_position: 1
title: Touchpoint
---

# Touchpoint

**Dynamic Ordering Experiences for Trade & Industry**

Touchpoint is a modern, slot-based UI framework for building configurable ordering experiences. It provides both admin and customer-facing layers that deeply integrate with CommerceBridge to deliver real-time pricing, inventory, and fulfillment information.

---

## Why Touchpoint?

B2B commerce requires sophisticated, configurable interfaces that can adapt to different industries, products, and workflows. Touchpoint provides:

- **Slot-Based Architecture** — composable UI components that adapt to context
- **Dual Layers** — admin tools and customer-facing storefronts from one codebase
- **Real-Time Data** — pricing, availability, and fulfillment calculated on-demand
- **Configurable Workflows** — adapt to industry-specific requirements
- **CommerceBridge Native** — built from the ground up to leverage engagement patterns

---

## Core Concepts

### Slot-Based UI Model

Touchpoint uses a **slot-based component architecture** where UI elements are dynamically composed based on:

- Product type and configuration
- User role and permissions
- Tenant customizations
- Workflow stage

```typescript
// Slots adapt based on context
<ProductDetailSlot
  product={product}
  context="cart"
  userRole="buyer"
  tenant={tenant}
/>
```

This allows the same component system to power vastly different experiences without rebuilding the interface.

[Learn more about Slot-Based UI →](/touchpoint/slot-based-ui)

### Admin vs Storefront

Touchpoint provides **two interconnected layers**:

#### Admin Layer

The admin interface enables:

- Product catalog management
- Pricing rule configuration
- Fulfillment zone setup
- Customer account management
- Order processing and tracking
- System configuration

#### Storefront Layer

The customer-facing experience provides:

- Product discovery and search
- Real-time pricing and availability
- Cart building with live calculations
- Checkout and order placement
- Order tracking and history
- Account management

Both layers share the same underlying component system but render different slot configurations.

[Learn more about Admin vs Storefront →](/touchpoint/admin-vs-storefront)

---

## Key Features

### Real-Time Pricing

Touchpoint integrates with CommerceBridge's pricing engine to provide:

- Live price calculations as users build carts
- Quantity break visualization
- Delivery zone-based pricing
- Customer-specific pricing rules
- Multi-stage modifier application

### Dynamic Search

Sophisticated product discovery powered by OpenSearch:

- Full-text search across product attributes
- Spatial filtering (delivery zones, proximity)
- Faceted navigation
- Real-time availability filtering
- Configurable result ranking

### Configurable Products

Deep integration with Eidos for product configuration:

- Rule-based product options
- Dynamic attribute displays
- Configuration validation
- Price impact visualization
- Save and recall configurations

### Multi-Tenant Customization

Each tenant can customize:

- Branding and themes
- Product catalog visibility
- Workflow configurations
- UI slot arrangements
- Feature flags and options

---

## Architecture

### Frontend Stack

- **Angular** — component framework
- **TypeScript** — type-safe development
- **RxJS** — reactive state management
- **SCSS** — modular styling
- **Angular Material** — base component library

### Backend Integration

Touchpoint communicates with CommerceBridge through:

- **Experience Layer APIs** — Express.js endpoints that proxy to the Bridge
- **WebSocket Connections** — real-time updates for pricing and availability
- **Event Streams** — order status and fulfillment updates
- **Caching Layers** — Redis for performance optimization

```
┌─────────────┐
│  Touchpoint │ (Angular Frontend)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Experience  │ (Express.js APIs)
│   Layer     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Commerce    │ (Bridge + Workers)
│   Bridge    │
└─────────────┘
```

[Learn more about CommerceBridge Integration →](/touchpoint/commercebridge-integration)

---

## Use Cases

### Trade & Distribution

- Multi-location inventory management
- Bulk ordering with quantity breaks
- Delivery zone-based pricing and availability
- Customer-specific catalogs and pricing

### Manufacturing

- Configurable product ordering (Eidos integration)
- Lead time calculation and display
- Production scheduling integration
- Made-to-order workflows

### Food Service

- Unit of measure conversions (each, case, pallet)
- Temperature-controlled delivery zones
- Scheduled delivery windows
- Recurring order patterns

---

## Customization

Touchpoint is designed to be extended and customized:

### Theme Customization

```scss
// Tenant-specific theme overrides
:root {
  --primary-color: #your-brand-color;
  --accent-color: #your-accent;
  // ... more theme variables
}
```

### Slot Customization

```typescript
// Custom slot implementation
@Component({
  selector: 'app-custom-product-detail',
  template: `...`
})
export class CustomProductDetailComponent implements ProductSlot {
  // Custom logic for your industry
}
```

### Workflow Customization

Configure workflows to match your business processes:

- Multi-step approvals
- Custom validation rules
- Integration with external systems
- Industry-specific requirements

[Learn more about Customization →](/touchpoint/customization)

---

## Example Flows

### Product Search to Cart

1. User searches for products with location context
2. OpenSearch returns relevant results filtered by delivery zones
3. User views product detail with real-time pricing
4. User adds to cart, triggering live price calculation
5. Cart displays pricing, availability, and delivery options

### Checkout and Order Placement

1. User reviews cart with final pricing
2. User selects delivery location and date preferences
3. Fulfillment options calculated in real-time
4. User confirms order
5. Engagement created in CommerceBridge
6. Worker processes order and updates inventory
7. Customer receives confirmation and tracking

[View more Example Flows →](/touchpoint/example-flows)

---

## Next Steps

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🎨 UI Architecture</h3>
      </div>
      <div className="card__body">
        <p>Learn about the slot-based component system</p>
        <a href="/touchpoint/slot-based-ui">Slot-Based UI →</a>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🔧 Customization</h3>
      </div>
      <div className="card__body">
        <p>Extend and customize Touchpoint for your needs</p>
        <a href="/touchpoint/customization">Customization Guide →</a>
      </div>
    </div>
  </div>
</div>

---

**Touchpoint: Crafted experiences for modern commerce.**

