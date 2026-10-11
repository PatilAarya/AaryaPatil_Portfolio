import { useEffect, useRef } from 'react';
import { initials, prefersReducedMotion } from '../hooks.jsx';

/*
 * The name is set in a variable font. Each letter thickens and softens
 * as the pointer approaches it; on touch screens a slow wave runs through it.
 */
function LiveName({ first, last }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const letters = [...root.querySelectorAll('.ch')];
    const fine = matchMedia('(pointer: fine)').matches;
    const weight = letters.map(() => 340);
    const soft = letters.map(() => 0);
    let centers = [];
    let pointer = { x: -1e4, y: -1e4 };
    let raf = 0;
    let visible = true;

    const measure = () => {
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY };
      });
    };

    const tick = (t) => {
      const radius = Math.max(innerWidth * 0.22, 220);
      letters.forEach((el, i) => {
        // A slow wave always runs through the name; a nearby cursor swells it further.
        const wave = (Math.sin(t / 900 - i * 0.55) + 1) / 2;
        let k = fine ? wave * 0.6 : wave;
        if (fine) {
          const c = centers[i];
          const d = Math.hypot(pointer.x - c.x, pointer.y - c.y);
          k = Math.max(k, Math.min(Math.max(1 - d / radius, 0), 1));
        }
        k = k * k * (3 - 2 * k);
        weight[i] += (340 + k * 560 - weight[i]) * 0.14;
        soft[i] += (k * 100 - soft[i]) * 0.14;
        el.style.fontVariationSettings =
          `'wght' ${weight[i].toFixed(1)}, 'SOFT' ${soft[i].toFixed(1)}, 'opsz' 144`;
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e) => { pointer = { x: e.clientX, y: e.clientY + scrollY }; };
    const onLeave = () => { pointer = { x: -1e4, y: -1e4 }; };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) { measure(); raf = requestAnimationFrame(tick); }
    });

    // Wait for the entrance animation and web font before measuring.
    const start = setTimeout(() => {
      measure();
      io.observe(root);
    }, 1200);
    document.fonts?.ready.then(measure);
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    addEventListener('resize', measure);

    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      removeEventListener('resize', measure);
    };
  }, [first, last]);

  const letters = (word, offset) =>
    [...word].map((ch, i) => (
      <span className="ch" key={i} style={{ '--i': i + offset }}>{ch}</span>
    ));

  return (
    <h1 className="live-name" ref={ref} aria-label={`${first} ${last}`}>
      <span className="live-name-first" aria-hidden>{letters(first, 0)}</span>
      <span className="live-name-last" aria-hidden>{letters(last, first.length)}</span>
    </h1>
  );
}


function Seal({ text, monogram }) {
  const label = `${text} · ${text} · `;
  return (
    <a href="#letter" className="seal" aria-label="Open to work. Write to me.">
      <svg viewBox="0 0 200 200" aria-hidden>
        <defs>
          <path id="seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" className="seal-ring" />
        <circle cx="100" cy="100" r="60" className="seal-ring seal-ring--dash" />
        <text className="seal-text">
          <textPath href="#seal-path" textLength="488">{label.toUpperCase()}</textPath>
        </text>
      </svg>
      <span className="seal-mark" aria-hidden>{monogram}</span>
    </a>
  );
}

/* A taped-on slip in the cover's right margin: a preview of the short note. */
function GlanceSlip({ lines, onOpen }) {
  const preview = lines.slice(0, 3);
  const more = lines.length - preview.length;
  return (
    <button className="slip" onClick={onOpen} aria-label="Read the 30-second version">
      <span className="slip-tape" aria-hidden />
      <span className="slip-head">
        <span>At a Glance</span>
        <span>30 sec</span>
      </span>
      <span className="slip-lines">
        {preview.map((line) => <span key={line}>{line}</span>)}
      </span>
      <span className="slip-foot">
        {more > 0 && <span>+{more} more</span>}
        <span className="slip-read">Read it all <span aria-hidden>→</span></span>
      </span>
    </button>
  );
}

export default function Cover({ profile, onTelegram }) {
  return (
    <section id="cover" className="cover">
      <p className="cover-kicker">
        <span>{profile.role}</span>
        <span className="cover-place">based in {profile.location.split(',')[0]}</span>
      </p>

      <div className="cover-name">
        <LiveName first={profile.firstName} last={profile.lastName} />
        <p className="cover-hint" aria-hidden>Go on, run your cursor over my name.</p>
        {profile.status.open && <Seal text="Open to work" monogram={initials(profile)} />}
        <GlanceSlip lines={profile.telegram} onOpen={onTelegram} />
      </div>

      <div className="cover-foot">
        <p className="cover-intro">{profile.intro}</p>
        <div className="cover-actions">
          <a className="ink-link" href="#exhibits">See the work <span aria-hidden>↓</span></a>
          <button className="ink-link ink-link--quiet" onClick={onTelegram}>
            Short on time? Read the short version <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
