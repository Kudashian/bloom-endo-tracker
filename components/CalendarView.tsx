'use client';

import { useState, CSSProperties } from 'react';
import { SymptomEntry } from '@/lib/types';

interface Props {
  entries: SymptomEntry[];
  onSelectDate: (date: string, existingEntry: SymptomEntry | null) => void;
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarView({ entries, onSelectDate }: Props) {
  const today = new Date();
  const todayStr = toDateStr(today);
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, negative = past months

  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const entryByDate = new Map(entries.map((e) => [e.entry_date, e]));

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: '#2d1f3d',
          marginBottom: 4,
        }}
      >
        Backfill Missed Days
      </h2>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: '#888',
          fontSize: 13,
          marginBottom: 20,
        }}
      >
        Tap any past day to log or edit it.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => setMonthOffset((o) => o - 1)}
          style={navButtonStyle}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: '#3d3d3d',
          }}
        >
          {monthLabel}
        </span>
        <button
          onClick={() => setMonthOffset((o) => Math.min(0, o + 1))}
          disabled={monthOffset === 0}
          style={{
            ...navButtonStyle,
            opacity: monthOffset === 0 ? 0.3 : 1,
            cursor: monthOffset === 0 ? 'default' : 'pointer',
          }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: 6,
        }}
      >
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: '#aaa',
              fontWeight: 600,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          marginBottom: 20,
        }}
      >
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const dateStr = toDateStr(date);
          const isFuture = dateStr > todayStr;
          const isToday = dateStr === todayStr;
          const entry = entryByDate.get(dateStr) ?? null;

          let bg = '#f5f5f5';
          let color = '#ccc';
          if (!isFuture) {
            if (entry) {
              bg = '#e6f7ee';
              color = '#4caf7d';
            } else {
              bg = '#fdeeee';
              color = '#e07c7c';
            }
          }

          return (
            <button
              key={dateStr}
              disabled={isFuture}
              onClick={() => onSelectDate(dateStr, entry)}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: isToday ? '1.5px solid #c47a9b' : '1.5px solid transparent',
                background: bg,
                color,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: isFuture ? 'default' : 'pointer',
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Legend color="#4caf7d" bg="#e6f7ee" label="Logged" />
        <Legend color="#e07c7c" bg="#fdeeee" label="Missed" />
        <Legend color="#ccc" bg="#f5f5f5" label="Upcoming" />
      </div>
    </div>
  );
}

const navButtonStyle: CSSProperties = {
  background: 'none',
  border: '1px solid #e0d6eb',
  borderRadius: 8,
  width: 32,
  height: 32,
  fontSize: 16,
  color: '#c47a9b',
  cursor: 'pointer',
};

function Legend({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 12, height: 12, borderRadius: 4, background: bg, border: `1.5px solid ${color}` }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#888' }}>{label}</span>
    </div>
  );
}
