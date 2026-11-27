// "오늘 기록" 데모용 예시 데이터. 실제 이동 기록이 아니다 (화면에도 "예시" 표시).
// 장소 이름과 좌표는 저장해 둔 비짓제주 데이터, 시각과 머문 시간은 시안의 예시 값.
// 실제 기록을 붙이면 이 파일은 지운다.

// kind: 'visited' 들른 곳, 'passed' 지나가며 설명 들음. note 는 src/i18n/ 의 log.notes
export const demoVisits = [
  { id: 'hamdeok', time: '09:40', kind: 'visited', note: 'stayHeard', name: '함덕해수욕장', lat: 33.5427261, lng: 126.6690893 },
  { id: 'woljeong', time: '11:05', kind: 'visited', note: 'stay', name: '월정리해수욕장', lat: 33.5551118, lng: 126.798641 },
  { id: 'sehwa', time: '12:30', kind: 'passed', note: 'passed', name: '세화해수욕장', lat: 33.525305, lng: 126.861276 },
  { id: 'seongsan', time: '13:10', kind: 'visited', note: 'here', name: '성산일출봉', lat: 33.462147, lng: 126.936424 },
];

// 지나쳤지만 못 간 곳
export const demoMissed = [
  { id: 'darangshi', note: 'offRoad', name: '다랑쉬오름', lat: 33.474778, lng: 126.82626 },
  { id: 'maze', note: 'offRoad', name: '제주김녕미로공원', lat: 33.5365838, lng: 126.7723967 },
  { id: 'udo', note: 'ferry', name: '우도', lat: 33.506, lng: 126.953 },
];
