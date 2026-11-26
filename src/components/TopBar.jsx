import Clock from './Clock.jsx';
import Icon from './Icon.jsx';
import HeaderButtons from './HeaderButtons.jsx';

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
        <HeaderButtons t={t} onToggleTheme={onToggleTheme} onChangeLanguage={onChangeLanguage} />
      </div>
    </header>
  );
}
