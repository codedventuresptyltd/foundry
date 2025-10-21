---
sidebar_position: 3
title: MongoDB
---

# MongoDB Integration

Primary data storage for CommerceBridge. Provides modules for engagements, products, inventory, pricing, workers, and more.

## Modules Provided

### Engagement Module
Core commerce data - orders, quotes, carts.

**Collections:** `engagements`

**Operations:**
- Create engagements
- Update engagement state
- Query by customer, status, date
- Historical snapshots

**Use Cases:**
- Order management
- Quote processing
- Cart persistence
- Order history

### Datastore Module
Product catalog and content management.

**Collections:** `products`, `categories`, `brands`

**Operations:**
- Product CRUD operations
- Search by SKU, title, attributes
- Category management
- Bulk imports

**Use Cases:**
- Product catalog
- Content management
- SKU management
- Product data sync

### Inventory Module
Stock levels and warehouse data.

**Collections:** `inventory`, `warehouses`

**Operations:**
- Stock level tracking
- Reservation management
- Multi-warehouse inventory
- Stock movements

**Use Cases:**
- Inventory management
- Stock allocation
- Warehouse operations
- Stock auditing

### Pricing Module
Price lists and customer-specific pricing.

**Collections:** `price_lists`, `price_rules`

**Operations:**
- Price list management
- Customer pricing rules
- Volume break configuration
- Price snapshots

**Use Cases:**
- Dynamic pricing
- Customer contracts
- Volume discounts
- Price history

### Worker Module
Worker lifecycle and health tracking.

**Collections:** `workers`, `worker_vitals`

**Operations:**
- Worker registration
- Vitals reporting
- Worker discovery
- Health monitoring

**Use Cases:**
- Worker orchestration
- Health checks
- Auto-scaling decisions
- Worker management

### Logs Module
Structured application logging.

**Collections:** `logs`, `error_logs`

**Operations:**
- Write structured logs
- Query by level, time, worker
- Error aggregation
- Performance metrics

**Use Cases:**
- Application logging
- Error tracking
- Debugging
- Audit trails

### Translator Module
Translation config storage.

**Collections:** `translator_configs`

**Operations:**
- Store field mappings
- Retrieve configs by name
- Update mappings
- Version management

**Use Cases:**
- cXML field mappings
- Client-specific translations
- Format configurations
- Mapping overrides

### UOM Module
Unit of measure configurations.

**Collections:** `uom_configurations`

**Operations:**
- UOM definition storage
- Conversion rules
- Unit hierarchies
- Configuration retrieval

**Use Cases:**
- Unit conversions
- UOM validation
- Multi-unit products
- Fulfillment calculations

### Repository Module
Generic document storage.

**Collections:** Various

**Operations:**
- Generic document CRUD
- Query by arbitrary fields
- Bulk operations
- Document versioning

**Use Cases:**
- Custom data storage
- Configuration storage
- Integration data
- Tenant-specific data

### List Module
List management (favorites, wish lists, etc.).

**Collections:** `lists`, `list_items`

**Operations:**
- Create lists
- Add/remove items
- Share lists
- Query user lists

**Use Cases:**
- Favorites
- Wish lists
- Shopping lists
- Saved carts

### Management Module
System configuration and tenants.

**Collections:** `tenants`, `configurations`

**Operations:**
- Tenant management
- Configuration storage
- Feature flags
- System settings

**Use Cases:**
- Multi-tenancy
- System configuration
- Feature toggles
- Tenant settings

### Community Module
Worker ecosystem metadata.

**Collections:** `communities`, `actors`

**Operations:**
- Community registration
- Actor management
- Ecosystem discovery
- Relationship mapping

**Use Cases:**
- Worker ecosystems
- Actor directory
- Service discovery
- Ecosystem topology

### Account Module
User accounts and authentication.

**Collections:** `accounts`, `sessions`

**Operations:**
- Account creation
- Authentication
- Session management
- Profile updates

**Use Cases:**
- User management
- Authentication
- Session tracking
- Account operations

## Configuration

### Connection Settings

```typescript
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=commercebridge
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=10
```

### Authentication

```typescript
MONGODB_AUTH_SOURCE=admin
MONGODB_USERNAME=commercebridge
MONGODB_PASSWORD=<from-secrets>
```

### Performance Settings

```typescript
MONGODB_READ_PREFERENCE=primary
MONGODB_WRITE_CONCERN=majority
MONGODB_READ_CONCERN=local
MONGODB_MAX_STALENESS_SECONDS=90
```

## Bridge Access

```typescript
// Engagement operations
const engagement = await bridge.integrations.mongoDb.module_engagement
  .engagement_getEngagement(engagementId);

await bridge.integrations.mongoDb.module_engagement
  .engagement_updateEngagement(engagementId, updates);

// Datastore operations
const product = await bridge.integrations.mongoDb.module_datastore
  .getDocumentbyUrlTitle(productId, 'products');

// Worker operations
await bridge.integrations.mongoDb.module_worker
  .worker_registerWorker(workerData);

// Pricing operations
const priceList = await bridge.integrations.mongoDb.module_pricing
  .pricing_getPriceList(customerId);

// Translator operations
const config = await bridge.integrations.mongoDb.module_translator
  .translator_getConfigByName(configName);
```

## Indexing Strategy

### Engagement Indexes
- `customerId` + `createdAt` (customer order history)
- `tenantId` + `status` (tenant filtering)
- `attributes.orderNumber` (order lookup)

### Product Indexes
- `sku` (unique, product lookup)
- `title` (text index for search)
- `dataSet.category` (category filtering)

### Worker Indexes
- `communityId` + `status` (active workers)
- `lastCallHome` (health monitoring)
- `workerType` (worker discovery)

### Log Indexes
- `timestamp` + `level` (time-based queries)
- `workerId` + `timestamp` (worker logs)
- TTL index on `timestamp` (auto-cleanup)

## Advantages

**Flexible Schema**
- Dynamic document structure
- Schema evolution without migration
- Nested documents and arrays

**Rich Query Language**
- Complex queries with aggregation
- Text search capabilities
- Geospatial queries

**Scalability**
- Horizontal scaling with sharding
- Replica sets for high availability
- Read scaling with secondaries

**Developer Experience**
- JSON-like documents
- No impedance mismatch
- Easy to work with in JavaScript/TypeScript

## Operational Notes

### Backup Strategy
- Daily full backups
- Continuous oplog backup
- Point-in-time recovery capability

### Sharding
- Shard by `tenantId` for multi-tenant isolation
- Shard by `customerId` for engagement data
- Avoid shard key changes after deployment

### Replica Sets
- Minimum 3 nodes for production
- One primary, two secondaries
- Automatic failover

### Monitoring
- Connection pool utilization
- Query performance (slow query log)
- Replication lag
- Disk space and IOPS

## When to Use

**Primary Data Store:** MongoDB is the standard choice for all business data in CommerceBridge.

**Document Storage:** When you need flexible schema and nested structures.

**Multi-Tenancy:** Excellent for tenant-isolated data with sharding.

## When NOT to Use

**Analytics:** Use a data warehouse for complex analytics (aggregate to PostgreSQL or BigQuery).

**Time-Series:** Consider TimescaleDB for pure time-series data.

**Graph Queries:** Use a graph database for complex relationship queries.

---

**MongoDB: The foundation of CommerceBridge data.**


