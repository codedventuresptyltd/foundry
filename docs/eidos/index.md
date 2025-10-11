---
sidebar_position: 1
title: Eidos
---

# Eidos Overview

**Tagline:** The genetic layer that defines how product meaning and data evolve through distributed systems.

---

## What It Is

Eidos is a conceptual and structural framework for product definition within the Coded Ventures ecosystem. It defines **what a product is**, how it relates to its purpose and usage, and how it evolves through a network of connected repositories — from supplier to store.

Unlike traditional PIM (Product Information Management) systems that simply store product data, Eidos defines the **rules of inheritance, propagation, and variation** that govern how that data flows through an ecosystem.

**Eidos provides:**

- **Conceptual model for meaning** — Purpose, usage, relationships
- **Structural model for evolution** — Branching and propagation across nodes

---

## The Role of Eidos

Eidos sits above the repository hierarchy. It defines the **genetic pattern** that determines how product data behaves and evolves across connected contexts.

### Example: Product Hierarchy

```
90×45 Structural Pine Timber (Eidos Definition)
└── Supplier A (Repository)
    ├── Distributor A (Repository)
    │   ├── Region 1 (Repository)
    │   │   ├── Store 1 (Repository)
    │   │   └── Store 2 (Repository)
    │   ├── Region 2 (Repository)
    │   │   └── Store 3 (Repository)
    │   └── Region 3 (Repository)
    │       └── Store 4 (Repository)
    └── Distributor B (Repository)
        └── Region 1 (Repository)
            └── Store 5 (Repository)
```

**Eidos (top):** Defines the conceptual blueprint — purpose, usage, attributes, relationships, and behavior rules.

**Repositories:** Contextual instances of the Eidos definition (Supplier, Distributor, Region, Store).

**Propagation:** Updates flow downward along the branch; child nodes can override or extend inherited data.

This creates a **living, distributed model of product knowledge** — globally consistent, locally adaptable.

---

## Why It Exists

| Problem | Eidos Solution |
|---------|----------------|
| Product data duplication | Centralized definition with controlled downstream flow |
| Manual maintenance across supply chains | Automated inheritance and propagation |
| Inconsistent product variants | Repository-level branching with local overrides |
| No context for usage or purpose | Conceptual layer defining relationships and meaning |

---

## Core Concepts

| Term | Description |
|------|-------------|
| **Eidos** | The conceptual definition that captures purpose, usage, structure, and relationships |
| **Repository** | A node that holds live product data for a specific context |
| **Propagation** | The automatic flow of updates down the hierarchy |
| **Override** | Local modification that stops propagation at that node |

---

## Integration Role

Eidos doesn't serve data directly to frontends or users.

Instead, systems like **CommerceBridge** and **Touchpoint** consult Eidos to:

- Resolve which repository version applies to a given context
- Understand product purpose and relationships
- Apply configuration or pricing logic consistently across variants

Eidos ensures that all downstream systems share the same conceptual understanding of what each product represents.

---

## Next

- **[What is an Eidos?](/eidos/product-dna)** — The complete product definition
- **[Repositories](/eidos/repositories)** — How Eidos instances are distributed
- **[Relationships](/eidos/relationships)** — How purpose and usage link products

---

**Eidos: The genetic code of product knowledge.**
