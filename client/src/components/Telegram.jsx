import { useEffect, useRef } from 'react';

export function useOverlay(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    document.body.classList.add('locked');
    requestAnimationFrame(() => ref.current?.querySelector('[data-autofocus]')?.focus());
    return () => {
      removeEventListener('keydown', onKey);
      document.body.classList.remove('locked');
      previous?.focus?.();
    };
  }, [open, onClose]);
  return ref;
}

export default function Telegram({ open, onClose, profile, projects }) {
  const ref = useOverlay(open, onClose);
  if (!open) return null;

  const stamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const live = projects.find((p) => p.live);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="telegram" role="dialog" aria-modal="true" aria-labelledby="tg-title" ref={ref}>
        <div className="telegram-head">
          <p id="tg-title">At a Glance</p>
          <p>From {profile.location.toUpperCase()} · {stamp} · Urgent</p>
          <button className="text-btn telegram-close" onClick={onClose} data-autofocus>Close ✕</button>
        </div>

        <p className="telegram-to">To: whoever is hiring</p>
        <ol className="telegram-lines">
          <li>{profile.firstName} {profile.lastName} here</li>
          {profile.telegram.map((line, i) => <li key={line} style={{ '--i': i + 1 }}>{line}</li>)}
          <li style={{ '--i': profile.telegram.length + 1 }}>Replies welcome</li>
        </ol>

        <div className="telegram-actions">
          <a className="stamp-btn" href={profile.links.resume} target="_blank" rel="noreferrer">Résumé, PDF ↓</a>
          <a className="ink-link" href={`mailto:${profile.email}`}>Email me</a>
          <a className="ink-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          {live && <a className="ink-link" href={live.live} target="_blank" rel="noreferrer">Live project ↗</a>}
        </div>
      </div>
    </div>
  );
}
