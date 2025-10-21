---
sidebar_position: 1
title: Integrations Overview
---

# Integrations Overview

CommerceBridge integrates with external services through a modular integration layer. Each integration provides specific modules that fulfill system roles like queue management, data storage, logging, and notifications.

## Integration Architecture

Integrations follow a consistent pattern:

- **Integration Class** - Manages connection lifecycle and configuration
- **Modules** - Specialized functionality (queue, logs, data, etc.)
- **Bridge Access** - Exposed through `bridge.integrations.[service]`

All integrations are **swappable** - the system doesn't care if you use Kafka or RabbitMQ for queuing, the Bridge provides interface consistency within the application.

## Available Integrations

### Message Brokers

| Integration | Queue | Logs | Notifications |
|-------------|-------|------|---------------|
| [Kafka/Redpanda](./redpanda.md) | ✅ | ✅ | ✅ |
| [RabbitMQ](./rabbitmq.md) | ✅ | ✅ | ✅ |

### Data Storage

| Integration | Modules |
|-------------|---------|
| [MongoDB](./mongodb.md) | Engagement, Datastore, Inventory, Pricing, Worker, Logs, Translator, UOM, Repository, List, Management |

### Search & Indexing

| Integration | Purpose |
|-------------|---------|
| [OpenSearch](./opensearch.md) | Product search, spatial queries, full-text indexing |

### Commerce Platforms

| Integration | Purpose |
|-------------|---------|
| [Medusa](./medusa.md) | Headless commerce platform integration |
| [Strapi](./strapi.md) | CMS and content management |

### Communication

| Integration | Purpose |
|-------------|---------|
| [Mailgun](./mailgun.md) | Transactional email delivery |
| [Twilio](./twilio.md) | SMS, voice, and email (SendGrid) |

### AI & Intelligence

| Integration | Purpose |
|-------------|---------|
| [OpenAI](./openai.md) | Engagement generation, OMS intelligence, worker generation |

### Infrastructure

| Integration | Purpose |
|-------------|---------|
| [Google Secret Manager](./google-secret-manager.md) | Secure credential storage |
| [Crypto](./crypto.md) | Hashing, signing, magic links |

## Module Types

### Worker Queue
Manages job distribution and processing:
- Push jobs to workers
- Fetch job batches
- Commit completed jobs
- Handle job failures

**Providers:** Kafka/Redpanda, RabbitMQ

### Logs
Centralized logging infrastructure:
- Structured log messages
- Error tracking
- Performance metrics
- Audit trails

**Providers:** Kafka/Redpanda, RabbitMQ, MongoDB

### Notifications
Event-driven notifications:
- System events
- User notifications
- Worker alerts
- Integration webhooks

**Providers:** Kafka/Redpanda, RabbitMQ

### Commerce Data
Core business data storage:
- Engagements
- Products (datastore)
- Inventory
- Pricing
- Orders

**Provider:** MongoDB

### Search & Discovery
Product and data search:
- Full-text search
- Faceted search
- Spatial queries
- Autocomplete

**Provider:** OpenSearch

## Integration Patterns

### Single Responsibility
Each module does one thing well. The queue module only handles queuing, not logging or data storage.

### Configuration-Driven
Integrations are configured via environment variables and bridge setup. No hardcoded connections.

### Health Checks
All integrations provide health check methods for monitoring and readiness probes.

### Graceful Degradation
When an integration fails, the system degrades gracefully rather than crashing. Logs fall back, queues retry, data operations queue for later.

## Choosing Integrations

### For Development
- **Queue:** RabbitMQ (simpler, easier to run locally)
- **Data:** MongoDB (standard choice)
- **Search:** OpenSearch (feature-rich)
- **Logs:** RabbitMQ (combined with queue)

### For Production
- **Queue:** Kafka/Redpanda (higher throughput, better scaling)
- **Data:** MongoDB (proven at scale)
- **Search:** OpenSearch (production-grade search)
- **Logs:** Kafka/Redpanda (centralized, scalable)

### Hybrid Approach
Mix and match based on needs:
- Kafka for high-volume log transport to multiple log sinks
- RabbitMQ for worker queue and notifications
- MongoDB for all data storage
- OpenSearch for product discovery

---

**Next:** Explore individual integrations to understand their modules and configuration options.


