---
sidebar_position: 4
title: Relationships
---

# Relationships
**Concept:** How purpose and usage connect products across the catalog.

---

## What Are Relationships?

**Relationships** define how products connect to each other based on their purpose and usage, not just arbitrary associations.

In Eidos, relationships are semantic — they're based on **why** and **how** products are used together, creating a meaningful network of product knowledge.

---

## Relationship Types

### Complementary Products

Products that are used together to achieve a purpose:

**Example: 90×45 Structural Pine Timber**
- **Purpose:** Load-bearing construction
- **Complements:**
  - Nails (fastening)
  - Brackets (joining)
  - Moisture barrier (protection)
  - Concrete anchors (foundation connection)

**Why these relationships exist:**
All are needed to complete timber framing work. The relationship is based on shared purpose (construction) and sequential usage.

### Alternative Products

Products that can substitute for each other in the same use case:

**Example: 90×45 Structural Pine Timber**
- **Alternatives:**
  - 90×45 Treated Pine (outdoor/exposed construction)
  - 90×45 Engineered Timber (higher load requirements)
  - 70×45 Structural Pine (non-load-bearing walls)

**Why these relationships exist:**
All serve similar purposes but with different properties (weather resistance, strength, dimensions).

### Component Relationships

Products that are parts of larger assemblies:

**Example: Door Frame Assembly**
- **Components:**
  - Timber lengths (90×35 DAR Pine)
  - Hinges (75mm brass)
  - Screws (#8 x 40mm)
  - Door stop beading

**Why these relationships exist:**
These products combine to create a functional door frame. The relationship is hierarchical — assembly contains components.

### Usage-Based Relationships

Products that appear together in specific workflows:

**Example: Electrical Installation**
- **Usage:** "Wiring a commercial building"
- **Products in workflow:**
  - Electrical cable (power transmission)
  - Conduit (cable protection)
  - Junction boxes (connection points)
  - Terminals (wire joining)
  - Circuit breakers (safety)

**Why these relationships exist:**
All are needed to complete the electrical installation workflow.

### Experience or Intent-Based Relationships

Products grouped by the experience or outcome they enable:

**Example: Family Canoe Trip**
- **Intent:** "Family day on the lake"
- **Eidos in experience:**
  - Canoe rental (the activity)
  - Lakeside attractions (viewing points, swimming spots, picnic areas)
  - Safety equipment (life jackets, paddles)
  - Refreshments or facilities nearby

**Why these relationships exist:**
These aren't functionally dependent products — they're related by the **intended experience**. The canoe Eidos might include relationships to attraction Eidos that create a complete day trip experience.

**Repository context:**
A local canoe rental repository includes the specific attractions available on their lake, not all possible lake attractions globally.

---

## How Relationships Are Defined

Relationships are defined in the **Eidos**:

### Purpose-Driven
Based on what the product is for:
- Structural timber → Complements fasteners (both for construction)
- Electrical cable → Complements conduit (both for electrical work)

### Usage-Driven
Based on how products are applied:
- Products used in the same workflow
- Products that solve related problems
- Products that appear in the same bill of materials

### Attribute-Driven
Based on technical compatibility:
- Compatible dimensions (90×45 timber fits 90mm brackets)
- Material compatibility (steel screws for treated timber)
- Specification requirements (cable gauge for circuit breaker size)

---

## Propagation Through Repositories

Relationships defined in the **Eidos propagate through repositories**:

**Eidos:**
"90×45 Structural Pine complements: Nails, Brackets, Moisture Barrier"

**Store 1 Repository (inherits):**
Shows complementary products when customer views timber

**Store 2 Repository (overrides):**
"We don't stock moisture barrier" → Filters that relationship locally

---

## How Systems Use Relationships

### In Touchpoint (UI)
- Display "Frequently Bought Together"
- Show "You May Also Need"
- Recommend alternatives when out of stock
- Guide configuration workflows

### In CommerceBridge (Processing)
- Validate product combinations
- Apply bundle pricing
- Suggest complete solutions
- Calculate project materials

### In Search
- Expand queries to related products
- Boost products used in same workflows
- Find alternatives automatically

---

## Benefits

**1. Semantic Understanding**
Relationships capture the "why" behind product associations, not just "customers who bought X also bought Y."

**2. Guided Discovery**
Help customers find everything they need without expert knowledge.

**3. Accurate Recommendations**
Based on actual purpose and usage, not just purchase history.

**4. Configuration Support**
Relationships enable intelligent product configuration and compatibility checking.

---

## Learn More

- **[What is an Eidos?](/eidos/product-dna)** — The complete product definition
- **[Repositories](/eidos/repositories)** — How relationships propagate
- **[Eidos Overview](/eidos)** — Framework overview

---

**Relationships: Products connected by purpose and usage.**

