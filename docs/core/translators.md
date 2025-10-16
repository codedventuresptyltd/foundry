---
sidebar_position: 6
title: Translator Framework
---

# Translator Framework
**Pattern:** Static service providing registry-driven translation for serializing Engagements into external data formats.

---

## What is the Translator Framework?

The **Translator Framework** provides a standardized way to convert internal Engagement data into external data exchange formats like **cXML**, **UBL**, **JSON schemas**, and custom XML formats required by procurement systems, ERPs, and trading partners.

Implemented as a static service class (following the pricing module pattern), the framework provides:

1. **Config** — Declarative field mappings with MongoDB storage support
2. **Transformer** — Type-safe data extraction and normalization (TypeScript class)
3. **Template** — Format output definition (simple placeholder replacement)

This separation allows new formats to be added quickly, versioned independently, and customized per client with database-stored configs—no code changes required.

---

## Why This Matters

**The Problem:**
B2B commerce requires integrating with dozens of procurement and ERP systems, each with their own data format:
- cXML for Ariba, Coupa, Jaggaer
- UBL for government procurement
- Custom XML schemas for enterprise ERPs
- Proprietary JSON formats for partner systems

Without a framework, you end up with:
- Hardcoded transforms scattered across the codebase
- Duplication when multiple formats need similar data
- No way to override mappings per tenant
- Breaking changes when internal models evolve

**The Solution:**
The Translator Framework decouples **what data** (config), **how to extract it** (transformer), and **how to format it** (template). This means:
- New formats are registered at startup with simple imports
- Client overrides stored in MongoDB, not code
- Schema versions coexist (e.g., cXML 1.2.014 and 1.2.041)
- Templates stay clean because transformers handle all the logic
- Static service pattern provides simple, consistent API

---

## Architecture

The Translator Framework follows a clear flow from input to output:

**Flow:** Engagement → TranslatorService → (Registry + Transformer + Template Engine) → Formatted Output

**Config Layer:** MongoDB provides optional config overrides that modify field mappings without code changes.

### Core Design

The framework is implemented as `TranslatorService`, a **static service class** that provides:

- **Internal Registry:** Map-based translator definitions lookup (O(1))
- **Template Engine:** Simple placeholder replacement with double-brace syntax
- **Helper Utilities:** Static methods for formatting, XML sanitization, property access
- **Bridge Integration:** Exposed as `bridge.translators` for easy access

### Components

**1. Config (Mapping)**
Defines how Engagement fields map to the format's data model. Configs include:
- Version information
- Field mappings (e.g., `buyerCookie` → `actors[0].attributes.accountId`)
- Default values (currency, units, country codes)
- Configs can be stored in MongoDB and override code defaults

**2. Transformer (Logic)**
TypeScript class that extracts, normalizes, validates, and formats data using config mappings. Transformers:
- Use mapping helpers to resolve paths from config
- Apply formatting (dates, currency, XML escaping)
- Handle format-specific business logic
- Transform nested structures (line items, addresses, etc.)

**3. Template (Format)**
Simple placeholder templates define the final serialized output. Templates:
- Use double-brace syntax for variable interpolation
- Support nested property access
- Focus purely on structure (no logic)
- For complex loops, transformers can provide custom template functions

**Note:** For templates requiring iterations, transformers can implement custom template functions until the template engine supports loops natively.

---

## How It Works

### 1. Registration
Translators are registered at startup using simple imports (no file I/O):
- Format-specific registration functions import all components (transformer, template, config)
- Registration uses a dot-notation key system (e.g., `cxml.punchout.orderMessage`)
- Each translator includes transformer instance, template, config, and version
- The Bridge automatically calls registration functions during startup
- All translators are available immediately after bridge initialization

### 2. Translation
Access translators through the Bridge's static service:
- Simple translation: `bridge.translators.run(key, engagement)` returns formatted output
- With metadata: `runWithMetadata()` includes timing and timestamp information
- Check availability: `has()` verifies translator registration
- List available: `list()` returns all registered translator keys
- Get stats: `getStats()` provides format breakdown and counts

### 3. Client Config Overrides
Clients can override configs via MongoDB without modifying code:

**Stored Config Structure:**
- Collection: `translator_configs`
- Theme: `translator-config`
- Topic: translator key (e.g., `cxml.punchout.orderMessage`)
- Name: custom identifier
- Config object with mappings and defaults

**Usage Pattern:**
- Retrieve config using MongoDB translator module
- Methods: `translator_getConfig()`, `translator_getConfigByName()`, `translator_listConfigs()`
- Future: merge custom config with defaults at translation time
- No code deployment needed for mapping changes

---

## Directory Structure

The actual implementation uses a flattened structure for clarity:

**Core Files:**
- `translator.service.ts` - Main static service (all-in-one)
- `template.engine.ts` - Template rendering engine
- `types.ts` - Core type definitions
- `index.ts` - Public exports

**Format Organization:**
Each format (e.g., cxml) contains translator subdirectories (e.g., punchout_orderMessage) with:
- `types.ts` - Type extensions via declaration merging
- `transformer.ts` - Transform logic
- `template.ts` - Format template
- `config.ts` - Field mappings and defaults

Format directories include `register.ts` for auto-registration and `index.ts` for exports.

**Design Principles:**
- ✅ Flattened structure (`punchout_orderMessage` not `punchout/orderMessage`)
- ✅ Hard imports (no file I/O via readFileSync)
- ✅ Co-located types (types live with transformers)
- ✅ Service pattern (static methods, matches `pricing.service.ts`)

### Schema Versioning

