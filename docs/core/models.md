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
- **lineItems** — List of products/services in this engagement
- **pricing** — The calculated pricing for this engagement
- **fulfillment** — How this will be fulfilled (warehouses, delivery)
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

## Pricing Result

A **Pricing Result** contains the calculated pricing for products or engagements.

**Properties:**

- **basePrice** — Starting price before any adjustments
- **modifiers** — List of all price modifications applied
- **finalPrice** — Final price after all modifiers
- **currency** — Currency code (USD, AUD, etc.)
- **breakdown** — Detailed breakdown of each modifier
- **calculatedAt** — When this price was calculated
- **validUntil** — Optional: When this price expires
- **cacheKey** — Key used for caching this price

**Example:**

Base price of $100, with a volume discount modifier (-15%) and delivery zone modifier (+5%), resulting in final price of $90.

---

## Price Modifier

A **Price Modifier** represents a single adjustment to a price.

**Properties:**

- **type** — What kind of modifier (volume-discount, zone-upcharge, customer-discount)
- **value** — The modification amount (percentage or fixed amount)
- **operation** — How to apply (multiply, add, subtract)
- **reason** — Human-readable explanation
- **priority** — Order in which to apply (lower numbers first)

**Example:**

Type: "volume-discount", Value: 0.15 (15%), Operation: "multiply", Reason: "Volume discount for 100+ units"

---

## Allocation Result

An **Allocation Result** shows how inventory was allocated for an order.

**Properties:**

- **success** — Whether allocation succeeded
- **allocations** — List of warehouse allocations
- **reservationId** — Identifier for this inventory reservation
- **expiresAt** — When this reservation expires
- **splitShipment** — Whether multiple warehouses are involved

**Each allocation contains:**

- **warehouseId** — Which warehouse
- **productId** — Which product
- **quantity** — How many units from this warehouse
- **estimatedShipDate** — When this can ship

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

## Tenant Config

**Tenant Config** contains tenant-specific settings.

**Properties:**

- **tenantId** — Unique tenant identifier
- **name** — Tenant name
- **features** — Enabled features for this tenant
- **settings** — Custom settings
- **integrations** — External system credentials
- **branding** — UI branding configuration
- **limits** — Rate limits and quotas
- **isActive** — Whether tenant is active

---

## Pricing Context

**Pricing Context** contains all information needed to calculate a price.

**Properties:**

- **productId** — Which product to price
- **quantity** — How many units
- **customerId** — Who is buying
- **deliveryZone** — Where it's being delivered
- **uom** — Unit of measure
- **date** — Optional: Pricing date (for historical prices)
- **configuration** — Optional: Product configuration
- **promoCode** — Optional: Promotional code

---

## Availability Query

**Availability Query** asks if a product is available.

**Properties:**

- **productId** — Which product
- **quantity** — How many units needed
- **deliveryZone** — Where it needs to be delivered
- **uom** — Unit of measure
- **requestedDate** — Optional: When it's needed by

**Response:**

- **available** — True/false
- **quantityAvailable** — How many units are available
- **warehouses** — Which warehouses have stock
- **estimatedDelivery** — When it could be delivered
- **alternatives** — Alternative products if unavailable

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

## Queue Stats

**Queue Stats** provides metrics about a message queue.

**Properties:**

- **queueName** — Name of the queue
- **messageCount** — Total messages in queue
- **consumerCount** — Number of active consumers
- **messagesPerSecond** — Processing rate
- **averageProcessingTime** — Average time to process a message
- **errorRate** — Percentage of failed messages
- **oldestMessage** — Age of oldest message in queue

---

## Worker Metrics

**Worker Metrics** tracks worker performance.

**Properties:**

- **workerId** — Which worker
- **jobsProcessed** — Total jobs completed
- **jobsFailed** — Total jobs failed
- **averageJobTime** — Average processing time
- **successRate** — Percentage successful
- **uptime** — How long worker has been running
- **lastBeat** — Last heartbeat timestamp
- **currentLoad** — Current job processing count

---

## Engagement Event

An **Engagement Event** represents something that happened to an engagement (audit trail).

**Properties:**

- **id** — Event identifier
- **engagementId** — Which engagement
- **type** — Event type (created, updated, status-changed, etc.)
- **timestamp** — When event occurred
- **userId** — Who triggered the event
- **changes** — What changed
- **metadata** — Additional event data

---

## Tenant Feature

A **Tenant Feature** represents a capability that can be enabled/disabled per tenant.

**Properties:**

- **name** — Feature name (e.g., 'advanced-pricing', 'multi-warehouse')
- **enabled** — Whether feature is enabled
- **config** — Feature-specific configuration
- **enabledAt** — When feature was enabled
- **enabledBy** — Who enabled the feature

---

## Cache Entry

A **Cache Entry** represents cached data in Redis.

**Properties:**

- **key** — Cache key
- **value** — Cached data
- **ttl** — Time to live (seconds until expiration)
- **createdAt** — When cached
- **expiresAt** — When it expires
- **tags** — Optional: Tags for grouped invalidation

---

**These models form the foundation of the entire system.**

