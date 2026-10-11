import { useClock } from '../hooks.jsx';

export default function Masthead({ profile, theme, onTheme, onTelegram }) {
  const time = useClock(profile.timezone);

  return (
    <header className="masthead">
      <div className="masthead-row">
        <a href="#cover" className="masthead-name">
          {profile.firstName} {profile.lastName}
          <span className="masthead-vol"> · Vol. {new Date().getFullYear()}</span>
        </a>

        <p className="masthead-meta" aria-label={`Local time in ${profile.location}`}>
          <span>{profile.location.split(',')[0]}</span>
          <span className="masthead-time">{time} {profile.tzLabel}</span>
          {profile.status.open && <a className="masthead-open" href="#letter">Open to work</a>}
        </p>

        <div className="masthead-actions">
          <button className="text-btn" onClick={onTelegram}>
            <span className="hide-sm">The </span>30-sec version
          </button>
          <button
            className="theme-switch"
            onClick={onTheme}
            aria-label={`Switch to ${theme === 'ink' ? 'light' : 'dark'} theme`}
          >
            <span className={theme === 'paper' ? 'on' : ''}>Paper</span>
            <span aria-hidden>/</span>
            <span className={theme === 'ink' ? 'on' : ''}>Ink</span>
          </button>
        </div>
      </div>
      <div className="progress" aria-hidden />
    </header>
  );
}
