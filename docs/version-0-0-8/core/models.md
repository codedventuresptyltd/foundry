---
sidebar_position: 11
title: Models & Types
---

# Models & Types

**Core Data Structures in Plain Language**

This page defines the key models used throughout CommerceBridge, Touchpoint, and Eidos — focusing on what they represent and how they work together.

---

## Engagement

An **Engagement** represents the full lifecycle of a commerce conversation, from initial inquiry through to completion.

**Core Properties:**

- **Identity** — Tenant, customer, and engagement type (quote, order, subscription)
- **State** — Current status in the lifecycle (draft, active, processing, confirmed, fulfilled, complete)
- **Line Items** — Products being purchased (see [Line Item](#line-item))
- **Pricing** — Price Cards for all items (see [Price Card](#price-card))
- **Fulfillment** — Delivery plan from warehouses (see [Fulfillment Plan](#fulfillment-plan))
- **Metadata** — Custom fields for tenant-specific data

**Purpose:** The engagement is the container for the entire commerce conversation. Everything related to a customer's purchase journey lives here.

---

## Job Card

A **Job Card** is a unit of work delivered to workers for processing.

**Core Properties:**

- **Task Definition** — What work to perform (e.g., 'process-order', 'calculate-price')
- **Payload** — Data needed to complete the task
- **Execution Control** — Priority, retry attempts, timeout settings
- **Context** — Tenant ID for multi-tenant isolation

**Purpose:** Job cards are how work gets distributed to workers. They define what to do, provide the data, and control execution behavior.

---

## Line Item

A **Line Item** represents a single product or service within an engagement.

**Core Properties:**

- **Product** — Product ID and SKU
- **Quantity** — How many units and UOM (unit of measure)
- **Pricing** — Base price, final price, and applied modifiers
- **Configuration** — Optional product configuration (for configurable products)
- **Allocation** — Where this will be fulfilled from

**Purpose:** Line items connect products to engagements and carry their pricing and fulfillment information.

---

## Price Card

A **Price Card** is the complete pricing calculation result for a product, including all applied rules and modifiers.

**Core Properties:**

- **Final Pricing** — Unit price, quantity, subtotal, total, discounts
- **Status** — 'OK', 'POA' (Price on Application), 'DISALLOW', 'NOT_FOUND'
- **Transparency** — Base price atom, applied rules, aggregate discounts
- **Multi-UOM Support** — Slabs showing breakdown by unit of measure
- **Traceability** — Provenance with snapshot ID and rules applied

**Purpose:** Price Cards provide complete transparency into pricing calculations. When Touchpoint requests a price, it receives a Price Card showing not just the final price, but how it was calculated and which rules were applied.

---

## Fulfillment Plan

A **Fulfillment Plan** describes how an engagement will be fulfilled across warehouse networks.

**Core Properties:**

- **Warehouse Assignments** — Which warehouses are fulfilling which items
- **Shipments** — Planned shipments with line items and status
- **Delivery** — Estimated delivery time, carrier, delivery zone
- **Cost** — Shipping cost calculation

**Purpose:** The Fulfillment Plan connects engagements to physical warehouses and coordinates multi-warehouse shipments.

---

## Product

A **Product** represents an item that can be sold.

**Core Properties:**

- **Identity** — ID, SKU, name
- **Catalog** — Description, category, images
- **Pricing** — Base price and available UOMs
- **Inventory** — Stock levels by warehouse
- **Attributes** — Custom product attributes (from Eidos)

**Purpose:** Products are the catalog items that customers can purchase. They connect to pricing snapshots, inventory datastores, and Eidos configuration.

---

## Customer

A **Customer** represents a buyer in the system.

**Core Properties:**

- **Identity** — ID, name, contact information
- **Pricing** — Customer-specific pricing rules and tier
- **Delivery** — Addresses and delivery preferences  
- **Credit** — Payment terms and credit limits

**Purpose:** Customers affect pricing (customer-specific rules), fulfillment (delivery addresses), and order processing (payment terms).

---

## Warehouse

A **Warehouse** represents a fulfillment location.

**Core Properties:**

- **Location** — Name, address, geographic coordinates
- **Coverage** — Which delivery zones this warehouse serves
- **Capabilities** — Operating hours, capacity, what it can handle

**Purpose:** Warehouses are the physical locations that fulfill orders. They're matched to delivery zones to determine which warehouses can serve which customers.

---

## Delivery Zone

A **Delivery Zone** represents a geographic area for delivery coverage.

**Core Properties:**

- **Geography** — Zone name, type (polygon, radius, postal codes), boundaries
- **Network** — Which warehouses serve this zone, available carriers
- **Pricing** — Zone-specific price adjustments (shipping costs, surcharges)
- **Service** — Typical delivery time

**Purpose:** Delivery zones connect customer locations to warehouse networks. They affect both pricing (zone surcharges) and fulfillment (which warehouses can deliver).

---

## Worker Config

**Worker Config** defines how a worker operates within its ecosystem.

**Core Properties:**

- **Identity** — Worker ID and type (order-processor, notification-sender, etc.)
- **Queue** — Which queue to consume from
- **Processing** — Batch size, concurrency, timeout settings
- **Bridge** — Connection configuration for the Bridge

**Purpose:** Worker Config tells a worker instance how to behave: what queue to watch, how many jobs to process at once, and how to connect to the Bridge.

---

## Bridge Config

**Bridge Config** defines how a bridge connects to its integration infrastructure.

**Core Properties:**

- **Theme/Topic/Concern** — Organizational hierarchy for bridge configuration
- **Modules** — Which integration to use for each module (messaging, database, search)
- **Integrations** — Connection details for each integration (MongoDB, Kafka, OpenSearch, etc.)
- **Tenant Context** — Current tenant ID

**Purpose:** Bridge Config maps functional modules to actual integration services and provides connection details. This is how ecosystems configure their infrastructure.

---

## Search Config

**Search Config** defines a complete search experience including indexing, algorithm, and interface.

**Core Properties:**

- **Indexing Strategy** — Which fields to index, how to process them
- **Search Algorithm** — Ranking rules, relevance scoring, business logic boosts
- **Filter Configuration** — Hard filters (must match) and soft filters (preferences)
- **UI Interface** — Which filters to display, result card data bindings, sort options
- **Scope** — Product type, category, or use case this config applies to

**Purpose:** Search configs allow different search experiences for different product types or categories. One tenant can have multiple search configs, each optimized for specific needs (e.g., industrial supplies vs office products).

---

**These models form the foundation of the entire system.**
