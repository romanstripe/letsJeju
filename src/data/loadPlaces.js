// 장소 목록을 불러오는 곳은 여기 하나. 서버가 바뀌면 이 함수만 고친다.
let request;

export function loadPlaces() {
  request ??= fetch('/api/places')
    .then((res) => {
      if (!res.ok) throw new Error(`/api/places ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      request = undefined; // 다음에 다시 시도
      throw err;
    });
  return request;
}
