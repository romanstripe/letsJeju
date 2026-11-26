import Icon from './Icon.jsx';

// 오른쪽 위 밝기·언어 버튼 (모든 화면 공통)
export default function HeaderButtons({ t, onToggleTheme, onChangeLanguage }) {
  return (
    <div className="header-buttons">
      <button type="button" className="round-button" aria-label={t.header.toggleTheme} onClick={onToggleTheme}>
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
  );
}
