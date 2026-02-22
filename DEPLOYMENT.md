# 🚀 Deployment Quick Start (90 Minutes)

This guide walks you through deploying Bloom so Ruvarashe can start using it TODAY.

## Timeline Breakdown

- **Setup Supabase**: 15 minutes
- **Deploy to Vercel**: 10 minutes  
- **Test & Share Link**: 5 minutes
- **Buffer**: 60 minutes for any issues

---

## Part 1: Supabase Setup (15 min)

### Step 1: Create Account (3 min)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email

### Step 2: Create Project (2 min)
1. Click "New Project"
2. Fill in:
   - **Name**: `bloom-endo-tracker`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose **Africa (Johannesburg)** - closest to you
   - **Plan**: Free tier (perfect for personal use)
3. Click "Create new project"
4. Wait ~2 minutes for database to provision (grab coffee ☕)

### Step 3: Run Database Migration (5 min)
1. In left sidebar, click **SQL Editor**
2. Click **New Query**
3. Copy the ENTIRE schema from README.md (the big SQL block)
4. Paste into SQL editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned"

### Step 4: Get API Keys (2 min)
1. Click **Settings** (gear icon, bottom left)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
4. **COPY BOTH** - you'll need them in Step 2

### Step 5: Enable Email Auth (3 min)
1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Make sure these are enabled:
   - ✅ Enable Email provider
   - ✅ Confirm email
   - ❌ Disable "Enable email confirmations" (for faster testing)
4. Click **Save**

**✅ Supabase is ready!**

---

## Part 2: Deploy to Vercel (10 min)

### Step 1: Push to GitHub (4 min)

Open your terminal in the `bloom-app` folder:

\`\`\`bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Bloom endometriosis tracker"

# Create GitHub repo (go to github.com, click +, "New repository")
# Name it: bloom-endo-tracker
# Don't initialize with README (we already have one)
# Copy the commands GitHub shows you, something like:

git remote add origin https://github.com/YOUR-USERNAME/bloom-endo-tracker.git
git branch -M main
git push -u origin main
\`\`\`

### Step 2: Deploy on Vercel (6 min)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Find `bloom-endo-tracker` in your repo list
5. Click "Import"

**CRITICAL: Add Environment Variables**

Before clicking Deploy, scroll to "Environment Variables":

1. Click "Add" for each variable:

\`\`\`
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [paste your Supabase Project URL]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: [paste your Supabase anon key]
\`\`\`

2. Click "Deploy"
3. Wait ~2 minutes for build

**✅ Your app is live!**

---

## Part 3: Test & Share (5 min)

### Test the App

1. Vercel will show you the URL: `https://bloom-endo-tracker.vercel.app`
2. Open it in your browser
3. Enter YOUR email first (test before Ruvarashe)
4. Check your inbox for magic link
5. Click the link → You're logged in!
6. Try logging a symptom entry
7. Check History tab → Your entry appears

### Send to Ruvarashe

**Message template:**

\`\`\`
Hey! I built you a symptom tracker to help manage your endometriosis.

🌸 Bloom: https://bloom-endo-tracker.vercel.app

How it works:
1. Open the link
2. Enter your email
3. Check your inbox for login link
4. Start logging daily symptoms

Features:
✨ Track pain, fatigue, and other symptoms
📊 See patterns over time  
🔮 AI-powered flare predictions
🔒 Your data is private and secure

Try logging today's symptoms and let me know what you think!
\`\`\`

---

## Common Issues & Fixes

### Issue: Magic link not arriving
**Fix**: Check spam folder, or in Supabase go to Authentication → Settings → Disable "Confirm email" temporarily

### Issue: "Can't connect to database"  
**Fix**: Check that environment variables in Vercel match your Supabase keys EXACTLY (no extra spaces)

### Issue: "Row Level Security policy violation"
**Fix**: Make sure you ran the ENTIRE SQL migration, including all the RLS policies

### Issue: Build fails on Vercel
**Fix**: Check that all files are committed to GitHub. Run `git status` to see uncommitted files.

---

## What You Just Built

**From a technical perspective:**

- **Frontend**: React app with TypeScript for type safety
- **Backend**: Serverless Postgres database
- **Auth**: Magic link (passwordless) authentication  
- **Hosting**: Edge network (fast worldwide)
- **AI**: Claude API integration for insights

**From a portfolio perspective:**

This demonstrates:
- Full-stack development (frontend + backend + database)
- Healthcare data modeling (time-series + RLS)
- Production deployment (CI/CD with Vercel)
- Privacy-first architecture (HIPAA-compliant infrastructure)
- AI integration (Claude API for pattern analysis)

**Cost: $0/month** on free tiers

---

## Next Steps After Deployment

1. **Monitor usage**: Check Vercel dashboard for traffic
2. **Iterate based on feedback**: Ask Ruvarashe what's missing
3. **Add to portfolio**: Write a case study for your CV
4. **Plan Phase 2**: Email reminders, PDF export, ML predictions

---

## Learning Resources

**React concepts you just used:**
- Components (reusable UI pieces)
- State (data that changes)
- Props (passing data between components)  
- Effects (running code on load/change)
- Conditional rendering (show/hide based on data)

**Next.js features:**
- File-based routing (`app/page.tsx` → `/`)
- Server vs client components (`'use client'`)
- Environment variables (`NEXT_PUBLIC_*`)

**Supabase patterns:**
- Row Level Security (database-enforced privacy)
- Upsert (insert or update if exists)
- Magic link auth (passwordless)

Want to learn more about any of these? Ask me!

---

**You got this! 💪 If you hit issues, share the error message and I'll debug with you.**
