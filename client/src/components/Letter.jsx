import { useState } from 'react';
import { api } from '../api.js';
import { Reveal, Words, initials, useCopy } from '../hooks.jsx';

const TOPICS = ['a full-time role', 'an internship', 'a project together', 'just saying hello'];

export default function Letter({ profile }) {
  const [form, setForm] = useState({ topic: TOPICS[0], body: '', name: '', email: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [copied, copy] = useCopy();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.send(form);
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <section id="letter" className="section letter-section">
      <header className="section-head">
        <p className="section-n">06 <span>Correspondence</span></p>
        <Reveal as="h2" className="letter-title"><Words text="Let's make something good." /></Reveal>
      </header>

      <Reveal className="email-line">
        <a href={`mailto:${profile.email}`} className="email-big">{profile.email}</a>
        <button className="text-btn" onClick={() => copy(profile.email)} aria-live="polite">
          {copied ? 'Copied to clipboard ✓' : 'Copy address'}
        </button>
      </Reveal>

      <Reveal className="letter-wrap">
        {status === 'sent' ? (
          <div className="letter-sent" role="status">
            <span className="wax" aria-hidden>{initials(profile)}</span>
            <p className="letter-sent-title">Sealed and sent.</p>
            <p>Thank you, {form.name.split(' ')[0]}. I read every letter and will write back to {form.email}.</p>
          </div>
        ) : (
          <form className="letter" onSubmit={submit}>
            <p className="letter-date">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="letter-salute">Dear {profile.firstName},</p>

            <p className="letter-line">
              I'm writing about{' '}
              <label className="sr-only" htmlFor="l-topic">Topic</label>
              <select id="l-topic" className="line-input" value={form.topic} onChange={set('topic')}>
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
              .
            </p>

            <label className="sr-only" htmlFor="l-body">Your message</label>
            <textarea
              id="l-body"
              className="letter-body"
              rows={5}
              required
              maxLength={4000}
              placeholder="Tell me a little about it…"
              value={form.body}
              onChange={set('body')}
            />

            <p className="letter-line letter-sign">
              Yours,{' '}
              <label className="sr-only" htmlFor="l-name">Your name</label>
              <input id="l-name" className="line-input" placeholder="your name" required maxLength={80} value={form.name} onChange={set('name')} />
              <span className="letter-break" />
              reply to{' '}
              <label className="sr-only" htmlFor="l-email">Your email</label>
              <input id="l-email" type="email" className="line-input" placeholder="you@domain.com" required maxLength={120} value={form.email} onChange={set('email')} />
            </p>
            <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden />

            <div className="letter-foot">
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="stamp-btn stamp-btn--big" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sealing…' : 'Seal & send'} <span aria-hidden>→</span>
              </button>
            </div>
          </form>
        )}
      </Reveal>

      <Reveal as="ul" className="elsewhere">
        <li><span>Code</span><a className="ink-link" href={profile.links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden>↗</span></a></li>
        <li><span>Career</span><a className="ink-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden>↗</span></a></li>
        <li><span>Paper</span><a className="ink-link" href={profile.links.resume} target="_blank" rel="noreferrer">Résumé, PDF <span aria-hidden>↓</span></a></li>
      </Reveal>
    </section>
  );
}
