import BrowseMap from '../components/BrowseMap.jsx';
import { demoMissed, demoVisits } from '../data/demoLog.js';

const noop = () => {};
const PINS = [
  ...demoVisits.map((v) => ({ id: v.id, kind: v.kind, label: v.name, lat: v.lat, lng: v.lng })),
  ...demoMissed.map((v) => ({ id: v.id, kind: 'missed', label: v.name, lat: v.lat, lng: v.lng })),
];
const LEGEND = ['visited', 'passed', 'missed'];

// 위치 기록과 QR 은 아직 없다. 예시 데이터로 화면만 보여준다.
export default function LogScreen({ t, theme }) {
  const l = t.log;
  return (
    <div className="log">
      <section className="card map-area">
        <BrowseMap pins={PINS} path="solid" onPick={noop} onView={noop} theme={theme} errorText={t.map.mapError} />
        <ul className="legend-chip log-legend">
          {LEGEND.map((kind) => (
            <li key={kind}>
              <span className={`log-dot log-dot-${kind}`} />
              {l.legend[kind]}
            </li>
          ))}
        </ul>
      </section>

      <section className="card log-card">
        <div className="card-header">
          <h2>{l.summary.replace('{n}', demoVisits.length)}</h2>
          <span className="chip">{l.demo}</span>
        </div>
        <ol className="log-list">
          {demoVisits.map((visit) => (
            <li key={visit.id}>
              <time>{visit.time}</time>
              <span className={`log-dot log-dot-${visit.kind}`} />
              <span>
                <span className="stop-name" lang="ko">
                  {visit.name}
                </span>
                <span className="stop-note">{l.notes[visit.note]}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="log-rule">{l.rule}</p>
      </section>

      <div className="log-side">
        <section className="card log-qr">
          <div className="qr">{t.home.qr}</div>
          <div>
            <h2>{l.takeTitle}</h2>
            <p className="stop-note">{l.takeText}</p>
          </div>
        </section>
        <section className="card log-card">
          <h2>{l.missedTitle}</h2>
          <p className="stop-note">{l.missedText}</p>
          <ul className="log-missed">
            {demoMissed.map((place) => (
              <li key={place.id}>
                <span className="stop-name" lang="ko">
                  {place.name}
                </span>
                <span className="stop-note">{l.notes[place.note]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
