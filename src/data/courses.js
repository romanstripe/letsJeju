// "추천 코스" 데이터. 직접 채운다. 비어 있으면 화면에 [ ] 자리가 보인다.
//
// 코스 형식 (글자는 { ko, en, ja, 'zh-CN', 'zh-TW' }, 없는 언어는 ko 를 보여줌):
// {
//   id: 'east-day',
//   filters: ['day'],            // 아래 courseFilters 값. 여러 개 가능
//   name: { ko: '' },            // 코스 이름
//   summary: { ko: '' },         // 목록 카드의 장소 요약
//   kind: { ko: '' },            // 목록 카드의 마지막 줄 (예: 기간과 곳 수)
//   description: { ko: '' },     // 오른쪽 패널 설명
//   stops: [
//     { name: { ko: '' }, note: { ko: '' }, stay: { ko: '' }, lat: 0, lng: 0 },  // lat, lng 가 있으면 지도에 핀
//   ],
// }
export const courses = [];

// 위쪽 필터 버튼. 화면 이름은 src/i18n/ 의 course.filters
export const courseFilters = ['all', 'day', 'twoDays', 'cafe', 'gourmet', 'trend', 'walk'];
export const DEFAULT_FILTER = 'day';
