---
sidebar_position: 4
title: The Bridge
---

# The Bridge

:::info Coming Soon
Comprehensive Bridge documentation is in progress.
:::

The Bridge is the **single, common service layer** in CommerceBridge.

## Responsibilities

- Centralized integration management
- Multi-tenant resource coordination  
- Shared business logic
- State caching and persistence
- API gateway and routing

## Key Principle

> **All shared, reusable integrations must live in the Bridge.**

This keeps the architecture clean and prevents integration logic from being scattered across workers.

