---
sidebar_position: 6
title: Workers
---

# Workers

:::info Coming Soon
Complete worker documentation and patterns are being written.
:::

Workers are **stateless, replaceable processing engines** that form the execution layer of CommerceBridge.

## Worker Characteristics

- **Stateless** - No persistent state between invocations
- **Replaceable** - Can be stopped and started without impact
- **Elastic** - Scale based on workload
- **Autonomous** - Self-contained execution units

## Worker Patterns

### Consumption Pattern

Workers consume messages from queues and process them using Bridge services.

### Client-Specific Integration

When client-specific integrations are needed, implement them in dedicated Worker service files under `worker-services/`.

## Philosophy

> **"Starve old workers, evolve ecosystems."**

Workers are designed to be replaced, not updated in place.

