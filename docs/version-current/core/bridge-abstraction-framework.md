# Bridge Abstraction Framework - Specification

## Objective

Refactor the current monolithic `meshBridgeModel` into a modular, layered bridge architecture that:

1. **Organizes API surface** into logical namespaces (engagement, worker, queue, etc.)
2. **Centralizes application logic** in namespace modules (validation, auth, RBA, masking, business rules)
3. **Isolates infrastructure** in pure integrations (MongoDB, Kafka, etc.)
4. **Enables bridge specialization** via extension (WorkerBridge, EidosBridge, TenantBridge)
5. **Prevents duplication** through singleton integration and namespace sharing
6. **Improves security** by loading only required namespaces per bridge
7. **Provides universal pattern** applicable across all codebases (Workers, Eidos, APIs, Admin)

---

## Architecture Overview

### Three-Layer Model

```
┌─────────────────────────────────────────────┐
│  Bridge Layer                                │
│  - Extends BridgeBase                       │
│  - Declares required namespaces via config  │
│  - Adds custom domain/tenant-specific logic │
│  Example: WorkerBridge, EidosBridge         │
└─────────────────────────────────────────────┘
                    ↓ uses
┌─────────────────────────────────────────────┐
│  Namespace Module Layer                      │
│  - Application logic (validation, auth, RBA) │
│  - Business rules and orchestration         │
│  - Data masking and security                │
│  - Structured error handling                │
│  Example: EngagementNamespace               │
└─────────────────────────────────────────────┘
                    ↓ calls
┌─────────────────────────────────────────────┐
│  Integration Layer                           │
│  - Pure infrastructure operations           │
│  - No business logic                        │
│  - Connection management                    │
│  Example: MongoDbIntegration                │
└─────────────────────────────────────────────┘
```

### Key Principles

1. **Namespaces are the API**: All application logic organized into namespaces (engagement, worker, queue, etc.)
2. **Direct access**: Bridges expose namespaces directly (`bridge.engagement.save()`)
3. **Singleton sharing**: All bridges share the same namespace module instances
4. **Config-driven loading**: Bridge config declares which namespaces to load
5. **Extension over configuration**: Custom logic via bridge subclasses, not config files
6. **Security by omission**: Bridges only have access to declared namespaces

---

## Layer Responsibilities

### Integration Layer

**Location**: `common/integrations/`

**Purpose**: Pure infrastructure interaction with external systems

**Responsibilities**:
- Connect to external platforms (MongoDB, Kafka, PostgreSQL, etc.)
- Execute platform operations (insert, find, publish, consume)
- Manage connection pooling and lifecycle
- NO validation, NO auth, NO business logic

**Example**:
```typescript
// common/integrations/mongoDb/mongoDB.integration.ts
export class MongoDbIntegration {
  private clients: Map<string, MongoClient>
  
  constructor(config: any) {
    // Initialize connections
  }
  
  // Pure infrastructure operations
  async insert(database: string, collection: string, doc: any) {
    return await this.clients.get(database)
      .db(database)
      .collection(collection)
      .insertOne(doc)
  }
  
  async findOne(database: string, collection: string, query: any) {
    return await this.clients.get(database)
      .db(database)
      .collection(collection)
      .findOne(query)
  }
}
```

---

### Namespace Module Layer

**Location**: `common/bridge/namespaces/`

**Purpose**: Application logic organized by domain concern

**Responsibilities**:
- Input validation
- Authentication and authorization (RBA)
- Business rule enforcement
- Data masking and tokenization
- Structured error handling and logging
- Calling integrations to perform infrastructure operations

**Structure**:
```
common/bridge/namespaces/
├── engagement/
│   ├── engagement.namespace.ts      # Main namespace implementation
│   ├── engagement.validator.ts      # Validation logic
│   ├── engagement.auth.ts           # Auth/permission checking
│   └── engagement.types.ts          # Type definitions
├── worker/
│   └── worker.namespace.ts
├── queue/
│   └── queue.namespace.ts
└── repository/
    └── repository.namespace.ts
```

