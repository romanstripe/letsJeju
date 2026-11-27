import Icon from './Icon.jsx';

// 나레이션 카드 자리. 위치 감지와 재생은 여기에 직접 붙인다. 지금은 모양만 있다.
export default function NarrationCard({ t }) {
  const h = t.here;
  return (
    <section className="card narration">
      <div className="narration-photo">
        <span className="narration-badge">{h.badge}</span>
      </div>
      <div className="narration-body">
        <div>
          <p className="event-meta">{h.arrival}</p>
          <h2 className="narration-title">{h.name}</h2>
          <p className="event-note">{h.description}</p>
        </div>
        <button type="button" className="play-button" aria-label={h.play} disabled>
          <Icon name="play" />
        </button>
        <div className="progress">
          <span>[0:00]</span>
          <span className="progress-track" />
          <span>[0:00]</span>
        </div>
      </div>
    </section>
  );
}
