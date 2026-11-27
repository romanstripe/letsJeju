import { useCallback, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import Icon from '../components/Icon.jsx';
import Thumb, { isWholePhoto } from '../components/Thumb.jsx';
import { courseFilters, courses, DEFAULT_FILTER } from '../data/courses.js';
import { olleRoutes } from '../data/olleRoutes.js';

const noop = () => {};

// 분 → "1시간 20분"
function duration(total, c) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && c.hour.replace('{n}', h), m && c.minute.replace('{n}', m)].filter(Boolean).join(' ');
}

// 목록 카드와 큰 사진 위에 쓰는 한 줄
function kind(course, c) {
  if (course.trail) {
    const { km, hours, level } = course.trail;
    return c.trail.replace('{km}', km).replace('{hours}', hours).replace('{level}', c.levels[level]);
  }
  return [course.minutes && duration(course.minutes, c), c.places.replace('{n}', course.stops.length)]
    .filter(Boolean)
    .join(', ');
}

const cover = (course) => course.stops.find((stop) => stop.photo)?.photo;

export default function CourseScreen({ lang, t, theme }) {
  const c = t.course;
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [courseId, setCourseId] = useState(null);
  const [stopIndex, setStopIndex] = useState(0);
  const [info, setInfo] = useState(false);

  const list = courses.filter((course) => course.filters.includes(filter));
  const course = courses.find((item) => item.id === courseId && item.filters.includes(filter)) ?? list[0];
  // 코스 내용은 아직 한국어만 있어서, 없는 언어는 ko 를 보여주고 글꼴도 ko 로
  const text = (value) => value?.[lang] ?? value?.ko;
  const textLang = (value) => (value?.[lang] ? lang : 'ko');
  const words = (Tag, value, className) => (
    <Tag className={className} lang={textLang(value)}>
      {text(value)}
    </Tag>
  );

  // 좌표가 없는 지점은 핀을 빼되 번호는 그대로
  const pins = useMemo(
    () =>
      (course?.stops ?? [])
        .map((stop, index) => ({
          id: index,
          number: index + 1,
          lat: stop.lat,
          lng: stop.lng,
          photo: stop.photo,
          active: index === stopIndex,
        }))
        .filter((pin) => pin.lat && pin.lng),
    [course, stopIndex],
  );
  const route = course && olleRoutes[course.id];
  const pickStop = useCallback((index) => setStopIndex(index), []);

  function choose(id) {
    setCourseId(id);
    setStopIndex(0);
    setInfo(false);
  }

  const photo = course && cover(course);
  // 이 코스에 쓴 사진의 출처 (i 안에 보여준다)
  const credits = [
    ...new Set(
      (course?.stops ?? [])
        .filter((stop) => stop.photo)
        .map((stop) => (isWholePhoto(stop.photo) ? t.events.photoCredit : t.events.visitCredit)),
    ),
  ];

  return (
    <div className="course">
      <div className="course-left">
        <div className="tabs">
          {courseFilters.map((id) => (
            <button
              key={id}
              type="button"
              className="tab"
              aria-pressed={filter === id}
              onClick={() => {
                setFilter(id);
                choose(null);
              }}
            >
              {c.filters[id]}
            </button>
          ))}
        </div>
        <ul className="course-list">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="course-card"
                aria-pressed={item.id === course.id}
                onClick={() => choose(item.id)}
              >
                <Thumb photo={cover(item)} className="thumb-cover" />
                <span className="course-text">
                  {words('span', item.name, 'course-name')}
                  <span className="course-kind">{kind(item, c)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section className="card map-area">
        <BrowseMap
          pins={pins}
          path={!route}
          lines={route?.segments}
          onPick={pickStop}
          onView={noop}
          theme={theme}
          errorText={t.map.mapError}
        />
        {/* OpenStreetMap 경로는 출처를 표시해야 한다 */}
        {route && <p className="legend-chip course-source">{route.source === 'trail' ? c.routeTrail : c.routeWalk}</p>}
      </section>

      <aside className="card course-panel">
        {course ? (
          <>
            <header className="course-hero">
              {photo && <img className={isWholePhoto(photo) ? 'is-whole' : undefined} src={photo} alt="" />}
              <div className="course-hero-text">
                {words('h2', course.name)}
                <p>{kind(course, c)}</p>
              </div>
            </header>
            <div className="course-scroll" key={`${course.id}-${info}`}>
              {info ? (
                <div className="course-info">
                  {course.tip && (
                    <p>
                      <strong>{c.tip}</strong>
                      <span lang={textLang(course.tip)}>{text(course.tip)}</span>
                    </p>
                  )}
                  <p>{c.notice}</p>
                  {credits.map((credit) => (
                    <p key={credit} className="course-credit">
                      {credit}
                    </p>
                  ))}
                </div>
              ) : (
                <ol className="stop-list">
                  {course.stops.map((stop, index) => (
                    <li key={index}>
                      {/* 이동 수단은 아이콘으로, 시간이 있으면 함께 */}
                      {stop.move && (
                        <p className="stop-drive">
                          <Icon name={stop.move.mode} size={16} />
                          <span className="sr-only">{c.modes[stop.move.mode]}</span>
                          {stop.move.minutes && <span>{duration(stop.move.minutes, c)}</span>}
                        </p>
                      )}
                      <button
                        type="button"
                        className="stop-row"
                        aria-pressed={index === stopIndex}
                        onClick={() => setStopIndex(index)}
                      >
                        <Thumb photo={stop.photo} className="thumb-stop">
                          <b>{index + 1}</b>
                        </Thumb>
                        {words('span', stop.name, 'stop-name')}
                        <span className="stop-stay">{duration(stop.stay, c)}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="course-actions">
              {/* 출발하면 "지금 여기"에 이어지는 동작은 아직 없다 */}
              <button type="button" className="course-start" disabled>
                {c.start}
              </button>
              <button
                type="button"
                className="course-info-button"
                aria-label={c.info}
                aria-pressed={info}
                onClick={() => setInfo(!info)}
              >
                i
              </button>
            </div>
          </>
        ) : (
          <p className="panel-empty">{c.empty}</p>
        )}
      </aside>
    </div>
  );
}
