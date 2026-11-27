import { useEffect, useRef, useState } from 'react';
import { loadKakao } from '../map/kakao.js';
import { DARK_MAP_FILTER } from '../config.js';

// 처음 화면: 제주 본섬이 지도 너비에 꽉 차게
const CENTER = { lat: 33.38, lng: 126.55 };
const LEVEL = 10;

// 번호 핀. 색은 CSS 변수에서 읽는다.
function pinImage(maps, number, active) {
  const css = getComputedStyle(document.documentElement);
  const color = (name) => css.getPropertyValue(name).trim();
  const fill = color(active ? '--accent' : '--sub');
  const ink = color(active ? '--on-accent' : '--card');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="52"><path d="M22 50C14 41 6 31 6 20a16 16 0 0132 0c0 11-8 21-16 30z" fill="${fill}" stroke="${color('--card')}" stroke-width="3"/><text x="22" y="26" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="${ink}">${number}</text></svg>`;
  return new maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    new maps.Size(44, 52),
    { offset: new maps.Point(22, 50) },
  );
}

// pins: [{ id, number, lat, lng, active }]. 지도를 움직일 때마다 onView 로 보이는 범위를 알린다.
// path 를 주면 핀 순서대로 점선을 잇는다.
// me 를 주면 현재 위치를 표시하고 그곳을 중심으로 연다. 사용자가 지도를 직접 움직이면 moved 가 true.
export default function BrowseMap({ pins, path = false, me, level = LEVEL, onPick, onView, theme, errorText }) {
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
        image: pinImage(maps, pin.number, pin.active),
        zIndex: pin.active ? 10 : 5 - pin.number,
      });
      maps.event.addListener(marker, 'click', () => onPick(pin.id));
      return marker;
    });
    return () => markers.forEach((marker) => marker.setMap(null));
  }, [kakaoMap, pins, onPick, theme]);

  useEffect(() => {
    if (!kakaoMap || !path || pins.length < 2) return undefined;
    const { maps, map } = kakaoMap;
    const line = new maps.Polyline({
      map,
      path: pins.map((pin) => new maps.LatLng(pin.lat, pin.lng)),
      strokeWeight: 4,
      strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      strokeStyle: 'shortdash',
    });
    return () => line.setMap(null);
  }, [kakaoMap, path, pins, theme]);

  // 코스를 바꾸면 모든 핀이 보이게 맞춘다. 고른 곳만 바뀔 때는 지도를 그대로 둔다.
  const route = path ? pins.map((pin) => `${pin.lat},${pin.lng}`).join(' ') : '';
  useEffect(() => {
    if (!kakaoMap || !route) return;
    const { maps, map } = kakaoMap;
    const bounds = new maps.LatLngBounds();
    route.split(' ').forEach((point) => bounds.extend(new maps.LatLng(...point.split(',').map(Number))));
    map.setBounds(bounds, 80, 40, 40, 40);
  }, [kakaoMap, route]);

  return (
    <>
      <div ref={container} className="map-canvas" data-dark-filter={DARK_MAP_FILTER} />
      {failed && <p className="map-message">{errorText}</p>}
    </>
  );
}
