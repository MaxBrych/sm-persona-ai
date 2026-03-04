# Persona AI

AI-powered persona chat for product testing — built for Schwäbisch Media.

## About

Persona AI lets product teams simulate conversations with realistic user personas. Instead of generic feedback, the AI fully embodies each persona — their voice, habits, emotional drivers, and media consumption patterns — to deliver authentic, character-specific responses.

Built for **Schwäbisch Media** (Nordkurier & Schwäbische Zeitung) to test product ideas against diverse reader segments.

## Features

- **Multi-Persona Chat** — Select one or multiple personas and get responses in their authentic voice
- **Multi-Model Support** — Switch between Claude, GPT-4o, and Gemini mid-conversation
- **Persona Management** — Create, edit, and delete custom personas with avatar uploads
- **8 Pre-built Personas** — Archetypes representing different German news reader segments (tech-savvy millennials, tradition-conscious seniors, etc.)
- **Chat Persistence** — All conversations stored in Supabase with full history
- **Shareable URLs** — Each chat has its own route (`/chat/[id]`) for sharing
- **Streaming Responses** — Real-time token streaming with thinking indicators
- **Feedback System** — Thumbs up/down on AI responses, used to improve future answers
- **Multi-Persona Mode** — When multiple personas are selected, AI moderates a discussion between them

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| AI | Vercel AI SDK 6, Anthropic, OpenAI, Google AI |
| Database | Supabase (PostgreSQL + Storage) |
| Styling | Tailwind CSS v4, shadcn/ui |
| State | Zustand |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/MaxBrych/sm-persona-ai.git
cd sm-persona-ai
pnpm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers (at least one required)
ANTHROPIC_API_KEY=sk-ant-...        # Default provider
OPENAI_API_KEY=sk-proj-...          # Optional
GOOGLE_GENERATIVE_AI_API_KEY=AIza...# Optional
```

### 3. Database Setup

Create the following tables in your Supabase project:

**personas** — `id` (uuid), `name`, `type`, `category`, `image_url`, `data` (jsonb), `created_at`, `updated_at`

**chats** — `id` (uuid), `title`, `model`, `persona_ids` (uuid[]), `created_at`, `updated_at`

**messages** — `id` (uuid), `chat_id` (fk → chats), `role`, `content`, `parts` (jsonb), `feedback`, `created_at`

Create a public storage bucket named `images`.

### 4. Seed Personas

```bash
pnpm dev
# Then call the seed endpoint:
curl -X POST http://localhost:3000/api/seed
```

### 5. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (chat)/              # Chat routes (home + /chat/[id])
  api/
    chat/              # AI streaming endpoint
    chats/             # Chat CRUD
    personas/          # Persona CRUD
    seed/              # DB seeding
    upload/            # Image upload
components/
  chat/                # Chat UI (interface, input, messages, markdown)
  persona/             # Persona cards, forms, profiles
  sidebar/             # Left (chat history) + Right (persona selector)
  ui/                  # shadcn/ui components
hooks/
  use-app-store.ts     # Zustand global state
  use-chats.ts         # Chat data fetching
  use-personas.ts      # Persona data fetching
  use-chat-sync.ts     # URL ↔ state sync
lib/
  supabase/            # Client & server Supabase instances
  ai-providers.ts      # Model registry
  personas-data.ts     # Seed data (8 personas)
  types.ts             # TypeScript interfaces
```

## Available Models

| Provider | Model | ID |
|----------|-------|----|
| Anthropic | Claude Sonnet 4.5 | `anthropic:claude-sonnet-4-5-20250514` |
| Anthropic | Claude Haiku 4.5 | `anthropic:claude-haiku-4-5-20251001` |
| OpenAI | GPT-4o | `openai:gpt-4o` |
| OpenAI | GPT-4o Mini | `openai:gpt-4o-mini` |
| Google | Gemini 2.0 Flash | `google:gemini-2.0-flash` |

The default model is **Claude Sonnet 4.5**. Users can switch models from the chat interface.

## Scripts

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```
