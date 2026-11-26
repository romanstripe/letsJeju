import { formatPeriod, useCurrentEvents } from '../data/events.js';

// 행사 카드는 실제 데이터, 나머지는 [ ] 자리 표시. 위치 기반 설명(나레이션)은 나중 단계.
const TRENDS = ['openRun', 'limited', 'rising'];

export default function HomeScreen({ lang, t, onSeeEvents }) {
  const home = t.home;
  const { events, failed } = useCurrentEvents();
  const next = events?.[0];
  const notice = failed ? t.events.loadError : events === null ? t.events.loading : t.events.none;

  return (
    <div className="home">
      <section className="card map-card">
        <div className="map-placeholder">{home.map}</div>
        <div className="place">
          <h2 className="place-name">{home.placeName}</h2>
          <p className="place-description">{home.placeDescription}</p>
        </div>
      </section>

      <div className="home-side">
        <section className="card events-card">
          <div className="card-header">
            <h2>{home.eventsTitle}</h2>
            <button type="button" className="text-button" onClick={onSeeEvents}>
              {home.seeAll}
            </button>
          </div>
          {next ? (
            <div className="event">
              <div>
                <p className="event-meta">{formatPeriod(next, lang)}</p>
                <p className="event-name" lang="ko">
                  {next.title}
                </p>
                <p className="event-note">{home.eventNote}</p>
              </div>
              <div className="qr">{home.qr}</div>
            </div>
          ) : (
            <p className="event-empty" role="status">
              {notice}
            </p>
          )}
        </section>

        <section className="card trend-card">
          <div className="card-header">
            <h2>{home.trendTitle}</h2>
            <span className="chip">{home.trendUpdated}</span>
          </div>
          <ul className="trend-list">
            {TRENDS.map((id) => (
              <li key={id} className="trend-row">
                <span className={`badge badge-${id}`}>{home.trends[id].badge}</span>
                <span className="trend-name">{home.trends[id].name}</span>
                <span className="trend-where">{home.trends[id].where}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
