---
sidebar_position: 6
title: Workers
---

# Workers

**Stateless, Replaceable Processing Engines**

Workers are the execution layer of CommerceBridge. They are autonomous, stateless processors that consume tasks, execute business logic, and scale elastically based on workload.

---

## What Workers Are

Workers are:

- **Stateless** — No persistent state between executions
- **Replaceable** — Can be stopped and started without system impact
- **Autonomous** — Self-contained execution units
- **Elastic** — Scale up or down based on workload
- **Specialized** — Each worker handles a single business task

---

## What Workers Do

Workers execute specific business tasks by:

1. **Connecting to the system** — Announcing their presence (heartbeat)
2. **Receiving work** — Getting job cards from the queue
3. **Processing tasks** — Executing business logic using the Bridge
4. **Optimizing** — Cleaning up, reporting metrics
5. **Repeating** — Continuous cycle

---

## The Worker Loop

At a high level, every worker follows this cycle:

```
beat → getJobs → work loop → optimise → beat
```

### 1. Beat (Heartbeat)

Worker announces its presence to the system:

```typescript
async beat() {
  // Announce worker is alive and ready
  await this.bridge.publishToQueue('worker-registry', {
    workerId: this.workerId,
    type: this.workerType,
    status: 'active',
    timestamp: Date.now()
  });
}
```

### 2. Get Jobs

Worker retrieves job cards from its queue:

```typescript
async getJobs() {
  // Fetch available job cards
  const jobs = await this.bridge.consumeFromQueue(
    this.queueName,
    this.config.batchSize
  );
  return jobs;
}
```

### 3. Work Loop

Worker processes each job card:

```typescript
async workLoop(jobs: JobCard[]) {
  for (const job of jobs) {
    await this.processJob(job);
  }
}
```

### 4. Optimise

Worker cleans up and reports metrics:

```typescript
async optimise() {
  // Clear local caches
  this.clearLocalCache();
  
  // Report metrics
  await this.reportMetrics();
  
  // Check for updates/shutdown signals
  await this.checkSystemMessages();
}
```

Then the cycle repeats: **beat → getJobs → work loop → optimise**

---

## Core Principles

### Single Business Task Per Worker

Each worker should handle **one specific business task**:

✅ **Good Examples:**
- `order-processor` — Processes new orders
- `inventory-allocator` — Allocates inventory
- `price-calculator` — Calculates prices
- `notification-sender` — Sends customer notifications

❌ **Bad Examples:**
- `order-handler` — Too broad (process + allocate + notify)
- `multi-purpose-worker` — Violates single responsibility

### Isolation

Workers operate independently:

- No shared state between workers
- No direct worker-to-worker communication
- All communication through queues
- Each worker can fail without affecting others

### Independence

Workers are self-sufficient:

- Contain all logic needed for their task
- Make decisions autonomously
- Don't depend on other workers being available
- Can be deployed and scaled independently

---

## Building a Worker

### Step 1: Import the Core Models

```typescript
import { BaseWorker, JobCard, WorkerConfig } from '@commercebridge/core';
import { MyCustomBridge } from './my-bridge';
```

### Step 2: Define Your Worker Class

```typescript
export class OrderProcessorWorker extends BaseWorker {
  private bridge: MyCustomBridge;
  
  constructor(config: WorkerConfig) {
    super(config);
    this.bridge = new MyCustomBridge(config.bridge);
  }
}
```

### Step 3: Implement the Work Function

The `work()` function is the main control loop:

```typescript
async work(jobCard: JobCard): Promise<void> {
  // The core provides error handling, logging, and retry logic
  // Your job is to define the business logic
  
  switch (jobCard.task) {
    case 'process-order':
      await this.processOrder(jobCard);
      break;
    case 'confirm-order':
      await this.confirmOrder(jobCard);
      break;
    default:
      throw new Error(`Unknown task: ${jobCard.task}`);
  }
}
```

### Step 4: Define Task Functions

Each task function handles one specific operation:

```typescript
async processOrder(jobCard: JobCard): Promise<void> {
  return await this.executeTask(jobCard, async () => {
    // Task logic wrapped in executeTask for error handling
    const { orderId } = jobCard.payload;
    
    // Use the bridge to access core functions
    const engagement = await this.bridge.getEngagement(orderId);
    
    // Allocate inventory
    await this.bridge.allocateInventory(
      engagement.id,
      engagement.lineItems
    );
    
    // Calculate pricing
    const pricing = await this.bridge.calculatePrice(
      engagement.lineItems
    );
    
    // Update engagement
    await this.bridge.updateEngagement(engagement.id, {
      status: 'processing',
      pricing
    });
    
    // Use custom bridge functions
    await this.bridge.syncToErp(engagement);
    await this.bridge.sendNotification(
      engagement.customerId,
      'order-confirmed'
    );
  });
}
```

---

## Job Cards

Job cards are the unit of work that workers process.

### Job Card Structure

