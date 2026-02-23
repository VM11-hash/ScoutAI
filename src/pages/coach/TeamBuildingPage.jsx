// ═══════════════════════════════════════════════════════
//  ScoutAI — Team Building (Coach)
//  Add 11 members and form a team
// ═══════════════════════════════════════════════════════

import { useState } from 'react';
import { Users } from 'lucide-react';
import { computeCompositeScore, classifyTier } from '../../engine/tierEngine';
import { Avatar, TierBadge, SectionHeader } from '../../components/ui/SharedComponents';
import { MOCK_ATHLETES } from '../../data/mockAthletes';

const SLOT_LABELS = [
  'GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CM', 'CM', 'RW', 'ST', 'LW',
];

const emptySlot = { id: null, name: '', avatar: '—' };

export default function TeamBuildingPage() {
  const [slots, setSlots] = useState(() =>
    Array(11).fill(null).map(() => ({ ...emptySlot }))
  );

  const setSlot = (index, athleteId) => {
    if (!athleteId) {
      setSlots(prev => {
        const next = [...prev];
        next[index] = { ...emptySlot };
        return next;
      });
      return;
    }
    const a = MOCK_ATHLETES.find(x => x.id === athleteId);
    if (!a) return;
    setSlots(prev => {
      const next = [...prev];
      next[index] = { id: a.id, name: a.name, avatar: a.avatar, position: a.position, region: a.region, age: a.age, metrics: a.metrics };
      return next;
    });
  };

  const usedIds = slots.map(s => s.id).filter(Boolean);

  return (
    <div className="page-pad">
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="section-title">TEAM BUILDING</h1>
        <p className="section-subtitle">Select 11 athletes to form your team. Each slot can be filled from the roster.</p>
      </div>

      <div className="card fade-up" style={{ marginBottom: 24, animationDelay: '0.06s' }}>
        <SectionHeader
          title="FORMATION"
          subtitle="11 slots — choose one athlete per slot"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(11, 1fr)',
            gap: 10,
            alignItems: 'stretch',
          }}
        >
          {slots.map((slot, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 12,
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.5 }}>
                {SLOT_LABELS[idx]}
              </div>
              <select
                className="select-field"
                value={slot.id || ''}
                onChange={e => setSlot(idx, e.target.value || null)}
                style={{ width: '100%', fontSize: 11, padding: '6px 8px' }}
              >
                <option value="">— Select —</option>
                {MOCK_ATHLETES.map(a => (
                  <option
                    key={a.id}
                    value={a.id}
                    disabled={usedIds.includes(a.id) && slot.id !== a.id}
                  >
                    {a.name} ({a.position})
                  </option>
                ))}
              </select>
              {slot.id && (
                <>
                  <Avatar initials={slot.avatar} size={36} color={classifyTier(computeCompositeScore(slot.metrics)).color} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {slot.name}
                  </div>
                  <TierBadge score={computeCompositeScore(slot.metrics)} />
                </>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted2)' }}>
          <Users size={16} />
          {slots.filter(s => s.id).length} / 11 members selected
        </div>
      </div>
    </div>
  );
}
