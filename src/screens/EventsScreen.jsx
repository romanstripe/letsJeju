import { useState } from 'react';
import HeaderButtons from '../components/HeaderButtons.jsx';
import { formatPeriod, rangeEnd, todayInKorea, useCurrentEvents } from '../data/events.js';
import { seasonal } from '../data/seasonal.js';

const RANGES = ['today', 'week', 'month'];

function SeasonalColumn({ lang, t }) {
  const month = Number(todayInKorea().slice(4, 6));
  const items = seasonal[month] ?? [];
  const text = (value) => value?.[lang] ?? value?.ko;

  return (
    <section className="card events-column">
      <h2>{t.events.seasonalTitle}</h2>
      {items.length === 0 ? (
        <p className="events-notice">{t.events.seasonalEmpty}</p>
      ) : (
        <ul className="events-list">
          {items.map((item) => (
            <li key={item.name.ko} className="season-row">
              <p className="event-name">{text(item.name)}</p>
              {item.note && <p className="event-note">{text(item.note)}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EventDetail({ event, lang, t, onClose }) {
  const e = t.events;
  return (
    <aside className="card events-column event-detail">
      <div className="card-header">
        <p className="event-meta">{formatPeriod(event, lang)}</p>
        <button type="button" className="text-button" onClick={onClose}>
          {e.close}
        </button>
      </div>
      <div className="event-detail-body">
        <h2 lang="ko">{event.title}</h2>
        {/* 공공누리 사진은 자르거나 바꾸지 않고 출처를 적는다 */}
        {event.photo && (
          <figure>
            <img src={event.photo} alt={event.title} />
            <figcaption>{e.photoCredit}</figcaption>
          </figure>
        )}
        <p className="event-note" lang="ko">
          {event.address}
        </p>
        {event.tel && <p className="event-note">{event.tel}</p>}
        <div className="event-booking">
          <div className="qr">{t.home.qr}</div>
          <p className="event-note">{t.home.eventNote}</p>
        </div>
      </div>
      <button type="button" className="secondary-button" disabled>
        {t.map.addToCourse}
      </button>
    </aside>
  );
}

export default function EventsScreen({ lang, t, onToggleTheme, onChangeLanguage }) {
  const { events, failed } = useCurrentEvents();
  const [range, setRange] = useState('today');
  const [selected, setSelected] = useState(null);
  const e = t.events;

  const today = todayInKorea();
  const shown = (events ?? []).filter((event) => event.start <= rangeEnd(range, today));
  const none = events !== null && events.length === 0;

  let notice = null;
  if (failed) notice = e.loadError;
  else if (events === null) notice = e.loading;
  else if (none) notice = e.none;
  else if (shown.length === 0) notice = e.noneInRange;

  const eventColumn = (
    <section className="card events-column">
      <h2>{e.listTitle}</h2>
      {notice ? (
        <p className="events-notice" role="status">
          {notice}
        </p>
      ) : (
        <ul className="events-list">
          {shown.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                className="event-row"
                aria-pressed={selected?.id === event.id}
                onClick={() => setSelected(event)}
              >
                <span className="event-thumb">
                  {event.photo && <img src={event.photo} alt="" />}
                </span>
                <span className="event-text">
                  <span className="event-meta">
                    {formatPeriod(event, lang)} · {event.start <= today ? e.ongoing : e.upcoming}
                  </span>
                  <span className="event-name" lang="ko">
                    {event.title}
                  </span>
                  <span className="event-note" lang="ko">
                    {event.address}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
  const side = selected ? (
    <EventDetail event={selected} lang={lang} t={t} onClose={() => setSelected(null)} />
  ) : (
    <SeasonalColumn lang={lang} t={t} />
  );

  return (
    <>
      <header className="topbar">
        <h1 className="screen-title">{e.title}</h1>
        <div className="filters">
          {RANGES.map((id) => (
            <button
              key={id}
              type="button"
              className="filter-button"
              aria-pressed={range === id}
              onClick={() => {
                setRange(id);
                setSelected(null);
              }}
            >
              {e.ranges[id]}
            </button>
          ))}
        </div>
        <HeaderButtons t={t} onToggleTheme={onToggleTheme} onChangeLanguage={onChangeLanguage} />
      </header>
      {/* 행사가 하나도 없으면 제철 칸을 먼저 보여준다 */}
      <main className="content events-screen">
        {none ? (
          <>
            {side}
            {eventColumn}
          </>
        ) : (
          <>
            {eventColumn}
            {side}
          </>
        )}
      </main>
    </>
  );
}
