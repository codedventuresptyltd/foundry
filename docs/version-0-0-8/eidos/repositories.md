---
sidebar_position: 3
title: Repositories
---

# Repositories
**Concept:** Contextual instances of product DNA distributed across the supply chain.

---

## What Is a Repository?

A **repository** is a node in the product data hierarchy that holds **live product data for a specific context**.

While the Eidos defines what a product conceptually is, repositories hold **contextual variations of that definition**:
- Which product variations are available
- Local attribute overrides
- Context-specific relationships
- Regional or market adaptations

Each repository represents a real-world entity in the supply chain: suppliers, distributors, regional centers, stores.

**Note:** Repositories hold product **definitions**, not operational data. Inventory, pricing, and fulfillment live in CommerceBridge datastores, not in Eidos repositories.

---

## Repository Hierarchy

```
Eidos Definition: 90×45 Structural Pine Timber
│
├── Supplier A (Repository)
│   ├── Distributor A (Repository)
│   │   ├── Region 1 (Repository)
│   │   │   ├── Store 1 (Repository)
│   │   │   └── Store 2 (Repository)
│   │   └── Region 2 (Repository)
│   │       └── Store 3 (Repository)
│   └── Distributor B (Repository)
│       └── Region 1 (Repository)
│           └── Store 4 (Repository)
└── Supplier B (Repository)
    └── Distributor C (Repository)
        └── Store 5 (Repository)
```

Each level adds contextual data while inheriting from above.

---

## Inheritance and Propagation

### Downward Flow

Updates flow from parent to child repositories:

**Supplier updates product specification** → Change propagates to all downstream repositories (distributors, regions, stores)

**Distributor adds regional pricing** → Change propagates to regions and stores under that distributor

**Region updates delivery zones** → Change propagates to stores in that region

### Local Overrides

Child repositories can override inherited data:

**Example:**
- **Supplier A defines:** "Available in 3.6m and 4.8m lengths"
- **Store 2 overrides:** "We only stock 3.6m" (local inventory limitation)
- **Result:** Store 2 shows only 3.6m; other stores show both lengths

Overrides stop propagation — if a child changes something, that change doesn't flow further down.

---

## Repository Context

Each repository represents a specific business context:

### Supplier Repository
- Master product catalog
- Base specifications
- Manufacturing variations
- Source-level relationships

### Distributor Repository
- Distribution network product variations
- Regional market adaptations
- Distributor-specific product filtering
- Territory-specific certifications

### Regional Repository
- Geographic market variations
- Local compliance requirements
- Regional product availability
- Market-specific adaptations

### Store Repository
- Customer-facing catalog definition
- Store-specific product variations
- Local product filtering
- Context-specific relationships

---

## What Lives in a Repository

**Inherited from Eidos:**
- Product purpose and usage
- Core attributes
- Base relationships
- Behavior rules

**Added at Repository Level:**
- Available variations (which lengths, colors, grades)
- Local attribute values (regional certifications, market-specific specs)
- Context-specific relationships (alternative products available in this market)
- Filtered options (products this repository chooses to offer)

**Example — Store 1's Repository for "90×45 Structural Pine":**
```
Eidos (inherited):
  - Purpose: Load-bearing construction
  - Material: Pine
  - Standard dimensions: 90×45mm
  - Fire rating options
  
Repository (local):
  - Available lengths: 3.6m, 4.8m (we don't stock 6m)
  - Fire rating: Standard only (we don't stock fire-rated)
  - Regional certification: AU/NZ standards
  - Complementary products: Local nail and bracket variants
```

**Operational data** (inventory levels, pricing, warehouse location) is managed by CommerceBridge, not stored in Eidos repositories.

---

## Repository Updates

### Push from Above
Parent repository changes propagate downward:
- Supplier updates specification → All downstream repositories inherit change
- Automatic, controlled flow
- Children can still override if needed

### Pull from Below
Child repositories can request specific variations or extensions (not automatic — requires approval or sync).

---

## Repository Isolation

Each repository operates independently:
- Store 1's inventory is separate from Store 2's
- Pricing can vary by repository
- Local overrides don't affect siblings
- Parallel branches evolve independently

**Example:**
- Distributor A can have different pricing than Distributor B
- Both inherit the same DNA, but contextual data differs

---

## Integration with CommerceBridge

When Touchpoint displays products or CommerceBridge processes orders:

1. **Identify context** — Which store/region/distributor?
2. **Resolve repository** — Find the correct repository for that context
3. **Load product data** — Fetch data from that repository (includes inherited DNA + local overrides)
4. **Apply pricing/fulfillment** — Use repository-specific rules

**Result:** Each customer sees products appropriate to their context, with pricing and availability specific to their location/channel.

---

## Learn More

- **[What is an Eidos?](/eidos/product-dna)** — The complete product definition
- **[Relationships](/eidos/relationships)** — How purpose and usage link products
- **[Eidos Overview](/eidos)** — Framework overview

---

**Repositories: Global Eidos, local context.**

