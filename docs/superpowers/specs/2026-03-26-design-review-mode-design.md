# Design Review Mode — Spec

## Context

The persona AI chat is used for design review discussions where a user uploads a design image and multiple personas provide feedback. Currently, uploaded images appear as small thumbnails in chat bubbles — losing the design's visual context. The chat needs a dedicated "Design Review Mode" that treats the uploaded design as the foundation for the discussion, with Figma-like comment annotations and a split layout that keeps the design visible alongside the conversation.

## Overview

When a user attaches an image in the chat input, the chat transforms into a **Design Review Mode** with:
1. A **split canvas wrapper** at the top — design image on the left with persona comment pins, quick takes on the right
2. The **existing chat thread below** — preserving the current two-part AI response format (Persona voices + KI-Analyse)
3. **No stacked persona avatars** above user messages (removed)
4. Persona names with color indicators remain in the canvas legend
5. The **system prompt is untouched** — AI response format stays exactly as-is

## Layout Structure

```
┌──────────────────────────────────────────────────┐
│ ChatHeader (existing)                            │
├──────────────────────────────────────────────────┤
│ DesignReviewWrapper (new, activates on image)    │
│ ┌─────────────────────┬──────────────────────┐   │
│ │  Design Canvas      │  Quick Takes Panel   │   │
│ │  - Full image       │  - Short persona     │   │
│ │  - object-contain   │    comments with     │   │
│ │  - Dark bg          │    colored avatars    │   │
│ │  [N] [S] [A] pins  │                       │   │
│ │                     │                       │   │
│ │  ── Persona Legend ─│                       │   │
│ └─────────────────────┴──────────────────────┘   │
├──────────────────────────────────────────────────┤
│ Existing Chat Flow (max-w-3xl, centered)         │
│                                                  │
│      [ User message ]                   → right  │
│                                                  │
│  ┌── Persona voice cards (colored borders) ──┐   │
│  │  Each persona gets avatar + name + type   │   │
│  │  + colored left border + full feedback    │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌── KI-Analyse (existing format) ───────────┐   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  [Chat Input]                                    │
└──────────────────────────────────────────────────┘
```

## Components

### 1. DesignReviewWrapper (`components/chat/design-review-wrapper.tsx`)

**New component.** Renders the split canvas when an image is present.

**Props:**
- `imageUrl: string` — the uploaded image URL (from file preview or stored URL)
- `personas: Persona[]` — active personas for pins and legend
- `onScrollToTop: () => void` — callback when clicking the floating PiP

**Left panel (Design Canvas):**
- Dark background with subtle radial gradient
- Image displayed with `object-contain`, filling available space
- Comment pins auto-distributed across the image (one per persona)
  - Circular badges with persona initial and assigned color
  - Positioned at pre-set coordinates: top-left, center-right, bottom-center (for 3 personas), etc.
  - Box shadow with persona color for glow effect
- Bottom legend bar: persona name + color dot for each active persona

**Right panel (Quick Takes):**
- Header: "Quick Takes" label
- List of short persona comments (avatar + name + one-liner)
- These are extracted from the AI response — the first sentence of each persona's feedback
- Scrollable if more personas than space allows

**Pin distribution algorithm (simple):**
For N personas, distribute pins in a visually balanced pattern:
- 1 persona: center
- 2 personas: top-left, bottom-right
- 3 personas: top-left, center-right, bottom-center
- 4+ personas: grid pattern across the image

### 2. Floating PiP Card (within DesignReviewWrapper)

When the wrapper scrolls out of the viewport, a floating mini-card appears:
- Fixed position, bottom-right corner (e.g. `bottom-6 right-6`)
- Small thumbnail of the design (~120x80px)
- Rounded corners, subtle border, shadow
- Click → smooth scroll back to top of chat
- Uses `IntersectionObserver` on the wrapper to toggle visibility
- Transition: fade + slide-in from bottom

### 3. Changes to MessageItem (`components/chat/message-item.tsx`)

- **Remove** the stacked persona avatars block above user messages (lines 67-90)
- **Keep** the image rendering in user messages but hide it when in Design Review Mode (the image is shown in the wrapper instead)
- No other changes to message rendering — the AI markdown response renders as-is

### 4. Changes to MessageList (`components/chat/message-list.tsx`)

