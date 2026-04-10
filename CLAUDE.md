# CLAUDE.md — Safarnama (सफ़रनामा)

> Read this entire file before touching any code. It contains everything you need to work on this project correctly.

---

## What is Safarnama?

Safarnama (सफ़रनामा) means "travel narrative" in Hindi — an account of a journey. It is a **voice-first, AI-powered travel journal app** for slow travellers and wanderlusters who want to capture what a place *felt* like, not just where they went.

Built by Neha Rani — Engineering Manager at HashedIn by Deloitte — as Month 3 of her Data Engineering Series of monthly apps.

**Core loop:** Traveller speaks or writes a journal entry prompted by one of 7 sensory questions → Claude API synthesises entries into a literary memoir → entries can be shared as cards or LinkedIn posts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | CSS-in-JS (inline styles + CSS string in component) |
| AI | Claude API (claude-sonnet-4-20250514) via Cloudflare Worker proxy |
| Maps | react-leaflet + leaflet + OpenStreetMap (NO API key needed) |
| Persistence | Supabase (magic link auth, per-user journal entries) |
| Deploy | GitHub Pages (neha-rani-r.github.io) |
| Proxy | Cloudflare Worker (handles Claude API key server-side) |

**Never suggest Mapbox** — requires credit card. Always use Leaflet + OpenStreetMap.
**Never suggest wrangler CLI** — always use Cloudflare dashboard UI to deploy Workers.

---

## Brand & Design Rules

### Identity
- **App name:** Safarnama (always capitalised this way)
- **Hindi script:** सफ़रनामा (always shown alongside the Latin name)
- **Tagline:** सफ़रनामा · travel journal

### Colours
```
--bg:       #ffffff   (white background)
--surface:  #f7f6f3   (card/section backgrounds)
--border:   #e8e6e1   (borders)
--text:     #111110   (primary text)
--muted:    #999892   (secondary text)
--accent:   #2e7d32   (GREEN — primary brand colour, used for all accents)
--dark:     #1a1a1a   (logo mark, dark elements)
```

**The green #2e7d32 is sacred.** Every interactive element, badge, icon accent, and brand mark uses this green. Never substitute blue or any other colour for brand accents.

### Typography
```
--serif:  'Playfair Display'  — journal entries, prompts, memoir text, headings
--sans:   'Inter'             — all UI chrome, labels, buttons, metadata
--logo:   'Nunito' 900        — SAFARNAMA wordmark only, all-caps
```

Google Fonts import:
```
Playfair Display: ital 400, ital 500, 400, 500
Inter: 300, 400, 500
Nunito: 400, 700, 900
```

### Logo — Compass + Pen Nib
The Safarnama logo is a **compass where the north needle is a pen nib**. Navigate = travel. Pen nib = journal. Both things the app does.

```svg
<!-- Compass circle -->
<circle cx="36" cy="36" r="32" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
<!-- Cardinal ticks -->
<line x1="36" y1="4" x2="36" y2="10" stroke="#1a1a1a" strokeWidth="2"/>
<!-- ... E, W, S ticks ... -->
<!-- NORTH = pen nib (green) -->
<path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32"/>
<line x1="36" y1="16" x2="36" y2="28" stroke="#1a1a1a" strokeWidth="0.8"/>
<circle cx="36" cy="14" r="2.5" fill="#2e7d32"/> <!-- ink drop -->
<!-- South needle (dark, muted) -->
<path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.5"/>
<!-- Centre jewel -->
<circle cx="36" cy="36" r="4.5" fill="#1a1a1a"/>
<circle cx="36" cy="36" r="2.2" fill="#2e7d32"/>
```

**Animations defined (CSS classes):**
- `.compass-needle` — gentle left-right rock (idle state, header logo)
- `.compass-needle-spin` — full 360° rotation (loading/generating state)
- `.bird-float` — gentle vertical float (memoir section birds)
- `.bird-float-delay` — same but 0.8s delayed (alternating birds)
- `.fade-up` — entry on load
- `.shimmer` — text shimmer

