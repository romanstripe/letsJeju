import { useContext, useEffect, useRef, useState } from 'react';
import { MapSwitch } from '../mapSwitch.js';
import { loadKakao } from '../map/kakao.js';
import { DARK_MAP_FILTER } from '../config.js';

// 처음 화면: 제주 본섬이 지도 너비에 꽉 차게
const CENTER = { lat: 33.38, lng: 126.55 };
const LEVEL = 10;

// 오늘 기록의 핀: 들른 곳(물방울), 지나간 곳(고리), 못 간 곳(점선 고리)
function logImage(maps, kind) {
  const css = getComputedStyle(document.documentElement);
  const color = (name) => css.getPropertyValue(name).trim();
  const drop = kind === 'visited';
  const shape = drop
    ? `<path d="M22 50C14 41 6 31 6 20a16 16 0 0132 0c0 11-8 21-16 30z" fill="${color('--teal')}" stroke="${color('--card')}" stroke-width="3"/><circle cx="22" cy="20" r="6" fill="${color('--card')}"/>`
    : `<circle cx="22" cy="22" r="11" fill="${color('--card')}" stroke="${color(kind === 'passed' ? '--teal' : '--accent')}" stroke-width="4"${kind === 'missed' ? ' stroke-dasharray="5 4"' : ''}/>`;
  const height = drop ? 52 : 44;
  return new maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="${height}">${shape}</svg>`)}`,
    new maps.Size(44, height),
    { offset: new maps.Point(22, drop ? 50 : 22) },
  );
}

// 겹칠 때 비켜 볼 자리 [오른쪽, 위] (px)
const SHIFTS = [[0, 0], [32, 0], [-32, 0], [0, 40], [32, 40], [-32, 40], [64, 0], [-64, 0], [0, 80]];

