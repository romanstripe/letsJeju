// "둘러보기"의 올레길: 코스마다 지금 위치에서 가장 가까운 경로 지점에서 시작하는 1시간 구간 하나.
// 코스 번호와 상관없이 가까운 순. 거리는 직선거리다.
import { courses } from './courses.js';
import { olleCourses } from './olleCourses.js';
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

// from 에서 걸어서 limit(m)만큼 가는 길. 가장 먼저 limit 을 넘는 점까지의 최단 경로를 잘라 만든다.
// 경로가 그보다 짧으면 가장 먼 곳까지.
function stretch({ points, links }, from, limit) {
  const cost = new Map([[from, 0]]);
  const back = new Map();
  const done = new Set();
  let target = from;
  for (;;) {
    let here;
    for (const [id, value] of cost) if (!done.has(id) && (here === undefined || value < cost.get(here))) here = id;
    if (here === undefined) break;
    done.add(here);
    target = here; // 꺼내는 순서가 가까운 순이라 마지막이 가장 멀다
    if (cost.get(here) >= limit) break;
    for (const [next, length] of links[here]) {
      const value = cost.get(here) + length;
      if (!cost.has(next) || value < cost.get(next)) {
        cost.set(next, value);
        back.set(next, here);
      }
    }
  }
  const path = [target];
  while (path[0] !== from) path.unshift(back.get(path[0]));

  const line = [points[from]];
  let length = 0;
  for (const id of path.slice(1)) {
    const step = meters(line.at(-1), points[id]);
    if (length + step > limit) {
      const ratio = (limit - length) / step;
      line.push(line.at(-1).map((v, axis) => v + (points[id][axis] - v) * ratio));
      break;
    }
    line.push(points[id]);
    length += step;
  }
  return { line, length };
}

// 1, 6, 7, 9, 21 코스의 선은 추천 코스에서 쓰는 것(olleRoutes)
const savedRoute = (number) => {
  const course = courses.find((c) => c.trail && c.name.ko.match(/(\d+)코스/)?.[1] === number);
  return course && olleRoutes[course.id];
};

// 선은 위치와 상관없으므로 한 번만 만든다
let nets;
function networks() {
  nets ??= olleCourses.map((course) => {
    const route = course.segments ? { segments: course.segments, source: 'trail' } : savedRoute(course.number);
    return { course, official: route.source === 'trail', net: graph(route.segments) };
  });
  return nets;
}

// 가까운 점부터 보면서 구간이 충분히 나오는 첫 시작점을 고른다 (선이 끊긴 짧은 조각은 건너뛴다)
function fromNearest(net, from, limit) {
  const order = net.points.map((point, id) => [id, meters(point, from)]).sort((a, b) => a[1] - b[1]);
  for (const [start, distance] of order) {
    const result = stretch(net, start, limit);
    if (result.length >= limit * 0.8) return { line: result.line, distance };
  }
  const [start, distance] = order[0];
  return { line: stretch(net, start, limit).line, distance };
}

function section({ course, official, net }, here) {
  const from = [here.lat, here.lng];
  // 1시간에 걷는 거리 = 공식 거리 / 공식 소요 시간의 가운데 값
  const limit = (course.km * 1000 * HOURS) / ((course.hours[0] + course.hours[1]) / 2);
  const { line, distance } = fromNearest(net, from, limit);
  return {
    id: `olle-section:${course.number}`,
    number: course.number,
    title: course.title,
    km: course.km,
    hours: course.hours.join('~'),
    official,
    photo: course.photo,
    lat: line[0][0],
    lng: line[0][1],
    line,
    distance,
  };
}

// 가까운 순
export const olleSections = (here) =>
  networks()
    .map((item) => section(item, here))
    .sort((a, b) => a.distance - b.distance);