```typescript
interface JobCard {
  id: string;              // Unique job identifier
  task: string;            // Task type (e.g., 'process-order')
  payload: any;            // Task-specific data
  priority: number;        // Job priority (1-10)
  attempts: number;        // Retry attempt count
  maxAttempts: number;     // Maximum retry attempts
  createdAt: Date;         // When job was created
  scheduledFor?: Date;     // Delayed execution time
  tenantId: string;        // Tenant context
}
```

### Job Card Example

```typescript
{
  id: 'job-123',
  task: 'process-order',
  payload: {
    orderId: 'order-456',
    customerId: 'customer-789'
  },
  priority: 5,
  attempts: 0,
  maxAttempts: 3,
  createdAt: new Date(),
  tenantId: 'acme-corp'
}
```

---

## The Control Loop

The core provides the control loop infrastructure:

```typescript
export abstract class BaseWorker {
  // Core provides this control loop
  async start(): Promise<void> {
    while (this.isRunning) {
      // 1. Beat
      await this.beat();
      
      // 2. Get Jobs
      const jobs = await this.getJobs();
      
      // 3. Work Loop
      for (const job of jobs) {
        try {
          await this.work(job);
          await this.acknowledgeJob(job);
        } catch (error) {
          await this.handleJobError(job, error);
        }
      }
      
      // 4. Optimise
      await this.optimise();
      
      // Wait before next cycle
      await this.sleep(this.config.pollInterval);
    }
  }
  
  // You implement this
  abstract work(jobCard: JobCard): Promise<void>;
}
```

---

## Task Function Structure

Each task function follows this pattern:

```typescript
async myTask(jobCard: JobCard): Promise<void> {
  // Wrap in executeTask for built-in error handling
  return await this.executeTask(jobCard, async () => {
    // 1. Extract payload
    const { param1, param2 } = jobCard.payload;
    
    // 2. Validate inputs
    if (!param1) {
      throw new ValidationError('param1 is required');
    }
    
    // 3. Access bridge functions
    const data = await this.bridge.getSomeData(param1);
    
    // 4. Execute business logic
    const result = this.processSomething(data, param2);
    
    // 5. Update state via bridge
    await this.bridge.updateSomething(result);
    
    // 6. Trigger downstream work if needed
    if (result.requiresApproval) {
      await this.bridge.publishToQueue('approvals', {
        type: 'approval.required',
        data: result
      });
    }
    
    // Task complete - executeTask handles success reporting
  });
}
```

### executeTask Benefits

The `executeTask` wrapper provides:

- **Error catching and logging** — Automatic error capture
- **Retry logic** — Handles retries based on job card config
- **Metrics reporting** — Tracks execution time, success/failure
- **Transaction management** — Ensures atomicity
- **Timeout handling** — Prevents hung tasks

---

## Accessing the Bridge from Workers

### Import Your Custom Bridge

```typescript
import { MyEcosystemBridge } from '../bridges/my-ecosystem-bridge';

export class MyWorker extends BaseWorker {
  private bridge: MyEcosystemBridge;
  
  constructor(config: WorkerConfig) {
    super(config);
    
    // Instantiate your bridge
    this.bridge = new MyEcosystemBridge({
      mongodb: config.mongodb,
      redis: config.redis,
      queue: config.queue,
      tenantId: config.tenantId,
      // Your custom config
      erpUrl: config.erpUrl,
      erpApiKey: config.erpApiKey
    });
  }
}
```

### Using Bridge Functions

```typescript
async work(jobCard: JobCard): Promise<void> {
  // Access core bridge functions
  const engagement = await this.bridge.getEngagement(jobCard.payload.id);
  const pricing = await this.bridge.calculatePrice(...);
  await this.bridge.allocateInventory(...);
  
  // Access your custom bridge functions
  await this.bridge.syncToErp(engagement);
  await this.bridge.sendSms(customerId, message);
}
```

---

## Delivery of Job Cards

Job cards are delivered by the **core infrastructure**, not by your code.

### How It Works

```
1. Something creates a job card
   ↓
2. Core publishes to worker queue
   ↓
3. Worker's getJobs() fetches from queue
   ↓
4. Core delivers job card to work() function
   ↓
5. Your task function executes
```

### Creating Job Cards

Other systems create job cards and publish them:

```typescript
// From an API endpoint
await bridge.publishToQueue('order-processing', {
  id: generateId(),
  task: 'process-order',
  payload: { orderId: '123' },
  priority: 5,
  attempts: 0,
  maxAttempts: 3,
  createdAt: new Date(),
  tenantId: req.tenantId
});
```

### Worker Consumes Job Cards

Your worker doesn't create job cards, it **consumes** them:

```typescript
// Core handles this - you don't write this code
async getJobs(): Promise<JobCard[]> {
  return await this.bridge.consumeFromQueue(
    this.queueName,
    this.config.batchSize
  );
}
```

---

## Complete Worker Example

