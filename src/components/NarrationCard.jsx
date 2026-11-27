import { useRef, useState } from 'react';
import Icon from './Icon.jsx';

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

// 설명 재생 카드. 장소가 바뀌면 부모가 key 로 새로 만들어 처음부터 시작한다.
// autoPlay 는 사용자가 장소를 눌러 고른 경우에만 켠다 (브라우저는 누르기 전의 자동 재생을 막는다).
export default function NarrationCard({ place, t, autoPlay }) {
  const h = t.here;
  const audio = useRef(null);
  const [status, setStatus] = useState('ready');
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const playing = status === 'playing';

  function toggle() {
    const player = audio.current;
    if (playing) {
      player.pause();
      return;
    }
    if (status === 'error') player.load(); // 다시 받아 본다
    // 실패하면 onError 가 알리거나, 멈춘 상태로 남는다
    player.play().catch((err) => console.error(err.message));
  }

  return (
    <section className="card narration">
      <audio
        ref={audio}
        src={place.audio}
        autoPlay={autoPlay}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => setStatus('playing')}
        onPause={(event) => setStatus(event.currentTarget.ended ? 'ended' : 'paused')}
        onEnded={() => setStatus('ended')}
        onError={() => setStatus('error')}
      />
      <div className="narration-photo">
        <img src={place.photo} alt="" />
        <span className="narration-badge" role="status">
          <span className="narration-dot" />
          {h.status[status]}
        </span>
        <span className="narration-credit">{t.events.visitCredit}</span>
      </div>
      <div className="narration-body">
        <div>
          <h2 className="narration-title" lang="ko">
            {place.name}
          </h2>
          <p className="narration-voice">{h.voice}</p>
        </div>
        <button type="button" className="play-button" aria-label={playing ? h.pause : h.play} onClick={toggle}>
          <Icon name={playing ? 'pause' : 'play'} />
        </button>
        <div className="progress">
          <span>{clock(time)}</span>
          <span className="progress-track">
            <span className="progress-fill" style={{ width: duration ? `${(time / duration) * 100}%` : 0 }} />
          </span>
          <span>{duration ? clock(duration) : '[0:00]'}</span>
        </div>
      </div>
    </section>
  );
}
