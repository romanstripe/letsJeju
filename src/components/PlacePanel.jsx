import { useState } from 'react';
import { themeGroups, amenityGroups, detailOnlyTags } from '../data/tagGroups.js';

// alltag 는 tagGroups 를 거쳐서만 보여준다
function visibleTags(place, t) {
  const has = (group) => group.tags.some((tag) => place.tags.includes(tag));
  return [
    ...themeGroups.filter(has).map((g) => t.tags[g.id]),
    ...amenityGroups.filter(has).map((g) => t.tags[g.id]),
    ...detailOnlyTags.filter((tag) => place.tags.includes(tag)).map((tag) => t.detailTags[tag]),
  ];
}

function Photo({ place, fallback }) {
  const [broken, setBroken] = useState(false);
  if (!place.photo || broken) return <div className="panel-photo">{fallback}</div>;
  return <img className="panel-photo" src={place.photo} alt={place.title} onError={() => setBroken(true)} />;
}

export default function PlacePanel({ place, t, onClose }) {
  const m = t.map;

  if (!place) {
    return (
      <aside className="card panel">
        <p className="panel-empty">{m.empty}</p>
      </aside>
    );
  }

  return (
    <aside className="card panel">
      <Photo key={place.id} place={place} fallback={m.noPhoto} />
      <div className="panel-body" key={`body-${place.id}`}>
        {onClose && (
          <button type="button" className="text-button panel-close" onClick={onClose}>
            {t.events.close}
          </button>
        )}
        <p className="panel-meta">
          {m.categories[place.category]}
          {place.region.length > 0 && <span lang="ko"> · {place.region.join(' · ')}</span>}
        </p>
        <h2 className="panel-title" lang="ko">
          {place.title}
        </h2>
        {place.fromTourApi && place.photo && <p className="panel-meta">{t.events.photoCredit}</p>}
        <p className="panel-intro" lang="ko">
          {place.introduction}
        </p>
        <ul className="panel-tags">
          {visibleTags(place, t).map((label) => (
            <li key={label} className="chip">
              {label}
            </li>
          ))}
        </ul>
      </div>
      {/* 코스, QR 은 나중 단계 */}
      <div className="panel-actions">
        <button type="button" className="primary-button" disabled>
          {m.addToCourse}
        </button>
        <button type="button" className="secondary-button" disabled>
          {m.sendToPhone}
        </button>
      </div>
    </aside>
  );
}
