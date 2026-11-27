import Icon from './Icon.jsx';

// 오른쪽 위 지도 켜기, 번역, 언어, 밝기 버튼. 모든 화면 공통.
export default function HeaderButtons({ t, extra, mapOn, onToggleMap, translating, onToggleTheme, onTranslate, onChangeLanguage }) {
  const h = t.header;
  return (
    <div className="header-buttons">
      {extra}
      <button type="button" className="pill-button map-switch" aria-pressed={mapOn} onClick={onToggleMap}>
        <Icon name="map" size={20} />
        {mapOn ? h.mapOn : h.mapOff}
      </button>
      <button type="button" className="pill-button" aria-current={translating ? 'page' : undefined} onClick={onTranslate}>
        <Icon name="translate" size={20} />
        {t.nav.translate}
      </button>
      <button
        type="button"
        className="pill-button"
        aria-label={`${h.changeLanguage}: ${t.nativeName}`}
        onClick={onChangeLanguage}
      >
        <Icon name="globe" size={20} />
        {t.nativeName}
      </button>
      <button type="button" className="round-button" aria-label={h.toggleTheme} onClick={onToggleTheme}>
        <Icon name="brightness" size={20} />
      </button>
    </div>
  );
}
