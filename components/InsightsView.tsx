'use client';

import { useState } from 'react';
import { SymptomEntry } from '@/lib/types';

interface Props {
  entries: SymptomEntry[];
}

export default function InsightsView({ entries }: Props) {
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);

  if (entries.length < 3) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        color: '#aaa', 
        fontFamily: "'DM Sans', sans-serif" 
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔮</div>
        <p>Log at least 3 days to unlock pattern insights.</p>
        <p style={{ fontSize: 13 }}>
          You have {entries.length} {entries.length === 1 ? 'entry' : 'entries'} so far.
        </p>
      </div>
    );
  }

  // Calculate stats
  const avgPain = (entries.reduce((sum, e) => sum + e.pain_level, 0) / entries.length).toFixed(1);
  const avgFatigue = (entries.reduce((sum, e) => sum + e.fatigue_level, 0) / entries.length).toFixed(1);
  
  // Find most common trigger
  const triggerCounts: Record<string, number> = {};
  entries.forEach(e => {
    e.triggers?.forEach(t => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
  });
  const topTrigger = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None identified';

  // Flare risk calculation
  const recent = entries.slice(0, 3);
  const recentAvgPain = recent.reduce((s, e) => s + e.pain_level, 0) / 3;
  const recentAvgFatigue = recent.reduce((s, e) => s + e.fatigue_level, 0) / 3;
  
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  if (recentAvgPain >= 7 || (recentAvgPain >= 5 && recentAvgFatigue >= 6)) {
    riskLevel = 'high';
  } else if (recentAvgPain >= 4 || recentAvgFatigue >= 5) {
    riskLevel = 'medium';
  }

  const riskConfig = {
    high: { label: 'High Flare Risk', bg: '#fde8e8', color: '#c0392b', dot: '#e74c3c' },
    medium: { label: 'Moderate Risk', bg: '#fef3e2', color: '#b7770d', dot: '#f39c12' },
    low: { label: 'Symptoms Stable', bg: '#e8f8f0', color: '#1e8449', dot: '#27ae60' },
  };

  const risk = riskConfig[riskLevel];

  // Get AI insights
  async function getAIInsight() {
    setLoading(true);
    try {
      const summary = entries.slice(0, 7).map(e =>
        `Date: ${new Date(e.entry_date).toLocaleDateString()}, Pain: ${e.pain_level}/10, Fatigue: ${e.fatigue_level}/10, Triggers: ${e.triggers?.join(', ') || 'none'}`
      ).join('\n');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a compassionate endometriosis health assistant. Analyze symptom patterns and provide warm, clear, actionable insights. Keep response to 3-4 sentences. Never diagnose. Always suggest consulting their doctor for significant changes.',
          messages: [
            { 
              role: 'user', 
              content: `Analyze these recent symptom logs and share pattern insights:\n${summary}` 
            }
          ],
        }),
      });

      const data = await res.json();
      setAiInsight(data.content?.[0]?.text || 'Unable to generate insight.');
    } catch {
      setAiInsight('Unable to connect. Check your internet connection.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: 22, 
        color: '#2d1f3d', 
        marginBottom: 6 
      }}>
        Your Patterns
      </h2>
      
      {/* Risk Badge */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          background: risk.bg,
          color: risk.color,
          borderRadius: 20,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: risk.dot, 
            display: 'inline-block' 
          }} />
          {risk.label}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: 12, 
        marginBottom: 24 
      }}>
        {[
          { label: 'Avg Pain', value: avgPain, unit: '/10', color: '#e07c7c' },
          { label: 'Avg Fatigue', value: avgFatigue, unit: '/10', color: '#9b8ec4' },
          { label: 'Top Trigger', value: topTrigger, unit: '', color: '#6ba8c4' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: 14,
              padding: '14px 12px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(100,60,140,0.07)',
            }}
          >
            <div style={{ 
              fontFamily: "'DM Mono', monospace", 
              fontSize: 22, 
              color: stat.color, 
              fontWeight: 700 
            }}>
              {stat.value}
              <span style={{ fontSize: 12 }}>{stat.unit}</span>
            </div>
            <div style={{ 
              fontFamily: "'DM Sans', sans-serif", 
              fontSize: 11, 
              color: '#aaa', 
              marginTop: 4 
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pain Trend Chart */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 16, 
          color: '#2d1f3d', 
          marginBottom: 12 
        }}>
          Pain Trend (last {Math.min(entries.length, 7)} days)
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: 6, 
          height: 80, 
          background: 'white', 
          borderRadius: 14, 
          padding: '16px 16px 8px', 
          boxShadow: '0 2px 12px rgba(100,60,140,0.07)' 
        }}>
          {entries.slice(0, 7).reverse().map((entry, i) => {
            const height = (entry.pain_level / 10) * 60;
            const color = entry.pain_level >= 7 ? '#e07c7c' : 
                          entry.pain_level >= 4 ? '#c4a96b' : '#6bc47a';
            return (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 4 
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height, 
                  background: color, 
                  borderRadius: '4px 4px 0 0', 
                  minHeight: 4 
                }} />
                <span style={{ 
                  fontSize: 9, 
                  color: '#bbb', 
                  fontFamily: "'DM Sans', sans-serif" 
                }}>
                  {new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insight Button */}
      <button
        onClick={getAIInsight}
        disabled={loading}
        style={{
          width: '100%',
          padding: '13px 0',
          borderRadius: 14,
          border: 'none',
          background: 'linear-gradient(135deg, #9b8ec4, #6ba8c4)',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
          marginBottom: 16,
        }}
      >
        {loading ? 'Analyzing patterns...' : '✨ Get AI Pattern Insights'}
      </button>

      {/* AI Insight Display */}
      {aiInsight && (
        <div style={{
          background: 'linear-gradient(135deg, #f7f0ff, #f0f7ff)',
          borderRadius: 14,
          padding: 18,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: '#3d3d3d',
          lineHeight: 1.7,
          border: '1px solid #e0d6f0',
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#9b8ec4' }}>
            ✨ AI Insight
          </p>
          <p style={{ margin: 0 }}>{aiInsight}</p>
          <p style={{ margin: '12px 0 0', fontSize: 11, color: '#bbb' }}>
            Always consult your healthcare provider for medical decisions.
          </p>
        </div>
      )}
    </div>
  );
}
