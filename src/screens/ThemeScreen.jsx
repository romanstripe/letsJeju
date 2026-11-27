import { useEffect, useMemo, useState } from 'react';
import PlacePanel from '../components/PlacePanel.jsx';
import { loadGourmet, loadPlaces } from '../data/loadPlaces.js';
import { themeGroups } from '../data/tagGroups.js';

// 첫 쪽에 보일 테마. 나머지는 "더 보기"에 들어간다.
const FIRST = ['sunriseSunset', 'oreum', 'sea', 'photo', 'withParents', 'withKids', 'rainyDay', 'olle', 'nature', 'gourmet', 'cafe'];
// 'gourmet'(맛집)은 태그가 아니라 직접 받은 목록(src/data/gourmet.js)이다.
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
      {places.slice(0, limit).map((place) => {
        // 정보가 없는 곳은 눌러도 보여줄 것이 없어서 버튼으로 만들지 않는다
        const Row = place.unknown ? 'div' : 'button';
        const press = place.unknown ? {} : { type: 'button', onClick: () => onSelect(place) };
        return (
          <li key={place.id}>
            <Row className="theme-row" {...press}>
              <span className="theme-thumb">
                {place.photo && <img src={place.photo} alt="" loading="lazy" />}
              </span>
              <span className="theme-text">
                <span className="theme-name" lang="ko">
                  {place.title}
                </span>
                <span className="theme-meta">{place.unknown ? t.themes.noInfo : summary(place, t)}</span>
              </span>
            </Row>
          </li>
        );
      })}
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

export default function ThemeScreen({ t }) {
  const [places, setPlaces] = useState(null);
  const [gourmet, setGourmet] = useState(null);
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

  const isGourmet = theme === 'gourmet';

  useEffect(() => {
    if (!isGourmet) return undefined;
    let cancelled = false;
    loadGourmet()
      .then((list) => !cancelled && setGourmet(list))
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isGourmet]);

  const matches = useMemo(() => {
    if (theme === 'gourmet') {
      // 정보가 있는 곳 먼저, 그 안에서는 이름순
      return [...(gourmet ?? [])].sort(
        (a, b) => Boolean(a.unknown) - Boolean(b.unknown) || a.title.localeCompare(b.title, 'ko'),
      );
    }
    const { tags } = themeGroups.find((g) => g.id === theme);
    return (places ?? [])
      .filter((p) => p.category in ORDER && tags.some((tag) => p.tags.includes(tag)))
      .sort((a, b) => ORDER[a.category] - ORDER[b.category] || a.title.localeCompare(b.title, 'ko'));
  }, [places, gourmet, theme]);
  const loaded = isGourmet ? gourmet : places;

  const s = t.themes;
  let notice = null;
  if (failed) notice = t.map.loadError;
  else if (!loaded) notice = t.map.loading;
  else if (matches.length === 0) notice = s.empty;

  return (
    <div className="theme-screen">
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
            {loaded && <span className="chip">{t.map.count.replace('{n}', matches.length.toLocaleString())}</span>}
          </div>
          {notice ? (
            <p className="events-notice" role="status">
              {notice}
            </p>
          ) : (
            <PlaceList key={theme} places={matches} t={t} onSelect={setSelected} />
          )}
          <p className="theme-note">{isGourmet ? s.gourmetNote : s.note}</p>
        </section>
      )}
    </div>
  );
}