Different versions can coexist by using unique translator keys:
- Version-specific keys: `cxml.punchout.orderMessage.v1_2_014`
- Default/current version: `cxml.punchout.orderMessage`
- Future versions: `cxml.punchout.orderMessage.v2`

This allows:
- Different clients to use different schema versions
- Safe migration paths (deploy new version, migrate clients gradually)
- Legacy support without technical debt
- Same format directory, different registrations

---

## TranslatorService API

The `TranslatorService` provides a complete static API for translation and utilities.

### Core Methods

**Registration:**
- `register()` - Register new translator with key and definition
- `get()` - Retrieve translator definition by key
- `has()` - Check if translator exists
- `list()` - Get all registered translator keys
- `getByFormat()` - Filter translators by format prefix
- `getStats()` - Get total count and format breakdown

**Translation:**
- `run()` - Execute translation, returns formatted output string
- `runWithMetadata()` - Execute translation with timing/metadata

### Helper Utilities

All transformers have access to these static helper methods:

**Formatting:**
- `formatDate()` - ISO 8601 date formatting
- `formatMoney()` - Convert cents to currency string with decimals
- `sanitizeXml()` - Escape XML special characters
- `formatBoolean()` - Convert boolean to custom string values

**Data Access:**
- `getProperty()` - Nested property access with fallback defaults
- `getString()` - Safe string conversion with default
- `joinArray()` - Array to delimited string
- `applyMapping()` - Apply config-based field mappings

### Transformer Pattern

Transformers leverage these utilities to:
- Resolve config-based field mappings
- Format dates, currency, and special characters
- Access nested engagement properties safely
- Apply defaults when data is missing
- Keep template logic purely structural

---

## Template Best Practices

Templates should be **purely presentational**:

**Good Practices:**
- Use simple placeholders for pre-formatted values
- Let transformers handle all formatting logic
- Keep templates focused on structure only
- Use pre-transformed data from the model

**Anti-Patterns to Avoid:**
- Formatting in templates (decimal places, date formats)
- Logic or fallbacks in template expressions
- Direct access to raw engagement data
- Template-based conditionals or calculations

**Key Principle:** All data manipulation happens in the transformer. Templates only insert pre-formatted strings into the output structure.

---

## Benefits

### 1. Rapid Format Addition
Add a new format in minutes by creating three files: config, transformer, template. No changes to core systems.

### 2. Tenant Flexibility
Clients can customize field mappings without code changes. Deploy config overrides independently.

### 3. Version Coexistence
Support multiple schema versions simultaneously. Migrate tenants on their schedule, not yours.

### 4. Clean Separation
- Configs are pure data (JSON/YAML)
- Transformers contain all logic (testable TypeScript)
- Templates are pure structure (readable XML/JSON)

### 5. Type Safety
TypeScript transformers catch errors at compile time. Configs are validated against schemas.

### 6. Testability
Each component can be tested independently:
- Config: validate mappings resolve correctly
- Transformer: unit test data extraction and formatting
- Template: validate output against format schemas

---

## Use Cases

### Procurement Integration
Translate Engagements into **cXML PunchOut Order Messages** for procurement systems like Ariba, Coupa, and Jaggaer.

### ERP Sync
Convert Engagements into **custom ERP formats** (XML, JSON, or flat files) for systems like SAP, Oracle, NetSuite.

### Government Compliance
Generate **UBL invoices and orders** for government procurement portals that require standardized formats.

### Partner APIs
Produce **custom JSON payloads** matching partner-specific API schemas without writing one-off transformation code.

### Document Export
Generate **human-readable formats** like PDF-ready HTML or formatted Excel structures from Engagement data.

---

## Implementation Details

### Translation Pipeline

The translation process follows a clear sequence:

1. **Config Resolution** - Apply field mappings from config (default or database-stored)
2. **Transformation** - Execute transformer to extract and format data from engagement
3. **Validation** - Verify required fields and data types (optional)
4. **Template Rendering** - Insert transformed data into template structure
5. **Output** - Return formatted string (XML, JSON, EDI, etc.)

Each step is isolated and testable, with the transformer handling all business logic.

---

## Extending the Framework

### Adding a New Format

**Step 1: Create Directory Structure**
- Create format directory under `formats/` (e.g., `formats/edifact/`)
- Create translator-specific subdirectory (e.g., `formats/edifact/orders_d96a/`)

**Step 2: Create Config**
- Define version, field mappings, and default values
- Map Engagement fields to format-specific fields
- Export config object for registration

**Step 3: Create Transformer**
- Implement `transform()` method
- Use `TranslatorService` helper utilities
- Apply config mappings to extract data
- Format values according to target format requirements
- Return transformed model object

**Step 4: Create Template**
- Define output structure using placeholder syntax
- Use simple double-brace variable interpolation format
- Keep logic-free - all data pre-formatted by transformer
- For complex iterations, implement custom template function

**Step 5: Register Translator**
- Create registration function in format's `register.ts`
- Import all components (config, transformer, template)
- Call `TranslatorService.register()` with unique key
- Add registration call to Bridge startup

**Step 6: Type Extension**
- Extend `TranslatorTypeMap` interface using declaration merging
- Define input and output types for type safety
- Co-locate types with transformer code

---

## Learn More

For implementation details and integration guidance, see:

- **[Engagements](/core/engagements)** — The data model being translated
- **[Bridge Architecture](/core/bridge-architecture)** — Where translators are invoked
- **[Workers](/commercebridge/workers)** — How workers use translators for output
- **[Integrations](/commercebridge/integrations)** — Connecting translators to external systems

---

**Translator Framework: One model, infinite formats.**

