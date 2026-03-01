---
sidebar_position: 7
title: Custom Ecosystems
---

# Custom Ecosystems
**Concept:** How to use and extend the Bridge.

## What is an Ecosystem?

An **ecosystem** is a self-contained deployment unit that combines:

- **Core Workers** — Standard workers from `@mesh/ecosystem`
- **Custom Workers** — Your business-specific processors
- **Actors** — Specialized workers that manage ecosystem operations (reaper, seeder, steward, ambassador)
- **Configuration** — Bridge configs defining integrations and behaviors

Think of it as a "worker community" — a coordinated group of workers that collectively handle a specific business domain.

### Ecosystem Structure

```
my-ecosystem/
├── ecosystem.ts          # Main entry point
├── package.json          # Dependencies (includes @mesh/ecosystem)
├── workers/             # Your custom workers
│   └── custom-worker.ts
├── configs/             # Bridge configurations
└── .env                 # Environment variables
```

### How Ecosystems Work

1. **Import Core** — Ecosystem imports the core framework (`@mesh/ecosystem`)
2. **Define Workers** — Register core and custom workers in a library
3. **Configure Actors** — Set up management actors (reaper, seeder, etc.)
4. **Spawn Embryo** — Initialize the ecosystem with worker and actor libraries

### Ecosystem Philosophy

CommerceBridge provides a **base framework** with core commerce operations. You extend it by creating ecosystems that add:

- External system integrations
- Custom business logic
- Tenant-specific workflows
- Industry-specific features

**Rule:** Extend, don't modify. Keep the core generic.

---

## Building an Ecosystem

### 1. Install Core Package

```json
{
  "name": "my-ecosystem",
  "dependencies": {
    "@mesh/ecosystem": "~0.0.6-build1",
    "dotenv": "^16.0.3",
    "pm2": "^5.3.0"
  }
}
```

### 2. Create Ecosystem Entry Point

```ts
import * as mesh from "@mesh/ecosystem/ecosystem";
import { myCustomWorker } from './workers/my-custom-worker';

// Initialize ecosystem
const ecosystem = new mesh.core_models.ecosystemModel.Ecosystem();

// Register actors (ecosystem management)
const actorLibrary = {
  "reaper": mesh.core_community.actor_reaper.actor_reaper,
  "seeder": mesh.core_community.actor_seeder.actor_seeder,
  "steward": mesh.core_community.actor_steward.actor_steward,
  "ambassador": mesh.core_community.actor_ambassador.actor_ambassador
};

// Register workers (core + custom)
const workerLibrary = {
  // Core workers from framework
  "commerce/engagementRecalculator": mesh.core_workers.worker_commerce_engagement_reCaculator,
  "search/indexFromDatastore": mesh.core_workers.worker_search_openSearch_indexFromDatastore,
  
  // Your custom workers
  "custom/myBusinessProcess": myCustomWorker
};

// Spawn the ecosystem
new mesh.core_models.workerEmbyroModel.WorkerEmbryo(
  workerLibrary, 
  actorLibrary, 
  process.env.COMMUNITY_ID || "", 
  ecosystem
);
```

### 3. Configure Environment

```bash
# .env
COMMUNITY_ID=my-commerce-community
BRIDGE_CONFIG_ID=commerce-bridge-prod
```

### 4. Run the Ecosystem

```bash
# Development (single worker)
npm run start-dev -- --actor=myWorkerName

# Production (full community with PM2)
npm start
```

---

## Extension Patterns

### Pattern 1: External System Integration

```ts
export class EcosystemBridge extends BaseBridge {
  private externalClient: ExternalSystemClient
  
  constructor(config: BridgeConfig) {
    super(config)
    this.externalClient = new ExternalSystemClient(config.external)
  }
  
  async syncToExternalSystem(engagement: Engagement) {
    const externalFormat = this.transform(engagement)
    return await this.externalClient.sync(externalFormat)
  }
}
```

### Pattern 2: Custom Validation

```ts
export class ValidatedBridge extends BaseBridge {
  async createEngagement(params: EngagementParams) {
    // Add custom validation
    await this.validateCustomRules(params)
    
    // Call base implementation
    const engagement = await super.createEngagement(params)
    
    // Post-creation hooks
    await this.notifyStakeholders(engagement)
    
    return engagement
  }
}
```

