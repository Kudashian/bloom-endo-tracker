/**
 * TEACHING NOTE: LogView Component
 * 
 * This is a COMPONENT - a reusable piece of UI.
 * Components are functions that return JSX (HTML-like syntax).
 * 
 * Props = Data passed from parent to child
 * - Example: onSave is a function passed from the parent
 * - When we save successfully, we call onSave() to tell parent to refresh
 * 
 * Key pattern here: Controlled Components
 * - React controls the form state (useState)
 * - Every input has value={state} and onChange={updateState}
 * - This gives React full control and makes validation easy
 */

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const SYMPTOMS = [
  { id: 'pain_level', label: 'Pelvic Pain', icon: '⚡', color: '#e07c7c' },
  { id: 'fatigue_level', label: 'Fatigue', icon: '🌙', color: '#9b8ec4' },
  { id: 'bloating_level', label: 'Bloating', icon: '💧', color: '#6ba8c4' },
  { id: 'mood_level', label: 'Mood', icon: '🌤', color: '#c4a96b' },
  { id: 'nausea_level', label: 'Nausea', icon: '🌿', color: '#6bc47a' },
];

const TRIGGERS = ['Stress', 'Poor Sleep', 'Certain Foods', 'Exercise', 'Hormonal', 'Unknown'];

interface Props {
  onSave: () => void;  // Callback function when save succeeds
}

export default function LogView({ onSave }: Props) {
  // STATE: All the form data
  const [symptoms, setSymptoms] = useState({
    pain_level: 1,
    fatigue_level: 1,
    bloating_level: 1,
    mood_level: 5,
    nausea_level: 1,
  });
  const [bleeding, setBleeding] = useState<'none' | 'spotting' | 'light' | 'moderate' | 'heavy'>('none');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Toggle trigger on/off
  const toggleTrigger = (trigger: string) => {
    setTriggers(prev =>
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)  // Remove if exists
        : [...prev, trigger]  // Add if doesn't exist
    );
  };

  // Save to database
  async function handleSave() {
    setSaving(true);
    
    const entry = {
      entry_date: new Date().toISOString().split('T')[0],  // Today's date: "2025-02-17"
      ...symptoms,
      bleeding_level: bleeding,
      triggers,
      notes,
    };

    const { error } = await supabase
      .from('symptom_entries')
      .upsert(entry, {
        onConflict: 'user_id,entry_date',  // Update if entry for today exists
      });

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      onSave();  // Tell parent to reload entries
    }
    
    setSaving(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 22, 
          color: '#2d1f3d', 
          margin: '0 0 4px' 
        }}>
          How are you feeling?
        </h2>
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", 
          color: '#888', 
          fontSize: 14, 
          margin: 0 
        }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Symptom Sliders */}
      {SYMPTOMS.map((symptom) => (
        <SymptomSlider
          key={symptom.id}
          symptom={symptom}
          value={symptoms[symptom.id as keyof typeof symptoms]}
          onChange={(val) => setSymptoms(prev => ({ ...prev, [symptom.id]: val }))}
        />
      ))}

      {/* Bleeding Level */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", 
          fontSize: 14, 
          fontWeight: 600, 
          color: '#3d3d3d', 
          marginBottom: 10 
        }}>
          Bleeding
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['none', 'spotting', 'light', 'moderate', 'heavy'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setBleeding(level)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1.5px solid',
                borderColor: bleeding === level ? '#c47a9b' : '#e0d6eb',
                background: bleeding === level ? '#f7eaf2' : 'white',
                color: bleeding === level ? '#c47a9b' : '#888',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Triggers */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", 
          fontSize: 14, 
          fontWeight: 600, 
          color: '#3d3d3d', 
          marginBottom: 10 
        }}>
          Possible Triggers
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TRIGGERS.map((trigger) => (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1.5px solid',
                borderColor: triggers.includes(trigger) ? '#7a9bc4' : '#e0d6eb',
                background: triggers.includes(trigger) ? '#eaf0f7' : 'white',
                color: triggers.includes(trigger) ? '#7a9bc4' : '#888',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ 
          fontFamily: "'DM Sans', sans-serif", 
          fontSize: 14, 
          fontWeight: 600, 
          color: '#3d3d3d', 
          marginBottom: 8 
        }}>
          Notes
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other symptoms or observations..."
          style={{
            width: '100%',
            minHeight: 80,
            border: '1.5px solid #e0d6eb',
            borderRadius: 12,
            padding: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: '#3d3d3d',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fdfbff',
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 14,
          border: 'none',
          background: saving 
            ? '#ccc' 
            : 'linear-gradient(135deg, #c47a9b, #9b7ac4)',
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: saving ? 'default' : 'pointer',
          letterSpacing: 0.3,
        }}
      >
        {saving ? 'Saving...' : "Save Today's Log"}
      </button>
    </div>
  );
}

// Symptom Slider Component
function SymptomSlider({ 
  symptom, 
  value, 
  onChange 
}: { 
  symptom: typeof SYMPTOMS[0]; 
  value: number; 
  onChange: (val: number) => void;
}) {
  const percentage = ((value - 1) / 9) * 100;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8 
      }}>
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          fontFamily: "'DM Sans', sans-serif", 
          fontSize: 15, 
          color: '#3d3d3d', 
          fontWeight: 500 
        }}>
          <span style={{ fontSize: 20 }}>{symptom.icon}</span>
          {symptom.label}
        </span>
        <span style={{
          background: symptom.color + '22',
          color: symptom.color,
          borderRadius: 12,
          padding: '2px 10px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'DM Mono', monospace",
        }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(to right, ${symptom.color} ${percentage}%, #e8e0f0 ${percentage}%)`,
          outline: 'none',
          cursor: 'pointer',
          color: symptom.color,
        }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 11, 
        color: '#aaa', 
        marginTop: 4, 
        fontFamily: "'DM Sans', sans-serif" 
      }}>
        <span>None</span>
        <span>Severe</span>
      </div>
    </div>
  );
}
