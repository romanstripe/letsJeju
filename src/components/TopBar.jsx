import Clock from './Clock.jsx';
import Icon from './Icon.jsx';

export default function TopBar({ lang, t, onToggleTheme, onChangeLanguage }) {
  return (
    <header className="topbar">
      <span className="logo">
        <Icon name="logo" />
      </span>
      <span className="app-name">{t.app.name}</span>
      <div className="topbar-right">
        <Clock lang={lang} />
        <span className="weather">
          <Icon name="weather" />
          {t.header.weather}
        </span>
        <button
          type="button"
          className="round-button"
          aria-label={t.header.toggleTheme}
          onClick={onToggleTheme}
        >
          <Icon name="brightness" size={20} />
        </button>
        <button
          type="button"
          className="pill-button"
          aria-label={`${t.header.changeLanguage}: ${t.nativeName}`}
          onClick={onChangeLanguage}
        >
          <Icon name="globe" size={20} />
          {t.nativeName}
        </button>
      </div>
    </header>
  );
}
