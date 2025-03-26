# Header Component Usage Guide

## Overview
The Header component in this project uses Svelte 5's runes and snippet API. This guide explains how to use it correctly to avoid compatibility issues.

## Correct Usage

### Basic Usage
```svelte
<Header 
  title="Page Title"
  subtitle="Optional subtitle"
/>
```

### With Title Suffix (e.g., Premium Badge)
```svelte
<Header 
  title="Page Title"
  subtitle="Optional subtitle"
  titleSuffix={() => (
    <div class="ml-2">
      <PremiumBadge size="small" />
    </div>
  )}
/>
```

### Within a Snippet
```svelte
{#snippet header()}
  <Header 
    title="Page Title"
    subtitle="Optional subtitle"
    titleSuffix={() => (
      <div class="ml-2">
        <PremiumBadge size="small" />
      </div>
    )}
  />
{/snippet}
```

## Important Notes

1. **DO NOT** use traditional `<slot>` elements with this component, as it uses the newer Svelte 5 snippet API.
2. Always use the `titleSuffix` prop for adding content next to the title.
3. The `left` prop can be used for adding content to the left side of the header in progress variant.

## Available Props

- `variant`: 'base' (default) or 'progress'
- `title`: Main header title (required)
- `subtitle`: Optional subtitle text
- `progress`: Current progress value (for progress variant)
- `maxProgress`: Maximum progress value (for progress variant)
- `left`: Left content snippet (for progress variant)
- `titleSuffix`: Content to display next to the title
