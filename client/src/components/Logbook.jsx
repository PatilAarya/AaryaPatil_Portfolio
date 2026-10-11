import { useState } from 'react';
import { Reveal } from '../hooks.jsx';
import { SectionHead } from './Exhibits.jsx';

function Entry({ entry, open, onToggle, index }) {
  const id = `log-${entry.slug}`;
  const hasMore = entry.points?.length > 0 || entry.stack?.length > 0;

  return (
    <Reveal as="li" className={`entry ${open ? 'is-open' : ''}`} style={{ '--d': `${index * 90}ms` }}>
      <button
        className="entry-row"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        disabled={!hasMore && !entry.summary}
      >
        <span className="entry-dates">{entry.start} <span aria-hidden>→</span> {entry.end}</span>
        <span className="entry-main">
          <span className="entry-org">{entry.org}</span>
          <span className="entry-role">{entry.role}</span>
        </span>
        <span className="entry-kind">{entry.kind}</span>
        <span className="entry-toggle" aria-hidden />
      </button>

      <div className="entry-more" id={id}>
        <div>
          <div className="entry-inner">
            <p className="entry-loc">{entry.location}</p>
            {entry.summary && <p className="entry-summary">{entry.summary}</p>}
            {entry.points?.length > 0 && (
              <ul className="dash-list">
                {entry.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            )}
            {entry.stack?.length > 0 && (
              <p className="entry-stack"><span>Worked with</span> {entry.stack.join(' · ')}</p>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Logbook({ entries }) {
  const [open, setOpen] = useState(entries[0]?.slug);

  return (
    <section id="logbook" className="section">
      <SectionHead n="03" kicker="Logbook" title="Where I have worked and studied." />
      <ol className="log">
        {entries.map((e, i) => (
          <Entry
            key={e.slug}
            entry={e}
            index={i}
            open={open === e.slug}
            onToggle={() => setOpen(open === e.slug ? null : e.slug)}
          />
        ))}
      </ol>
    </section>
  );
}
