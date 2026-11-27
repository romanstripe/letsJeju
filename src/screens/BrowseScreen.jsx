import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import EventDetail from '../components/EventDetail.jsx';
import PlacePanel from '../components/PlacePanel.jsx';
import { NEARBY_MAP_LEVEL } from '../config.js';
import { browseButtons, DEFAULT_BUTTON } from '../data/browseButtons.js';
import { formatPeriod, rangeEnd, todayInKorea, useCurrentEvents } from '../data/events.js';
import { loadGourmet, loadPlaces } from '../data/loadPlaces.js';
import { seasonal } from '../data/seasonal.js';
import { themeGroups } from '../data/tagGroups.js';
import { useCurrentLocation } from '../location.js';

const PAGE_SIZE = 4;
// 행사(c5)는 날짜가 없어 끝난 것이 섞이므로 뺀다. 테마여행(c6)은 장소가 아니라 기사라서 뺀다.
const CATEGORIES = new Set(['c1', 'c2', 'c4']);
// 카드 해시태그는 누구와 가는지를 먼저, 최대 3개
const HASHTAG_FIRST = ['withPartner', 'withParents', 'withKids', 'withFriends', 'solo'];
const HASHTAG_GROUPS = [...themeGroups].sort(
  (a, b) => Number(HASHTAG_FIRST.includes(b.id)) - Number(HASHTAG_FIRST.includes(a.id)),
);
// 직접 받은 식당·카페 목록을 쓰는 버튼
const FOOD = { foodRestaurant: 'restaurant', foodCafe: 'cafe' };
const TRENDS = ['openRun', 'limited', 'rising'];

const hashtags = (place, t) =>
  HASHTAG_GROUPS.filter((g) => g.tags.some((tag) => place.tags?.includes(tag)))
    .slice(0, 3)
    .map((g) => `#${t.tags[g.id].split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`);

