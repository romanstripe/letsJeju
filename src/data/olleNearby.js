// "둘러보기"의 올레길: 코스마다 지금 위치에서 가장 가까운 지점에서 시작하는 1시간 구간 하나.
// 시작점은 courses.js 의 이름 있는 지점, 선은 olleRoutes.js 의 경로를 따라 자른다.
import { courses } from './courses.js';
import { olleRoutes } from './olleRoutes.js';

const HOURS = 1;
const meters = (a, b) => Math.hypot((a[0] - b[0]) * 111000, (a[1] - b[1]) * 93000);

// 경로 조각들을 점 연결망으로. 조각 끝이 조금 떨어져 있으면 이어 준다.
function graph(segments, gap = 150) {
  const points = [];
  const index = new Map();
  const links = [];
  const node = (p) => {
    const key = p.join(',');
    if (!index.has(key)) {
      index.set(key, points.length);
      points.push(p);
      links.push([]);
    }
    return index.get(key);
  };
  const link = (a, b) => {
    if (a === b) return;
    const length = meters(points[a], points[b]);
    links[a].push([b, length]);
    links[b].push([a, length]);
  };
  const ends = [];
  for (const segment of segments) {
    const ids = segment.map(node);
    ids.slice(1).forEach((id, i) => link(ids[i], id));
    ends.push(ids[0], ids.at(-1));
  }
  for (const end of ends) {
    points.forEach((p, other) => {
      if (other !== end && meters(points[end], p) < gap) link(end, other);
    });
  }
  return { points, links };
}

const nearest = ({ points }, p) =>
  points.reduce((best, q, i) => (meters(q, p) < meters(points[best], p) ? i : best), 0);

// 두 점 사이의 가장 짧은 길 (점이 수백 개라 단순한 방법으로 충분)
function walk({ links }, from, to) {
  const cost = new Map([[from, 0]]);
  const back = new Map();
  const done = new Set();
  while (!done.has(to)) {
    let here;
    for (const [id, value] of cost) if (!done.has(id) && (here === undefined || value < cost.get(here))) here = id;
    if (here === undefined) return [];
    done.add(here);
    for (const [next, length] of links[here]) {
      const value = cost.get(here) + length;
      if (!cost.has(next) || value < cost.get(next)) {
        cost.set(next, value);
        back.set(next, here);
      }
    }
  }
  const path = [to];
  while (path[0] !== from) path.unshift(back.get(path[0]));
  return path;
}

// 코스 지점을 order 순서로 따라가며 limit(m)만큼 자른다
function cut(net, stops, order, limit) {
  const line = [net.points[nearest(net, [stops[order[0]].lat, stops[order[0]].lng])]];
  let length = 0;
  for (let i = 1; i < order.length && length < limit; i++) {
    const [a, b] = [stops[order[i - 1]], stops[order[i]]].map((s) => nearest(net, [s.lat, s.lng]));
    const path = walk(net, a, b);
    if (path.length === 0) break; // 선이 끊긴 곳은 건너뛰지 않는다
    for (const id of path.slice(1)) {
      const step = meters(line.at(-1), net.points[id]);
      if (length + step > limit) {
        const ratio = (limit - length) / step;
        line.push(line.at(-1).map((v, axis) => v + (net.points[id][axis] - v) * ratio));
        return { line, length: limit };
      }
      line.push(net.points[id]);
      length += step;
    }
  }
  return { line, length };
}

function section(course, here) {
  const route = olleRoutes[course.id];
  if (!route || !course.trail) return null;
  const net = graph(route.segments);
  // 경로 선에서 200m 안에 있는 지점만 시작점이 될 수 있다
  const stops = course.stops.filter(
    (s) => s.lat && s.lng && meters(net.points[nearest(net, [s.lat, s.lng])], [s.lat, s.lng]) < 200,
  );
  if (stops.length < 2) return null;
  const hours = course.trail.hours.split('~').map(Number);
  // 1시간에 걷는 거리 = 공식 거리 / 공식 소요 시간의 가운데 값
  const limit = (parseFloat(course.trail.km) * 1000 * HOURS) / (hours.reduce((a, b) => a + b, 0) / hours.length);
  const from = [here.lat, here.lng];
  const distances = stops.map((s) => meters([s.lat, s.lng], from));
  const start = distances.indexOf(Math.min(...distances));
  const indices = stops.map((_, i) => i);
  // 가는 방향으로 자르고, 끝에 가까워 모자라면 반대 방향
  let result = cut(net, stops, indices.slice(start), limit);
  if (result.length < limit * 0.8) {
    const reversed = cut(net, stops, indices.slice(0, start + 1).reverse(), limit);
    if (reversed.length > result.length) result = reversed;
  }
  const stop = stops[start];
  return {
    id: `olle-section:${course.id}`,
    number: course.name.ko.match(/(\d+)코스/)?.[1],
    // "안덕계곡 구간" 같은 이름은 장소 이름만
    start: stop.name.ko.split(',')[0].replace(/ (구간|부근|주변)$/, ''),
    km: course.trail.km,
    official: route.source === 'trail',
    photo: stop.photo,
    lat: result.line[0][0],
    lng: result.line[0][1],
    line: result.line,
    distance: distances[start],
  };
}

// 가까운 순
export const olleSections = (here) =>
  courses
    .map((course) => section(course, here))
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);
