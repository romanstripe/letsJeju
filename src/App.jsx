import { useEffect, useLayoutEffect, useState } from 'react';
import { DEFAULT_LANG, LANGS, messages } from './i18n/index.js';
import Icon from './components/Icon.jsx';
import { MapSwitch } from './mapSwitch.js';
import { load, save } from './storage.js';
import LanguageScreen from './screens/LanguageScreen.jsx';
import HereScreen from './screens/HereScreen.jsx';
import CourseScreen from './screens/CourseScreen.jsx';
import BrowseScreen from './screens/BrowseScreen.jsx';
import LogScreen from './screens/LogScreen.jsx';
import TranslateScreen from './screens/TranslateScreen.jsx';
import ScreenHeader from './components/ScreenHeader.jsx';
import BottomNav from './components/BottomNav.jsx';

// 번역에서 승객이 고를 수 있는 언어 (기사님은 한국어)
const PASSENGER_LANGS = ['en', 'ja', 'zh-CN', 'zh-TW'];

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = load('lang');
    return LANGS.includes(saved) ? saved : null;
  });
  const [theme, setTheme] = useState(() => (load('themeChoice') === 'dark' ? 'dark' : 'light'));
  const [tab, setTab] = useState('here');
  const [choosing, setChoosing] = useState(false);
  const [mapOn, setMapOn] = useState(() => load('mapChoice') !== 'off');
  const [passengerChoice, setPassengerChoice] = useState(null);

  const current = lang ?? DEFAULT_LANG;
  const t = messages[current];

  useEffect(() => {
    document.documentElement.lang = current;
    document.title = t.app.name;
  }, [current, t]);

  // 지도 마커가 CSS 색을 읽기 전에 적용되어야 해서 useLayoutEffect
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function chooseLanguage(code) {
    setLang(code);
    save('lang', code);
    setTab('here');
    setPassengerChoice(null);
    setChoosing(false);
  }

  if (!lang || choosing) {
    return (
      <div className="stage">
        <LanguageScreen current={current} onChoose={chooseLanguage} />
      </div>
    );
  }

  const headerProps = {
    t,
    // 직접 누른 경우에만 저장한다. 안 눌렀으면 기본값(라이트)
    onToggleTheme: () => {
      const next = theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      save('themeChoice', next);
    },
    mapOn,
    onToggleMap: () => {
      setMapOn(!mapOn);
      save('mapChoice', mapOn ? 'off' : 'on');
    },
    translating: tab === 'translate',
    onTranslate: () => setTab('translate'),
    onChangeLanguage: () => setChoosing(true),
  };

  const title = tab === 'translate' ? t.translate.title : t.nav[tab];
  // 화면 언어가 한국어면 승객은 영어부터
  const passenger = passengerChoice ?? (PASSENGER_LANGS.includes(lang) ? lang : 'en');
  const passengerButton = tab === 'translate' && (
    <button
      type="button"
      className="pill-button"
      aria-label={t.translate.switchLang}
      onClick={() => setPassengerChoice(PASSENGER_LANGS[(PASSENGER_LANGS.indexOf(passenger) + 1) % PASSENGER_LANGS.length])}
    >
      {messages[passenger].nativeName}
      <Icon name="swap" size={18} />
      {messages.ko.nativeName}
    </button>
  );

  return (
    <div className="stage">
      <MapSwitch value={{ on: mapOn, offText: t.header.mapDisabled }}>
        <div className="shell">
          <ScreenHeader
            title={title}
            highlight={tab === 'here' ? t.here.following : undefined}
            subtitle={t.subtitle[tab]} // "지금 여기"와 "오늘 기록"에만 있다
            extra={passengerButton}
            {...headerProps}
          />
          <main className="content">
            {tab === 'here' ? (
              <HereScreen t={t} theme={theme} />
            ) : tab === 'course' ? (
              <CourseScreen lang={lang} t={t} theme={theme} />
            ) : tab === 'browse' ? (
              <BrowseScreen lang={lang} t={t} theme={theme} />
            ) : tab === 'log' ? (
              <LogScreen t={t} theme={theme} />
            ) : (
              <TranslateScreen key={passenger} passenger={passenger} />
            )}
          </main>
          <BottomNav t={t} tab={tab} onSelect={setTab} />
        </div>
      </MapSwitch>
    </div>
  );
}
