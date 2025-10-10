# <Concept Name>
Concise description of what this is and why it matters.

## Responsibilities
- Primary responsibilities
- Key interactions
- Example workflows

## Lifecycle
1. Creation
2. Processing
3. Completion

## Interfaces (Public-Safe)
```ts
export interface ExampleModel {
  id?: string
  name: string
  metadata?: Record<string, unknown>
}
```

## Example (Pseudo)
```ts
const id = await bridge.createExample({ name: "Sample" })
const item = await bridge.getExample(id)
```

## Extension Points
How developers can extend this safely.

## IP Safety
Avoid including schemas, credentials, or integration payloads.
