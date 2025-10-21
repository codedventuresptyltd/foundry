---
sidebar_position: 7
title: Pricing Engine
---

# Pricing Engine
Multi-stage price calculation engine with modifiers, volume breaks, and zone-based adjustments.

## Responsibilities

### Price Calculation
- Calculate final prices from base prices
- Apply multi-stage modifier chains
- Handle volume break tiers
- Process customer-specific pricing
- Adjust for delivery zones

### Snapshot Management
- Capture pricing state at engagement creation
- Store complete context for historical accuracy
- Enable price consistency throughout engagement lifecycle
- Support audit and compliance requirements

### Transparency
- Provide breakdown of all modifiers applied
- Show step-by-step calculation
- Maintain audit trail of price changes
- Support historical price snapshots

## Lifecycle

### 1. Base Price Retrieval
- Fetch product base price
- Apply current date/time context
- Check for promotional overrides

### 2. Modifier Application
Sequential application of modifiers:
- Volume break discounts
- Customer-specific pricing
- Delivery zone adjustments
- Custom tenant modifiers

## Price Modifiers

### Volume Breaks

Quantity-based tier pricing:

| Quantity | Price | Discount |
|----------|-------|----------|
| 1-9 | $10.00 | Base |
| 10-49 | $9.00 | 10% |
| 50-99 | $8.50 | 15% |
| 100+ | $8.00 | 20% |

### Customer Pricing

Customer-specific rates:
- Contract pricing
- Negotiated rates
- Account-level discounts

---

**Pricing Engine: Sophisticated, transparent, and fast.**
