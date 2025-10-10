---
sidebar_position: 11
title: Extending CommerceBridge
---

# Extending CommerceBridge
**Pattern:** How to safely extend the base framework for your needs.

## Extension Philosophy

CommerceBridge provides a **base framework** with core commerce operations. You extend it to add:

- External system integrations
- Custom business logic
- Tenant-specific workflows
- Industry-specific features

**Rule:** Extend, don't modify. Keep the core generic.

---

## What You Extend

### 1. The Bridge

Add your integrations and business logic:

```ts
import { BaseBridge } from '@commercebridge/core'

export class MyBridge extends BaseBridge {
  // All core functions inherited automatically
  
  // Add your functions
  async yourCustomFunction() {
    // Your logic
  }
}
```

### 2. Workers

Create task-specific processors:

```ts
import { BaseWorker } from '@commercebridge/core'

export class MyWorker extends BaseWorker {
  async work(job: JobCard) {
    // Your task logic
  }
}
```

### 3. Pricing Logic

Customize price calculations:

```ts
export class CustomBridge extends BaseBridge {
  async calculatePrice(context: PricingContext) {
    // Get base calculation
    const base = await super.calculatePrice(context)
    
    // Add your custom modifiers
    const customModifiers = await this.getCustomModifiers(context)
    
    return {
      ...base,
      modifiers: [...base.modifiers, ...customModifiers],
      finalPrice: this.applyCustomModifiers(base.finalPrice, customModifiers)
    }
  }
}
```

### 4. Fulfillment Logic

Customize allocation strategies:

```ts
export class CustomBridge extends BaseBridge {
  async allocateInventory(engagementId: string, items: LineItem[]) {
    // Add custom pre-allocation logic
    const preferences = await this.getCustomerPreferences(engagementId)
    
    // Modify allocation strategy based on preferences
    if (preferences.preferSingleWarehouse) {
      return await this.allocateFromSingleWarehouse(engagementId, items)
    }
    
    return await super.allocateInventory(engagementId, items)
  }
}
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

```ts
interface CustomBridgeConfig extends BridgeConfig {
  // Base config inherited
  
  // Add your custom config
  erpUrl: string
  erpApiKey: string
  messagingProvider: {
    smsService: string
    emailService: string
  }
  customFeatures: {
    approvalThreshold: number
    autoAllocate: boolean
  }
}

export class CustomBridge extends BaseBridge {
  constructor(config: CustomBridgeConfig) {
    super(config)
    // Initialize your custom clients with custom config
  }
}
```

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

### Initialize in Your Ecosystem

```ts
import { CustomBridge } from './bridge/custom-bridge'
import { OrderProcessor } from './workers/order-processor'

// Initialize Bridge
const bridge = new CustomBridge(config)

// Initialize Workers
const orderWorker = new OrderProcessor({
  ...workerConfig,
  bridge: config
})

await orderWorker.start()
```

---

## IP Safety

This documentation shows:
- **Public:** Extension patterns, interfaces, best practices
- **Private (not shown):** Specific implementations, system details, tenant logic

---

**Extending CommerceBridge: Your business logic, our foundation.**
