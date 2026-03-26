---
sidebar_position: 7
title: Twilio
---

# Twilio Integration

Multi-channel communication platform for SMS, voice, and email (via SendGrid).

## Modules Provided

### Twilio Send Message Module

**Capabilities:**
- SMS delivery
- Voice calls
- WhatsApp messages
- Phone number verification

### SendGrid Send Message Module

**Capabilities:**
- Email delivery
- Template system
- Analytics tracking
- Marketing emails

## Configuration

### Twilio Settings

```typescript
TWILIO_ACCOUNT_SID=<from-secrets>
TWILIO_AUTH_TOKEN=<from-secrets>
TWILIO_PHONE_NUMBER=+1234567890
```

### SendGrid Settings

```typescript
SENDGRID_API_KEY=<from-secrets>
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Your Company
```

## Bridge Access

```typescript
// SMS via Twilio
await bridge.integrations.twilio.module_twilio.sendMessage({
  to: '+1234567890',
  body: 'Your order has shipped!'
});

// Email via SendGrid
await bridge.integrations.twilio.module_sendgrid.sendMessage({
  to: 'customer@example.com',
  subject: 'Order Update',
  html: emailContent
});
```

## Use Cases

**SMS:**
- Order status updates
- Delivery notifications
- Two-factor authentication
- Emergency alerts

**Email:**
- Marketing campaigns
- Newsletter delivery
- Bulk communications
- Customer outreach

## When to Use

**SMS Notifications:** Time-sensitive customer updates.

**Multi-Channel:** When you need both SMS and email from one integration.

**Marketing:** SendGrid excels at bulk email campaigns with analytics.

---

**Twilio: Multi-channel customer communication.**