- **Keep** the persona names + avatars row at the top (lines 74-93) — this stays as-is since it's part of the canvas legend now
- Actually, **remove** this row too since the canvas legend replaces it
- Pass `hasDesignImage` prop to conditionally render the DesignReviewWrapper above the message thread

### 5. Changes to ChatInput (`components/chat/chat-input.tsx`)

- Add an `onImageAttach` callback prop that fires when a user attaches an image file
- This triggers the Design Review Mode immediately (before sending)
- The image preview in the wrapper replaces the small 16x16 thumbnails in the input area — but keep the remove (X) button somewhere accessible

### 6. Changes to ChatInterface (`components/chat/chat-interface.tsx`)

- Track `designImage` state: `{ file: File, previewUrl: string } | null`
- When image is attached in ChatInput → set `designImage` state → wrapper activates
- When message is sent → the `designImage` stays (persisted from message parts)
- On subsequent messages in same chat: if any user message has image parts, keep wrapper active with the first image
- New prop drilling: pass `designImage` to MessageList → DesignReviewWrapper

## Persona Color Assignment

Each persona gets a consistent color for pins, borders, and quick takes:

```typescript
const PERSONA_COLORS = [
  '#ff6b6b', // red
  '#4ecdc4', // teal
  '#a78bfa', // purple
  '#ffe66d', // yellow
  '#ff9ff3', // pink
  '#48dbfb', // blue
  '#ff6348', // orange
  '#26de81', // green
];

function getPersonaColor(index: number): string {
  return PERSONA_COLORS[index % PERSONA_COLORS.length];
}
```

## Activation Logic

Design Review Mode activates when:
1. User attaches an image file in ChatInput (immediate, before send)
2. Loading a chat that has a user message with image parts

Design Review Mode deactivates when:
- User removes the attached image before sending (X button)
- Never deactivates during an active chat with images

## Quick Takes Extraction

The Quick Takes panel shows abbreviated persona feedback. Since the AI response is markdown with a known structure (persona names appear as bold text or headings), we parse it client-side:
- Regex: look for `**PersonaName**` or `### PersonaName` patterns in the response text
- Extract the first sentence (up to first period/exclamation/question mark) after each match
- Match against known active persona names for reliable identification
- Display with corresponding persona color and avatar
- **Loading state**: Show skeleton lines until the AI response arrives
- **Fallback**: If parsing fails (format varies), show the persona name with "..." placeholder — the full response is always visible below in the chat thread anyway

## Files to Modify

| File | Change |
|------|--------|
| `components/chat/design-review-wrapper.tsx` | **NEW** — Split canvas + pins + quick takes + floating PiP |
| `components/chat/chat-interface.tsx` | Add `designImage` state, pass to MessageList |
| `components/chat/chat-input.tsx` | Add `onImageAttach` callback, fire on file attach |
| `components/chat/message-list.tsx` | Render DesignReviewWrapper when image present, remove top persona row |
| `components/chat/message-item.tsx` | Remove stacked persona avatars above user messages |

## What Stays the Same

- **System prompt** — no changes to `app/api/chat/route.ts`
- **AI response format** — two-part output (Persona voices + KI-Analyse) renders via existing MarkdownRenderer
- **File upload flow** — Supabase storage upload, data URL for AI
- **Persona selection** — PersonaGrid, PersonaSelector unchanged
- **Chat persistence** — message storage format unchanged

## Verification

1. **Attach image**: Open new chat, select 3 personas, attach an image → wrapper appears immediately with the design
2. **Quick takes**: Send message → AI responds → quick takes populate in right panel
3. **Pins**: Verify 3 colored pins appear on the design, one per persona
4. **Scroll PiP**: Scroll down past the wrapper → floating card appears bottom-right → click it → scrolls back to top
5. **No stacked avatars**: User messages should NOT show the small overlapping persona circles above them
6. **Existing format**: AI response below the wrapper renders exactly as before (markdown, two-part format)
7. **Load existing chat**: Navigate to a chat with images → wrapper loads with the image from message parts
8. **Remove image**: Attach image → click remove → wrapper disappears, returns to normal chat
9. **Mobile/responsive**: Wrapper should stack vertically on narrow screens (design on top, quick takes below)
