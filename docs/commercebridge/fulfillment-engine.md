---
sidebar_position: 8
title: Fulfillment Engine
---

# Fulfillment Engine

**Intelligent Inventory Allocation and Delivery Orchestration**

The Fulfillment Engine is a core component that orchestrates inventory across multiple warehouses, optimizes delivery routes, and ensures products get to customers efficiently.

---

## What It Does

The Fulfillment Engine:

1. **Checks availability** — Real-time inventory across all warehouses
2. **Allocates inventory** — Reserves stock for orders
3. **Optimizes fulfillment** — Determines best warehouse(s) to ship from
4. **Manages delivery zones** — Filters by deliverable areas
5. **Handles split shipments** — Coordinates multi-warehouse orders
6. **Selects carriers** — Chooses appropriate shipping methods
7. **Tracks reservations** — Manages inventory holds

---

## Key Features

### Multi-Warehouse Inventory Allocation

The engine considers multiple warehouses:

**Scenario:** Customer orders 100 units, needs delivery to Chicago

**Process:**
1. Check all warehouses for stock
2. Filter by warehouses that serve Chicago delivery zone
3. Find optimal allocation:
   - Warehouse A (Milwaukee): Has 60 units, 1-day delivery
   - Warehouse B (Indianapolis): Has 40 units, 2-day delivery
4. Allocate 100 units from Warehouse A (single shipment preferred)

**Optimization criteria:**
- Minimize number of shipments
- Minimize delivery time
- Minimize shipping cost
- Respect warehouse capabilities

### Delivery Zone Optimization

Delivery zones define where warehouses can ship:

**Geographic boundaries:**
- Polygon areas (e.g., state boundaries)
- Radius from warehouse (e.g., 100 mile radius)
- Postal code lists
- Custom geographic shapes

**Zone properties:**
- Which warehouses serve this zone
- Delivery time estimates
- Zone-specific pricing
- Carrier availability

**Filtering:**
- Products only show if deliverable to customer's zone
- Warehouses filtered by delivery zone
- Pricing adjusted based on zone
- Availability checked per zone

### Carrier Selection and Routing

Rules-based carrier selection:

**Factors considered:**
- Package weight and dimensions
- Delivery zone
- Delivery time requirements
- Cost
- Carrier capabilities
- Tenant preferences

**Example rules:**
- Heavy items (>50 lbs) → Freight carrier
- Express delivery → Premium carrier
- Standard delivery → Cost-optimized carrier
- Hazmat products → Certified carrier

### Split Shipment Handling

When inventory is across multiple warehouses:

**Example:**
Customer orders 150 units:
- Warehouse A has 100 units
- Warehouse B has 50 units

**Options:**
1. **Split shipment** — Ship 100 from A, 50 from B
2. **Wait for consolidation** — Transfer to one warehouse first
3. **Partial fulfillment** — Ship what's available, backorder rest

**Decision factors:**
- Customer preference
- Delivery urgency
- Cost comparison
- Product characteristics

### Real-Time Availability Checking

Availability checks are dynamic:

**Not just "in stock" vs "out of stock":**

- Stock level by warehouse
- Reserved vs available stock
- Incoming shipments
- Lead times for out-of-stock items
- Alternative products
- Delivery timeline

**Example response:**
- 75 units available immediately (Warehouse A)
- 25 units available in 3 days (incoming shipment)
- Alternative product available: 200 units

---

## How It Works

### Availability Check

**Input:**
- Product ID
- Quantity needed
- Delivery zone
- Unit of measure

**Process:**
1. Get all warehouses for this product
2. Filter warehouses by delivery zone
3. Check inventory levels at each warehouse
4. Calculate delivery times
5. Determine optimal source

**Output:**
- Available: yes/no
- Quantity available
- Source warehouse(s)
- Estimated delivery date
- Alternative options

### Inventory Allocation

**Input:**
- Engagement ID
- Line items (products, quantities)

**Process:**
1. For each line item:
   - Find warehouses with stock
   - Filter by delivery zone
   - Calculate shipping costs
   - Rank by optimization criteria
2. Create allocation plan
3. Reserve inventory
4. Generate reservation ID

**Output:**
- Success: yes/no
- Allocations by warehouse
- Reservation ID
- Expiration time
- Estimated ship dates

### Fulfillment Optimization

**Optimization algorithm considers:**

1. **Minimize shipments** — Prefer single warehouse when possible
2. **Minimize distance** — Choose closest warehouse
3. **Minimize cost** — Factor in shipping costs
4. **Minimize time** — Meet delivery requirements
5. **Balance load** — Don't overload one warehouse

**Result:**
- Optimal warehouse allocation
- Estimated costs
- Estimated delivery times
- Carrier recommendations

---

## Inventory Reservation

When inventory is allocated, it's **reserved**:

**Reservation properties:**
- **Reservation ID** — Unique identifier
- **Expires at** — Reservation timeout (typically 15-30 minutes)
- **Warehouse** — Where stock is reserved
- **Product and quantity** — What's reserved
- **Status** — Active, expired, released, fulfilled

