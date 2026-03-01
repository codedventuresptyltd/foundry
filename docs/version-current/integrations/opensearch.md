---
sidebar_position: 5
title: OpenSearch
---

# OpenSearch Integration

Full-text search and spatial query engine for product discovery, geolocation, and complex queries. Elasticsearch-compatible with open-source licensing.

## Capabilities

### Product Search
Full-text search across product catalog.

**Features:**
- Multi-field text search
- Fuzzy matching
- Autocomplete
- Relevance scoring

**Use Cases:**
- Product discovery
- SKU lookup
- Title search
- Attribute filtering

### Faceted Search
Dynamic filtering and aggregation.

**Features:**
- Category facets
- Attribute facets
- Price range filters
- Brand aggregation

**Use Cases:**
- Filter-based navigation
- Product browsing
- Guided search
- Analytics

### Spatial Queries
Geographic and location-based search.

**Features:**
- Point-in-polygon queries
- Radius search
- Zone intersection
- Distance calculations

**Use Cases:**
- Delivery zone validation
- Warehouse proximity
- Service area lookup
- Geographic filtering

### Fuzzy Matching
Typo-tolerant search.

**Features:**
- Levenshtein distance
- Phonetic matching
- Autocorrect suggestions
- Synonym expansion

**Use Cases:**
- User search tolerance
- Product name variants
- SKU variations
- Spelling errors

## Configuration

### Connection Settings

```typescript
OPENSEARCH_HOST=localhost
OPENSEARCH_PORT=9200
OPENSEARCH_PROTOCOL=https
OPENSEARCH_AUTH_USERNAME=admin
OPENSEARCH_AUTH_PASSWORD=<from-secrets>
```

### Index Configuration

```typescript
OPENSEARCH_PRODUCT_INDEX=products
OPENSEARCH_INVENTORY_INDEX=inventory
OPENSEARCH_INDEX_SHARDS=5
OPENSEARCH_INDEX_REPLICAS=1
```

### Performance Settings

```typescript
OPENSEARCH_MAX_RESULTS=10000
OPENSEARCH_SEARCH_TIMEOUT=30s
OPENSEARCH_BULK_SIZE=500
OPENSEARCH_REFRESH_INTERVAL=1s
```

## Bridge Access

```typescript
// Product search
const results = await bridge.integrations.openSearch.search({
  index: 'products',
  query: {
    multi_match: {
      query: 'timber',
      fields: ['title', 'sku', 'description']
    }
  },
  filters: [
    { term: { category: 'lumber' } },
    { range: { price: { gte: 10, lte: 50 } } }
  ],
  size: 20
});

// Spatial query
const warehousesInZone = await bridge.integrations.openSearch.spatialQuery({
  index: 'warehouses',
  point: { lat: -37.8136, lon: 144.9631 },
  radius: '50km'
});

// Autocomplete
const suggestions = await bridge.integrations.openSearch.autocomplete({
  index: 'products',
  field: 'title',
  prefix: 'tim',
  size: 10
});

// Bulk indexing
await bridge.integrations.openSearch.bulkIndex({
  index: 'products',
  documents: productBatch
});
```

## Index Mappings

### Product Index

**Fields:**
- `title` (text, analyzed)
- `sku` (keyword, exact match)
- `description` (text, analyzed)
- `category` (keyword)
- `price` (float)
- `attributes` (nested)
- `in_stock` (boolean)

### Warehouse Index

**Fields:**
- `warehouse_id` (keyword)
- `name` (text)
- `location` (geo_point)
- `delivery_zones` (geo_shape)
- `capacity` (integer)

### Delivery Zone Index

**Fields:**
- `zone_id` (keyword)
- `name` (text)
- `geometry` (geo_shape)
- `warehouse_ids` (keyword array)

## Advantages

**Full-Text Search**
- Advanced text analysis
- Multi-language support
- Relevance tuning
- Highlighting

**Real-Time**
- Near-real-time indexing
- Fast query responses
- Live updates
- Immediate consistency

**Scalability**
- Horizontal scaling
- Shard distribution
- Replica redundancy
- Load balancing

**Flexibility**
- Schema-less documents
- Dynamic mapping
- Nested objects
- Array support

## Operational Notes

### Indexing Strategy
- Bulk index for performance
- Async indexing from MongoDB
- Refresh interval tuning
- Shard allocation

### Querying Best Practices
- Use filters over queries when possible (cached)
- Limit result size
- Use pagination
- Profile slow queries

### Monitoring
- Query latency
- Index size
- Shard health
- JVM memory

### Maintenance
- Daily index optimization
- Old index cleanup
- Replica verification
- Snapshot backups

## Search Patterns

### Basic Text Search
Simple full-text query across fields.

**Use Case:** User searches for "timber 90x45".

### Faceted Navigation
Search with aggregations for filtering.

**Use Case:** Browse products, filter by category, price, brand.

### Autocomplete
Prefix matching for search suggestions.

**Use Case:** Type-ahead product search in UI.

### Geospatial
Location-based queries.

**Use Case:** Find warehouses near delivery address.

## When to Use

**Product Search:** Primary use case - fast, relevant product discovery.

**Spatial Queries:** Delivery zone validation, warehouse proximity.

**Analytics:** Quick aggregations and metrics on indexed data.

**Autocomplete:** Real-time search suggestions.

## When NOT to Use

**Primary Data Store:** Use MongoDB for source of truth.

**Transactions:** No ACID guarantees - use for search only.

**Frequent Updates:** Re-indexing has overhead - batch when possible.

---

**OpenSearch: Fast, flexible search for commerce.**


