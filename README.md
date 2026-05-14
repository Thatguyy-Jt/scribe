# Scribe — AI Document Editor

Write smarter documents with AI assistance and knowledge references.

Scribe is a full-stack document editor that pairs a rich text writing experience with an AI co-writer. Attach knowledge sources to any document, and the AI assistant uses them as context to help you draft, edit, and refine your work.

**Live demo:** [scribe-doc.vercel.app](https://scribe-doc.vercel.app)

---

## Features

- **Rich Text Editor** — Powered by Tiptap with bold, italic, underline, headings (H1–H3), bullet/ordered lists, blockquotes, and placeholder text.
- **AI Writing Assistant** — Chat sidebar powered by [Groq](https://groq.com). Ask the AI to draft sections, summarize notes, or brainstorm ideas. Responses stream in real-time and can be inserted directly into your document.
- **Knowledge Base** — Attach context, facts, or instructions to any document. The AI references these knowledge sources when generating responses.
- **Auto-Save** — Documents save automatically after 2 seconds of inactivity. Title and content changes persist seamlessly.
- **Authentication** — Email/password auth via Supabase with protected routes and middleware-level session management.
- **Row-Level Security** — Every database query is scoped to the authenticated user. Users can only access their own documents and knowledge items.
- **Responsive Layout** — Three-panel editor (knowledge sidebar, editor, AI chat) with collapsible sidebars that adapt to mobile, tablet, and desktop.
- **Rate Limit Handling** — Distinguishes between per-minute throttling and daily quota exhaustion with clear, actionable error messages.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4, Lora + Inter (Google Fonts) |
| Auth & Database | [Supabase](https://supabase.com) (Postgres + Auth + RLS) |
| Rich Text Editor | [Tiptap](https://tiptap.dev) (StarterKit, Placeholder, Underline) |
| AI | [Groq](https://groq.com) via [Vercel AI SDK](https://sdk.vercel.ai) (`@ai-sdk/groq`, default model `llama-3.3-70b-versatile`) |
| Animations | [Framer Motion](https://motion.dev) |
| Icons | [Lucide React](https://lucide.dev) |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
scribe/
├── middleware.ts                       # Auth session refresh + route protection
├── supabase-schema.sql                 # Database migration (documents + knowledge + RLS)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout, fonts, metadata
│   │   ├── page.tsx                    # Landing page
│   │   ├── error.tsx                   # Global error boundary
│   │   ├── icon.svg                    # Favicon
│   │   ├── globals.css                 # Tailwind + theme variables
│   │   ├── pricing/page.tsx            # Pricing + FAQ page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx              # Auth guard (redirects to /login)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx            # Document grid
│   │   │   │   ├── loading.tsx         # Skeleton loading state
│   │   │   │   └── actions.ts          # Server actions (create doc, sign out)
│   │   │   └── documents/[id]/
│   │   │       └── page.tsx            # Editor view
│   │   └── api/ai/chat/
│   │       └── route.ts                # Groq AI streaming endpoint (auth-protected)
│   ├── components/
│   │   ├── auth/AuthForm.tsx           # Shared login/signup form
│   │   ├── dashboard/
│   │   │   ├── DocumentCard.tsx        # Document preview card
│   │   │   └── CreateDocumentButton.tsx
│   │   ├── editor/
│   │   │   ├── DocumentWorkspace.tsx   # Three-panel layout orchestrator
│   │   │   ├── DocumentEditor.tsx      # Tiptap editor + auto-save
│   │   │   ├── DocumentHeader.tsx      # Title input, save status, sidebar toggles
│   │   │   ├── EditorToolbar.tsx       # Formatting controls
│   │   │   ├── KnowledgeSidebar.tsx    # Left panel: knowledge CRUD
│   │   │   └── AIChatSidebar.tsx       # Right panel: AI chat + insert
│   │   ├── landing/                    # Hero, Features, Navbar, Footer, Pricing, FAQ
│   │   ├── blocks/                     # Animated testimonials
│   │   └── ui/                         # Primitives (button, avatar, background-paths)
│   ├── hooks/
│   │   ├── useDocument.ts              # Load + save document via Supabase
│   │   ├── useAutoSave.ts              # Debounced save with unmount flush
│   │   └── useKnowledge.ts             # Knowledge item CRUD
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts               # Browser Supabase client
│   │       └── server.ts               # Server Supabase client (cookie-based)
│   └── types/index.ts                  # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Groq Cloud](https://console.groq.com/keys) API key

### 1. Clone the repo

```bash
git clone https://github.com/Thatguyy-Jt/scribe.git
cd scribe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Open the **SQL Editor** in your Supabase dashboard and run the contents of `supabase-schema.sql`. This creates the `documents` and `knowledge` tables with Row-Level Security policies.

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
```

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API → `anon` `public` key |
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com/keys) → Create API Key |

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```sql
-- Documents: stores user documents with Tiptap JSON content
documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       text NOT NULL DEFAULT 'Untitled',
  content     jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()  -- auto-updated via trigger
);

-- Knowledge: context items attached to documents
knowledge (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title         text NOT NULL,
  content       text NOT NULL,
  created_at    timestamptz DEFAULT now()
);
```

Both tables have **Row-Level Security** enabled. All policies enforce `auth.uid() = user_id`.

---

## Authentication & Route Protection

| Layer | Mechanism |
|-------|-----------|
| **Middleware** (`middleware.ts`) | Refreshes Supabase auth tokens on every request. Redirects unauthenticated users from `/dashboard` and `/documents/*` to `/login`. Redirects authenticated users from `/login` and `/signup` to `/dashboard`. |
| **Layout guard** (`(protected)/layout.tsx`) | Server-side `getUser()` check — redirects to `/login` if no session. |
| **API auth** (`/api/ai/chat`) | Validates Supabase session before processing. Returns 401 for unauthenticated requests. |
| **Database RLS** | Supabase enforces `auth.uid() = user_id` on all table operations regardless of client behavior. |

---

## AI Integration

The AI chat uses **Groq** (`llama-3.3-70b-versatile` by default) via the [`@ai-sdk/groq`](https://sdk.vercel.ai/providers/ai-sdk-providers/groq) provider and Vercel **AI SDK** `streamText`. Override the model with `GROQ_MODEL` if needed.

**How it works:**
1. User sends a message in the AI Chat sidebar.
2. The frontend POSTs to `/api/ai/chat` with the chat history, current document content, and all knowledge items.
3. The API route constructs a system prompt that includes the document and knowledge as context.
4. Groq streams plain text back, which renders incrementally in the chat UI.
5. The user can click **"Insert into document"** to append any AI response into the editor.

**Limits:** Groq enforces rate limits per account and model (see [Groq rate limits](https://console.groq.com/docs/rate-limits)). The UI surfaces temporary throttling separately from quota-style messages when the API response allows it.

---

## Deployment

The app is deployed on **Vercel** with automatic deploys on push to `main`.

To deploy your own instance:

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add the environment variables listed above (at minimum Supabase + `GROQ_API_KEY`)
3. Deploy

After deployment, update your Supabase project:
- **Authentication → URL Configuration → Site URL**: set to your Vercel URL
- **Redirect URLs**: add `https://your-app.vercel.app/**`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

This project is for educational and portfolio purposes.
