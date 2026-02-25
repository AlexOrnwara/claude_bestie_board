# 💌 BFF Board

A real-time shared board for two besties — built with Next.js + Supabase.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Supabase credentials
Copy the example env file and fill in your values:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push this repo to GitHub
2. Import in Vercel
3. Add your two environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will auto-detect Next.js — no extra configuration needed.
