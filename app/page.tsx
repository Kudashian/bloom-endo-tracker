/**
 * TEACHING NOTE: Main Page Component
 * 
 * This is the heart of the app. Key React concepts:
 * 
 * 1. 'use client' = This component runs in the browser (not server)
 *    - Needed for interactive features (buttons, state changes)
 *    - Without this, Next.js assumes it's server-only
 * 
 * 2. useState() = React's way of remembering data that changes
 *    - Example: const [view, setView] = useState('log')
 *    - 'view' is the current value
 *    - 'setView' is the function to change it
 *    - When you call setView('history'), React re-renders the component
 * 
 * 3. useEffect() = Run code when component loads or data changes
 *    - Example: Load saved entries when page opens
 *    - Like ngOnInit in Angular, componentDidMount in old React
 */

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { SymptomEntry } from '@/lib/types';
import LogView from '@/components/LogView';
import HistoryView from '@/components/HistoryView';
import InsightsView from '@/components/InsightsView';

export default function TrackerPage() {
  // STATE: Data that changes and triggers re-renders
  const [view, setView] = useState<'log' | 'history' | 'insights'>('log');
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // EFFECT: Run once when component loads
  useEffect(() => {
    checkUser();
    loadEntries();
  }, []);

  // Check if user is logged in
  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    // Listen for auth changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }

  // Load all entries from database
  async function loadEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .order('entry_date', { ascending: false });
    
    if (error) {
      console.error('Error loading entries:', error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  }

  // If not logged in, show login screen
  if (!user) {
    return <LoginScreen />;
  }

  // If still loading data, show spinner
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: 24 
      }}>
        🌸 Loading...
      </div>
    );
  }

  // Main app interface
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px 16px 100px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌸</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            color: '#2d1f3d',
            margin: '0 0 4px',
            fontWeight: 600,
          }}>
            Bloom
          </h1>
          <p style={{ 
            fontFamily: "'DM Sans', sans-serif", 
            color: '#aaa', 
            fontSize: 13, 
            margin: 0 
          }}>
            Hi {user.email}! 👋
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: '24px 22px',
          boxShadow: '0 8px 40px rgba(100,60,140,0.1)',
          border: '1px solid rgba(200,180,240,0.3)',
        }}>
          {/* Conditional rendering based on current view */}
          {view === 'log' && <LogView onSave={loadEntries} />}
          {view === 'history' && <HistoryView entries={entries} />}
          {view === 'insights' && <InsightsView entries={entries} />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav view={view} setView={setView} />
    </div>
  );
}

// Simple login component
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 20 
    }}>
      <div style={{ 
        maxWidth: 400, 
        width: '100%',
        background: 'white',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 8px 40px rgba(100,60,140,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 28, 
            color: '#2d1f3d',
            marginBottom: 8 
          }}>
            Welcome to Bloom
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            {sent ? 'Check your email for the login link!' : 'Sign in to start tracking'}
          </p>
        </div>

        {!sent && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1.5px solid #e0d6eb',
                borderRadius: 12,
                fontSize: 15,
                marginBottom: 16,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #c47a9b, #9b7ac4)',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Bottom navigation tabs
function BottomNav({ 
  view, 
  setView 
}: { 
  view: string; 
  setView: (v: 'log' | 'history' | 'insights') => void 
}) {
  const tabs = [
    { id: 'log' as const, icon: '📝', label: 'Log' },
    { id: 'history' as const, icon: '📋', label: 'History' },
    { id: 'insights' as const, icon: '✨', label: 'Insights' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(200,180,240,0.3)',
      display: 'flex',
      justifyContent: 'center',
      gap: 0,
      padding: '8px 0 12px',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          style={{
            flex: 1,
            maxWidth: 120,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '6px 0',
          }}
        >
          <span style={{ fontSize: 22 }}>{tab.icon}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: view === tab.id ? 600 : 400,
            color: view === tab.id ? '#c47a9b' : '#bbb',
          }}>
            {tab.label}
          </span>
          {view === tab.id && (
            <div style={{ 
              width: 4, 
              height: 4, 
              borderRadius: '50%', 
              background: '#c47a9b' 
            }} />
          )}
        </button>
      ))}
    </div>
  );
}
