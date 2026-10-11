import {
  siDocker, siExpress, siGit, siHtml5, siMongodb, siNodedotjs, siOpenjdk, siReact,
} from 'simple-icons';

/* Official marks (Simple Icons), drawn in one colour so they sit in the palette. */
const BRANDS = {
  react: siReact,
  'node.js': siNodedotjs,
  node: siNodedotjs,
  express: siExpress,
  mongodb: siMongodb,
  'html & css': siHtml5,
  html: siHtml5,
  git: siGit,
  java: siOpenjdk,
  docker: siDocker,
};

/* Hand-drawn line glyphs for things that have no logo. */
const GLYPHS = {
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
      <path d="M5 5.5v13c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-13" />
      <path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" />
    </>
  ),
  'agentic ai': (
    <>
      <circle cx="12" cy="4.5" r="2.3" />
      <circle cx="4.8" cy="18" r="2.3" />
      <circle cx="19.2" cy="18" r="2.3" />
      <path d="M10.9 6.5 5.9 16M13.1 6.5l5 9.5M7.1 18h9.8" />
    </>
  ),
  rag: (
    <>
      <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H11" />
      <path d="M14 3l5 5v2.5M14 3v5h5" />
      <path d="M8 11h4M8 14.5h2.5" />
      <circle cx="16.5" cy="16.5" r="3.2" />
      <path d="m18.9 18.9 2.3 2.3" />
    </>
  ),
};

export function SkillIcon({ name }) {
  const key = name.toLowerCase();
  const brand = BRANDS[key];
  if (brand) {
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" aria-hidden>
        <path d={brand.path} fill="currentColor" />
      </svg>
    );
  }
  if (GLYPHS[key]) {
    return (
      <svg
        className="skill-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {GLYPHS[key]}
      </svg>
    );
  }
  // Anything else gets a typeset monogram.
  return <span className="skill-icon skill-mono" aria-hidden>{name.slice(0, 2)}</span>;
}