### Pattern 3: Workflow Customization

```ts
export class WorkflowBridge extends BaseBridge {
  async updateEngagement(id: string, updates: Partial<Engagement>) {
    const current = await this.getEngagement(id)
    
    // Custom workflow logic
    if (this.requiresApproval(current, updates)) {
      await this.triggerApprovalWorkflow(id, updates)
      return current // Don't update yet
    }
    
    return await super.updateEngagement(id, updates)
  }
  
  private requiresApproval(current: Engagement, updates: Partial<Engagement>) {
    // Your approval logic
    return updates.status === 'confirmed' && 
           current.pricing.finalPrice > 10000
  }
}
```

---

## Best Practices

### ✅ Do

- **Use inheritance** — Extend BaseBridge, don't fork it
- **Keep extensions focused** — One concern per extension
- **Document your additions** — Help future maintainers
- **Use dependency injection** — Pass clients via config
- **Maintain multi-tenant safety** — Always include tenant context
- **Test extensions independently** — Unit test your additions

### ❌ Don't

- **Modify base classes** — Always extend
- **Bypass core functions** — Use inherited methods
- **Hardcode configuration** — Use config injection
- **Mix concerns** — Keep integrations separate
- **Ignore tenant context** — Always scope operations
- **Create deep inheritance chains** — Keep it simple

---

## Configuration Pattern

Bridge configuration follows a structured model that separates concerns and integrations:

```ts
interface BridgeConfig {
  _id: string
  theme: string        // Organizational grouping
  topic: string        // Functional area
  concern: string      // Specific concern within topic
  config: {
    modules: {
      [key: string]: {
        integration: string  // Which integration service to use
      }
    }
    integrations: {
      [key: string]: {
        integration: string  // Integration service class name
        uri?: string         // Connection URI
        poolSize?: number    // Connection pool size
        timeoutMs?: number   // Operation timeout
      }
    }
  }
}
```

**Example Configuration:**

```ts
const bridgeConfig: BridgeConfig = {
  _id: 'commerce-bridge-prod',
  theme: 'commerce',
  topic: 'order-processing',
  concern: 'fulfillment',
  config: {
    modules: {
      messaging: {
        integration: 'kafka'
      },
      database: {
        integration: 'mongodb'
      },
      search: {
        integration: 'opensearch'
      }
    },
    integrations: {
      kafka: {
        integration: 'KafkaIntegrationService',
        uri: 'kafka://localhost:9092',
        timeoutMs: 5000
      },
      mongodb: {
        integration: 'MongoDBIntegrationService',
        uri: 'mongodb://localhost:27017',
        poolSize: 10
      },
      opensearch: {
        integration: 'OpenSearchIntegrationService',
        uri: 'https://localhost:9200'
      }
    }
  }
}
```

**Available Integration Types:**
- **Messaging:** Kafka, RabbitMQ
- **Data:** MongoDB
- **Search:** OpenSearch
- **Communication:** Twilio, Mailgun
- **Utility:** Crypto, OpenAI, Strapi

---

## Testing Extensions

### Unit Testing

```ts
describe('CustomBridge', () => {
  let bridge: CustomBridge
  
  beforeEach(() => {
    bridge = new CustomBridge(testConfig)
  })
  
  it('should sync to ERP', async () => {
    const engagement = createTestEngagement()
    const result = await bridge.syncToErp(engagement)
    expect(result.success).toBe(true)
  })
})
```

### Integration Testing

```ts
describe('Custom Workflow', () => {
  it('should trigger approval for large orders', async () => {
    const engagement = await bridge.createEngagement(largeOrderParams)
    
    await bridge.updateEngagement(engagement.id, {
      status: 'confirmed'
    })
    
    // Verify approval workflow triggered
    const approvals = await bridge.getPendingApprovals()
    expect(approvals).toContain(engagement.id)
  })
})
```

---

## Deployment

### Package Your Extensions

```bash
my-ecosystem/
├── bridge/
│   └── custom-bridge.ts
├── workers/
│   ├── order-processor.ts
│   └── inventory-sync.ts
└── config/
    └── bridge-config.ts
```

---

**Custom Ecosystems: Your workers, your community, our foundation.**

