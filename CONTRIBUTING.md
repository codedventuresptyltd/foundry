# Contributing to Foundry

Thank you for your interest in contributing to the Coded Ventures Foundry!

## How to Contribute

### Documentation Improvements

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b docs/improve-section-name`
3. **Make your changes**
4. **Test locally:** `npm start`
5. **Submit a pull request**

### Writing Guidelines

#### Voice and Tone

- **Conversational but professional** - Write as if explaining to a colleague
- **Clear and direct** - Avoid unnecessary jargon
- **Confident but humble** - "This is how we do it" not "This is the only way"
- **Educational** - Explain the why, not just the how

#### Formatting

- Use **markdown** for all documentation
- Use **MDX** only when React components are needed
- Include **code examples** where relevant
- Add **diagrams** for complex concepts (use Mermaid or images)
- Use **admonitions** for notes, warnings, and tips:

```markdown
:::info
This is helpful information
:::

:::tip
Pro tip goes here
:::

:::warning
Important warning
:::
```

#### Code Examples

- Include complete, runnable examples
- Use TypeScript for type safety
- Add comments for clarity
- Show both good and bad patterns when relevant

#### Links

- Use **relative links** for internal pages: `/commercebridge/overview`
- Use **descriptive link text**: "Learn about Bridge Architecture →" not "Click here"
- Check all links work before submitting

---

## Documentation Structure

### Page Frontmatter

Every documentation page should have frontmatter:

```markdown
---
sidebar_position: 1
title: Page Title
---
```

### Headings

- Use **one H1** (`#`) per page - the title
- Use **H2** (`##`) for main sections
- Use **H3** (`###`) for subsections
- Use **H4+** sparingly

### Code Blocks

Specify the language for syntax highlighting:

````markdown
```typescript
const example = 'code here';
```
````

---

## Field Notes (Blog Posts)

### Creating a Field Note

1. Create a new file in `fieldnotes/`
2. Use naming convention: `YYYY-MM-DD-slug.md`
3. Add frontmatter:

```markdown
---
slug: your-post-slug
title: Your Post Title
authors: [codedventures]
tags: [tag1, tag2, tag3]
---
```

4. Write your post
5. Add `<!-- truncate -->` where you want the preview to cut off

### Field Note Guidelines

- **Length:** 800-2000 words ideal
- **Depth:** Go deep on one topic rather than shallow on many
- **Practical:** Include real-world examples and lessons
- **Honest:** Share both successes and failures
- **Timeless:** Focus on principles over trends

---

## Style Guide

### Terminology

Use consistent terminology:

- **CommerceBridge** (not Commerce Bridge or commerce-bridge)
- **Touchpoint** (not Touch Point)
- **Eidos** (not EIDOS)
- **Worker** (capitalized when referring to the pattern)
- **Bridge** (capitalized when referring to the component)
- **Engagement** (capitalized when referring to the entity)

### Formatting

- **Code:** Use backticks for inline code: \`functionName\`
- **File paths:** Use backticks: \`/path/to/file.ts\`
- **UI elements:** Use **bold**: **Button Name**
- **Emphasis:** Use *italics* sparingly
- **Commands:** Use code blocks with `bash`:

```bash
npm install
```

### American English

Use American English spelling:

- "behavior" not "behaviour"
- "optimize" not "optimise"
- "color" not "colour"

---

## Review Process

1. **Self-review** - Check for typos, broken links, formatting
2. **Local build** - Ensure `npm run build` succeeds
3. **Submit PR** - Write a clear description of changes
4. **Address feedback** - Respond to review comments
5. **Approval** - Two approvals required for merge

---

## What We're Looking For

### High Priority

- Filling in "Coming Soon" sections with real content
- Adding code examples and diagrams
- Improving existing explanations
- Fixing typos and broken links

### Medium Priority

- New Field Notes posts
- Additional example flows
- Integration guides
- Troubleshooting sections

### Lower Priority

- Stylistic improvements
- Alternative explanations
- Expanded examples

---

## Questions?

- **Unclear documentation?** Open an issue describing what's confusing
- **Suggested improvement?** Open an issue with your suggestion
- **Want to write about X?** Open an issue proposing the topic

---

## Code of Conduct

Be respectful and constructive. We're all here to learn and improve.

---

**Thank you for contributing to Foundry!** 🔨