function useLoaded(loader, enabled) {
  const [state, setState] = useState({ list: null, failed: false });
  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    loader()
      .then((list) => !cancelled && setState({ list, failed: false }))
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setState({ list: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [loader, enabled]);
  return state;
}

// 보이는 범위 안의 곳을 가까운 순으로. 기준은 현재 위치, 지도를 직접 움직였으면 지도 가운데.
// 좌표가 없는 곳은 뒤에 붙인다.
function arrange(items, view, here) {
  const located = items.filter((i) => i.lat && i.lng);
  const rest = items.filter((i) => !(i.lat && i.lng));
  const origin = view?.moved ? view : here;
  const shrink = Math.cos((origin.lat * Math.PI) / 180);
  const distance = (i) => (i.lat - origin.lat) ** 2 + ((i.lng - origin.lng) * shrink) ** 2;
  if (!view) {
    return { list: [...located.sort((a, b) => distance(a) - distance(b)), ...rest], visible: located.length };
  }
  const inView = located
    .filter((i) => i.lat >= view.south && i.lat <= view.north && i.lng >= view.west && i.lng <= view.east)
    .sort((a, b) => distance(a) - distance(b));
  return { list: [...inView, ...rest], visible: inView.length };
}

function Card({ item, number, active, onOpen }) {
  const Box = item.open ? 'button' : 'div';
  const press = item.open ? { type: 'button', onClick: onOpen } : {};
  return (
    <Box className={active ? 'browse-card is-active' : 'browse-card'} {...press}>
      <span className="browse-photo">
        {item.photo && <img className={item.credit ? 'is-whole' : undefined} src={item.photo} alt="" />}
        {item.badge && <span className="browse-badge">{item.badge}</span>}
        {number && <span className="browse-number">{number}</span>}
        {item.photo && item.credit && <span className="browse-credit">{item.credit}</span>}
      </span>
      <span className="browse-text">
        <span className="browse-name" lang={item.nameLang}>
          {item.name}
        </span>
        <span className="browse-meta">{item.meta}</span>
        {item.tags && <span className="browse-tags">{item.tags.join('  ')}</span>}
      </span>
    </Box>
  );
}

export default function BrowseScreen({ lang, t, theme }) {
  const b = t.browse;
  const here = useCurrentLocation();
  const [button, setButton] = useState(DEFAULT_BUTTON);
  const [view, setView] = useState(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const isFood = button in FOOD;
  const group = themeGroups.find((g) => g.id === button);
  const places = useLoaded(loadPlaces, Boolean(group));
  const food = useLoaded(loadGourmet, isFood);
  const { events, failed: eventsFailed } = useCurrentEvents();

  const today = todayInKorea();
  const month = Number(today.slice(4, 6));
  const monthName = new Intl.DateTimeFormat(lang, { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2000, month - 1, 1)),
  );
  const label = (id) => {
    if (id === 'trend') return b.sns;
    if (id === 'month') return b.month.replace('{month}', monthName);
    return b.labels[id] ?? t.tags[id];
  };

  // 어떤 버튼이든 카드 모양 하나로 바꾼다
  const { items, notice } = useMemo(() => {
    const placeItem = (place) =>
      place.unknown
        ? { id: place.id, name: place.title, nameLang: 'ko', meta: t.themes.noInfo }
        : {
            id: place.id,
            name: place.title,
            nameLang: 'ko',
            lat: place.lat,
            lng: place.lng,
            photo: place.photo,
            credit: place.fromTourApi ? t.events.photoCredit : null,
            meta: [b.drive, place.region.at(-1)].filter(Boolean).join(' · '),
            tags: hashtags(place, t),
            open: { type: 'place', data: place },
          };

    if (button === 'trend') {
      return {
        items: TRENDS.map((id) => {
          const trend = t.home.trends[id];
          return { id, badge: trend.badge, name: trend.name, meta: trend.where };
        }),
        notice: null,
      };
    }

    if (button === 'month') {
      const end = rangeEnd('month', today);
      const monthEvents = (events ?? [])
        .filter((e) => e.start <= end && e.photo) // 사진 있는 곳만
        .map((e) => ({
          id: `event:${e.id}`,
          name: e.title,
          nameLang: 'ko',
          lat: e.lat,
          lng: e.lng,
          photo: e.photo,
          credit: t.events.photoCredit,
          badge: e.start <= today ? t.events.ongoing : t.events.upcoming,
          meta: formatPeriod(e, lang),
          open: { type: 'event', data: e },
        }));
      const season = (seasonal[month] ?? []).map((item) => ({
        id: `season:${item.name.ko}`,
        badge: t.events.seasonalTitle,
        name: item.name[lang] ?? item.name.ko,
        meta: item.note?.[lang] ?? item.note?.ko,
      }));
      if (season.length === 0) {
        season.push({ id: 'season:empty', badge: t.events.seasonalTitle, name: t.events.seasonalEmpty });
      }
      let message = null;
      if (eventsFailed) message = t.events.loadError;
      else if (events === null) message = t.events.loading;
      else if (monthEvents.length === 0) message = t.events.none;
      return { items: [...monthEvents, ...season], notice: message };
    }

    const source = button in FOOD ? food : places;
    if (source.failed) return { items: [], notice: t.map.loadError };
    if (!source.list) return { items: [], notice: t.map.loading };
    const tags = themeGroups.find((g) => g.id === button)?.tags;
    const matched = (
      tags
        ? source.list.filter((p) => CATEGORIES.has(p.category) && tags.some((tag) => p.tags.includes(tag)))
        : source.list.filter((p) => p.group === FOOD[button])
    ).filter((p) => p.photo); // 사진 있는 곳만
    const sorted = [...matched].sort((x, y) => x.title.localeCompare(y.title, 'ko'));
    return { items: sorted.map(placeItem), notice: sorted.length === 0 ? t.themes.empty : null };
  }, [button, places, food, events, eventsFailed, today, month, lang, t, b]);

  const { list, visible } = useMemo(() => arrange(items, view, here), [items, view, here]);
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const first = current * PAGE_SIZE;
  const shown = useMemo(() => list.slice(first, first + PAGE_SIZE), [list, first]);

  const pins = useMemo(() => {
    const located = shown.filter((i) => i.lat && i.lng);
    const activeId = located.some((i) => i.id === selected?.id) ? selected.id : located[0]?.id;
    return located.map((i, index) => ({
      id: i.id,
      number: index + 1,
      lat: i.lat,
      lng: i.lng,
      active: i.id === activeId,
    }));
  }, [shown, selected]);

  // 지도를 움직이면 첫 쪽부터 다시
  const handleView = useCallback((next) => {
    setView(next);
    setPage(0);
  }, []);
  const handlePick = useCallback((id) => setSelected(items.find((i) => i.id === id) ?? null), [items]);

  function choose(id) {
    setButton(id);
    setPage(0);
    setSelected(null);
  }

  let order = null;
  if (view && first < visible) {
    order = (view.moved ? b.order : b.orderHere)
      .replace('{from}', first + 1)
      .replace('{to}', Math.min(first + PAGE_SIZE, visible));
  } else if (view && shown.length > 0 && shown.some((i) => i.open)) {
    order = b.noLocation;
  }

  const close = () => setSelected(null);

  return (
    <div className="browse">
      <div className="filters">
        {browseButtons.map((ids, index) => (
          <Fragment key={ids.join()}>
            {index > 0 && <span className="filter-divider" />}
            {ids.map((id) => (
              <button
                key={id}
                type="button"
                className="filter-button"
                aria-pressed={button === id}
                onClick={() => choose(id)}
              >
                {label(id)}
              </button>
            ))}
          </Fragment>
        ))}
      </div>

      <section className="card map-area">
        <BrowseMap
          pins={pins}
          me={here}
          level={NEARBY_MAP_LEVEL}
          onPick={handlePick}
          onView={handleView}
          theme={theme}
          errorText={t.map.mapError}
        />
        <p className="legend-chip map-hint">{b.hint}</p>
      </section>

      {selected?.open.type === 'place' ? (
        <PlacePanel place={selected.open.data} t={t} onClose={close} />
      ) : selected?.open.type === 'event' ? (
        <EventDetail event={selected.open.data} lang={lang} t={t} onClose={close} />
      ) : (
        <div className="browse-side">
          {notice && (
            <p className="browse-notice" role="status">
              {notice}
            </p>
          )}
          {!notice && view && shown.length === 0 && (
            <p className="browse-notice" role="status">
              {b.noneInView}
            </p>
          )}
          <ul className="browse-grid">
            {shown.map((item) => {
              const pin = pins.find((p) => p.id === item.id);
              return (
                <li key={item.id}>
                  <Card item={item} number={pin?.number} active={pin?.active} onOpen={() => setSelected(item)} />
                </li>
              );
            })}
          </ul>
          <div className="browse-pager">
            <p className="browse-summary">
              {[view && items.some((i) => i.lat) && b.visible.replace('{n}', visible.toLocaleString()), order].filter(Boolean).join(' · ')}
            </p>
            <button
              type="button"
              className="pill-button"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              {b.prev}
            </button>
            <button
              type="button"
              className="pill-button pill-primary"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
            >
              {b.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
