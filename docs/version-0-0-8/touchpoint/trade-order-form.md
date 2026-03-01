---
sidebar_position: 5
title: Trade Order Form
---

# Trade Order Form
**Module:** B2B order entry interface optimized for professional buyers.

---

## What It Is

The **Trade Order Form** is a Touchpoint module designed for bulk order entry in B2B contexts. It provides a streamlined interface for customers who know product SKUs and need to build multi-line orders quickly.

Unlike consumer-focused shopping UIs, the Trade Order Form prioritizes speed and efficiency over product discovery.

---

## Core Features

### Passwordless Access

Uses time-limited, secure tokens (magic links) for order access:
- No registration or password management
- Token-based authentication
- Session-specific access
- Reduces friction for one-time or occasional buyers

### Line-Item Order Entry

Optimized for professional buyers:
- SKU-based product lookup
- Keyboard-driven input
- Multi-line entry support
- Autocomplete and validation

### Multi-Drop Order Splitting

Engagement can contain multiple delivery locations:
- Orders automatically split by delivery address and date
- Each drop processed as separate fulfillment
- Totals calculated per delivery location
- Single engagement, multiple fulfillment plans

**Implementation:** Worker processes engagement and creates split job cards based on delivery address grouping.

### Account-Based Pricing

Customer-specific pricing applied automatically:
- Pricing snapshots loaded for authenticated account
- Customer tier and contract pricing
- Volume breaks per customer
- Zone-specific pricing

**Data flow:** Account ID → Load pricing snapshot → Apply rules via pricing engine

---

## Technical Architecture

### Trade Order Engagement Model

The Trade Order Form extends the base engagement model with trade-specific metadata:

**Base Engagement:**
- Customer ID
- Line items
- Pricing
- Fulfillment
- Status

**Trade Order Extension:**
- **Account context** — Trade account ID, pricing tier, payment terms
- **Multi-drop metadata** — Delivery locations with dates and instructions per drop
- **Custom lists** — References to saved lists or templates
- **Order references** — Customer PO numbers, job codes, project IDs
- **Split fulfillment** — Multiple fulfillment plans per delivery location

**Example engagement metadata:**
```
engagement.metadata: {
  accountId: "ACC-123",
  pricingTier: "platinum",
  customerPO: "PO-2024-789",
  deliveryDrops: [
    { location: "Site A", date: "2026-02-15", instructions: "Loading dock" },
    { location: "Site B", date: "2026-02-18", instructions: "Front entrance" }
  ],
  fromTemplate: "monthly-reorder-list"
}
```

Workers process this extended model to handle multi-drop splitting, account pricing, and template-based ordering.

---

## UOM-Aware Fulfillment

### Multiple Unit Types

Products can be ordered in different units of measure:

**Unit-based:**
- Individual pieces (e.g., bolts, fittings)

**Length-based:**
- Linear meters (e.g., cable, pipe, timber)
- Can be cut to custom lengths

**Weight-based:**
- Tons, kilograms (e.g., aggregate, bulk materials)

### Packaging Configurations

Same product, different packaging options:

**Example: Screws**
- Unit (individual screws)
- Box (100-pack)
- Crate (bulk 5000-pack)

**Example: Cable**
- Unit (per meter, cut to length)
- Drum (100m pre-packaged)
- Reel (500m industrial)

---

## Product Configuration

### Modifiers and Add-Ons

Products can have attached modifiers:
- Finishes or treatments
- Fitting kits or accessories
- Installation services
- Packaging options

**Implementation:** Modifier selections update engagement line item configuration, trigger recalculation via worker.

### Custom Lists

Reusable product lists stored per customer:
- Job-specific bundles
- Frequently ordered items
- Saved carts
- Template orders

**Storage:** Lists stored as engagement templates, can be loaded to create new engagement.

---

## Trade Search

Multiple search configs for different product categories:

**Example: Timber Search Config**
- Indexing: Dimensions, grade, treatment, length
- Algorithm: Exact match priority (customers know codes)
- Filters: Material, grade, dimensions, treatment
- Results: Compact display with specs

**Example: General Supplies Config**
- Indexing: Name, category, brand
- Algorithm: Relevance scoring
- Filters: Category, price range, in stock
- Results: Visual cards with images

---

## Learn More

- **[Abstracted Business Logic](/touchpoint/commercebridge-integration)** — How calculations work
- **[Slot-Based UI](/touchpoint/slot-based-ui)** — Component rendering
- **[Search](/touchpoint/search)** — Search configuration
- **[Touchpoint Overview](/touchpoint)** — Complete framework

---

**Trade Order Form: Fast bulk ordering for professional buyers.**
