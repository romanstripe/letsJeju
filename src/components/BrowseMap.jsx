import { useContext, useEffect, useRef, useState } from 'react';
import { MapSwitch } from '../mapSwitch.js';
import { loadKakao } from '../map/kakao.js';
import { DARK_MAP_FILTER } from '../config.js';
import Icon from './Icon.jsx';
import { isWholePhoto } from './Thumb.jsx';

// 처음 화면: 제주 본섬이 지도 너비에 꽉 차게
const CENTER = { lat: 33.38, lng: 126.55 };
const LEVEL = 10;

// 겹칠 때 비켜 볼 자리 [오른쪽, 위] (px). 제자리에서 가까운 곳부터.
const SHIFTS = [[0, 0], [48, 0], [-48, 0], [0, 58], [48, 58], [-48, 58], [96, 0], [-96, 0], [0, 116]];

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 사진 핀. kind 'passed' 지나간 곳, 'missed' 못 간 곳은 작은 고리.
function pinElement(pin) {
  const ring = pin.kind === 'passed' || pin.kind === 'missed';
  const button = element('button', ring ? `map-ring is-${pin.kind}` : 'photo-pin');
  button.type = 'button';
  if (pin.active) button.classList.add('is-active');
  if (pin.kind === 'visited') button.classList.add('is-visited');
  if (!ring) {
    const face = element('span', 'photo-pin-face');
    if (pin.photo) {
      const image = element('img', isWholePhoto(pin.photo) ? 'is-whole' : '');
      image.src = pin.photo;
      image.alt = '';
      face.append(image);
    }
    button.append(face);
    if (pin.number) button.append(element('b', 'photo-pin-number', pin.number));
  }
  if (pin.label) {
    const label = element('span', 'map-name', pin.label);
    label.lang = 'ko';
    button.append(label);
  }
  button.setAttribute('aria-label', pin.label ?? String(pin.number ?? ''));
  return button;
}

// pins: [{ id, number, lat, lng, active, photo, kind, label }]. 지도를 움직일 때마다 onView 로 보이는 범위를 알린다.
// path 를 주면 핀 순서대로 잇는다. 'solid' 는 기록용(청록, kind 'missed' 는 잇지 않음).
// lines([[[lat, lng], ...], ...])를 주면 그 선을 그리고 거기에 맞춰 보여준다.
// others([{ lat, lng }])는 누를 수 없는 작은 점으로 보여준다.
// sections([{ id, number, points, active }])는 짧은 선과 번호를 그리고, active 인 선에 지도를 맞춘다.
// me 를 주면 현재 위치를 표시하고 그곳을 중심으로 연다. 사용자가 지도를 직접 움직이면 moved 가 true.
// locateLabel 을 주면 오른쪽 위에 현재 위치 버튼을 둔다. 누르면 처음 확대 정도로 돌아가고 moved 가 풀린다.
// onMapClick 을 주면 핀이 아닌 지도를 누른 좌표({ lat, lng })를 알린다.
// 지도를 꺼 두면 안쪽 컴포넌트를 만들지 않아서 카카오를 부르지 않는다
export default function BrowseMap(props) {
  const { on, offText } = useContext(MapSwitch);
  return on ? <KakaoMap {...props} /> : <p className="map-message map-off">{offText}</p>;
}

