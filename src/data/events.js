// 행사 불러오기와 날짜 계산 (홈, 행사 화면 공통). 날짜는 YYYYMMDD 문자열, 기준은 한국 시간.
import { useEffect, useState } from 'react';

function loadEvents() {
  return fetch('/api/events').then((res) => {
    if (!res.ok) throw new Error(`/api/events ${res.status}`);
    return res.json();
  });
}

export function todayInKorea() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date()).replaceAll('-', '');
}

const toDate = (ymd) => new Date(Date.UTC(ymd.slice(0, 4), ymd.slice(4, 6) - 1, ymd.slice(6, 8)));
const toYmd = (date) => date.toISOString().slice(0, 10).replaceAll('-', '');

// 'today' 오늘, 'week' 오늘~이번 일요일, 'month' 오늘~이번 달 말일
export function rangeEnd(range, today) {
  const d = toDate(today);
  if (range === 'week') d.setUTCDate(d.getUTCDate() + ((7 - d.getUTCDay()) % 7));
  if (range === 'month') d.setUTCMonth(d.getUTCMonth() + 1, 0);
  return toYmd(d);
}

export function formatPeriod(event, lang) {
  const format = new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric', timeZone: 'UTC' });
  const start = format.format(toDate(event.start));
  return event.start === event.end ? start : `${start} ~ ${format.format(toDate(event.end))}`;
}

// 지금 진행 중이거나 예정인 행사만, 시작일 순
export function useCurrentEvents() {
  const [state, setState] = useState({ events: null, failed: false });
  useEffect(() => {
    let cancelled = false;
    loadEvents()
      .then((list) => {
        if (cancelled) return;
        const today = todayInKorea();
        const events = list
          .filter((e) => e.start && e.end >= today)
          .sort((a, b) => a.start.localeCompare(b.start));
        setState({ events, failed: false });
      })
      .catch((err) => {
        console.error(err.message);
        if (!cancelled) setState({ events: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
