import Icon from './Icon.jsx';

// 나레이션 카드 자리. 위치 감지와 재생은 여기에 직접 붙인다. 지금은 모양만 있다.
export default function NarrationCard({ t }) {
  const h = t.here;
  return (
    <section className="card narration">
      <div className="narration-photo">
        <span className="narration-badge">
          <span className="narration-dot" />
          {h.badge}
        </span>
      </div>
      <div className="narration-body">
        <div>
          <h2 className="narration-title">{h.name}</h2>
          <p className="narration-arrival">{h.arrival}</p>
        </div>
        <button type="button" className="play-button" aria-label={h.play} disabled>
          <Icon name="play" />
        </button>
        <div className="progress">
          <span>[0:00]</span>
          <span className="progress-track" />
          <span>[0:00]</span>
          <button type="button" className="more-audio" disabled>
            {h.moreAudio}
          </button>
        </div>
      </div>
    </section>
  );
}
