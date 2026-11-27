import BrowseMap from '../components/BrowseMap.jsx';
import Icon from '../components/Icon.jsx';
import NarrationCard from '../components/NarrationCard.jsx';
import Thumb from '../components/Thumb.jsx';
import { NEARBY_MAP_LEVEL } from '../config.js';
import { useCurrentLocation } from '../location.js';

// 코스 따라가기는 아직 없어서 지도에는 현재 위치만, 나머지는 [ ] 자리 표시
const NO_PINS = [];
const noop = () => {};
const NEXT = [1, 2];

export default function HereScreen({ t, theme }) {
  const h = t.here;
  const me = useCurrentLocation();
  return (
    <div className="here">
      <section className="card map-area">
        <BrowseMap
          pins={NO_PINS}
          me={me}
          level={NEARBY_MAP_LEVEL}
          onPick={noop}
          onView={noop}
          theme={theme}
          errorText={t.map.mapError}
        />
      </section>

      <div className="here-side">
        <NarrationCard t={t} />
        <section className="card next-card">
          <h2>{h.nextTitle}</h2>
          <ul className="next-list">
            {NEXT.map((id) => (
              <li key={id} className="next-row">
                <Thumb className="thumb-large" />
                <span className="next-text">
                  <span className="next-name">{h.nextPlace}</span>
                  <span className="next-status">{h.ready}</span>
                </span>
                <span className="drive-time">
                  <Icon name="car" size={16} />
                  <span className="sr-only">{t.course.modes.car}</span>
                  {h.minutes}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
