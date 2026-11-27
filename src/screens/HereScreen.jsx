import { useCallback, useContext, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import Icon from '../components/Icon.jsx';
import NarrationCard from '../components/NarrationCard.jsx';
import Thumb from '../components/Thumb.jsx';
import { NARRATION_RADIUS_M, NEARBY_MAP_LEVEL } from '../config.js';
import { narrations } from '../data/narrations.js';
import { useCurrentLocation } from '../location.js';
import { MyCourse } from '../myCourse.js';

const noop = () => {};

// 두 좌표 사이의 대략적인 거리(m). 제주 안에서만 쓰므로 평면으로 어림한다.
const meters = (a, b) => Math.hypot((a.lat - b.lat) * 111_000, (a.lng - b.lng) * 93_000);

// 반경 안에서 가장 가까운 설명 장소. 없으면 undefined
const nearby = (point) =>
  narrations
    .filter((place) => meters(point, place) <= NARRATION_RADIUS_M)
    .sort((a, b) => meters(point, a) - meters(point, b))[0];

// 담은 곳에 해당하는 설명: 이름이 같거나 300m 안. 없으면 undefined
const narrationFor = (stop) =>
  narrations.find((place) => place.name === stop.name || (stop.lat && meters(stop, place) <= 300));

// 실제 GPS 는 아직 없다. 지도를 누르면 그곳을 현재 위치로 보고, 근처에 설명 장소가 있으면 자동으로 튼다.
// 지도 핀이나 목록에서 장소를 누르면 바로 그곳에 도착한 것으로 본다.
export default function HereScreen({ t, theme }) {
  const h = t.here;
  const m = t.myCourse;
  const here = useCurrentLocation();
  const { stops, name: courseName, remove, shift } = useContext(MyCourse);
  const [arrivedId, setArrivedId] = useState(null);
  const [spot, setSpot] = useState(null); // 눌러서 만든 가상 위치
  const [editing, setEditing] = useState(false);

  const hasCourse = stops.length > 0;
  // 아직 도착한 곳이 없으면 코스에서 설명이 있는 첫 곳을 보여준다
  const first = stops.map(narrationFor).find(Boolean) ?? narrations[0];
  const place = narrations.find((item) => item.id === arrivedId) ?? first;
  const index = narrations.indexOf(place);
  // 담은 코스가 있으면 그 순서대로, 없으면 설명이 있는 곳을 지금 장소 다음부터
  const list = hasCourse ? stops : [...narrations.slice(index + 1), ...narrations.slice(0, index)];
  const ownCount = stops.filter((stop) => !stop.fromCourse).length;

  const pins = useMemo(() => {
    if (!stops.length) {
      return narrations.map(({ id, lat, lng, photo }, i) => ({ id, number: i + 1, lat, lng, photo, active: id === place.id }));
    }
    // 좌표가 없는 곳은 핀을 빼되 번호는 그대로
    return stops
      .map(({ id, lat, lng, photo, ...stop }, i) => ({
        id,
        number: i + 1,
        lat,
        lng,
        photo,
        active: narrationFor({ ...stop, lat, lng })?.id === place.id,
      }))
      .filter((pin) => pin.lat && pin.lng);
  }, [stops, place.id]);

  const arrive = useCallback((id) => {
    setArrivedId(id);
    setSpot(narrations.find((item) => item.id === id));
  }, []);
  // 근처에 장소가 없으면 위치만 옮기고, 듣던 설명은 그대로 둔다
  const moveTo = useCallback((point) => {
    setSpot(point);
    const found = nearby(point);
    if (found) setArrivedId(found.id);
  }, []);
  // 설명이 있으면 도착한 것으로 보고 틀고, 없으면 위치만 옮긴다
  const visit = useCallback(
    (stop) => {
      const found = narrationFor(stop);
      if (found) arrive(found.id);
      else if (stop.lat && stop.lng) setSpot({ lat: stop.lat, lng: stop.lng });
    },
    [arrive],
  );
  const pick = useCallback(
    (id) => {
      const stop = stops.find((item) => item.id === id);
      if (stop) visit(stop);
      else arrive(id);
    },
    [stops, visit, arrive],
  );

  return (
    <div className="here">
      <section className="card map-area">
        <BrowseMap
          pins={pins}
          path={hasCourse}
          me={spot ?? here}
          level={NEARBY_MAP_LEVEL}
          onMapClick={moveTo}
          onPick={pick}
          onView={noop}
          theme={theme}
          errorText={t.map.mapError}
        />
      </section>

      <div className="here-side">
        <NarrationCard key={arrivedId ?? 'first'} place={place} t={t} autoPlay={arrivedId !== null} />
        <section className="card next-card">
          {hasCourse ? (
            <header className="my-course-head">
              <div>
                <h2 className="my-course-name" lang={courseName ? 'ko' : undefined}>
                  {courseName ?? m.mine}
                </h2>
                <p className="next-status">
                  {m.count.replace('{n}', stops.length)}
                  {courseName && ownCount > 0 && ` · ${m.ownCount.replace('{n}', ownCount)}`}
                </p>
              </div>
              <button type="button" className="my-course-edit" aria-pressed={editing} onClick={() => setEditing(!editing)}>
                {editing ? m.done : m.edit}
              </button>
            </header>
          ) : (
            <h2>{h.nextTitle}</h2>
          )}
          <ul className="next-list">
            {list.map((item, i) => (
              <li key={item.id} className="next-item">
                <button type="button" className="next-row" onClick={() => visit(item)}>
                  <Thumb photo={item.photo} className="thumb-large">
                    {hasCourse && <b className="next-number">{i + 1}</b>}
                  </Thumb>
                  <span className="next-text">
                    <span className="next-name" lang="ko">
                      {item.name}
                    </span>
                    <span className="next-status">
                      {hasCourse && courseName && !item.fromCourse && <span className="next-own">{m.own}</span>}
                      {narrationFor(item) ? h.status.ready : h.status.none}
                    </span>
                  </span>
                  {!editing && (
                    <span className="drive-time">
                      <Icon name="car" size={16} />
                      <span className="sr-only">{t.course.modes.car}</span>
                      {h.minutes}
                    </span>
                  )}
                </button>
                {hasCourse && editing && (
                  <span className="next-tools">
                    <button type="button" aria-label={m.up} disabled={i === 0} onClick={() => shift(item.id, -1)}>
                      ↑
                    </button>
                    <button type="button" aria-label={m.down} disabled={i === list.length - 1} onClick={() => shift(item.id, 1)}>
                      ↓
                    </button>
                    <button type="button" aria-label={m.remove} onClick={() => remove(item.id)}>
                      <Icon name="close" size={18} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
