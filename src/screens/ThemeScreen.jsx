import { useEffect, useMemo, useState } from 'react';
import HeaderButtons from '../components/HeaderButtons.jsx';
import PlacePanel from '../components/PlacePanel.jsx';
import { loadPlaces } from '../data/loadPlaces.js';
import { themeGroups } from '../data/tagGroups.js';

// 첫 쪽에 보일 테마. 나머지는 "더 보기"에 들어간다.
const FIRST = ['sunriseSunset', 'oreum', 'sea', 'photo', 'withParents', 'withKids', 'rainyDay', 'olle', 'nature', 'rest', 'cafe'];
const PAGES = [FIRST, themeGroups.map((g) => g.id).filter((id) => !FIRST.includes(id))];

// 행사(c5)는 날짜가 없어 끝난 것이 섞이므로 뺀다. 순서: 관광지, 테마여행, 음식점, 쇼핑
const ORDER = { c1: 0, c6: 1, c4: 2, c2: 3 };
const PAGE_SIZE = 30;
const DIFFICULTY = ['쉬움', '어려움', '아주 어려움'];

function summary(place, t) {
  const has = (...tags) => tags.some((tag) => place.tags.includes(tag));
  return [
    t.map.categories[place.category],
    place.region.at(-1),
    ...DIFFICULTY.filter((tag) => has(tag)).map((tag) => t.detailTags[tag]),
    has('공용주차장', '주차장') && t.tags.parking,
    has('화장실') && t.tags.restroom,
  ]
    .filter(Boolean)
    .join(' · ');
}

function PlaceList({ places, t, onSelect }) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  return (
    <ul className="theme-list">
      {places.slice(0, limit).map((place) => (
        <li key={place.id}>
          <button type="button" className="theme-row" onClick={() => onSelect(place)}>
            <span className="theme-thumb">
              {place.photo && <img src={place.photo} alt="" loading="lazy" />}
            </span>
            <span className="theme-text">
              <span className="theme-name" lang="ko">
                {place.title}
              </span>
              <span className="theme-meta">{summary(place, t)}</span>
            </span>
          </button>
        </li>
      ))}
      {places.length > limit && (
        <li>
          <button type="button" className="theme-more" onClick={() => setLimit(limit + PAGE_SIZE)}>
            {t.themes.more} ({limit}/{places.length})
          </button>
        </li>
      )}
    </ul>
  );
}

export default function ThemeScreen({ t, onToggleTheme, onChangeLanguage }) {
  const [places, setPlaces] = useState(null);
  const [failed, setFailed] = useState(false);
  const [theme, setTheme] = useState(FIRST[0]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadPlaces()
      .then((list) => !cancelled && setPlaces(list))
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const { tags } = themeGroups.find((g) => g.id === theme);
    return (places ?? [])
      .filter((p) => p.category in ORDER && tags.some((tag) => p.tags.includes(tag)))
      .sort((a, b) => ORDER[a.category] - ORDER[b.category] || a.title.localeCompare(b.title, 'ko'));
  }, [places, theme]);

  const s = t.themes;
  let notice = null;
  if (failed) notice = t.map.loadError;
  else if (!places) notice = t.map.loading;
  else if (matches.length === 0) notice = s.empty;

  return (
    <>
      <header className="topbar">
        <h1 className="screen-title">{s.title}</h1>
        <div className="topbar-right">
          <HeaderButtons t={t} onToggleTheme={onToggleTheme} onChangeLanguage={onChangeLanguage} />
        </div>
      </header>
      <main className="content theme-screen">
        <div className="theme-grid">
          {PAGES[page].map((id) => (
            <button
              key={id}
              type="button"
              className="theme-tile"
              aria-pressed={theme === id}
              onClick={() => {
                setTheme(id);
                setSelected(null);
              }}
            >
              {t.tags[id]}
            </button>
          ))}
          <button type="button" className="theme-tile theme-tile-more" onClick={() => setPage(1 - page)}>
            {page === 0 ? s.more : s.back}
          </button>
        </div>
        {selected ? (
          <PlacePanel place={selected} t={t} onClose={() => setSelected(null)} />
        ) : (
          <section className="card theme-panel">
            <div className="card-header">
              <h2>{t.tags[theme]}</h2>
              {places && <span className="chip">{t.map.count.replace('{n}', matches.length.toLocaleString())}</span>}
            </div>
            {notice ? (
              <p className="events-notice" role="status">
                {notice}
              </p>
            ) : (
              <PlaceList key={theme} places={matches} t={t} onSelect={setSelected} />
            )}
            <p className="theme-note">{s.note}</p>
          </section>
        )}
      </main>
    </>
  );
}
