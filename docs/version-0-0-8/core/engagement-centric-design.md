---
sidebar_position: 4
title: Engagement-Centric Design
---

# Engagement-Centric Design
**Pattern:** Model commerce as conversations, not isolated transactions.

---

## The Concept

Traditional e-commerce thinks in **orders** — discrete, transactional events that happen at a moment in time.

B2B commerce is more complex. It's a **conversation** that unfolds over time:

1. Customer requests a quote
2. Pricing is calculated
3. Customer negotiates
4. Product is configured
5. Inventory is allocated
6. Order is confirmed
7. Fulfillment is scheduled
8. Delivery is tracked
9. Invoice is generated

This isn't a transaction — it's an **engagement**.

---

## What is an Engagement?

An **engagement** is a lifecycle container for the entire commerce conversation. It holds:

- **Identity** — Customer, tenant, channel
- **State** — Current status, workflow progress
- **Content** — Line items, configurations, notes
- **Pricing** — Calculations, modifiers, history
- **Fulfillment** — Allocation, delivery, tracking
- **Events** — Complete audit trail

Everything related to the commerce conversation lives in one place.

---

## Why This Matters

### Traditional Order Model
```
Quote → (lost context) → Order → (separate system) → Fulfillment
```
Each step is isolated. Context is lost. Systems are disconnected.

### Engagement Model
```
Engagement Created → Quote Added → Negotiation → Configuration → 
  Confirmed → Allocated → Fulfilled → Invoiced
```
One continuous conversation. Complete context. Connected workflow.

---

## Benefits

**1. Complete Context**
Every worker that touches the engagement has access to the full history and current state.

**2. Audit Trail**
Every action is recorded within the engagement lifecycle.

**3. Workflow Flexibility**
Engagements can follow different paths based on business rules (approval workflows, configuration steps, etc.).

**4. Real-Time Updates**
UI can subscribe to engagement changes and update in real-time as the conversation progresses.

---

---

## Learn More

For detailed implementation, see:

- **[Engagements](/core/engagements)** — Complete engagement model documentation
- **[The Bridge](/commercebridge/bridge)** — How the Bridge manages engagement state
- **[Touchpoint Integration](/touchpoint/commercebridge-integration)** — How Touchpoint uses engagements

---

**Engagement-Centric Design: Commerce is a conversation.**
