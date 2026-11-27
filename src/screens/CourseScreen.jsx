import { useCallback, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import Icon from '../components/Icon.jsx';
import { courseFilters, courses, DEFAULT_FILTER } from '../data/courses.js';
import { olleRoutes } from '../data/olleRoutes.js';

const noop = () => {};

// 분 → "1시간 20분"
function duration(total, c) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && c.hour.replace('{n}', h), m && c.minute.replace('{n}', m)].filter(Boolean).join(' ');
}

// 목록 카드의 마지막 줄
function kind(course, c) {
  if (course.trail) {
    const { km, hours, level } = course.trail;
    return c.trail.replace('{km}', km).replace('{hours}', hours).replace('{level}', c.levels[level]);
  }
  return [
    course.minutes && c.about.replace('{t}', duration(course.minutes, c)),
    c.places.replace('{n}', course.stops.length),
  ]
    .filter(Boolean)
    .join(', ');
}

export default function CourseScreen({ lang, t, theme }) {
  const c = t.course;
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [courseId, setCourseId] = useState(null);
  const [stopIndex, setStopIndex] = useState(0);

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
  }

  return (
    <div className="course">
      <div className="course-left">
        <div className="course-filters">
          {courseFilters.map((id) => (
            <button
              key={id}
              type="button"
              className="filter-button"
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
                {words('span', item.name, 'course-name')}
                {words('span', item.summary, 'course-summary')}
                <span className="course-kind">{kind(item, c)}</span>
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
        <p className="legend-chip course-hint">
          {route ? (route.source === 'trail' ? c.routeTrail : c.routeWalk) : c.hint}
        </p>
      </section>

      <aside className="card course-panel">
        {course ? (
          <>
            {words('h2', course.name)}
            <div className="course-scroll" key={course.id}>
              {course.tip && (
                <p className="course-tip">
                  <strong>{c.tip}</strong> <span lang={textLang(course.tip)}>{text(course.tip)}</span>
                </p>
              )}
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
                      <span className="stop-number">{index + 1}</span>
                      <span className="stop-text">
                        {words('span', stop.name, 'stop-name')}
                        <span className="stop-time">
                          {[
                            stop.time,
                            stop.withDrive ? c.withDrive.replace('{t}', duration(stop.stay, c)) : duration(stop.stay, c),
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="course-notice">{c.notice}</p>
            </div>
            {/* 출발하면 "지금 여기"에 이어지는 동작은 아직 없다 */}
            <button type="button" className="course-start" disabled>
              {c.start}
            </button>
          </>
        ) : (
          <p className="panel-empty">{c.empty}</p>
        )}
      </aside>
    </div>
  );
}
