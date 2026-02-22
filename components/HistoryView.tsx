'use client';

import { SymptomEntry } from '@/lib/types';

const SYMPTOMS = [
  { id: 'pain_level', label: 'Pain', icon: '⚡', color: '#e07c7c' },
  { id: 'fatigue_level', label: 'Fatigue', icon: '🌙', color: '#9b8ec4' },
  { id: 'bloating_level', label: 'Bloating', icon: '💧', color: '#6ba8c4' },
  { id: 'mood_level', label: 'Mood', icon: '🌤', color: '#c4a96b' },
  { id: 'nausea_level', label: 'Nausea', icon: '🌿', color: '#6bc47a' },
];

interface Props {
  entries: SymptomEntry[];
}

export default function HistoryView({ entries }: Props) {
  if (!entries.length) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        color: '#aaa', 
        fontFamily: "'DM Sans', sans-serif" 
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <p>No entries yet. Start logging to see your history.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: 22, 
        color: '#2d1f3d', 
        marginBottom: 20 
      }}>
        Your History
      </h2>
      {entries.map((entry, i) => {
        const date = new Date(entry.entry_date);
        const painLevel = entry.pain_level;
        const borderColor = painLevel >= 7 ? '#e07c7c' : painLevel >= 4 ? '#c4a96b' : '#6bc47a';

        return (
          <div
            key={entry.id || i}
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 18,
              marginBottom: 14,
              boxShadow: '0 2px 12px rgba(100,60,140,0.07)',
              borderLeft: `4px solid ${borderColor}`,
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 12 
            }}>
              <span style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 15, 
                color: '#2d1f3d', 
                fontWeight: 600 
              }}>
                {date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SYMPTOMS.map((symptom) => {
                const value = entry[symptom.id as keyof SymptomEntry] as number;
                return (
                  <div
                    key={symptom.id}
                    style={{
                      background: symptom.color + '15',
                      borderRadius: 10,
                      padding: '4px 10px',
                      fontSize: 12,
                      color: symptom.color,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {symptom.icon} {symptom.label} {value}/10
                  </div>
                );
              })}
            </div>
            {entry.triggers && entry.triggers.length > 0 && (
              <div style={{ 
                marginTop: 10, 
                fontSize: 12, 
                color: '#888', 
                fontFamily: "'DM Sans', sans-serif" 
              }}>
                Triggers: {entry.triggers.join(', ')}
              </div>
            )}
            {entry.notes && (
              <div style={{ 
                marginTop: 8, 
                fontSize: 13, 
                color: '#666', 
                fontFamily: "'DM Sans', sans-serif", 
                fontStyle: 'italic' 
              }}>
                "{entry.notes}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
