---
sidebar_position: 8
title: Tenant Isolation
---

# Tenant Isolation

:::info Coming Soon
Multi-tenancy documentation is being prepared.
:::

Multi-tenant security and data separation strategies.

## Isolation Layers

1. **Data Layer** - MongoDB collections namespaced by tenant
2. **Cache Layer** - Redis keys prefixed with tenant ID
3. **Search Layer** - OpenSearch indices per tenant
4. **Processing Layer** - Worker tenant context

## Security Boundaries

- JWT-based authentication with tenant claims
- Row-level security
- API gateway validation
- Worker message verification