**Example**:
```typescript
// common/bridge/namespaces/engagement/engagement.namespace.ts
export class EngagementNamespace {
  constructor(
    private db: MongoDbIntegration,
    private validator: EngagementValidator,
    private auth: EngagementAuth
  ) {}
  
  async save(data: EngagementModel, context: BridgeContext): Promise<void> {
    // 1. Validate
    const errors = this.validator.validate(data)
    if (errors.length > 0) {
      throw new ValidationError('Invalid engagement', errors)
    }
    
    // 2. Auth check
    if (!this.auth.hasPermission(context, 'engagement:create')) {
      throw new AuthError('Permission denied')
    }
    
    // 3. Business rules
    if (data.total < 0) {
      throw new BusinessRuleError('Total cannot be negative')
    }
    
    // 4. Apply defaults
    data.status = data.status || 'draft'
    data.tenantId = context.tenantId
    data.createdAt = new Date()
    
    // 5. Call integration (pure infrastructure)
    await this.db.insert('commerce', 'engagements', data)
    
    // 6. Log
    logger.info('Engagement created', { id: data.id, tenantId: data.tenantId })
  }
  
  async getById(id: string, context: BridgeContext): Promise<EngagementModel> {
    // Auth check
    if (!this.auth.hasPermission(context, 'engagement:read')) {
      throw new AuthError('Permission denied')
    }
    
    // Get from DB with tenant isolation
    const doc = await this.db.findOne('commerce', 'engagements', {
      _id: id,
      tenantId: context.tenantId
    })
    
    if (!doc) {
      throw new NotFoundError(`Engagement ${id} not found`)
    }
    
    // Mask sensitive data based on role
    return this.maskSensitiveData(doc, context)
  }
  
  private maskSensitiveData(engagement: any, context: BridgeContext) {
    if (!context.hasRole('admin')) {
      delete engagement.internalNotes
      engagement.customerEmail = this.maskEmail(engagement.customerEmail)
    }
    return engagement
  }
}
```

**Key Points**:
- Each namespace is a complete, self-contained module
- Contains ALL application logic for that domain
- Reusable across all bridges (no duplication)
- Easy to test in isolation
- Clear separation of concerns

---

### Bridge Layer

**Location**: Distributed with consumers

**Purpose**: Composition and optional customization

**Base Bridge** (`common/bridge/core/bridge-base.ts`):
```typescript
export class BridgeBase {
  protected config: BridgeConfig
  
  // Namespace properties (populated during initialization)
  public engagement?: EngagementNamespace
  public worker?: WorkerNamespace
  public queue?: QueueNamespace
  public repository?: RepositoryNamespace
  public datastore?: DatastoreNamespace
  public search?: SearchNamespace
  public community?: CommunityNamespace
  public admin?: AdminNamespace
  
  constructor(config: BridgeConfig) {
    this.config = config
  }
  
  async initialize(): Promise<void> {
    // 1. Initialize integrations (singleton instances)
    const integrations = await this.initializeIntegrations()
    
    // 2. Load namespaces declared in config
    for (const namespaceName of this.config.namespaces) {
      await this.registerNamespace(namespaceName, integrations)
    }
    
    // 3. Emit ready event
    this.events.emit('ready')
  }
  
  private async registerNamespace(name: string, integrations: any) {
    // Lazy instantiation of namespace modules
    const NamespaceRegistry = {
      'engagement': () => new EngagementNamespace(
        integrations.mongoDb,
        new EngagementValidator(),
        new EngagementAuth()
      ),
      'worker': () => new WorkerNamespace(integrations.mongoDb),
      'queue': () => new QueueNamespace(integrations.kafka),
      // ... etc
    }
    
    if (NamespaceRegistry[name]) {
      this[name] = NamespaceRegistry[name]()
    }
  }
  
  protected getCurrentContext(): BridgeContext {
    // Return current context (tenant, user, permissions)
    return {
      tenantId: this.config.tenantId,
      userId: this.config.userId,
      permissions: this.config.permissions
    }
  }
}
```

**Specialized Bridges** (extend base):

```typescript
// ecosystem/core-workers/worker-bridge.ts
export class WorkerBridge extends BridgeBase {
  constructor() {
    super({
      name: 'worker-bridge',
      namespaces: ['engagement', 'worker', 'queue', 'logs']
    })
  }
  
  // Add custom methods that provide value
  async optimizeBatchSize(): Promise<number> {
    const queueDepth = await this.queue.getLength()
    const activeWorkers = await this.worker.getActiveCount()
    return Math.ceil(queueDepth / activeWorkers)
  }
}
```

```typescript
// experienceLayer/experience-eidos/eidos-bridge.ts
export class EidosBridge extends BridgeBase {
  constructor() {
    super({
      name: 'eidos-bridge',
      namespaces: ['repository', 'datastore', 'search', 'dataflow']
    })
  }
  
  async syncRepository(repoId: string): Promise<SyncResult> {
    const records = await this.repository.getAllRecords(repoId)
    await this.search.indexRecords(records)
    return { synced: records.length }
  }
}
```

