# Foundry Docs – Cursor Brief

This brief defines how to generate **public-safe, professional documentation** for Coded Ventures’ products — **CommerceBridge**, **Touchpoint**, and **Eidos** — inside the Foundry documentation repo.

The goal:  
Establish credibility and conceptual clarity without exposing IP or implementation details.

---

## Audience & Tone
- **Audience:** CTOs, engineers, partners, and investors.
- **Voice:** Calm, confident, technical.
- **Purpose:** Explain architecture and concepts, not source code.
- **Style:** SDK-like documentation — readable, minimal jargon.

---

## Guardrails

### ✅ Must
- Describe **concepts**, **interfaces**, **patterns**.
- Include public-safe TypeScript pseudo-code and **Mermaid** diagrams.
- Use **generic** infrastructure language: “cache layer”, “message queue”, “worker,” etc.
- Link between docs frequently.

### 🚫 Must Not
- Reveal schemas, queue/topic names, credentials, or infra specifics.
- Show production payloads or tenant logic.
- Mention real client names or identifiers.
- Include vendor details (Redis, Kafka, etc.) — replace with generic equivalents.

---

## Repo Layout
```
foundry/
  docs/
    commercebridge/
    touchpoint/
    eidos/
    core/
    fieldnotes/
  docusaurus.config.js
  sidebars.js
```

Each folder holds an `_category_.json` and Markdown files (e.g., `overview.md`, `bridge.md`, etc.).

---

## Templates
See [`docs/templates/`](./templates) for reusable page structures.
