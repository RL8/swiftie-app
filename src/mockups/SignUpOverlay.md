# Sign Up Overlay Mockup

## Overview
This mockup demonstrates an overlay that encourages users to sign up for a free account when they reach the share page. The overlay allows users to still see the shareable graphics in the background while presenting compelling reasons to create an account.

## Key Features
1. **Semi-transparent overlay** that doesn't completely hide the underlying content
2. **Clear value proposition** explaining benefits of signing up
3. **Prominent call-to-action button** for sign-up
4. **Option to skip** and continue without an account
5. **Tab buttons remain visible** so users can still switch between visualization types

## Design Elements
- **Header & Tab Navigation**: Remain visible and accessible
- **Content Area**: Slightly blurred to maintain focus on the overlay
- **Overlay**: Clean, light background with clear messaging
- **Benefits List**: Bullet points highlighting key advantages
- **CTA Button**: Prominent, branded color that stands out
- **Skip Option**: Subtle but accessible for users who prefer not to sign up
- **Footer Navigation**: Remains accessible

## Implementation Notes
When implemented in Svelte, this would be a conditional component that appears only on the share page and can be dismissed by either signing up or clicking "Continue without an account."

## Visual Representation
```
┌─────────────────────────────────┐
│           HEADER                │
├─────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3] [Tab 4] │
├─────────────────────────────────┤
│                                 │
│                                 │
│     ┌───────────────────┐       │
│     │       🎵          │       │
│     │                   │       │
│     │  Unlock the Full  │       │
│     │  T3×3 Experience! │       │
│     │                   │       │
│     │  Create a free    │       │
│     │  account to save  │       │
│     │  your T3×3 and    │       │
│     │  share it with    │       │
│     │  the world.       │       │
│     │                   │       │
│     │  ✓ Save multiple  │       │
│     │    collections    │       │
│     │  ✓ Share on       │       │
│     │    social media   │       │
│     │  ✓ Discover other │       │
│     │    fans' T3×3s    │       │
│     │  ✓ Get personal   │       │
│     │    recommendations│       │
│     │                   │       │
│     │ [Sign Up Now - It's Free!]│
│     │                   │       │
│     │ Continue without account  │
│     └───────────────────┘       │
│                                 │
├─────────────────────────────────┤
│ [Back]                 [Export] │
└─────────────────────────────────┘
```

This mockup HTML file can be opened in a browser to see a visual representation of the proposed overlay.
