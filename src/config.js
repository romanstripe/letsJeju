// 다크 모드에서 카카오 지도 타일에 씌울 필터. 값만 바꾸면 된다.
// 'A': 색 반전  invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)
// 'B': 어둡게    brightness(0.7) saturate(0.8)
export const DARK_MAP_FILTER = "A";

// 개발용 가짜 현재 위치(제주국제공항). 실제로 읽는 곳은 src/location.js
export const DEV_LOCATION = { lat: 33.5066, lng: 126.493 };

// "둘러보기" 지도의 처음 확대 정도 (숫자가 작을수록 확대)
export const NEARBY_MAP_LEVEL = 9;

// 지도를 눌러 만든 가상 위치가 이 거리 안이면 그 장소의 설명을 튼다 (m).
// 처음 지도에서 손가락으로 누르기 쉽도록 넉넉하게 잡았다. 실제 GPS 를 붙일 때 다시 정한다.
export const NARRATION_RADIUS_M = 1500;
