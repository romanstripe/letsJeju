import Icon from './Icon.jsx';

// 코스에 담은 뒤 아래에 잠깐 뜨는 알림. onGo 가 없으면(이미 "지금 여기") 이동 버튼은 숨긴다.
export default function CourseNotice({ course, t, onGo }) {
  const { stops, notice, close } = course;
  if (!notice) return null;
  const m = t.myCourse;

  let message = m.started;
  if (notice.type === 'added') {
    const index = stops.findIndex((stop) => stop.id === notice.id);
    if (index < 0) return null;
    if (stops.length === 1) message = m.created;
    else if (index === 0) message = m.addedFirst;
    else message = m.addedAfter.replace('{name}', stops[index - 1].name);
  }

  return (
    <div className="course-toast" role="status">
      <p>
        {message}
        <span className="course-toast-count">{m.count.replace('{n}', stops.length)}</span>
      </p>
      {onGo && (
        <button
          type="button"
          className="course-toast-go"
          onClick={() => {
            close();
            onGo();
          }}
        >
          {m.goHere}
        </button>
      )}
      <button type="button" className="course-toast-close" aria-label={t.events.close} onClick={close}>
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}
