import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import EventDetail from '../components/EventDetail.jsx';
import Icon from '../components/Icon.jsx';
import PlacePanel from '../components/PlacePanel.jsx';
import Thumb, { isWholePhoto } from '../components/Thumb.jsx';
import { NEARBY_MAP_LEVEL } from '../config.js';
import { browseButtons, DEFAULT_BUTTON, INDOOR_BUTTONS, NOT_ACTIVITY } from '../data/browseButtons.js';
import { formatPeriod, rangeEnd, todayInKorea, useCurrentEvents } from '../data/events.js';
import { loadGourmet, loadPlaces, loadTrends } from '../data/loadPlaces.js';
import { olleSections } from '../data/olleNearby.js';
import { seasonal } from '../data/seasonal.js';
import { themeGroups } from '../data/tagGroups.js';
import { useCurrentLocation } from '../location.js';

const PAGE_SIZE = 4;
const NOW_COUNT = 16; // "요즘 제주" 카드 수
const TREND_COUNT = 12;
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
const INDOOR_TAGS = themeGroups.find((g) => g.id === 'rainyDay').tags;

const hashtags = (place, t) =>
  HASHTAG_GROUPS.filter((g) => g.tags.some((tag) => place.tags?.includes(tag)))
    .slice(0, 3)
    .map((g) => `#${t.tags[g.id].split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`);

// 같은 장소가 없을 때 상세 패널에 보여줄 최소 정보. 사진과 소개글 대신 주소를 보여준다
const fromTrend = (trend) => ({
  id: `trend:${trend.name}`,
  category: /음식점|한식|분식|양식|일식|중식|카페|술집/.test(trend.category) ? 'c4' : /쇼핑/.test(trend.category) ? 'c2' : 'c1',
  title: trend.name,
  region: [trend.region],
  introduction: trend.address,
  tags: [],
  photo: trend.photo,
});

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