**Never remove or redesign the logo.** It is fixed brand identity.

### Decorative elements (use throughout)
- **Mountain/wave SVG divider** — peaks that are also wave crests, green stroke, thin, used between sections
- **Birds as arcs** — `<path d="M0,0 Q-12,-7 -22,0">` simple V shapes, green or dark
- **Compass marks** in empty states, loading states
- **Stars** — small green circles scattered in sky/background areas

---

## App Structure

### Tabs
1. **New Entry** (Write tab) — location input, 7 prompt chips, textarea, voice recording, save
2. **Journal** — list of all entries with share buttons
3. **Memoir** — AI synthesis of all entries into literary memoir
4. **Map** *(Step 9 — add this)* — Leaflet map with entry pins
5. *Insights tab can be added with Step 10*

### The 7 Sensory Prompts
```javascript
const PROMPTS = [
  { id: "surprise", icon: "✦", q: "What surprised you today that you wouldn't find at home?", why: "Cultural contrast" },
  { id: "senses",   icon: "◈", q: "Describe a sound or smell you want to remember.",           why: "Sensory memory" },
  { id: "food",     icon: "◉", q: "What did you eat, and what did it remind you of?",           why: "Food + emotion" },
  { id: "human",    icon: "◎", q: "Who did you talk to today? What did they teach you?",        why: "Human connection" },
  { id: "notice",   icon: "◆", q: "What did you notice that tourists usually miss?",            why: "Slow attention" },
  { id: "body",     icon: "◐", q: "How did your body feel in this place?",                      why: "Physical presence" },
  { id: "recommend",icon: "◑", q: "What would you tell someone who asked if they should come here?", why: "Your verdict" },
];
```

### Entry Object Shape
```typescript
interface Entry {
  id: number;
  location: string;
  prompt: string;           // prompt id
  text: string;
  date: string;             // "March 2026"
  lat?: number;             // Step 9 — GPS latitude
  lng?: number;             // Step 9 — GPS longitude
  emotion?: {               // Step 10 — emotion tag
    emotion: string;
    secondary: string;
    intensity: number;      // 0–1
    one_word: string;
  };
}
```

---

## Step 9 — Map View (Leaflet)

### Install
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### Import CSS
Add to index.html or main entry: `import 'leaflet/dist/leaflet.css'`

### Tile layer
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
Attribution: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
```

### GPS capture on save
```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => saveEntry({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
  () => saveEntry({ lat: undefined, lng: undefined })
);
```

### Custom marker
Use `L.divIcon` with the compass SVG (green, 28px) instead of default Leaflet pin.

### Map tab behaviour
- Centred on world view initially (lat: 20, lng: 0, zoom: 2)
- Zoom to fit all pins if entries exist
- Click pin → popup with location name (italic, Playfair), prompt badge, first 100 chars of entry, "Read full" link that switches to Journal tab

---

## Step 10 — Emotion Tagging

### Emotion vocabulary (13 emotions)
```
awe, joy, solitude, wonder, nostalgia, excitement, peace, melancholy,
realisation, learning, retrospection, enlightenment, experience
```

### Emotion badge colours
```javascript
const EMOTION_COLORS = {
  awe:            { bg: '#EEEDFE', text: '#3C3489' },
  joy:            { bg: '#FAEEDA', text: '#633806' },
  solitude:       { bg: '#E6F1FB', text: '#0C447C' },
  wonder:         { bg: '#E1F5EE', text: '#085041' },
  nostalgia:      { bg: '#FAECE7', text: '#712B13' },
  excitement:     { bg: '#FBEAF0', text: '#4B1528' },
  peace:          { bg: '#EAF3DE', text: '#27500A' },
  melancholy:     { bg: '#F1EFE8', text: '#2C2C2A' },
  realisation:    { bg: '#E1F5EE', text: '#0F6E56' },
  learning:       { bg: '#E6F1FB', text: '#185FA5' },
  retrospection:  { bg: '#EEEDFE', text: '#534AB7' },
  enlightenment:  { bg: '#FAEEDA', text: '#854F0B' },
  experience:     { bg: '#EAF3DE', text: '#3B6D11' },
};
```

### Claude API call for emotion (fires silently on save)
```javascript
const response = await fetch(CLAUDE_PROXY_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 60,
    system: 'You are an emotion classifier. Return ONLY valid JSON with no extra text: {"emotion":"<primary>","secondary":"<secondary>","intensity":<0-1>,"one_word":"<single evocative word>"}. Emotions: awe, joy, solitude, wonder, nostalgia, excitement, peace, melancholy, realisation, learning, retrospection, enlightenment, experience.',
    messages: [{ role: 'user', content: entryText }]
  })
});
```

### Insights (after 10+ entries)
- Show an "Insights" card in the Journal tab header
- Call Claude with all entry emotions summarised
- Output: "You feel most alive near [X]. Your [emotion] entries come from [pattern]."
- Style: soft green border card, Playfair italic text, compass icon

---

## Environment Variables

```bash
# .env (never commit this)
VITE_CLAUDE_KEY=sk-ant-...        # Only if calling Claude directly
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev

