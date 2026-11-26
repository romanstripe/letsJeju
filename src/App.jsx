import { useEffect, useLayoutEffect, useState } from 'react';
import { DEFAULT_LANG, LANGS, messages } from './i18n/index.js';
import { load, save } from './storage.js';
import LanguageScreen from './screens/LanguageScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MapScreen from './screens/MapScreen.jsx';
import EmptyScreen from './screens/EmptyScreen.jsx';
import TopBar from './components/TopBar.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = load('lang');
    return LANGS.includes(saved) ? saved : null;
  });
  const [theme, setTheme] = useState(() => (load('theme') === 'light' ? 'light' : 'dark'));
  const [tab, setTab] = useState('home');
  const [choosing, setChoosing] = useState(false);

  const current = lang ?? DEFAULT_LANG;
  const t = messages[current];

  useEffect(() => {
    document.documentElement.lang = current;
    document.title = t.app.name;
  }, [current, t]);

  // 지도 마커가 CSS 색을 읽기 전에 적용되어야 해서 useLayoutEffect
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('theme', theme);
  }, [theme]);

  function chooseLanguage(code) {
    setLang(code);
    save('lang', code);
    setTab('home');
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
    onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    onChangeLanguage: () => setChoosing(true),
  };

  return (
    <div className="stage">
      <div className={tab === 'map' ? 'shell shell-map' : 'shell'}>
        {tab === 'map' ? (
          <MapScreen {...headerProps} theme={theme} />
        ) : (
          <>
            <TopBar lang={lang} {...headerProps} />
            <main className="content">
              {tab === 'home' ? (
                <HomeScreen t={t} onSeeEvents={() => setTab('events')} />
              ) : (
                <EmptyScreen title={t.nav[tab]} />
              )}
            </main>
          </>
        )}
        <BottomNav t={t} tab={tab} onSelect={setTab} />
      </div>
    </div>
  );
}
