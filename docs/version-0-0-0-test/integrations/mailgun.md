---
sidebar_position: 6
title: Mailgun
---

# Mailgun Integration

Transactional email delivery service for order confirmations, notifications, and customer communications.

## Module Provided

### Send Message Module

**Capabilities:**
- Transactional emails
- Template rendering
- Attachment support
- Delivery tracking

**Operations:**
- Send individual emails
- Batch email sending
- Template-based emails
- HTML and plain text

## Configuration

```typescript
MAILGUN_API_KEY=<from-secrets>
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@yourdomain.com
MAILGUN_FROM_NAME=Your Company
```

## Bridge Access

```typescript
await bridge.integrations.mailgun.sendMessage({
  to: 'customer@example.com',
  subject: 'Order Confirmed',
  html: emailHtml,
  text: emailText,
  tags: ['order', 'confirmation']
});
```

## Use Cases

- Order confirmation emails
- Quote notifications
- Password reset emails
- System notifications
- Customer communications

## When to Use

**Transactional Email:** Production-grade email delivery with tracking.

**Compliance:** GDPR-compliant email infrastructure.

**Deliverability:** High delivery rates with reputation management.

---

**Mailgun: Reliable transactional email.**


