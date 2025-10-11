---
sidebar_position: 2
title: What is an Eidos?
---

# What is an Eidos?
**Concept:** The complete conceptual definition that captures purpose, usage, and structure.

---

## What It Is

An **Eidos** is the genetic blueprint that defines what a product fundamentally is:

- **Purpose** — Why this product exists (structural support, electrical connection, fastening)
- **Usage** — How this product is used (construction framing, wiring installations, assembly)
- **Attributes** — Core characteristics (material, dimensions, specifications)
- **Relationships** — How this product relates to others (complements, alternatives, components)

The Eidos is **conceptual**, not operational. It defines the "what" and "why" of a product, independent of inventory, pricing, fulfillment, or transactional data.

---

## Eidos vs Repository Data

**Eidos:**
- Conceptual definition
- Purpose and usage
- Global attributes
- Relationship patterns

**Repository Data:**
- Contextual instance
- Local variations
- Filtered product options
- Context-specific attributes

**Example:**

**Eidos:** "90×45 Structural Pine Timber is a construction material used for framing, with standard dimensions and grade specifications."

**Repository (Store 5):** "We offer this in 3.6m and 4.8m lengths (not 6m), standard grade only (not fire-rated), meets AU/NZ building codes."

---

## Purpose and Usage

### Purpose: Why It Exists

Defines the fundamental reason for the product:
- **Structural timber** → Purpose: Load-bearing construction
- **Electrical cable** → Purpose: Power transmission
- **Fastener** → Purpose: Joining materials

### Usage: How It's Applied

Defines the contexts where the product is used:
- **Structural timber** → Usage: Wall framing, roof trusses, floor joists
- **Electrical cable** → Usage: Building wiring, industrial installations
- **Fastener** → Usage: Wood joinery, metal assembly

This contextual information helps systems:
- Recommend complementary products
- Validate configurations
- Apply appropriate pricing rules
- Guide customers to correct products

---

## Attributes and Structure

DNA defines the **core attributes** that describe the product:

### Fixed Attributes
Unchanging characteristics:
- Material type
- Standard dimensions
- Grade or specification
- Regulatory certifications

### Variable Attributes
Context-dependent characteristics:
- Available lengths (in different repositories)
- Color options (in different markets)
- Packaging variations (bulk vs retail)

---

## Relationships

DNA defines how products relate to each other:

### Complementary Products
Products used together:
- Structural timber → Complemented by: Nails, brackets, moisture barrier
- Electrical cable → Complemented by: Conduit, junction boxes, terminals

### Alternative Products
Substitutable products:
- 90×45 Structural Pine → Alternative: 90×45 Treated Pine (outdoor use)
- Standard cable → Alternative: Armored cable (high-risk environments)

### Component Relationships
Products that are part of larger assemblies:
- Door frame → Components: Timber lengths, hinges, screws
- Electrical panel → Components: Breakers, bus bars, enclosure

---

## How Eidos Propagates

When the Eidos updates, changes flow through the repository hierarchy:

```
Update Eidos: Add new attribute "Fire Rating"
  ↓
Supplier repository inherits change
  ↓
Distributor repositories inherit change
  ↓
Regional repositories inherit change
  ↓
Store repositories inherit change
```

**Repositories can override** if needed (e.g., Store 3 doesn't sell fire-rated products, so it filters that variation).

---

## Learn More

- **[Repositories](/eidos/repositories)** — How Eidos instances are distributed
- **[Relationships](/eidos/relationships)** — How purpose and usage connect products
- **[Eidos Overview](/eidos)** — Complete framework overview

---

**Eidos: The conceptual blueprint of what a product is.**
