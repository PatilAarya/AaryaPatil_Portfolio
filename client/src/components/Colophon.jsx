export default function Colophon({ profile, onIndex }) {
  return (
    <footer className="colophon">
      <div className="colophon-big" aria-hidden>{profile.firstName}<em>{profile.lastName}</em></div>
      <div className="colophon-row">
        <figure className="colophon-quote">
          <blockquote>
            <p>“I am right now somewhere between <em className="quote-what">‘what if?’</em> and <em className="quote-try">‘let me try!’</em>”</p>
          </blockquote>
          <figcaption>{profile.firstName} {profile.lastName}</figcaption>
        </figure>
        <p className="colophon-links">
          <button className="text-btn" onClick={onIndex}>Press <kbd>/</kbd> for the index</button>
          <a className="text-btn" href="#cover">Back to the cover ↑</a>
        </p>
      </div>
      <p className="colophon-copy">© {new Date().getFullYear()} {profile.firstName} {profile.lastName} · {profile.location}</p>
    </footer>
  );
}
