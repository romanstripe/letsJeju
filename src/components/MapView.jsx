import { useEffect, useRef, useState } from 'react';
import { loadKakao } from '../map/kakao.js';

// 처음 화면에 제주 본섬(과 우도, 마라도)이 모두 들어오게
const JEJU = { south: 33.11, west: 126.14, north: 33.57, east: 126.98 };

const CLUSTER_STYLE = {
  width: '44px',
  height: '44px',
  lineHeight: '38px',
  boxSizing: 'border-box',
  textAlign: 'center',
  borderRadius: '22px',
  border: '3px solid var(--pin-ring)',
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  fontSize: '14px',
  fontWeight: '700',
};

// 마커 그림은 CSS 변수 색으로 만든다. 눌리는 영역은 44px.
function pinImage(maps, fillVar, radius) {
  const css = getComputedStyle(document.documentElement);
  const color = (name) => css.getPropertyValue(name).trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="${radius}" fill="${color(fillVar)}" stroke="${color('--pin-ring')}" stroke-width="3"/></svg>`;
  return new maps.MarkerImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    new maps.Size(44, 44),
    { offset: new maps.Point(22, 22) },
  );
}

export default function MapView({ places, selected, onSelect, theme, errorText }) {
  const container = useRef(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const node = container.current;
    loadKakao()
      .then((maps) => {
        if (cancelled) return;
        const map = new maps.Map(node, { center: new maps.LatLng(33.38, 126.55), level: 10 });
        const bounds = new maps.LatLngBounds(
          new maps.LatLng(JEJU.south, JEJU.west),
          new maps.LatLng(JEJU.north, JEJU.east),
        );
        map.setBounds(bounds, 10, 10, 10, 10);
        const clusterer = new maps.MarkerClusterer({
          map,
          averageCenter: true,
          minLevel: 4,
          gridSize: 60,
          styles: [CLUSTER_STYLE],
        });
        setKakaoMap({ maps, map, clusterer });
      })
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      node.replaceChildren();
    };
  }, []);

  useEffect(() => {
    if (!kakaoMap) return undefined;
    const { maps, clusterer } = kakaoMap;
    const image = pinImage(maps, '--pin-fill', 10);
    const markers = places.map((place) => {
      const marker = new maps.Marker({
        position: new maps.LatLng(place.lat, place.lng),
        image,
        title: place.title,
      });
      maps.event.addListener(marker, 'click', () => onSelect(place));
      return marker;
    });
    clusterer.addMarkers(markers);
    return () => clusterer.clear();
  }, [kakaoMap, places, onSelect, theme]);

  // 고른 곳은 클러스터와 상관없이 위에 따로 표시
  useEffect(() => {
    if (!kakaoMap || !selected) return undefined;
    const { maps, map } = kakaoMap;
    const position = new maps.LatLng(selected.lat, selected.lng);
    const marker = new maps.Marker({ map, position, image: pinImage(maps, '--accent', 15), zIndex: 10 });
    const label = document.createElement('div');
    label.className = 'pin-label';
    label.lang = 'ko';
    label.textContent = selected.title;
    const overlay = new maps.CustomOverlay({ map, position, content: label, yAnchor: 1.8, zIndex: 11 });
    return () => {
      marker.setMap(null);
      overlay.setMap(null);
    };
  }, [kakaoMap, selected, theme]);

  return (
    <>
      <div ref={container} className="map-canvas" />
      {failed && <p className="map-message">{errorText}</p>}
    </>
  );
}