function KakaoMap({ pins, path = false, lines, others, sections, me, level = LEVEL, onMapClick, onPick, onView, theme, errorText, locateLabel }) {
  const container = useRef(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [failed, setFailed] = useState(false);
  const initial = useRef({ center: me ?? CENTER, level });
  const moved = useRef(false);
  const reportView = useRef(null);
  const [resized, setResized] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const node = container.current;
    loadKakao()
      .then((maps) => {
        if (cancelled) return;
        const { center: start, level: zoom } = initial.current;
        const map = new maps.Map(node, { center: new maps.LatLng(start.lat, start.lng), level: zoom });
        moved.current = false;
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
        // 손으로 끌거나 확대·축소한 경우. 코드로 옮길 때는 생기지 않는다.
        // idle 이 먼저 올 수 있어서 여기서도 다시 알린다
        const markMoved = () => {
          moved.current = true;
          report();
        };
        maps.event.addListener(map, 'dragend', markMoved);
        maps.event.addListener(map, 'zoom_changed', markMoved);
        maps.event.addListener(map, 'idle', report);
        reportView.current = report;
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

  // 화면 크기가 바뀌면 지도를 다시 맞춘다. 보던 가운데는 그대로.
  useEffect(() => {
    if (!kakaoMap) return undefined;
    const { map } = kakaoMap;
    const node = container.current;
    let size = `${node.clientWidth}x${node.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const next = `${node.clientWidth}x${node.clientHeight}`;
      if (next === size) return;
      size = next;
      const center = map.getCenter();
      map.relayout();
      map.setCenter(center);
      setResized((n) => n + 1); // 코스와 기록은 모든 핀이 보이게 다시 맞춘다
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [kakaoMap]);

  useEffect(() => {
    if (!kakaoMap || !onMapClick) return undefined;
    const { maps, map } = kakaoMap;
    const click = ({ latLng }) => onMapClick({ lat: latLng.getLat(), lng: latLng.getLng() });
    maps.event.addListener(map, 'click', click);
    return () => maps.event.removeListener(map, 'click', click);
  }, [kakaoMap, onMapClick]);

  // 현재 위치 표시. 위치가 바뀌었고 사용자가 지도를 안 움직였으면 따라간다.
  useEffect(() => {
    if (!kakaoMap || !me) return undefined;
    const { maps, map } = kakaoMap;
    const position = new maps.LatLng(me.lat, me.lng);
    const overlay = new maps.CustomOverlay({ map, position, content: element('div', 'me-dot'), zIndex: 1 });
    if (!moved.current) map.setCenter(position);
    return () => overlay.setMap(null);
  }, [kakaoMap, me]);

  useEffect(() => {
    if (!kakaoMap) return undefined;
    const { maps, map } = kakaoMap;
    const shown = pins.map((pin) => {
      const node = pinElement(pin);
      node.addEventListener('click', () => onPick(pin.id));
      const position = new maps.LatLng(pin.lat, pin.lng);
      const ring = pin.kind === 'passed' || pin.kind === 'missed';
      const overlay = new maps.CustomOverlay({
        map,
        position,
        content: node,
        clickable: true,
        yAnchor: ring ? 0.5 : 1,
        zIndex: pin.active ? 20 : 12 - (pin.number ?? 8),
      });
      return { node, overlay, position };
    });
    // 코스에서는 가까운 핀이 서로 가리지 않게 비켜 놓는다. 확대·이동하면 다시 계산.
    const spread = () => {
      const projection = map.getProjection();
      const width = container.current?.clientWidth ?? Infinity;
      const placed = [];
      for (const { node, position } of shown) {
        const point = projection.containerPointFromCoords(position);
        const free = ([dx, dy]) =>
          point.x + dx >= 28 &&
          point.x + dx <= width - 28 &&
          !placed.some((q) => Math.abs(q.x - point.x - dx) < 44 && Math.abs(q.y - point.y + dy) < 52);
        const [dx, dy] = SHIFTS.find(free) ?? [0, 0];
        placed.push({ x: point.x + dx, y: point.y - dy });
        node.style.transform = `translate(${dx}px, ${-dy}px)`;
      }
    };
    const spreading = Boolean(path || lines) && pins.every((pin) => !pin.kind);
    if (spreading) {
      maps.event.addListener(map, 'idle', spread);
      spread();
    }
    return () => {
      if (spreading) maps.event.removeListener(map, 'idle', spread);
      shown.forEach(({ overlay }) => overlay.setMap(null));
    };
  }, [kakaoMap, pins, onPick, path, lines]);

  useEffect(() => {
    if (!kakaoMap || !sections) return undefined;
    const { maps, map } = kakaoMap;
    const css = getComputedStyle(document.documentElement);
    const drawn = sections.flatMap((section) => {
      const path = section.points.map(([lat, lng]) => new maps.LatLng(lat, lng));
      const line = new maps.Polyline({
        map,
        path,
        strokeWeight: section.active ? 7 : 4,
        strokeColor: css.getPropertyValue(section.active ? '--accent' : '--teal').trim(),
        strokeOpacity: 0.95,
      });
      const badge = element('button', section.active ? 'section-number is-active' : 'section-number', section.number);
      badge.type = 'button';
      badge.addEventListener('click', () => onPick(section.id));
      const overlay = new maps.CustomOverlay({ map, position: path[0], content: badge, clickable: true, zIndex: section.active ? 20 : 5 });
      return [line, overlay];
    });
    return () => drawn.forEach((item) => item.setMap(null));
  }, [kakaoMap, sections, onPick, theme]);

  useEffect(() => {
    if (!kakaoMap || !others?.length) return undefined;
    const { maps, map } = kakaoMap;
    const dots = others.map(
      (p) => new maps.CustomOverlay({ map, position: new maps.LatLng(p.lat, p.lng), content: element('div', 'map-dot'), zIndex: 0 }),
    );
    return () => dots.forEach((dot) => dot.setMap(null));
  }, [kakaoMap, others]);

  const focus = sections?.find((section) => section.active);
  const focusId = focus?.id;
  const focusPoints = useRef(null);
  focusPoints.current = focus?.points;
  useEffect(() => {
    if (!kakaoMap || !focusId) return;
    const { maps, map } = kakaoMap;
    const bounds = new maps.LatLngBounds();
    focusPoints.current.forEach(([lat, lng]) => bounds.extend(new maps.LatLng(lat, lng)));
    map.setBounds(bounds, 60, 60, 60, 60);
  }, [kakaoMap, focusId, resized]);

  useEffect(() => {
    if (!kakaoMap) return undefined;
    const { maps, map } = kakaoMap;
    const css = getComputedStyle(document.documentElement);
    const draw = (points, colorVar) =>
      new maps.Polyline({
        map,
        path: points.map(([lat, lng]) => new maps.LatLng(lat, lng)),
        strokeWeight: 5,
        strokeColor: css.getPropertyValue(colorVar).trim(),
        strokeOpacity: 0.95,
      });
    let drawn = [];
    if (lines) {
      drawn = lines.map((line) => draw(line, '--accent'));
    } else if (path) {
      const stops = pins.filter((pin) => pin.kind !== 'missed');
      if (stops.length > 1) {
        drawn = [draw(stops.map((pin) => [pin.lat, pin.lng]), path === 'solid' ? '--teal' : '--accent')];
      }
    }
    return () => drawn.forEach((line) => line.setMap(null));
  }, [kakaoMap, path, lines, pins, theme]);

  // 코스를 바꾸면 모든 핀이 보이게 맞춘다. 고른 곳만 바뀔 때는 지도를 그대로 둔다.
  const route = path ? pins.map((pin) => `${pin.lat},${pin.lng}`).join(' ') : '';
  useEffect(() => {
    if (!kakaoMap || (!route && !lines)) return;
    const { maps, map } = kakaoMap;
    const bounds = new maps.LatLngBounds();
    const points = lines ? lines.flat() : route.split(' ').map((point) => point.split(',').map(Number));
    points.forEach(([lat, lng]) => bounds.extend(new maps.LatLng(lat, lng)));
    // 기록 화면은 아래에 QR 판이 있어 아래 여백을 크게
    map.setBounds(bounds, 90, 50, path === 'solid' ? 190 : 40, 50);
    if (map.getLevel() < 6) map.setLevel(6);
  }, [kakaoMap, route, lines, path, resized]);

  const locate = () => {
    const { maps, map } = kakaoMap;
    map.setLevel(initial.current.level); // zoom_changed 가 moved 를 켜므로 먼저 하고 끈다
    moved.current = false;
    map.setCenter(new maps.LatLng(me.lat, me.lng));
    reportView.current();
  };

  return (
    <>
      <div ref={container} className="map-canvas" data-dark-filter={DARK_MAP_FILTER} />
      {failed && <p className="map-message">{errorText}</p>}
      {locateLabel && me && kakaoMap && (
        <button type="button" className="map-locate" aria-label={locateLabel} onClick={locate}>
          <Icon name="locate" />
        </button>
      )}
    </>
  );
}
