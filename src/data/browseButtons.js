// "둘러보기" 위쪽 버튼. 바꿀 때는 이 파일만 고친다. 묶음 사이에 세로줄이 그어진다.
// 쓸 수 있는 값:
//   'trend'  SNS 핫플 (아직 [ ] 자리)
//   'month'  이번 달에만 (행사 + 제철)
//   'foodRestaurant' 식당, 'foodCafe' 카페 (src/data/gourmet.js 중 사진 있는 곳)
//   그 밖에는 src/data/tagGroups.js 의 themeGroups id (예: 'withKids' 아이와, 'cafe' 카페)
export const browseButtons = [
  ['trend', 'month', 'rainyDay', 'activity'],
  ['oreum', 'sea', 'sunriseSunset', 'olle'],
  ['foodRestaurant', 'foodCafe'],
];

export const DEFAULT_BUTTON = 'month';
