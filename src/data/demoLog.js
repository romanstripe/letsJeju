// "오늘 기록" 데모용 예시 데이터. 실제 이동 기록이 아니다 (화면에도 "예시" 표시).
// 장소 이름과 좌표는 저장해 둔 비짓제주 데이터, 시각과 머문 시간은 시안의 예시 값.
// 실제 기록을 붙이면 이 파일은 지운다.

// kind: 'visited' 들른 곳, 'passed' 지나가며 설명 들음. note 는 src/i18n/ 의 log.notes
export const demoVisits = [
  { id: 'hamdeok', time: '09:40', kind: 'visited', note: 'stayHeard', name: '함덕해수욕장', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/20/3d61ccf2-3fa8-422a-bc40-8cbafe20c52d.webp', lat: 33.5427261, lng: 126.6690893 },
  { id: 'woljeong', time: '11:05', kind: 'visited', note: 'stay', name: '월정리해수욕장', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/10/6136a994-a08d-495a-a912-0a1e7b1171e8.webp', lat: 33.5551118, lng: 126.798641 },
  { id: 'sehwa', time: '12:30', kind: 'passed', note: 'passed', name: '세화해수욕장', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/24/26a940f4-8517-437c-bef2-88be65dfd157.webp', lat: 33.525305, lng: 126.861276 },
  { id: 'seongsan', time: '13:10', kind: 'visited', note: 'here', name: '성산일출봉', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/20/464d6099-295a-4e60-bd93-9e65388f4d0d.webp', lat: 33.462147, lng: 126.936424 },
];

// 지나쳤지만 못 간 곳
export const demoMissed = [
  { id: 'darangshi', note: 'offRoad', name: '다랑쉬오름', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/60df4e71-fe8d-4fd6-84db-eb078af1be07.webp', lat: 33.474778, lng: 126.82626 },
  { id: 'maze', note: 'offRoad', name: '제주김녕미로공원', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/09/a56a5a58-59e0-4da0-8d4a-6f18d0043d93.webp', lat: 33.5365838, lng: 126.7723967 },
  { id: 'udo', note: 'ferry', name: '우도', photo: 'https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/21/92bf5bba-77fc-4829-8555-5076b2e7bb52.webp', lat: 33.506, lng: 126.953 },
];
