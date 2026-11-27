import MapView from '../components/MapView.jsx';
import NarrationCard from '../components/NarrationCard.jsx';

// 코스 데이터와 현재 위치는 아직 없어서 지도만 보여주고, 나머지는 [ ] 자리 표시
const NO_PLACES = [];
const noop = () => {};
const NEXT = [1, 2];

export default function HereScreen({ t, theme, onBrowse }) {
  const h = t.here;
  return (
    <div className="here">
      <section className="card map-area">
        <MapView places={NO_PLACES} selected={null} onSelect={noop} theme={theme} errorText={t.map.mapError} />
        <p className="legend-chip here-hint">
          <span className="legend-dot" />
          {h.hint}
        </p>
      </section>

      <div className="here-side">
        <NarrationCard t={t} />
        <section className="card next-card">
          <h2>{h.nextTitle}</h2>
          <ul className="next-list">
            {NEXT.map((id) => (
              <li key={id} className="next-row">
                <span className="next-time">{h.minutes}</span>
                <span className="next-name">{h.nextPlace}</span>
                <span className="next-status">{h.ready}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="next-more" onClick={onBrowse}>
            {h.more} →
          </button>
        </section>
      </div>
    </div>
  );
}