// 번호 핀. 색은 CSS 변수에서 읽는다.
function pinImage(maps, number, active, [dx, dy] = [0, 0]) {
  const css = getComputedStyle(document.documentElement);
  const color = (name) => css.getPropertyValue(name).trim();
  const fill = color(active ? '--accent' : '--sub');
  const ink = color(active ? '--on-accent' : '--card');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="52"><path d="M22 50C14 41 6 31 6 20a16 16 0 0132 0c0 11-8 21-16 30z" fill="${fill}" stroke="${color('--card')}" stroke-width="3"/><text x="22" y="26" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="${ink}">${number}</text></svg>`;
  return new maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    new maps.Size(44, 52),
    { offset: new maps.Point(22 - dx, 50 + dy) },
  );
}

// pins: [{ id, number, lat, lng, active }]. 지도를 움직일 때마다 onView 로 보이는 범위를 알린다.
// path 를 주면 핀 순서대로 점선을 잇는다. 'solid' 면 실선이고 kind 가 'missed' 인 핀은 잇지 않는다.
// lines([[[lat, lng], ...], ...])를 주면 그 선을 그리고 거기에 맞춰 보여준다.
// 핀에 kind 가 있으면 번호 대신 기록용 모양, label 이 있으면 이름을 붙인다.
// me 를 주면 현재 위치를 표시하고 그곳을 중심으로 연다. 사용자가 지도를 직접 움직이면 moved 가 true.
// 지도를 꺼 두면 안쪽 컴포넌트를 만들지 않아서 카카오를 부르지 않는다
export default function BrowseMap(props) {
  const { on, offText } = useContext(MapSwitch);
  return on ? <KakaoMap {...props} /> : <p className="map-message map-off">{offText}</p>;
}

function KakaoMap({ pins, path = false, lines, me, level = LEVEL, onPick, onView, theme, errorText }) {
  const container = useRef(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [failed, setFailed] = useState(false);
  const initial = useRef({ center: me ?? CENTER, level });
  const moved = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const node = container.current;
    loadKakao()
      .then((maps) => {
        if (cancelled) return;
        const { center: start, level: zoom } = initial.current;
        const map = new maps.Map(node, { center: new maps.LatLng(start.lat, start.lng), level: zoom });
        moved.current = false;
        // 손으로 끌거나 확대·축소한 경우. 코드로 옮길 때는 생기지 않는다.
        // idle 이 먼저 올 수 있어서 여기서도 다시 알린다
        const markMoved = () => {
          moved.current = true;
          report();
        };
        maps.event.addListener(map, 'dragend', markMoved);
        maps.event.addListener(map, 'zoom_changed', markMoved);
        const report = () => {
          if (cancelled) return;
          const view = map.getBounds();
          const center = map.getCenter();
          onView({
            south: view.getSouthWest().getLat(),
            west: view.getSouthWest().getLng(),
            north: view.getNorthEast().getLat(),
            east: view.getNorthEast().getLng(),
            lat: center.getLat(),
            lng: center.getLng(),
            moved: moved.current,
          });
        };
        maps.event.addListener(map, 'idle', report);
        report();
        setKakaoMap({ maps, map });
      })
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      node.replaceChildren();
      onView(null);
    };
  }, [onView]);

  // 현재 위치 표시. 위치가 바뀌었고 사용자가 지도를 안 움직였으면 따라간다.
  useEffect(() => {
    if (!kakaoMap || !me) return undefined;
    const { maps, map } = kakaoMap;
    const position = new maps.LatLng(me.lat, me.lng);
    const dot = document.createElement('div');
    dot.className = 'me-dot';
    const overlay = new maps.CustomOverlay({ map, position, content: dot, zIndex: 1 });
    if (!moved.current) map.setCenter(position);
    return () => overlay.setMap(null);
  }, [kakaoMap, me]);

  useEffect(() => {
    if (!kakaoMap) return undefined;
    const { maps, map } = kakaoMap;
    const markers = pins.map((pin) => {
      const marker = new maps.Marker({
        map,
        position: new maps.LatLng(pin.lat, pin.lng),
        image: pin.kind ? logImage(maps, pin.kind) : pinImage(maps, pin.number, pin.active),
        zIndex: pin.active ? 10 : 5 - (pin.number ?? 0),
      });
      maps.event.addListener(marker, 'click', () => onPick(pin.id));
      return marker;
    });
    // 코스에서는 가까운 핀이 서로 가리지 않게 옆으로 비켜 놓는다. 확대·이동하면 다시 계산.
    const spread = () => {
      const projection = map.getProjection();
      const placed = [];
      markers.forEach((marker, index) => {
        const pin = pins[index];
        const point = projection.containerPointFromCoords(marker.getPosition());
        const width = container.current?.clientWidth ?? Infinity;
        const free = ([dx, dy]) =>
          point.x + dx >= 22 &&
          point.x + dx <= width - 22 &&
          !placed.some((q) => Math.abs(q.x - point.x - dx) < 30 && Math.abs(q.y - point.y + dy) < 36);
        // 제자리에서 멀지 않게: 옆, 위, 그다음 조금 더 멀리
        const shift = SHIFTS.find(free) ?? [0, 0];
        placed.push({ x: point.x + shift[0], y: point.y - shift[1] });
        marker.setImage(pinImage(maps, pin.number, pin.active, shift));
      });
    };
    const spreading = Boolean(path || lines) && pins.every((pin) => !pin.kind);
    if (spreading) {
      maps.event.addListener(map, 'idle', spread);
      spread();
    }
    const labels = pins
      .filter((pin) => pin.label)
      .map((pin) => {
        const label = document.createElement('div');
        label.className = 'pin-label map-name';
        label.lang = 'ko';
        label.textContent = pin.label;
        return new maps.CustomOverlay({ map, position: new maps.LatLng(pin.lat, pin.lng), content: label, yAnchor: 0 });
      });
    return () => {
      if (spreading) maps.event.removeListener(map, 'idle', spread);
      [...markers, ...labels].forEach((item) => item.setMap(null));
    };
  }, [kakaoMap, pins, onPick, theme, path, lines]);

  useEffect(() => {
    const stops = pins.filter((pin) => pin.kind !== 'missed');
    if (!kakaoMap || !path || stops.length < 2) return undefined;
    const { maps, map } = kakaoMap;
    const line = new maps.Polyline({
      map,
      path: stops.map((pin) => new maps.LatLng(pin.lat, pin.lng)),
      strokeWeight: 4,
      strokeColor: getComputedStyle(document.documentElement)
        .getPropertyValue(path === 'solid' ? '--teal' : '--accent')
        .trim(),
      strokeStyle: path === 'solid' ? 'solid' : 'shortdash',
    });
    return () => line.setMap(null);
  }, [kakaoMap, path, pins, theme]);

  // 코스를 바꾸면 모든 핀이 보이게 맞춘다. 고른 곳만 바뀔 때는 지도를 그대로 둔다.
  const route = path ? pins.map((pin) => `${pin.lat},${pin.lng}`).join(' ') : '';
  useEffect(() => {
    if (!kakaoMap || (!route && !lines)) return;
    const { maps, map } = kakaoMap;
    const bounds = new maps.LatLngBounds();
    const points = lines ? lines.flat() : route.split(' ').map((point) => point.split(',').map(Number));
    points.forEach(([lat, lng]) => bounds.extend(new maps.LatLng(lat, lng)));
    map.setBounds(bounds, 80, 40, 40, 40);
    if (map.getLevel() < 6) map.setLevel(6);
  }, [kakaoMap, route, lines]);

  useEffect(() => {
    if (!kakaoMap || !lines) return undefined;
    const { maps, map } = kakaoMap;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const drawn = lines.map(
      (line) =>
        new maps.Polyline({
          map,
          path: line.map(([lat, lng]) => new maps.LatLng(lat, lng)),
          strokeWeight: 4,
          strokeColor: color,
          strokeOpacity: 0.9,
        }),
    );
    return () => drawn.forEach((item) => item.setMap(null));
  }, [kakaoMap, lines, theme]);

  return (
    <>
      <div ref={container} className="map-canvas" data-dark-filter={DARK_MAP_FILTER} />
      {failed && <p className="map-message">{errorText}</p>}
    </>
  );
}