```typescript
// tenants/acme-corp/acme-bridge.ts
export class AcmeCorpBridge extends BridgeBase {
  constructor() {
    super({
      name: 'acme-corp-bridge',
      tenantId: 'acme-corp',
      namespaces: ['engagement', 'product', 'queue']
    })
  }
  
  async saveEngagementWithDiscount(data: EngagementModel): Promise<void> {
    // Apply ACME-specific 15% enterprise discount
    data.discount = data.total * 0.15
    await this.engagement.save(data, this.getCurrentContext())
  }
}
```

---

## File Structure

```
common/
├── integrations/                    # Pure infrastructure
│   ├── mongoDb/
│   │   └── mongoDB.integration.ts
│   ├── kafka/
│   │   └── kafka.integration.ts
│   ├── crypto/
│   │   └── crypto.integration.ts
│   └── index.ts
│
└── bridge/
    ├── core/
    │   ├── bridge-base.ts           # Base bridge class
    │   ├── bridge-context.ts        # Context types
    │   ├── bridge-error.ts          # Error types
    │   └── integration-registry.ts  # Singleton registry
    │
    ├── namespaces/                  # Namespace implementations
    │   ├── engagement/
    │   │   ├── engagement.namespace.ts
    │   │   ├── engagement.validator.ts
    │   │   ├── engagement.auth.ts
    │   │   └── engagement.types.ts
    │   ├── worker/
    │   │   └── worker.namespace.ts
    │   ├── queue/
    │   │   └── queue.namespace.ts
    │   ├── repository/
    │   │   └── repository.namespace.ts
    │   └── index.ts
    │
    └── index.ts                     # Export BridgeBase, types

ecosystem/
└── core-workers/
    └── worker-bridge.ts             # WorkerBridge class

experienceLayer/
├── experience-eidos/
│   └── eidos-bridge.ts              # EidosBridge class
│
├── experience-touchpoint/
│   └── api-bridge.ts                # ApiBridge class
│
└── experience-admin/
    └── admin-bridge.ts              # AdminBridge class

tenants/
├── acme-corp/
│   └── acme-bridge.ts               # AcmeCorpBridge class
│
└── contoso/
    └── contoso-bridge.ts            # ContosoBridge class
```

---

## Usage Patterns

### Direct Namespace Access

```typescript
const bridge = new WorkerBridge()
await bridge.initialize()

// Direct namespace method calls
await bridge.engagement.save(engagementData)
await bridge.worker.spawn(workerConfig)
await bridge.queue.getBatch(10)

// Type-safe with autocomplete
bridge.engagement.   // ← IDE shows: save, getById, update, delete, etc.
```

### Custom Bridge Methods

Only add bridge methods when they:
- Combine multiple namespace operations
- Add tenant/domain-specific logic
- Orchestrate complex workflows

**Don't do this (unnecessary wrapper):**
```typescript
async createEngagement(data: any) {
  return await this.engagement.save(data)  // ❌ Just wrapper
}
```

**Do this (adds value):**
```typescript
async createEngagementWithNotification(data: any) {
  const engagement = await this.engagement.save(data, this.getCurrentContext())
  
  await this.queue.publish('notifications', {
    type: 'engagement_created',
    engagementId: engagement.id,
    tenantId: data.tenantId
  })
  
  return engagement  // ✅ Orchestrates two operations
}
```

---

## Configuration Model

### Bridge Config Structure

```typescript
interface BridgeConfig {
  name: string
  namespaces: string[]        // Which namespaces to load
  tenantId?: string           // Optional tenant context
  userId?: string             // Optional user context
  permissions?: string[]      // Optional permission set
  integrations: {             // Integration connection details
    mongoDb?: IntegrationConfig
    kafka?: IntegrationConfig
    // ... etc
  }
}
```

### Config Example

```json
{
  "name": "worker-bridge",
  "namespaces": ["engagement", "worker", "queue", "logs"],
  "integrations": {
    "mongoDb": {
      "uri": "${MONGO_URI}",
      "poolSize": 10
    },
    "kafka": {
      "brokers": ["localhost:9092"],
      "clientId": "worker-bridge"
    }
  }
}
```

---

## Security Model

### Namespace-Level Security

Security is enforced **inside namespace modules**, not at bridge level:

```typescript
// In namespace module
async save(data: any, context: BridgeContext) {
  // Check permission
  if (!this.auth.hasPermission(context, 'engagement:create')) {
    throw new AuthError('Permission denied')
  }
  
  // Tenant isolation
  data.tenantId = context.tenantId
  
  // Proceed with operation
}
```

### Bridge-Level Security

Bridges enforce security by **only loading required namespaces**:

```typescript
// Worker bridge has these
bridge.worker.spawn()      // ✅
bridge.engagement.save()   // ✅

// Worker bridge DOES NOT have these
bridge.admin.dropCommunity()  // ❌ Property doesn't exist
bridge.admin.truncateQueues() // ❌ Property doesn't exist
```

