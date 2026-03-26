---
sidebar_position: 4
title: RabbitMQ
---

# RabbitMQ Integration

Message broker alternative to Kafka/Redpanda. Simpler operational model, lower throughput, excellent for development and smaller deployments.

## Modules Provided

### Worker Queue Module
Job distribution with flexible routing patterns.

**Exchanges & Queues:**
- Worker-specific queues
- Direct exchange for routing
- Dead letter queues for failures

**Operations:**
- Push jobs to specific workers
- Fetch jobs with acknowledgment
- Requeue failed jobs
- Priority queuing

**Use Cases:**
- Worker job distribution
- Task scheduling
- Background processing
- Retry management

### Logs Module
Structured logging with fanout pattern.

**Exchanges & Queues:**
- Logs exchange (fanout)
- Consumer-specific queues
- Level-based routing

**Operations:**
- Write structured logs
- Subscribe to log streams
- Filter by log level
- Multiple consumers

**Use Cases:**
- Application logging
- Log aggregation
- Real-time log viewing
- Error tracking

### Notifications Module
Event-driven notifications with topic routing.

**Exchanges & Queues:**
- Notifications exchange (topic)
- Subscription-based routing
- Pattern matching

**Operations:**
- Publish typed notifications
- Subscribe to patterns
- Targeted delivery
- Broadcast messages

**Use Cases:**
- User notifications
- System events
- Integration webhooks
- Alert distribution

## Configuration

### Connection Settings

```typescript
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=commercebridge
RABBITMQ_PASSWORD=<from-secrets>
RABBITMQ_VHOST=/commercebridge
```

### Queue Configuration

```typescript
RABBITMQ_QUEUE_PREFIX=worker
RABBITMQ_LOGS_EXCHANGE=logs
RABBITMQ_NOTIFICATIONS_EXCHANGE=notifications
RABBITMQ_PREFETCH_COUNT=10
```

### Connection Pooling

```typescript
RABBITMQ_CONNECTION_POOL_SIZE=5
RABBITMQ_CHANNEL_POOL_SIZE=20
RABBITMQ_HEARTBEAT_INTERVAL=60
```

## Bridge Access

```typescript
// Worker Queue
await bridge.integrations.rabbitmq.module_queue.publishJob(
  'worker-type',
  jobCard
);

const jobs = await bridge.integrations.rabbitmq.module_queue.fetchJobs(
  'worker-type',
  10
);

await bridge.integrations.rabbitmq.module_queue.acknowledgeJob(jobId);

// Logs
await bridge.integrations.rabbitmq.module_logs.writeLog({
  level: 'error',
  message: 'Processing failed',
  error: errorDetails
});

// Notifications
await bridge.integrations.rabbitmq.module_notifications.publish({
  type: 'order.shipped',
  routingKey: 'order.customer.123',
  data: shipmentInfo
});

// Subscribe to notifications
await bridge.integrations.rabbitmq.module_notifications.subscribe(
  'order.*',
  (notification) => {
    console.log('Received:', notification);
  }
);
```

## Exchange Patterns

### Direct Exchange (Queue Module)
- One-to-one message routing
- Worker-type-specific queues
- Exact routing key match

**Use Case:** Job distribution to specific worker types.

### Fanout Exchange (Logs Module)
- One-to-many broadcasting
- All queues receive messages
- No routing key needed

**Use Case:** Broadcast logs to multiple consumers (file writer, log viewer, error tracker).

### Topic Exchange (Notifications Module)
- Pattern-based routing
- Wildcard subscriptions
- Flexible targeting

**Use Case:** Subscribe to `order.*` to get all order events, or `order.123.*` for specific order.

## Advantages

**Flexible Routing**
- Multiple exchange types
- Complex routing patterns
- Dead letter exchanges

**Low Latency**
- Sub-millisecond message delivery
- Immediate acknowledgment
- Priority queues

**Operational Simplicity**
- Single-node deployment sufficient
- Web management UI included
- Easy monitoring

**Developer Experience**
- Rich management API
- Excellent tooling
- Well-documented

## RabbitMQ vs Kafka/Redpanda

### Use RabbitMQ When:
- Development or smaller deployments
- Low-to-medium message volume
- Complex routing patterns needed
- Operational simplicity preferred

### Use Kafka/Redpanda When:
- High-throughput requirements
- Need message replay capability
- Event sourcing patterns
- Large-scale distributed systems

Both provide the same interface - switch without code changes.

## Operational Notes

### Queue Management
- Set max queue length to prevent memory issues
- Use TTL for old messages
- Monitor queue depth
- Configure dead letter exchanges

### High Availability
- Use mirrored queues for HA
- 3-node cluster recommended
- Automatic failover
- Queue synchronization

### Monitoring
- Queue length (backlog growing?)
- Message rates (throughput)
- Consumer count (workers active?)
- Memory usage (messages accumulating?)

### Performance Tuning
- Adjust prefetch count (higher = more batching)
- Use persistent messages sparingly
- Enable lazy queues for large queues
- Configure message TTL

## Message Patterns

### Work Queue Pattern
One producer, multiple consumers, round-robin distribution.

**Use Case:** Distribute jobs evenly across worker pool.

### Publish-Subscribe Pattern
One producer, multiple consumers, all receive messages.

**Use Case:** Broadcast system events to all interested services.

### Request-Reply Pattern
Temporary reply queues for synchronous communication.

**Use Case:** RPC-style operations where response is needed.

### Routing Pattern
Selective message delivery based on routing keys.

**Use Case:** Send notifications only to interested subscribers.

## When to Use

**Development Environment:** Easier to run locally than Kafka.

**Low-to-Medium Volume:** Perfect for systems with < 10K messages/second.

**Complex Routing:** When you need flexible message routing patterns.

## When NOT to Use

**High Throughput:** Kafka handles millions of messages better.

**Message Replay:** RabbitMQ doesn't support replay - messages are consumed once.

**Long-term Storage:** Not designed for persistent event logs.

---

**RabbitMQ: Simple, flexible, reliable messaging.**


