# 🌸 Bloom - Endometriosis Symptom Tracker

A tool for tracking endometriosis symptoms and predicting flare-ups.

## Features

- **Daily Symptom Logging**: Track pain, fatigue, bloating, mood, and nausea
- **Cycle Tracking**: Monitor bleeding patterns
- **Trigger Identification**: Tag potential triggers (stress, sleep, diet, exercise)
- **Pattern Analysis**: Visualize trends and calculate averages
- **Flare Risk Detection**: Automated alerts based on symptom patterns
- **AI Insights**: Get personalized pattern analysis using Claude AI
- **Privacy-First**: Your data stays yours, encrypted and secure

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Anthropic Claude API
- **Hosting**: Vercel (free tier)
- **Design**: Custom CSS with warm, organic aesthetics

## Setup

### 1. Supabase Project

1. [supabase.com](https://supabase.com)
2. Europe region (recommended, will change depending on latency)

### 2. Database Migration

1. Database schema:

\`\`\`sql
-- Create symptom_entries table
CREATE TABLE symptom_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entry_date DATE NOT NULL,
  
  -- Symptom levels (1-10)
  pain_level INT CHECK (pain_level BETWEEN 1 AND 10),
  fatigue_level INT CHECK (fatigue_level BETWEEN 1 AND 10),
  bloating_level INT CHECK (bloating_level BETWEEN 1 AND 10),
  mood_level INT CHECK (mood_level BETWEEN 1 AND 10),
  nausea_level INT CHECK (nausea_level BETWEEN 1 AND 10),
  
  bleeding_level TEXT CHECK (bleeding_level IN ('none', 'spotting', 'light', 'moderate', 'heavy')),
  triggers TEXT[],
  notes TEXT,
  
  UNIQUE(user_id, entry_date)
);

-- Index for fast queries
CREATE INDEX idx_entries_user_date ON symptom_entries(user_id, entry_date DESC);

-- Row Level Security
ALTER TABLE symptom_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON symptom_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON symptom_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON symptom_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON symptom_entries FOR DELETE
  USING (auth.uid() = user_id);
\`\`\`

### 3. Configure Environment Variables

1. Created a file named `.env.local` in the project root
2. Add your Supabase credentials:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 4. Installed Dependencies and run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deployed to Vercel

1. Pushed code to GitHub
2. [vercel.com](https://vercel.com)
4. Add environment variables (same as `.env.local`)
5. Deploy!

Your app will be live at `https://bloom-endo-tracker.vercel.app`

## Usage

### First Time Setup

1. Open the app
2. Enter your email
3. Check your inbox for the magic link
4. Click the link to sign in (no password needed!)

### Daily Logging

1. Go to **Log** tab
2. Slide the symptom levels
3. Select bleeding level and triggers
4. Add notes (optional)
5. Click "Save Today's Log"

### View History

- **History** tab shows all past entries
- Color-coded by pain severity (green = mild, yellow = moderate, red = severe)

### Get Insights

- **Insights** tab shows:
  - Flare risk level (high/medium/low)
  - Average pain and fatigue
  - Most common trigger
  - 7-day pain trend chart
  - AI-powered pattern analysis

## Architecture

\`\`\`
Frontend (Next.js)
    ↓
Supabase Auth (Magic Link)
    ↓
PostgreSQL Database (RLS enabled)
    ↓
Claude API (Pattern Analysis)
\`\`\`

## Privacy & Security

- ✅ End-to-end encryption (HTTPS)
- ✅ Row Level Security (users can only see their own data)
- ✅ No tracking or analytics
- ✅ HIPAA-compliant infrastructure (Supabase)
- ✅ Magic link auth (no passwords to leak)

## Future Enhancements

### Phase 2 
- [ ] Email reminders for daily logging
- [ ] PDF export for doctor visits
- [ ] Cycle overlay on history view
- [ ] Dark mode

### Phase 3 
- [ ] ML-based flare prediction (PyTorch LSTM)
- [ ] Personalized treatment recommendations
- [ ] Medication tracking
- [ ] Symptom correlations

## License

Personal use only. Not for redistribution.

## Support

Everything, always for you, Ru ❤️

For issues or questions, contact: [nyamupakuda@gmail.com]
