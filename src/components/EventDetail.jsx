import { useContext } from 'react';
import { formatPeriod } from '../data/events.js';
import { MyCourse } from '../myCourse.js';

export default function EventDetail({ event, lang, t, onClose }) {
  const e = t.events;
  const course = useContext(MyCourse);
  const added = course.has(event.title);
  const addEvent = () =>
    course.add({ id: `event:${event.id}`, name: event.title, lat: event.lat, lng: event.lng, photo: event.photo });
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
      <button type="button" className="secondary-button" disabled={added} onClick={addEvent}>
        {added ? t.myCourse.inCourse : t.map.addToCourse}
      </button>
    </aside>
  );
}
