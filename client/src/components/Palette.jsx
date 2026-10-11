import { useMemo, useState } from 'react';
import { useOverlay } from './Telegram.jsx';

export default function Palette({ open, onClose, sections, profile, theme, onTheme, onTelegram }) {
  const ref = useOverlay(open, onClose);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const items = useMemo(() => {
    const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    const open = (url) => () => window.open(url, '_blank', 'noopener');
    return [
      ...sections.map((s) => ({ group: 'Go to', label: s.label, hint: s.n, run: go(s.id) })),
      { group: 'Do', label: 'Read the 30-second version', hint: 'summary', run: onTelegram },
      { group: 'Do', label: 'Copy email address', hint: profile.email, run: () => navigator.clipboard?.writeText(profile.email) },
      { group: 'Do', label: 'Open résumé', hint: 'PDF', run: open(profile.links.resume) },
      { group: 'Do', label: `Switch to ${theme === 'ink' ? 'Paper' : 'Ink'}`, hint: 'theme', run: onTheme },
      { group: 'Elsewhere', label: 'GitHub', hint: '↗', run: open(profile.links.github) },
      { group: 'Elsewhere', label: 'LinkedIn', hint: '↗', run: open(profile.links.linkedin) },
    ];
  }, [sections, profile, theme, onTheme, onTelegram]);

  const shown = items.filter((i) =>
    `${i.group} ${i.label}`.toLowerCase().includes(query.trim().toLowerCase()));

  if (!open) return null;

  const run = (item) => {
    onClose();
    setQuery('');
    setCursor(0);
    setTimeout(item.run, 60);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, shown.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && shown[cursor]) run(shown[cursor]);
  };

  let lastGroup = '';
  return (
    <div className="overlay overlay--top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Index" ref={ref}>
        <div className="palette-search">
          <span aria-hidden>→</span>
          <input
            data-autofocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={onKey}
            placeholder="Where to?"
            aria-label="Search the index"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={shown[cursor] ? `pal-${cursor}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-list" id="palette-list" role="listbox">
          {shown.length === 0 && <li className="palette-empty">Nothing by that name.</li>}
          {shown.map((item, i) => {
            const header = item.group !== lastGroup && (lastGroup = item.group);
            return (
              <li key={item.label} role="presentation">
                {header && <p className="palette-group">{item.group}</p>}
                <button
                  id={`pal-${i}`}
                  role="option"
                  aria-selected={i === cursor}
                  className={i === cursor ? 'is-cursor' : ''}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => run(item)}
                >
                  <span>{item.label}</span>
                  <span className="palette-hint">{item.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
