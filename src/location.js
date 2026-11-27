import { DEV_LOCATION } from './config.js';

// 현재 위치를 얻는 곳은 여기 하나. 지금은 개발용 가짜 위치를 돌려준다.
// 태블릿 GPS 를 붙일 때는 이 함수 안에서만 값을 바꾼다.
// (state 로 들고 navigator.geolocation.watchPosition 으로 갱신)
export function useCurrentLocation() {
  return DEV_LOCATION;
}
