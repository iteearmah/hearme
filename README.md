# HearMe

An installable PWA that rewrites blunt, logical "solving-the-problem" messages into
the warm, emotionally intelligent version she'll actually want to hear — then gets out
of the way so you can send it.

Private by default: no account, no analytics, history stays in `localStorage`, and the
default AI provider needs **no API key at all**.

---

## What it does

- Paste what you'd normally send ("You never do the dishes, logically you just need to…").
- Pick a tone: Gentle · Warm · Playful · Accountable · Reassuring · Firm but kind.
- Set the softening level (0 = you, unedited / 100 = fully re-voiced).
- Get a send-ready rewrite, then Copy / Share / Again, with a side-by-side "Compare".
- Everything is saved to an on-device history you can pin, reuse and clear.

The prompt does the real work. It keeps **your intent and every concrete point**, and
only changes delivery: feelings first, no "logically/just/regardless", absolutes turned
into impact statements, commands turned into invitations. It is explicitly told *not* to
invent apologies, guilt-trip, or mind-read — the output should sound like a slightly
better version of you, not a stranger.

## AI providers (all configurable at runtime)

| Provider | Key required | Notes |
| --- | --- | --- |
| **Pollinations** | none | Default. Anonymous free tier, works on first load |
| **Ollama** (local) | none | 100% private; needs a reachable host + `ALLOW_PRIVATE_ENDPOINTS` on self-host |
| **LM Studio** (local) | none | Local OpenAI-compatible server |
| **OpenCode Zen** | key | `*-free` models are $0 but the gateway requires a key from opencode.ai/console |
| **Groq** | key | Free tier, very fast |
| **Google AI Studio** | key | Gemini free tier |
| **OpenRouter** | key | Many `:free` models |
| **Custom** | optional | Any OpenAI-compatible `chat/completions` URL |

Keys are typed in Settings and stored only in that browser's `localStorage`. They travel
to the app's own `/api/chat` proxy, which injects the `Authorization` header — they are
never hardcoded into the bundle. Alternatively set server-side env keys (see below) so
visitors need to configure nothing.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

The dev server needs the API function locally to do rewrites:

```bash
node scripts/dev-api.mjs                  # terminal 1 → :4199
DEV_API_TARGET=http://localhost:4199 npm run dev   # terminal 2
```

Other scripts:

```bash
npm run build        # typecheck + production build
npm run preview      # serve the built PWA
npm run icons        # regenerate the PWA icon set from SVG (sharp)
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Or import the repo at [vercel.com/new](https://vercel.com/new) — the framework preset
is detected as Vite and `api/chat.ts` is deployed as a serverless function automatically.

Optional environment variables (all optional — the keyless provider works with none of them):

```bash
OPENCODE_API_KEY=     # server-side key for OpenCode Zen
GROQ_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
POLLINATIONS_API_KEY=
ALLOW_PRIVATE_ENDPOINTS=1   # only if you self-host and want localhost/LAN endpoints
PUBLIC_SITE_URL=           # used for the OpenRouter referer header
```

## PWA details

`vite-plugin-pwa` (Workbox) generates a precache service worker with network-only handling
for `/api/*`, so the app shell and your history work offline while rewrites obviously
need a connection. Icons are generated from `scripts/gen-icons.mjs` (192/512 any + 512
maskable + 180 apple-touch-icon + favicon SVG/PNG), plus iOS meta tags, safe-area insets,
`viewport-fit=cover`, an app shortcut, and a no-flash inline theme script.

## Stack

React 19 · TypeScript · Vite 8 · vite-plugin-pwa · one tiny serverless function.
No UI framework, no state library, no CSS framework — hand-written CSS with
light/dark themes and `prefers-reduced-motion` support.