# .env.example (commit this)
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

**No Mapbox token needed. No map API key of any kind.**

---

## Cloudflare Worker (proxy)

The Claude API key lives server-side in the Cloudflare Worker. The frontend calls the Worker URL, never api.anthropic.com directly.

**Deploy via Cloudflare dashboard UI only — never wrangler CLI.** Wrangler detects the React app and overwrites the Worker.

Worker receives: `{ model, max_tokens, system, messages }`
Worker adds: `Authorization: Bearer ${API_KEY}` header
Worker forwards to: `https://api.anthropic.com/v1/messages`

---

## Supabase Schema (Step 8 — persistence)

```sql
create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  location text not null,
  prompt text not null,
  text text not null,
  date text not null,
  lat float,
  lng float,
  emotion jsonb,
  created_at timestamptz default now()
);

alter table entries enable row level security;
create policy "Users see own entries" on entries
  for all using (auth.uid() = user_id);
```

---

## What NOT to do

- **Never** use Mapbox — requires credit card
- **Never** use wrangler CLI to deploy Cloudflare Workers
- **Never** change the compass+pen nib logo
- **Never** change the green #2e7d32 accent colour
- **Never** use Inter for journal entry text (use Playfair Display)
- **Never** use Nunito for anything except the SAFARNAMA wordmark
- **Never** add emojis to the UI — use SVG shapes or unicode geometric symbols
- **Never** remove the CSS animations — they are part of the brand identity
- **Never** call api.anthropic.com directly from frontend — always proxy via Cloudflare Worker

---

## File Structure (target)

```
safarnama/
├── CLAUDE.md                 ← this file
├── .env.example
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx               ← main component
│   ├── components/
│   │   ├── CompassLogo.tsx   ← animated compass SVG
│   │   ├── EntryCard.tsx     ← journal entry with share buttons
│   │   ├── MapView.tsx       ← Leaflet map tab (Step 9)
│   │   ├── EmotionBadge.tsx  ← coloured emotion tag (Step 10)
│   │   ├── Insights.tsx      ← emotion pattern analysis (Step 10)
│   │   ├── ShareModal.tsx    ← share card + LinkedIn post
│   │   └── MemoirView.tsx    ← AI memoir synthesis
│   ├── hooks/
│   │   ├── useVoiceInput.ts
│   │   ├── useGeoLocation.ts ← Step 9
│   │   └── useEmotionTag.ts  ← Step 10
│   ├── lib/
│   │   ├── claude.ts         ← Claude API calls via proxy
│   │   └── supabase.ts       ← Supabase client (Step 8)
│   └── types.ts              ← Entry, Emotion, Prompt types
└── public/
    └── favicon.svg           ← compass mark in green
```

---

## Owner

Neha Rani — neha-rani-r on GitHub
LinkedIn: linkedin.com/in/neha-rani-r
Part of the Data Engineering Series (Month 3)
