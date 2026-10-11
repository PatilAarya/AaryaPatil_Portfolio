export default function IndexRail({ sections, active, current, onIndex }) {
  return (
    <>
      <nav className="rail" aria-label="Sections">
        <p className="rail-title">Index</p>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? 'active' : ''} aria-current={active === s.id ? 'true' : undefined}>
                <span className="rail-n">{s.n}</span>
                <span className="rail-line" aria-hidden />
                <span className="rail-label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <button className="rail-key" onClick={onIndex}><kbd>/</kbd> to search</button>
      </nav>

      <nav className="dock" aria-label="Section navigation">
        <a href={`#${current.id}`} className="dock-current">
          <span className="dock-n">{current.n}</span>
          <span key={current.id} className="dock-label">{current.label}</span>
        </a>
        <button className="dock-index" onClick={onIndex}>Index ↑</button>
        <span className="dock-progress" aria-hidden />
      </nav>
    </>
  );
}
