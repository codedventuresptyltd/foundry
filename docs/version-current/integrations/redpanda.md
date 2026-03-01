---
sidebar_position: 2
title: Kafka / Redpanda
---

# Kafka / Redpanda Integration

High-throughput message broker for worker queues, logs, and notifications. Kafka and Redpanda are **API-compatible** - use either based on your infrastructure preferences.

## Modules Provided

### Worker Queue Module
Distributes jobs to workers with exactly-once semantics.

**Topics:**
- Worker-specific queues
- Job distribution
- Result collection

**Operations:**
- Push jobs to queues
- Fetch job batches
- Commit job completion
- Handle processing failures

**Use Cases:**
- Engagement recalculation
- Order processing
- Batch operations
- Scheduled tasks

### Logs Module
Centralized structured logging with high throughput.

**Topics:**
- System logs
- Error logs
- Performance metrics
- Audit trails

**Operations:**
- Write structured logs
- Query recent logs
- Stream log events
- Aggregate metrics

**Use Cases:**
- Application logging
- Error tracking
- Performance monitoring
- Compliance auditing

### Notifications Module
Event-driven notification system.

**Topics:**
- User notifications
- System events
- Integration webhooks
- Worker alerts

**Operations:**
- Publish notifications
- Subscribe to events
- Filter by type
- Broadcast messages

**Use Cases:**
- Order status updates
- System alerts
- Integration events
- User notifications

## Configuration

### Connection Settings

```typescript
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=commercebridge-prod
KAFKA_GROUP_ID=worker-group-1
KAFKA_ENABLE_SSL=false
```

### Topic Configuration

```typescript
KAFKA_QUEUE_TOPIC=worker-queue
KAFKA_LOGS_TOPIC=system-logs
KAFKA_NOTIFICATIONS_TOPIC=notifications
```

### Performance Tuning

```typescript
KAFKA_MAX_BATCH_SIZE=100
KAFKA_BATCH_TIMEOUT_MS=5000
KAFKA_COMPRESSION_TYPE=snappy
KAFKA_MAX_IN_FLIGHT=5
```

## Bridge Access

```typescript
// Worker Queue
await bridge.integrations.kafka.module_queue.publishJob(jobCard);
const jobs = await bridge.integrations.kafka.module_queue.fetchBatch(100);

// Logs
await bridge.integrations.kafka.module_logs.writeLog({
  level: 'info',
  message: 'Processing engagement',
  metadata: { engagementId }
});

// Notifications
await bridge.integrations.kafka.module_notifications.publish({
  type: 'order.confirmed',
  userId: '123',
  data: orderDetails
});
```

## Kafka vs Redpanda

### Use Kafka When:
- You need mature ecosystem tooling
- Integration with existing Kafka infrastructure
- Extensive monitoring requirements
- Large-scale proven deployments

### Use Redpanda When:
- Lower operational complexity desired
- Better resource efficiency needed
- Simpler deployment model preferred
- Kafka-compatible but lighter footprint

Both provide identical functionality through the same interface. Switch between them without code changes.

## Advantages

**High Throughput**
- Process millions of messages per second
- Horizontal scaling with partitions
- Efficient batching and compression

**Durability**
- Replication across brokers
- Persistent storage
- Exactly-once semantics

**Scalability**
- Add brokers dynamically
- Partition-based parallelism
- Consumer group load balancing

**Reliability**
- Fault tolerance through replication
- Automatic failover
- Message ordering guarantees

## Operational Notes

### Partition Strategy
- One partition per worker type for isolation
- More partitions = more parallelism
- Balance partition count with overhead

### Consumer Groups
- One group per worker ecosystem
- Group ID ties to tenant or environment
- Parallel consumption within group

### Retention Policies
- Logs: 7 days retention
- Queue: 24 hours (jobs should process quickly)
- Notifications: 3 days (for replay)

### Monitoring
- Consumer lag (jobs backing up?)
- Throughput (messages per second)
- Error rates (processing failures)
- Broker health (replica sync status)

## When to Use

**Primary Queue System:** When you need high-volume job processing with ordering guarantees.

**Centralized Logging:** When you need to collect logs from distributed workers and services.

**Event Streaming:** When you need to broadcast events to multiple consumers with replay capability.

## When NOT to Use

**Low-Volume Operations:** RabbitMQ is simpler for low-throughput use cases.

**Request-Reply Patterns:** Use direct HTTP or RPC for synchronous communication.

**Small Deployments:** Operational overhead might outweigh benefits for tiny systems.

---

**Kafka/Redpanda: Built for scale, handles the load.**