**Lifecycle:**
1. **Reserve** — Allocation creates reservation
2. **Hold** — Inventory held for engagement
3. **Convert** — Engagement confirms, reservation becomes allocation
4. **Release** — Engagement cancelled, inventory released
5. **Expire** — Timeout reached, auto-release

---

## Delivery Zone Filtering

### Spatial Queries

The engine uses OpenSearch for spatial filtering:

**Query types:**
- Point in polygon (is address in zone?)
- Radius search (warehouses within X miles)
- Polygon intersection (does warehouse zone overlap delivery zone?)

**Performance:**
- Spatial indexes for fast lookups
- Cached zone geometries
- Pre-calculated warehouse-zone relationships

### Zone-Based Availability

Products are filtered by deliverability:

**Customer in Chicago searches for products:**
1. Customer's location determined (coordinates or postal code)
2. Delivery zones calculated for that location
3. Warehouses filtered by zones
4. Products filtered by warehouse inventory
5. Only deliverable products shown

**Result:** Customer only sees products that can actually be delivered to them.

---

## Multi-Warehouse Scenarios

### Scenario 1: Single Warehouse Sufficient

**Order:** 50 units  
**Warehouse A:** 100 units, serves zone, 2-day delivery  
**Result:** Allocate all 50 from Warehouse A

### Scenario 2: Split Required

**Order:** 150 units  
**Warehouse A:** 100 units, serves zone, 2-day delivery  
**Warehouse B:** 60 units, serves zone, 3-day delivery  
**Result:** Split shipment - 100 from A, 50 from B

### Scenario 3: Zone Constraints

**Order:** 100 units, deliver to rural Montana  
**Warehouse A:** 200 units, doesn't serve Montana  
**Warehouse B:** 80 units, serves Montana, 5-day delivery  
**Result:** Can fulfill 80 units only, suggest alternatives for remaining 20

### Scenario 4: Optimization

**Order:** 200 units, deliver to Dallas  
**Warehouse A:** 300 units, 800 miles away, 4-day delivery, $150 shipping  
**Warehouse B:** 250 units, 200 miles away, 2-day delivery, $75 shipping  
**Result:** Allocate from Warehouse B (closer, faster, cheaper)

---

## Integration with Pricing

Fulfillment affects pricing:

### Zone-Based Pricing

Delivery zone can modify price:
- Remote zone: +10% upcharge
- Urban zone: Standard pricing
- High-demand zone: Dynamic pricing

### Shipping Costs

Calculated based on:
- Warehouse origin
- Delivery destination
- Package weight/dimensions
- Carrier rates
- Delivery speed

### Availability-Based Pricing

Stock levels can influence pricing:
- High stock: Promotional pricing
- Low stock: Standard pricing
- Out of stock: Future pricing with lead time

---

## Real-World Examples

### Example 1: Trade Distributor

**Business:** Industrial supplies distributor  
**Warehouses:** 5 locations across US  
**Challenge:** Multi-warehouse orders common

**Solution:**
- Delivery zones by state
- Optimization prefers single warehouse
- Split shipments when necessary
- Zone-based pricing adjustments

### Example 2: Food Service

**Business:** Restaurant supply company  
**Warehouses:** 3 temperature-controlled facilities  
**Challenge:** Temperature requirements, delivery windows

**Solution:**
- Zones based on delivery routes
- Warehouse capabilities (refrigeration)
- Scheduled delivery windows
- Route optimization

### Example 3: Manufacturing

**Business:** Custom equipment manufacturer  
**Warehouses:** 2 factories with different capabilities  
**Challenge:** Made-to-order items, lead times

**Solution:**
- Warehouse capabilities matching
- Lead time calculation
- Production scheduling
- Split delivery (stock + custom)

---

## Performance

### Real-Time Checks

Availability checks complete in:
- **Simple query:** under 50ms
- **Multi-warehouse:** under 100ms
- **Complex optimization:** under 200ms

### Caching

Cached data includes:
- Warehouse inventory levels (5-minute TTL)
- Delivery zone geometries (1-hour TTL)
- Warehouse capabilities (1-day TTL)
- Carrier rates (1-hour TTL)

### Optimization

When allocating:
- Pre-filter warehouses by zone
- Check cached inventory first
- Only query uncached data
- Batch multiple line items
- Parallel warehouse checks

---

## Configuration

### Warehouse Setup

Each warehouse configured with:
- Geographic location
- Delivery zones served
- Capabilities (cold storage, hazmat, etc.)
- Capacity limits
- Operating hours
- Priority/ranking

### Zone Setup

Each delivery zone configured with:
- Geographic boundaries
- Delivery time estimates
- Pricing modifiers
- Carrier restrictions
- Minimum order requirements

### Optimization Rules

Tenant-specific rules:
- Prefer certain warehouses
- Minimize split shipments (yes/no)
- Max shipments per order
- Cost vs speed priority
- Carrier preferences

---

**Fulfillment Engine: Smart allocation, optimized delivery.**