```typescript
import { BaseWorker, JobCard, WorkerConfig } from '@commercebridge/core';
import { AcmeCommerceBridge } from '../bridges/acme-bridge';

export class OrderProcessorWorker extends BaseWorker {
  private bridge: AcmeCommerceBridge;
  
  constructor(config: WorkerConfig) {
    super(config);
    this.bridge = new AcmeCommerceBridge(config.bridge);
  }
  
  // Main work function - routes to task functions
  async work(jobCard: JobCard): Promise<void> {
    switch (jobCard.task) {
      case 'process-order':
        return await this.processOrder(jobCard);
      case 'confirm-order':
        return await this.confirmOrder(jobCard);
      case 'cancel-order':
        return await this.cancelOrder(jobCard);
      default:
        throw new Error(`Unknown task: ${jobCard.task}`);
    }
  }
  
  // Task function: Process new order
  private async processOrder(jobCard: JobCard): Promise<void> {
    return await this.executeTask(jobCard, async () => {
      const { orderId } = jobCard.payload;
      
      // Get engagement
      const engagement = await this.bridge.getEngagement(orderId);
      
      // Allocate inventory (core function)
      const allocation = await this.bridge.allocateInventory(
        engagement.id,
        engagement.lineItems
      );
      
      if (!allocation.success) {
        throw new InsufficientInventoryError('Cannot fulfill order');
      }
      
      // Calculate final pricing (core function)
      const pricing = await this.bridge.calculatePrice(
        engagement.lineItems,
        engagement.customerId
      );
      
      // Update engagement (core function)
      await this.bridge.updateEngagement(engagement.id, {
        status: 'processing',
        pricing,
        allocation
      });
      
      // Sync to ERP (custom function)
      await this.bridge.syncOrderToErp(engagement);
      
      // Send notification (custom function)
      await this.bridge.sendSmsNotification(
        engagement.customerId,
        'Your order is being processed!'
      );
      
      // Trigger next step
      await this.bridge.publishToQueue('order-confirmation', {
        id: generateId(),
        task: 'confirm-order',
        payload: { orderId: engagement.id },
        priority: 5,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        tenantId: jobCard.tenantId
      });
    });
  }
  
  // Task function: Confirm order
  private async confirmOrder(jobCard: JobCard): Promise<void> {
    return await this.executeTask(jobCard, async () => {
      const { orderId } = jobCard.payload;
      
      const engagement = await this.bridge.getEngagement(orderId);
      
      await this.bridge.updateEngagement(engagement.id, {
        status: 'confirmed'
      });
      
      await this.bridge.sendEmailNotification(
        engagement.customerId,
        'order-confirmation',
        { order: engagement }
      );
    });
  }
  
  // Task function: Cancel order
  private async cancelOrder(jobCard: JobCard): Promise<void> {
    return await this.executeTask(jobCard, async () => {
      const { orderId, reason } = jobCard.payload;
      
      const engagement = await this.bridge.getEngagement(orderId);
      
      // Release inventory (core function)
      await this.bridge.releaseInventory(engagement.allocation.id);
      
      // Update status
      await this.bridge.updateEngagement(engagement.id, {
        status: 'cancelled',
        cancellationReason: reason
      });
      
      // Notify customer
      await this.bridge.sendSmsNotification(
        engagement.customerId,
        `Order cancelled: ${reason}`
      );
    });
  }
}
```

---

## Worker Configuration

```typescript
const workerConfig: WorkerConfig = {
  workerId: 'order-processor-1',
  workerType: 'order-processor',
  queueName: 'order-processing',
  pollInterval: 1000,        // ms between cycles
  batchSize: 10,             // jobs per cycle
  concurrency: 5,            // parallel task execution
  
  bridge: {
    mongodb: { uri: process.env.MONGODB_URI },
    redis: { host: process.env.REDIS_HOST },
    queue: { url: process.env.RABBITMQ_URL },
    tenantId: 'acme-corp',
    
    // Custom bridge config
    erpUrl: process.env.ERP_URL,
    erpApiKey: process.env.ERP_KEY
  }
};

const worker = new OrderProcessorWorker(workerConfig);
await worker.start();
```

---

## Worker Lifecycle

```
1. Worker starts
   ↓
2. Connects to infrastructure (MongoDB, Redis, Queue)
   ↓
3. Sends initial heartbeat
   ↓
4. Enters control loop:
   - beat
   - getJobs
   - work loop
   - optimise
   ↓
5. On shutdown signal:
   - Finish current jobs
   - Send final heartbeat (status: stopping)
   - Close connections
   - Exit gracefully
```

---

## Best Practices

### Do:

✅ Keep workers focused on a single business task  
✅ Use the provided `executeTask` wrapper  
✅ Access all data through the bridge  
✅ Handle errors gracefully  
✅ Use job cards for all communication  
✅ Keep task functions pure and testable  

### Don't:

❌ Share state between worker instances  
❌ Communicate directly with other workers  
❌ Access databases directly (use bridge)  
❌ Create your own control loop  
❌ Bypass the executeTask wrapper  
❌ Mix multiple business tasks in one worker  

---

**Workers: Autonomous, focused, and scalable.**
