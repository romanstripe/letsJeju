import { useState } from 'react';
import BrowseMap from '../components/BrowseMap.jsx';
import Icon from '../components/Icon.jsx';
import Thumb from '../components/Thumb.jsx';
import { demoMissed, demoVisits } from '../data/demoLog.js';

const noop = () => {};
const stayed = demoVisits.filter((v) => v.kind === 'visited');
const PINS = [
  ...demoVisits.map((v) => ({
    id: v.id,
    kind: v.kind,
    number: v.kind === 'visited' ? stayed.indexOf(v) + 1 : undefined,
    photo: v.photo,
    lat: v.lat,
    lng: v.lng,
  })),
  ...demoMissed.map((v) => ({ id: v.id, kind: 'missed', label: v.name, lat: v.lat, lng: v.lng })),
];

// 위치 기록과 QR 은 아직 없다. 예시 데이터로 화면만 보여준다.
export default function LogScreen({ t, theme }) {
  const l = t.log;
  const [qrOpen, setQrOpen] = useState(true);
  return (
    <div className="log">
      <section className="card map-area">
        <BrowseMap pins={PINS} path="solid" onPick={noop} onView={noop} theme={theme} errorText={t.map.mapError} />
        {qrOpen && (
          <div className="take-banner">
            <div className="qr">{t.home.qr}</div>
            <div>
              <h2>{l.takeTitle}</h2>
              <p>{l.takeText}</p>
            </div>
            <button type="button" className="take-close" aria-label={t.events.close} onClick={() => setQrOpen(false)}>
              <Icon name="close" size={22} />
            </button>
          </div>
        )}
      </section>

      <section className="card log-card">
        <div className="card-header">
          <h2>{l.summary.replace('{n}', demoVisits.length)}</h2>
          <span className="chip">{l.demo}</span>
        </div>
        <div className="log-scroll">
          <ol className="log-list">
            {demoVisits.map((visit) => (
              <li key={visit.id} className={`log-row is-${visit.kind}`}>
                {visit.kind === 'passed' ? (
                  <span className="log-ring" />
                ) : (
                  <Thumb photo={visit.photo} className="thumb-large" />
                )}
                <span className="log-text">
                  <span className="log-name" lang="ko">
                    {visit.name}
                  </span>
                  <span className="log-note">{l.notes[visit.note]}</span>
                </span>
                <time>{visit.time}</time>
              </li>
            ))}
          </ol>
          <h3>{l.missedTitle}</h3>
          <ul>
            {demoMissed.map((place) => (
              <li key={place.id} className="log-row">
                <Thumb photo={place.photo} className="thumb-small" />
                <span className="log-text">
                  <span className="log-name" lang="ko">
                    {place.name}
                  </span>
                  <span className="log-note">{l.notes[place.note]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
