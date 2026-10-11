import { useCallback, useEffect, useState } from 'react';
import fallback from '../../content/content.js';
import { api } from './api.js';
import { useActiveSection, useScrollProgress } from './hooks.jsx';
import Masthead from './components/Masthead.jsx';
import IndexRail from './components/IndexRail.jsx';
import Cover from './components/Cover.jsx';
import Exhibits from './components/Exhibits.jsx';
import Logbook from './components/Logbook.jsx';
import Toolkit from './components/Toolkit.jsx';
import Margin from './components/Margin.jsx';
import Letter from './components/Letter.jsx';
import Colophon from './components/Colophon.jsx';
import Telegram from './components/Telegram.jsx';
import Palette from './components/Palette.jsx';

const SECTIONS = [
  { id: 'cover', n: '01', label: 'Cover' },
  { id: 'exhibits', n: '02', label: 'Exhibits' },
  { id: 'logbook', n: '03', label: 'Logbook' },
  { id: 'toolkit', n: '04', label: 'Toolkit' },
  { id: 'margin', n: '05', label: 'The Margin' },
  { id: 'letter', n: '06', label: 'Letter' },
];
const IDS = SECTIONS.map((s) => s.id);

export default function App() {
  const [data, setData] = useState(fallback);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'ink');
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const active = useActiveSection(IDS);
  useScrollProgress();

  useEffect(() => {
    api.content().then(setData).catch(() => { /* bundled content is already showing */ });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const favicon = document.getElementById('favicon');
    if (favicon) favicon.href = theme === 'ink' ? '/logo-mark-dark.png' : '/logo-mark-light.png';
  }, [theme]);

  // Ink is the default; a visitor's choice is remembered only once they actually switch.
  const toggleTheme = useCallback(() => {
    const next = theme === 'ink' ? 'paper' : 'ink';
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  }, [theme]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const { profile, projects, experience } = data;
  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <>
      <a className="skip" href="#exhibits">Skip to work</a>
      <Masthead
        profile={profile}
        theme={theme}
        onTheme={toggleTheme}
        onTelegram={() => setTelegramOpen(true)}
      />
      <IndexRail sections={SECTIONS} active={active} current={current} onIndex={() => setPaletteOpen(true)} />

      <main className="page">
        <Cover profile={profile} onTelegram={() => setTelegramOpen(true)} />
        <Exhibits projects={projects} profile={profile} />
        <Logbook entries={experience} />
        <Toolkit profile={profile} />
        <Margin />
        <Letter profile={profile} />
      </main>
      <Colophon profile={profile} onIndex={() => setPaletteOpen(true)} />

      <Telegram open={telegramOpen} onClose={() => setTelegramOpen(false)} profile={profile} projects={projects} />
      <Palette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        sections={SECTIONS}
        profile={profile}
        theme={theme}
        onTheme={toggleTheme}
        onTelegram={() => setTelegramOpen(true)}
      />
    </>
  );
}
