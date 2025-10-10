---
sidebar_position: 4
title: Slot-Based UI
---

# Slot-Based UI

:::info Coming Soon
Detailed slot architecture documentation is being prepared.
:::

Touchpoint uses a slot-based architecture where UI components are dynamically composed based on context.

## Benefits

- Highly customizable without code changes
- Context-aware rendering
- Tenant-specific customization
- Easy A/B testing

## Example

```typescript
<ProductDetailSlot
  product={product}
  context="cart"
  userRole="buyer"
  tenant={tenant}
/>
```

The same slot renders differently based on context, user, and tenant.

