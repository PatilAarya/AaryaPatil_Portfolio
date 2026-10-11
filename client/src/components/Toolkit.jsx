import { useEffect, useState } from 'react';
import { Reveal, prefersReducedMotion, useReveal } from '../hooks.jsx';
import { SkillIcon } from '../icons.jsx';
import { SectionHead } from './Exhibits.jsx';

const TIERS = [
  { id: 'daily', label: 'Used daily' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'learning', label: 'Learning now' },
];
const TIER_LABEL = Object.fromEntries(TIERS.map((t) => [t.id, t.label]));

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/* Letters shuffle and settle left to right, like a split-flap departures board. */
const FLAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function useFlap(text, run, delay) {
  const [out, setOut] = useState(() => text.replace(/\S/g, '·'));
  useEffect(() => {
    if (!run || prefersReducedMotion()) {
      if (run) setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t) => {
      if (!start) start = t + delay;
      const settled = Math.max(0, Math.floor((t - start) / 22));
      setOut([...text].map((ch, i) =>
        i < settled || ch === ' ' ? ch : FLAP[(Math.random() * FLAP.length) | 0]).join(''));
      if (settled < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run, delay]);
  return out;
}

function BoardRow({ label, text, run, delay }) {
  const shown = useFlap(text, run, delay);
  return (
    <div className="board-row">
      <span className="board-key">{label}</span>
      <span className="board-val">
        <span className="sr-only">{text}</span>
        <span aria-hidden>{shown}</span>
      </span>
    </div>
  );
}

function NowBoard({ now }) {
  const [ref, run] = useReveal(0.35);
  const rows = [
    ['Building', now.building],
    ['Learning', now.learning],
    ['Reading', now.reading],
  ];
  return (
    <div className="board" ref={ref}>
      <div className="board-head">
        <h3 className="board-title">Currently</h3>
        <span className="board-date">Updated {formatDate(now.updated)}</span>
      </div>
      {rows.map(([label, text], i) => (
        <BoardRow key={label} label={label} text={text} run={run} delay={i * 260} />
      ))}
    </div>
  );
}

export default function Toolkit({ profile }) {
  const [focus, setFocus] = useState(0);
  const skill = profile.skills[focus];
  const indexed = profile.skills.map((s, i) => ({ ...s, i }));

  return (
    <section id="toolkit" className="section">
      <SectionHead n="04" kicker="Toolkit" title="The tools I reach for." />

      <div className="toolkit">
        <div className="case">
          {TIERS.map((tier) => {
            const items = indexed.filter((s) => s.tier === tier.id);
            if (!items.length) return null;
            return (
              <Reveal key={tier.id} className={`shelf shelf--${tier.id}`}>
                <p className="shelf-label">
                  <span>{tier.label}</span>
                  <span className="shelf-count">{String(items.length).padStart(2, '0')}</span>
                </p>
                <div className="shelf-grid">
                  {items.map((s) => (
                    <button
                      key={s.name}
                      className={`skill ${s.i === focus ? 'is-focus' : ''}`}
                      onMouseEnter={() => setFocus(s.i)}
                      onFocus={() => setFocus(s.i)}
                      onClick={() => setFocus(s.i)}
                      aria-pressed={s.i === focus}
                    >
                      <span className="skill-n">{String(s.i + 1).padStart(2, '0')}</span>
                      <SkillIcon name={s.name} />
                      <span className="skill-name">{s.name}</span>
                    </button>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>

        <aside className="footnote" aria-live="polite">
          <p className="footnote-n">Footnote {focus + 1}</p>
          <p key={skill.name} className="footnote-body">
            <span className="footnote-name">{skill.name}</span>
            <span className="footnote-tier">{TIER_LABEL[skill.tier]}</span>
            <span className="footnote-note">{skill.note}</span>
          </p>
        </aside>
      </div>

      <NowBoard now={profile.now} />
    </section>
  );
}
