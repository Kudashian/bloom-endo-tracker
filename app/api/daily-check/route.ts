/**
 * TEACHING NOTE: API Route (Server-Side Code)
 * 
 * This file lives at app/api/daily-check/route.ts
 * Next.js automatically turns this into an API endpoint at:
 * https://bloom-endo-tracker.vercel.app/api/daily-check
 * 
 * This code runs on the SERVER, not in the browser.
 * That's important because:
 * - We can use secret API keys here (Resend key) without exposing them
 * - Vercel Cron can "call" this URL on a schedule
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Server-side Supabase client (uses service role key for admin access)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Different from anon key - has admin rights
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Security: verify this request is actually from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  // 1. Check if Ruvarashe logged today (this also keeps Supabase active)
  const { data: todayEntries, error } = await supabaseAdmin
    .from('symptom_entries')
    .select('id')
    .eq('entry_date', today);

  if (error) {
    console.error('Database check failed:', error);
    return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
  }

  const loggedToday = todayEntries && todayEntries.length > 0;

  // 2. Check logging streak for the week (data quality signal)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: weekEntries } = await supabaseAdmin
    .from('symptom_entries')
    .select('entry_date')
    .gte('entry_date', sevenDaysAgo.toISOString().split('T')[0]);

  const daysLoggedThisWeek = weekEntries?.length || 0;

  // 3. Send reminder email if she hasn't logged today
  let emailSent = false;
  if (!loggedToday) {
    try {
      await resend.emails.send({
        from: 'Bloom <onboarding@resend.dev>',  // Update once you verify your own domain
        to: process.env.RUVARASHE_EMAIL!,
        subject: '🌸 A gentle reminder from Bloom',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">🌸</div>
            <h2 style="color: #2d1f3d; text-align: center;">Hi Ruva!</h2>
            <p style="color: #555; line-height: 1.6; text-align: center;">
              Just a gentle nudge — you haven't logged your symptoms today yet.
              Taking a minute to track how you're feeling helps build a clearer picture over time.
            </p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://bloom-endo-tracker.vercel.app" 
                 style="background: linear-gradient(135deg, #c47a9b, #9b7ac4); color: white; 
                        padding: 12px 24px; border-radius: 12px; text-decoration: none; 
                        font-weight: 600; display: inline-block;">
                Log Today's Symptoms
              </a>
            </div>
            <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 32px;">
              You've logged ${daysLoggedThisWeek} of the last 7 days. Every entry helps! 💜
            </p>
          </div>
        `,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send reminder email:', emailError);
    }
  }

  return NextResponse.json({
    status: 'checked',
    date: today,
    loggedToday,
    daysLoggedThisWeek,
    reminderSent: emailSent,
  });
}
