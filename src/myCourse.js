// "내 코스": 승객이 추천 코스를 고르거나 둘러보며 담은 곳의 순서 목록.
// 화면을 새로 고치면 지워진다 (다음 승객에게 남지 않게 저장하지 않는다).
// 장소 하나: { id, name(한국어), lat, lng, photo }. 좌표가 없으면 lat, lng 는 비어 있다.
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const MyCourse = createContext({ stops: [], name: null, has: () => false, add: () => {}, start: () => {}, remove: () => {}, shift: () => {} });

const NOTICE_MS = 8000;
const located = (stop) => Boolean(stop?.lat && stop?.lng);
const distance = (a, b) => Math.hypot((a.lat - b.lat) * 111, (a.lng - b.lng) * 93); // km 어림
// 같은 곳이 다른 출처(추천 코스, 비짓제주)로 두 번 들어가지 않게 이름으로 비교
const sameName = (name) => name.replace(/\s/g, '');

// 덜 돌아가는 자리: 이웃한 두 곳 사이에 끼웠을 때 늘어나는 직선거리가 가장 작은 곳.
// 첫 곳 앞은 현재 위치(origin)와의 사이로 본다. 좌표가 없는 곳은 맨 끝.
export function insertIndex(origin, stops, stop) {
  if (!located(stop)) return stops.length;
  let best = stops.length;
  let bestCost = Infinity;
  for (let i = 0; i <= stops.length; i += 1) {
    const before = stops.slice(0, i).findLast(located) ?? origin;
    const after = stops.slice(i).find(located);
    const cost = after
      ? distance(before, stop) + distance(stop, after) - distance(before, after)
      : distance(before, stop);
    // 좌표 없는 곳 때문에 비용이 같으면 뒤쪽 자리를 고른다
    if (cost <= bestCost) {
      best = i;
      bestCost = cost;
    }
  }
  return best;
}

export function useMyCourse(origin) {
  const [stops, setStops] = useState([]);
  const [name, setName] = useState(null); // 출발한 추천 코스 이름. 직접 담아 만든 코스는 null
  // { type: 'added', id } | { type: 'started' }
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const has = useCallback((name) => stops.some((s) => sameName(s.name) === sameName(name)), [stops]);

  const add = useCallback(
    (stop) => {
      if (has(stop.name)) return;
      setStops(stops.toSpliced(insertIndex(origin, stops, stop), 0, stop));
      setNotice({ type: 'added', id: stop.id });
    },
    [origin, stops, has],
  );

  // 추천 코스로 출발: 코스를 바꾸되, 직접 담은 곳은 남겨서 덜 돌아가는 자리에 다시 끼운다
  const start = useCallback(
    (courseStops, courseName) => {
      setName(courseName);
      const names = new Set(courseStops.map((stop) => sameName(stop.name)));
      const own = stops.filter((stop) => !stop.fromCourse && !names.has(sameName(stop.name)));
      setStops(
        own.reduce(
          (list, stop) => list.toSpliced(insertIndex(origin, list, stop), 0, stop),
          courseStops.map((stop) => ({ ...stop, fromCourse: true })),
        ),
      );
      setNotice({ type: 'started' });
    },
    [origin, stops],
  );

  const remove = useCallback(
    (id) => {
      const rest = stops.filter((stop) => stop.id !== id);
      setStops(rest);
      if (!rest.length) setName(null);
    },
    [stops],
  );

  // 위(-1)나 아래(1)로 한 칸
  const shift = useCallback(
    (id, step) => {
      const from = stops.findIndex((stop) => stop.id === id);
      const to = from + step;
      if (from < 0 || to < 0 || to >= stops.length) return;
      setStops(stops.toSpliced(from, 1).toSpliced(to, 0, stops[from]));
    },
    [stops],
  );

  const actions = useMemo(
    () => ({ stops, name, has, add, start, remove, shift }),
    [stops, name, has, add, start, remove, shift],
  );
  return { stops, notice, actions, close: () => setNotice(null) };
}
