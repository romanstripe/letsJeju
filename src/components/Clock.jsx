import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Seoul';

// 분이 바뀌는 순간에 맞춰 1분마다 갱신
function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer;
    const tick = () => {
      clearTimeout(timer);
      setNow(new Date());
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  return now;
}

export default function Clock({ lang }) {
  const now = useMinuteClock();
  const date = new Intl.DateTimeFormat(lang, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: TIME_ZONE,
  }).format(now);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TIME_ZONE,
  }).format(now);

  return (
    <>
      <span className="top-date">{date}</span>
      <time className="top-time" dateTime={now.toISOString()}>
        {time}
      </time>
    </>
  );
}
