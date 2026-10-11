import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import content from '../content/content.js';
import { createStore } from './db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '.env'), quiet: true });

// `--port=` (used by `npm run dev`) wins over PORT, which hosts like Render set.
const portArg = process.argv.find((a) => a.startsWith('--port='));
const PORT = Number(portArg?.slice(7)) || Number(process.env.PORT) || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const store = await createStore(process.env.MONGODB_URI, content);

// Optional: forward every letter to your inbox (Gmail + an App Password).
const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
const MAIL_TO = process.env.MAIL_TO || GMAIL_USER;
const mailer = GMAIL_USER && GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } })
  : null;
if (!mailer) console.warn('[mail] GMAIL_USER / GMAIL_APP_PASSWORD not set. Letters are saved but not emailed.');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '16kb' }));
if (process.env.CLIENT_ORIGIN) app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

/* ── helpers ─────────────────────────────────────────────── */

const text = (value, max) =>
  typeof value === 'string'
    ? value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max)
    : '';

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

const admin = (req, res, next) =>
  ADMIN_TOKEN && req.get('x-admin-token') === ADMIN_TOKEN
    ? next()
    : res.status(401).json({ error: 'Unauthorised' });

const limiter = (max, minutes) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Easy there. Try again a little later.' },
  });

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

/* ── routes ──────────────────────────────────────────────── */

app.get('/api/health', (_req, res) => res.json({ ok: true, store: store.mode }));

app.get('/api/content', wrap(async (_req, res) => {
  const [projects, experience] = await Promise.all([store.projects(), store.experience()]);
  res.json({ profile: content.profile, projects, experience });
}));

app.get('/api/guestbook', wrap(async (_req, res) => {
  res.json(await store.signatures(60));
}));

app.post('/api/guestbook', limiter(4, 15), wrap(async (req, res) => {
  const name = text(req.body?.name, 40);
  const note = text(req.body?.note, 140);
  if (req.body?.website) return res.status(201).json({}); // honeypot
  if (!name || !note) return res.status(400).json({ error: 'A name and a note, please.' });
  res.status(201).json(await store.addSignature({ name, note }));
}));

app.delete('/api/guestbook/:id', admin, wrap(async (req, res) => {
  const removed = await store.removeSignature(req.params.id);
  res.status(removed ? 204 : 404).end();
}));

app.post('/api/messages', limiter(5, 60), wrap(async (req, res) => {
  const name = text(req.body?.name, 80);
  const email = text(req.body?.email, 120);
  const topic = text(req.body?.topic, 60);
  const body = text(req.body?.body, 4000);
  if (req.body?.website) return res.status(201).json({ ok: true }); // honeypot
  if (!name || !body) return res.status(400).json({ error: 'Your name and a message, please.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'That email address looks off.' });
  await store.addMessage({ name, email, topic, body });
  console.log(`[letter] from ${name} <${email}> about "${topic}"`);
  if (mailer) {
    // The letter is already saved, so a mail hiccup shouldn't fail the visitor's request.
    mailer.sendMail({
      from: `Portfolio letters <${GMAIL_USER}>`,
      to: MAIL_TO,
      replyTo: `${name} <${email}>`,
      subject: `New letter from ${name}: ${topic || 'no topic'}`,
      text: `${body}\n\n— ${name} <${email}>\n\nHit reply to answer them directly.`,
    }).catch((err) => console.error('[mail] could not forward letter:', err.message));
  }
  res.status(201).json({ ok: true });
}));

app.get('/api/messages', admin, wrap(async (_req, res) => {
  res.json(await store.messages());
}));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* ── built client (production) ───────────────────────────── */

const dist = path.join(here, '../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.use((req, res, next) =>
    req.method === 'GET' ? res.sendFile(path.join(dist, 'index.html')) : next());
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something broke on my side.' });
});

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}  (store: ${store.mode})`);
});