function Card({ item, number, active, onOpen, driveLabel }) {
  const Box = item.open ? 'button' : 'div';
  const press = item.open ? { type: 'button', onClick: onOpen } : {};
  return (
    <Box className={['browse-card', active && 'is-active', item.wrap && 'is-wrap'].filter(Boolean).join(' ')} {...press}>
      <Thumb photo={item.photo} className="browse-photo">
        {number && <span className="browse-number">{number}</span>}
        {item.badge && <span className="browse-badge">{item.badge}</span>}
        {item.drive && (
          <span className="browse-drive">
            <Icon name="car" size={16} />
            <span className="sr-only">{driveLabel}</span>
            {item.drive}
          </span>
        )}
        {isWholePhoto(item.photo) && <span className="browse-credit">{item.credit}</span>}
      </Thumb>
      <span className="browse-text">
        <span className="browse-name" lang={item.nameLang}>
          {item.name}
        </span>
        <span className="browse-meta">
          {item.meta}
          {item.tags?.length > 0 && <span className="browse-tags">{item.tags.join(' ')}</span>}
        </span>
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
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [olleId, setOlleId] = useState(null);

  const isFood = button in FOOD;
  const isOlle = button === 'olle';
  const isNow = button === 'now';
  const canIndoor = INDOOR_BUTTONS.includes(button);
  const indoor = indoorOnly && canIndoor;
  const group = themeGroups.find((g) => g.id === button);
  const places = useLoaded(loadPlaces, Boolean(group));
  const trendList = useLoaded(loadTrends, isNow);
  const food = useLoaded(loadGourmet, isFood);
  const { events, failed: eventsFailed } = useCurrentEvents();

  const today = todayInKorea();
  const month = Number(today.slice(4, 6));
  const label = (id) => (id === 'now' ? b.now : (b.labels[id] ?? t.tags[id]));

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
            drive: b.drive,
            meta: place.region.at(-1),
            tags: hashtags(place, t),
            open: { type: 'place', data: place },
          };

    // 요즘 제주: 마감이 가장 가까운 행사 1개, 트렌드 12곳, 제철, 남은 행사 순으로 16개까지
    if (button === 'now') {
      const end = rangeEnd('month', today);
      const monthEvents = (events ?? [])
        .filter((e) => e.start <= end && e.photo) // 사진 있는 곳만
        .sort((x, y) => x.end.localeCompare(y.end)) // 마감이 가까운 순
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
      // 트렌드 데이터가 없으면 [ ] 자리를 보여준다
      const trends = trendList.list?.length
        ? trendList.list.map((trend) => {
            const { place } = trend; // 저장 데이터에 같은 장소가 있으면 사진과 상세를 쓴다
            return {
              id: `trend:${trend.name}`,
              badge: trend.rising ? t.home.trends.rising.badge : b.talked,
              name: trend.name,
              nameLang: 'ko',
              meta: trend.region,
              lat: trend.lat,
              lng: trend.lng,
              photo: trend.photo ?? place?.photo,
              credit: !trend.photo && place?.fromTourApi ? t.events.photoCredit : null,
              open: {
                type: 'place',
                data: {
                  ...(place ?? fromTrend(trend)),
                  ...(trend.photo && { photo: trend.photo, fromTourApi: false }),
                  recommend: { sources: trend.sources, rising: trend.rising, menu: trend.menu },
                },
              },
            };
          })
        : TRENDS.map((id) => {
            const trend = t.home.trends[id];
            return { id, badge: trend.badge, name: trend.name, meta: trend.where };
          });
      let message = null;
      if (eventsFailed) message = t.events.loadError;
      else if (events === null) message = t.events.loading;
      // 행사가 없으면 따로 알리지 않고 제철과 장소만 보여준다
      // 행사와 제철로 16개가 안 되면 13위 아래 장소로 채운다
      const top = trends.slice(0, TREND_COUNT);
      const more = trends.slice(TREND_COUNT);
      const ordered = monthEvents.length
        ? [monthEvents[0], ...top, ...season, ...monthEvents.slice(1), ...more]
        : [...season, ...top, ...more];
      return { items: ordered.slice(0, NOW_COUNT), notice: message };
    }

    if (button === 'olle') {
      return {
        items: olleSections(here).map((section) => ({
          id: section.id,
          name: b.olleName.replace('{n}', section.number).replace('{start}', section.start),
          meta: b.olleMeta.replace('{km}', section.km),
          wrap: true,
          badge: section.official ? null : b.olleWalk,
          photo: section.photo,
          credit: t.events.photoCredit,
          lat: section.lat,
          lng: section.lng,
          line: section.line,
          open: { type: 'olle' },
        })),
        notice: null,
      };
    }

    const source = button in FOOD ? food : places;
    if (source.failed) return { items: [], notice: t.map.loadError };
    if (!source.list) return { items: [], notice: t.map.loading };
    const tags = themeGroups.find((g) => g.id === button)?.tags;
    const matched = (
      tags
        ? source.list.filter((p) => CATEGORIES.has(p.category) && tags.some((tag) => p.tags.includes(tag)))
        : source.list.filter((p) => p.group === FOOD[button])
    )
      .filter((p) => p.photo) // 사진 있는 곳만
      .filter((p) => button !== 'market' || p.category === 'c2') // 시장 안의 식당은 뺀다
      .filter((p) => button !== 'activity' || !NOT_ACTIVITY.has(p.id))
      .filter((p) => !indoor || INDOOR_TAGS.some((tag) => p.tags.includes(tag)));
    const sorted = [...matched].sort((x, y) => x.title.localeCompare(y.title, 'ko'));
    return { items: sorted.map(placeItem), notice: sorted.length === 0 ? t.themes.empty : null };
  }, [button, indoor, here, places, food, trendList, events, eventsFailed, today, month, lang, t, b]);

  // 올레(이미 가까운 순)와 요즘 제주(정한 순서)는 지도 범위와 상관없이 모두 그대로 보여준다
  const { list, visible } = useMemo(
    () => (isOlle || isNow ? { list: items, visible: items.length } : arrange(items, view, here)),
    [isOlle, isNow, items, view, here],
  );
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const first = current * PAGE_SIZE;
  const shown = useMemo(() => list.slice(first, first + PAGE_SIZE), [list, first]);

  // 고른 올레 구간(없으면 이 쪽의 첫 번째)에 지도를 맞춘다
  const activeOlle = isOlle ? (shown.find((i) => i.id === olleId) ?? shown[0]) : null;
  const sections = useMemo(
    () =>
      isOlle
        ? shown.map((i, index) => ({ id: i.id, number: index + 1, points: i.line, active: i.id === activeOlle?.id }))
        : undefined,
    [isOlle, shown, activeOlle],
  );

  const pins = useMemo(() => {
    if (isOlle) return [];
    const located = shown.filter((i) => i.lat && i.lng);
    const activeId = located.some((i) => i.id === selected?.id) ? selected.id : located[0]?.id;
    return located.map((i, index) => ({
      id: i.id,
      number: index + 1,
      lat: i.lat,
      lng: i.lng,
      photo: i.photo,
      active: i.id === activeId,
    }));
  }, [isOlle, shown, selected]);

  // 이번 쪽에 없는 나머지 곳은 지도에 숫자 묶음으로
  const others = useMemo(() => {
    if (isOlle) return undefined;
    const onPage = new Set(shown.map((i) => i.id));
    return list.slice(0, visible).filter((i) => !onPage.has(i.id) && i.lat && i.lng);
  }, [isOlle, list, visible, shown]);

  // 지도를 움직이면 첫 쪽부터 다시
  const handleView = useCallback((next) => {
    setView(next);
    setPage(0);
  }, []);
  const handlePick = useCallback(
    (id) => {
      const item = items.find((i) => i.id === id);
      if (item?.open?.type === 'olle') setOlleId(id);
      else setSelected(item?.open ? item : null); // 상세 정보가 없는 곳은 패널을 열지 않는다
    },
    [items],
  );

  function choose(id) {
    setButton(id);
    setPage(0);
    setSelected(null);
    setOlleId(null);
  }

  let order = null;
  if (isOlle) {
    order = b.olleOrder
      .replace('{from}', first + 1)
      .replace('{to}', Math.min(first + PAGE_SIZE, visible))
      .replace('{total}', visible);
  } else if (isNow) {
    order = null; // 가까운 순이 아니다
  } else if (view && first < visible) {
    order = (view.moved ? b.order : b.orderHere)
      .replace('{from}', first + 1)
      .replace('{to}', Math.min(first + PAGE_SIZE, visible))
      .replace('{total}', visible.toLocaleString());
  } else if (view && shown.some((i) => i.open)) {
    order = b.noLocation;
  }

  const close = () => setSelected(null);

  return (
    <div className="browse">
      <div className="tabs">
        {browseButtons.map((ids, index) => (
          <Fragment key={ids.join()}>
            {index > 0 && <span className="tab-divider" />}
            {ids.map((id) => (
              <button key={id} type="button" className="tab" aria-pressed={button === id} onClick={() => choose(id)}>
                {label(id)}
              </button>
            ))}
          </Fragment>
        ))}
      </div>

      <section className="card map-area">
        {/* 올레는 지도를 구간에 맞추므로 따로 만든다 (직접 움직인 상태가 다른 탭에 남지 않게) */}
        <BrowseMap
          key={isOlle ? 'olle' : isNow ? 'now' : 'places'}
          pins={pins}
          others={others}
          sections={sections}
          me={here}
          level={isNow ? undefined : NEARBY_MAP_LEVEL} // 요즘 제주는 섬 전체
          onPick={handlePick}
          onView={handleView}
          theme={theme}
          errorText={t.map.mapError}
        />
      </section>

      {selected?.open.type === 'place' ? (
        <PlacePanel place={selected.open.data} t={t} onClose={close} />
      ) : selected?.open.type === 'event' ? (
        <EventDetail event={selected.open.data} lang={lang} t={t} onClose={close} />
      ) : (
        <div className="browse-side">
          {/* 실내만: 쓸 수 있는 탭에서만, 안내 문구 자리에 */}
          {canIndoor && (
            <button
              type="button"
              className="indoor-toggle"
              aria-pressed={indoor}
              onClick={() => {
                setIndoorOnly(!indoorOnly);
                setPage(0);
              }}
            >
              {indoor ? b.indoorOn : b.indoorOnly}
            </button>
          )}
          {notice && (
            <p className="browse-notice" role="status">
              {notice}
            </p>
          )}
          {!notice && !isOlle && view && shown.length === 0 && (
            <p className="browse-notice" role="status">
              {b.noneInView}
            </p>
          )}
          <ul className="browse-grid">
            {shown.map((item) => {
              const pin = pins.find((p) => p.id === item.id);
              return (
                <li key={item.id}>
                  <Card
                    item={item}
                    number={isOlle ? shown.indexOf(item) + 1 : pin?.number}
                    active={isOlle ? item.id === activeOlle?.id : pin?.active}
                    driveLabel={t.course.modes.car}
                    onOpen={() => handlePick(item.id)}
                  />
                </li>
              );
            })}
          </ul>
          <div className="browse-pager">
            <p className="browse-summary">{order}</p>
            <button
              type="button"
              className="page-button"
              aria-label={b.prev}
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="page-button is-primary"
              aria-label={b.next}
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
