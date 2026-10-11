import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Reveal } from '../hooks.jsx';
import { SectionHead } from './Exhibits.jsx';

// Stable, gentle tilt per note so the wall looks hand-placed, not random on every render.
const tilt = (id) => {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 7) - 3) * 0.6;
};

const when = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Margin() {
  const [notes, setNotes] = useState([]);
  const [state, setState] = useState('loading'); // loading | ready | offline
  const [form, setForm] = useState({ name: '', note: '', website: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [fresh, setFresh] = useState(null);

  useEffect(() => {
    api.signatures()
      .then((list) => { setNotes(list); setState('ready'); })
      .catch(() => setState('offline'));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const saved = await api.sign(form);
      if (saved.id) {
        setNotes((n) => [saved, ...n]);
        setFresh(saved.id);
      }
      setForm({ name: '', note: '', website: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="margin" className="section">
      <SectionHead n="05" kicker="The Margin" title="Leave a mark before you go." />

      <Reveal as="form" className="sign" onSubmit={submit}>
        <label className="sr-only" htmlFor="sign-name">Your name</label>
        <input
          id="sign-name"
          className="line-input sign-name"
          placeholder="Your name"
          maxLength={40}
          required
          value={form.name}
          onChange={set('name')}
        />
        <span className="sign-word">wrote</span>
        <label className="sr-only" htmlFor="sign-note">Your note</label>
        <input
          id="sign-note"
          className="line-input sign-note"
          placeholder="something kind, curious, or honest"
          maxLength={140}
          required
          value={form.note}
          onChange={set('note')}
        />
        <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden />
        <button className="stamp-btn" disabled={sending || state === 'offline'}>
          {sending ? 'Inking…' : 'Sign it'}
        </button>
        <span className="sign-count" aria-hidden>{140 - form.note.length}</span>
      </Reveal>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="notes" aria-live="polite">
        {state === 'loading' && <p className="notes-empty">Fetching the margin…</p>}
        {state === 'offline' && <p className="notes-empty">The margin is resting right now. Come back soon.</p>}
        {state === 'ready' && notes.length === 0 && (
          <p className="notes-empty">The margin is clean. Be the first to write in it.</p>
        )}
        {notes.map((n) => (
          <figure
            key={n.id}
            className={`note ${fresh === n.id ? 'is-fresh' : ''}`}
            style={{ '--r': `${tilt(n.id)}deg` }}
          >
            <blockquote>“{n.note}”</blockquote>
            <figcaption>{n.name}, <time dateTime={n.createdAt}>{when(n.createdAt)}</time></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
