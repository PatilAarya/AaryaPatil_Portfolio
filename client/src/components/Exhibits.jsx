import { useRef } from 'react';
import { Reveal, Words } from '../hooks.jsx';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function SectionHead({ n, kicker, title }) {
  return (
    <Reveal as="header" className="section-head">
      <p className="section-n">{n} <span>{kicker}</span></p>
      <h2 className="section-title"><Words text={title} /></h2>
    </Reveal>
  );
}

/* When a project has no screenshot yet, compose a typographic plate for it. */
function GeneratedPlate({ project, index }) {
  const initials = project.title.split(/\s+/).map((w) => w[0]).join('').slice(0, 3);
  return (
    <div className="gen-plate" aria-hidden>
      <span className="gen-grid" />
      <span className="gen-circle" />
      <span className="gen-initials">{initials}</span>
      <span className="gen-corner gen-corner--tl">Plate {ROMAN[index]}</span>
      <span className="gen-corner gen-corner--tr">{project.year}</span>
      <span className="gen-corner gen-corner--bl">{project.stack.join(' · ')}</span>
      <span className="gen-corner gen-corner--br">{project.status}</span>
    </div>
  );
}

function Plate({ project, index }) {
  const cursor = useRef(null);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    cursor.current?.style.setProperty('transform',
      `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`);
  };
  const Tag = project.live ? 'a' : 'div';
  const linkProps = project.live
    ? { href: project.live, target: '_blank', rel: 'noreferrer', 'aria-label': `Open ${project.title} (live site)` }
    : {};

  return (
    <Reveal className="plate-wrap">
      <Tag className={`plate ${project.image ? 'plate--image' : ''}`} onPointerMove={move} {...linkProps}>
        <div className="plate-media">
          {project.image
            ? <img src={project.image} alt={`Screenshot of ${project.title}`} />
            : <GeneratedPlate project={project} index={index} />}
        </div>
        {project.live && (
          <span className="plate-cursor" ref={cursor} aria-hidden>Open<br />live ↗</span>
        )}
      </Tag>
    </Reveal>
  );
}

function Exhibit({ project, index }) {
  return (
    <article className="exhibit">
      <Reveal className="exhibit-top">
        <p className="exhibit-no">Exhibit <span>{String(index + 1).padStart(2, '0')}</span></p>
        <p className="exhibit-status">
          {project.status === 'Live' && <i aria-hidden />}
          {project.status} · {project.year}
        </p>
      </Reveal>

      <Reveal as="h3" className="exhibit-title"><Words text={project.title} /></Reveal>
      <Plate project={project} index={index} />

      <div className="exhibit-body">
        <Reveal as="dl" className="ledger">
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Year</dt><dd>{project.year}</dd></div>
          <div><dt>Built with</dt><dd>{project.stack.join(', ')}</dd></div>
        </Reveal>

        <Reveal className="exhibit-text">
          <p className="exhibit-summary">{project.summary}</p>
          <p>{project.description}</p>
          {project.highlights?.length > 0 && (
            <ol className="roman">
              {project.highlights.map((h) => <li key={h}>{h}</li>)}
            </ol>
          )}
          <p className="exhibit-links">
            {project.live && <a className="ink-link" href={project.live} target="_blank" rel="noreferrer">Visit the live site <span aria-hidden>↗</span></a>}
            {project.repo && <a className="ink-link ink-link--quiet" href={project.repo} target="_blank" rel="noreferrer">Read the source <span aria-hidden>↗</span></a>}
          </p>
        </Reveal>
      </div>
    </article>
  );
}

export default function Exhibits({ projects, profile }) {
  return (
    <section id="exhibits" className="section">
      <SectionHead n="02" kicker="Exhibits" title="Things I have built and shipped." />

      {projects.map((p, i) => <Exhibit key={p.slug} project={p} index={i} />)}

      <Reveal className="workshop">
        <p className="exhibit-no">Exhibit <span>{String(projects.length + 1).padStart(2, '0')}</span></p>
        <div>
          <p className="workshop-title">In the workshop<span className="dots" aria-hidden><i>.</i><i>.</i><i>.</i></span></p>
          <p className="workshop-text">
            The next piece is being built right now. This space is reserved for it.
            {' '}<a className="ink-link ink-link--quiet" href={profile.links.github} target="_blank" rel="noreferrer">Watch it take shape on GitHub <span aria-hidden>↗</span></a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
