import { useCallback, useMemo, useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import { courseFilters, courses, DEFAULT_FILTER } from '../data/courses.js';

const noop = () => {};

// 코스를 아직 안 적었을 때 보여줄 [ ] 자리
function placeholders(c) {
  const text = (ko) => ({ ko });
  const stops = Array.from({ length: 6 }, () => ({
    name: text(c.stopName),
    note: text(c.stopNote),
    stay: text(c.stay),
  }));
  return Array.from({ length: 4 }, (_, i) => ({
    id: `empty-${i}`,
    name: text(c.name),
    summary: text(c.summary),
    kind: text(c.kind),
    description: text(c.description),
    stops,
  }));
}

export default function CourseScreen({ lang, t, theme }) {
  const c = t.course;
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [courseId, setCourseId] = useState(null);
  const [stopIndex, setStopIndex] = useState(0);

  const isEmpty = courses.length === 0;
  const list = useMemo(() => {
    if (isEmpty) return placeholders(c);
    return filter === 'all' ? courses : courses.filter((course) => course.filters.includes(filter));
  }, [isEmpty, filter, c]);
  const course = list.find((item) => item.id === courseId) ?? list[0];
  const text = (value) => value?.[lang] ?? value?.ko;

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
  const pickStop = useCallback((index) => setStopIndex(index), []);

  const filterName = filter === 'all' ? '' : c.filters[filter];
  const count = c.count.replace('{filter}', filterName).replace('{n}', isEmpty ? '[N]' : list.length).trim();

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
                setCourseId(null);
                setStopIndex(0);
              }}
            >
              {c.filters[id]}
            </button>
          ))}
        </div>
        <p className="course-count">{count}</p>
        <ul className="course-list">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="course-card"
                aria-pressed={item.id === course.id}
                onClick={() => {
                  setCourseId(item.id);
                  setStopIndex(0);
                }}
              >
                <span className="course-name">{text(item.name)}</span>
                <span className="course-summary">{text(item.summary)}</span>
                <span className="course-kind">{text(item.kind)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section className="card map-area">
        <BrowseMap pins={pins} path onPick={pickStop} onView={noop} theme={theme} errorText={t.map.mapError} />
        <p className="legend-chip course-hint">{c.hint}</p>
      </section>

      <aside className="card course-panel">
        {course ? (
          <>
            <h2>{text(course.name)}</h2>
            <p className="course-description">{text(course.description)}</p>
            <ol className="stop-list">
              {course.stops.map((stop, index) => (
                <li key={index}>
                  {index > 0 && <p className="stop-drive">{t.browse.drive}</p>}
                  <button
                    type="button"
                    className="stop-row"
                    aria-pressed={index === stopIndex}
                    onClick={() => setStopIndex(index)}
                  >
                    <span className="stop-number">{index + 1}</span>
                    <span className="stop-text">
                      <span className="stop-name">{text(stop.name)}</span>
                      <span className="stop-note">{text(stop.note)}</span>
                    </span>
                    <span className="stop-note">{text(stop.stay)}</span>
                  </button>
                </li>
              ))}
            </ol>
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
