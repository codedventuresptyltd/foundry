---
sidebar_position: 11
title: Models & Types
---

# Models & Types

**Core Data Structures in Plain Language**

This page defines all the key models and types used throughout CommerceBridge, Touchpoint, and the broader ecosystem.

---

## Engagement

An **Engagement** represents the full lifecycle of a commerce interaction, from initial inquiry through to completion.

**Properties:**

- **id** — Unique identifier for this engagement
- **tenantId** — Which tenant/customer this engagement belongs to
- **customerId** — The customer involved in this engagement
- **type** — What kind of engagement this is (quote, order, subscription)
- **status** — Current state (draft, active, processing, complete, cancelled)
- **lineItems** — List of Line Items in this engagement (see [Line Item](#line-item))
- **pricing** — Price Cards for all line items (see [Price Card](#price-card))
- **fulfillment** — Fulfillment Plan for delivery (see [Fulfillment Plan](#fulfillment-plan))
- **createdAt** — When this engagement was created
- **updatedAt** — When this engagement was last modified
- **metadata** — Additional custom data specific to the tenant

**Example:**

An engagement might start as a quote (type: 'quote'), transition to an active cart (status: 'active'), become an order (type: 'order', status: 'processing'), and finally complete (status: 'complete').

---

## Job Card

A **Job Card** is a unit of work that gets delivered to a worker for processing.

**Properties:**

- **id** — Unique identifier for this job
- **task** — What task to perform (e.g., 'process-order', 'send-notification')
- **payload** — The data needed to complete the task
- **priority** — How important this job is (1-10, higher = more important)
- **attempts** — How many times this job has been tried
- **maxAttempts** — Maximum number of retry attempts allowed
- **createdAt** — When this job was created
- **scheduledFor** — Optional: When this job should be executed (for delayed jobs)
- **tenantId** — Which tenant this job belongs to
- **timeout** — Maximum time allowed for this job to complete

**Example:**

A job card with task "process-order" and payload containing orderId gets sent to the order-processor worker, which executes the order processing logic.

---

## Line Item

A **Line Item** represents a single product or service within an engagement.

**Properties:**

- **id** — Unique identifier for this line item
- **productId** — Which product this is
- **sku** — Product SKU code
- **quantity** — How many units
- **uom** — Unit of measure (each, case, pallet, etc.)
- **basePrice** — Base price per unit
- **finalPrice** — Final price after modifiers
- **priceModifiers** — List of price adjustments applied
- **configuration** — Optional: Product configuration (if configurable)
- **allocation** — Where this will be fulfilled from
- **notes** — Optional notes or special instructions

---

## Fulfillment Plan

A **Fulfillment Plan** describes how an engagement will be fulfilled.

**Properties:**

- **engagementId** — Which engagement this is for
- **warehouses** — List of warehouses involved
- **shipments** — List of planned shipments
- **estimatedDelivery** — When customer will receive
- **carrier** — Which shipping carrier to use
- **deliveryZone** — Which delivery zone applies
- **cost** — Shipping cost

**Each shipment contains:**

- **warehouseId** — Origin warehouse
- **lineItems** — Which items in this shipment
- **trackingNumber** — Optional: Tracking number once shipped
- **status** — Current shipment status

---

## Product

A **Product** represents an item that can be sold.

**Properties:**

- **id** — Unique identifier
- **sku** — SKU code
- **name** — Product name
- **description** — Product description
- **category** — Product category
- **basePrice** — Default price
- **uom** — Available units of measure
- **attributes** — Custom attributes
- **images** — Product images
- **inventory** — Stock levels by warehouse
- **isActive** — Whether product is available for sale
- **tenantId** — Which tenant owns this product

---

## Customer

A **Customer** represents a buyer.

**Properties:**

- **id** — Unique identifier
- **name** — Customer name
- **email** — Email address
- **phone** — Phone number
- **addresses** — List of delivery addresses
- **pricingRules** — Custom pricing rules for this customer
- **paymentTerms** — Payment terms (net 30, etc.)
- **creditLimit** — Maximum credit allowed
- **tier** — Customer tier/level
- **tenantId** — Which tenant this customer belongs to

---

## Warehouse

A **Warehouse** represents a fulfillment location.

**Properties:**

- **id** — Unique identifier
- **name** — Warehouse name
- **address** — Physical address
- **coordinates** — Latitude/longitude
- **deliveryZones** — Which zones this warehouse serves
- **capacity** — Storage capacity
- **operatingHours** — When warehouse operates
- **capabilities** — What this warehouse can handle
- **isActive** — Whether warehouse is operational
- **tenantId** — Which tenant owns this warehouse

---

## Delivery Zone

A **Delivery Zone** represents a geographic area for delivery.

**Properties:**

- **id** — Unique identifier
- **name** — Zone name (e.g., "US-MIDWEST")
- **type** — Zone type (polygon, radius, postal codes)
- **geometry** — Geographic boundaries
- **warehouses** — Which warehouses serve this zone
- **carriers** — Available carriers for this zone
- **pricingModifiers** — Zone-specific price adjustments
- **deliveryTime** — Typical delivery time to this zone

---

## Worker Config

**Worker Config** defines how a worker operates.

**Properties:**

- **workerId** — Unique identifier for this worker instance
- **workerType** — Type of worker (order-processor, notification-sender)
- **queueName** — Which queue to consume from
- **pollInterval** — Milliseconds between work cycles
- **batchSize** — How many jobs to fetch per cycle
- **concurrency** — How many jobs to process in parallel
- **timeout** — Maximum time per job
- **bridge** — Configuration for the bridge connection
- **logging** — Logging configuration
- **metrics** — Metrics reporting configuration

---

## Bridge Config

**Bridge Config** defines how a bridge connects to infrastructure.

**Properties:**

- **mongodb** — MongoDB connection settings
  - uri — Connection string
  - database — Database name
- **redis** — Redis connection settings
  - host — Redis host
  - port — Redis port
  - password — Optional password
- **queue** — Message queue settings
  - type — Queue type (rabbitmq, kafka)
  - url — Connection URL
- **search** — OpenSearch settings
  - node — OpenSearch URL
  - index — Index prefix
- **tenantId** — Current tenant context
- **logging** — Logging configuration

---

## Price Card

A **Price Card** represents the complete pricing calculation result for a product, including all applied rules and modifiers.

**Properties:**

- **status** — Pricing status ('OK', 'POA', 'DISALLOW', 'NOT_FOUND')
- **unitCents** — Final unit price in cents
- **qty** — Quantity being priced
- **groupQty** — Optional: Group quantity for aggregate discounts
- **modelPath** — Product model identifier
- **canonicalModelPath** — Canonical product path
- **baseAtom** — Base price atom from pricing snapshot
- **subtotalCents** — Line subtotal (unit × qty)
- **totalCents** — Total after all discounts
- **discountCents** — Total discount amount
- **breakingFee** — Fee for breaking packs/units
- **aggregateDiscounts** — Discounts applied at aggregate level
- **reason** — Explanation for special status (POA, DISALLOW)
- **rrpCents** — Recommended retail price
- **slabs** — Breakdown by UOM (for multi-UOM products)
- **provenance** — Traceability information (snapshot ID, rules applied, atoms used)

**Purpose:**

The Price Card is the result of the pricing engine calculation. It contains not just the final price, but complete transparency into how that price was calculated, which rules were applied, and where the base price came from.

**Example Use:**

When Touchpoint requests pricing for a product, it receives a Price Card that shows:
- The final calculated price
- All discounts and surcharges applied
- Which pricing rules were triggered
- Complete audit trail for the calculation

---

## Search Query

**Search Query** defines a product search request.

**Properties:**

- **query** — Search text
- **filters** — Filtering criteria
  - category — Product category
  - priceRange — Min/max price
  - inStock — Only show in-stock items
  - deliveryZone — Filter by delivery zone
- **sort** — How to sort results
- **page** — Which page of results
- **pageSize** — Results per page
- **tenantId** — Tenant context

---

**These models form the foundation of the entire system.**