Admin operations are isolated in AdminNamespace and only loaded by AdminBridge.

---

## Logging & Error Handling

### Structured Errors

All namespace operations use structured errors:

```typescript
export class BridgeError extends Error {
  code: ErrorCode
  severity: 'info' | 'warn' | 'error' | 'critical'
  context: {
    bridge: string
    namespace: string
    method: string
    tenantId?: string
    userId?: string
  }
  timestamp: Date
  correlationId: string
}

// Error types
export class ValidationError extends BridgeError {}
export class AuthError extends BridgeError {}
export class BusinessRuleError extends BridgeError {}
export class IntegrationError extends BridgeError {}
export class NotFoundError extends BridgeError {}
```

### Automatic Logging

All namespace operations automatically log:

```typescript
// In namespace module
async save(data: any, context: BridgeContext) {
  const correlationId = generateId()
  
  try {
    logger.info('engagement.save started', {
      correlationId,
      tenantId: context.tenantId,
      dataSize: JSON.stringify(data).length
    })
    
    // ... perform operation
    
    logger.info('engagement.save completed', {
      correlationId,
      duration: Date.now() - startTime
    })
    
  } catch (error) {
    logger.error('engagement.save failed', {
      correlationId,
      error: error.message,
      stack: error.stack
    })
    throw new IntegrationError('Failed to save engagement', {
      correlationId,
      originalError: error
    })
  }
}
```

---

## Validation & Testing

### Startup Validation

Bridge validates on initialization:

1. All declared namespaces exist
2. All integrations are configured
3. Required methods are present
4. Connections can be established

Example error:
```
BridgeInitError: Namespace 'engagement' requires integration 'mongoDb'
  Config: worker-bridge.config.json
  Fix: Add mongoDb integration configuration
```

### Unit Testing

Test namespaces independently:

```typescript
describe('EngagementNamespace', () => {
  let namespace: EngagementNamespace
  let mockDb: MockMongoDb
  
  beforeEach(() => {
    mockDb = new MockMongoDb()
    namespace = new EngagementNamespace(
      mockDb,
      new EngagementValidator(),
      new MockAuth()
    )
  })
  
  it('should validate engagement before saving', async () => {
    const invalid = { total: -100 }
    await expect(namespace.save(invalid, mockContext))
      .rejects.toThrow(ValidationError)
  })
  
  it('should check permissions', async () => {
    const contextWithoutPermission = { permissions: [] }
    await expect(namespace.save(validData, contextWithoutPermission))
      .rejects.toThrow(AuthError)
  })
})
```

### Integration Testing

Test bridges with real integrations:

```typescript
describe('WorkerBridge', () => {
  let bridge: WorkerBridge
  
  beforeAll(async () => {
    bridge = new WorkerBridge()
    await bridge.initialize()
  })
  
  it('should save engagement via namespace', async () => {
    const engagement = await bridge.engagement.save(testData)
    expect(engagement.id).toBeDefined()
  })
  
  it('should optimize batch size based on queue', async () => {
    const batchSize = await bridge.optimizeBatchSize()
    expect(batchSize).toBeGreaterThan(0)
  })
})
```

---

## Benefits Summary

### For Developers

✅ **Clear API**: Namespaced methods easy to discover (`bridge.engagement.save()`)
✅ **Type safety**: Full TypeScript support with autocomplete
✅ **Testability**: Each namespace testable in isolation
✅ **Extensibility**: Easy to add custom logic via bridge subclasses
✅ **Maintainability**: Small, focused files organized by domain

### For System

✅ **No duplication**: Application logic written once, shared everywhere
✅ **Singleton sharing**: All bridges share same namespace/integration instances
✅ **Resource efficiency**: One connection pool, shared across all bridges
✅ **Security**: Bridges only access declared namespaces
✅ **Observability**: Structured logging and errors throughout

### For Business

✅ **Faster development**: Clear patterns speed up feature development
✅ **Tenant customization**: Easy to create tenant-specific bridges
✅ **Reduced bugs**: Logic in one place means consistent behavior
✅ **Compliance ready**: Built-in audit logging and data masking
✅ **Scalable**: Pattern works across all codebases

---

## Deliverable

A modular bridge system where:
- Application logic lives in **namespace modules** (organized, testable, reusable)
- Integrations are **pure infrastructure** (no business logic)
- Bridges **compose namespaces** via config (security by omission)
- Custom logic added via **bridge extension** (tenant/domain-specific)
- All bridges **share instances** (no duplication, efficient resources)
- Pattern works **universally** across Workers, Eidos, APIs, Admin, and Tenants

