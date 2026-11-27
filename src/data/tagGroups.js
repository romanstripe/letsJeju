// 비짓제주 alltag 를 묶는 기준표. alltag 는 반드시 이 파일을 거쳐서 쓴다.
// tags 값은 API 원문 태그(완전 일치). 화면에 보일 이름은 id 를 키로 src/i18n/ 에 둔다.

// 테마
export const themeGroups = [
  { id: 'nature', tags: ['자연경관'] }, // 자연·풍경
  { id: 'oreum', tags: ['오름'] }, // 오름
  { id: 'sea', tags: ['해변', '해수욕장'] }, // 바다
  { id: 'photo', tags: ['포토스팟', '경관/포토'] }, // 사진 명소
  { id: 'rest', tags: ['휴식/힐링', '휴식'] }, // 쉬어가기
  { id: 'cafe', tags: ['카페'] }, // 카페
  { id: 'activity', tags: ['체험', '어트랙션'] }, // 놀거리·체험
  { id: 'walk', tags: ['도보여행', '도보'] }, // 걷기
  { id: 'culture', tags: ['문화관광'] }, // 문화·역사
  { id: 'withKids', tags: ['아이', '어린이'] }, // 아이와
  { id: 'withParents', tags: ['부모'] }, // 부모님과
  { id: 'withPartner', tags: ['커플'] }, // 연인과
  { id: 'withFriends', tags: ['친구'] }, // 친구와
  { id: 'solo', tags: ['혼자'] }, // 혼자
  { id: 'rainyDay', tags: ['실내', '실내+실외', '실내관광지'] }, // 비 오는 날
  { id: 'sunriseSunset', tags: ['일출', '일몰', '일몰명소'] }, // 일출·일몰
  { id: 'market', tags: ['전통시장', '오일장'] }, // 시장
  { id: 'olle', tags: ['올레', '올레길', '제주올레', '제주올레길'] }, // 올레길 (올레시장은 제외)
];

// 편의 필터
export const amenityGroups = [
  { id: 'restroom', tags: ['화장실'] }, // 화장실
  { id: 'parking', tags: ['공용주차장', '주차장'] }, // 주차장
  { id: 'wifi', tags: ['무료 WIFI', '공공와이파이존'] }, // 와이파이
  { id: 'convenienceStore', tags: ['편의점'] }, // 편의점
  { id: 'cardPayment', tags: ['카드결제'] }, // 카드결제
  {
    id: 'barrierFree', // 무장애
    tags: ['장애인 화장실', '장애인 전용 주차장', '단차없음', '승강기', '무장애관광'],
  },
];

// 상세 화면에서만 보여주는 태그
export const detailOnlyTags = ['쉬움', '어려움', '아주 어려움', '영어', '중국어'];

// 어디에도 쓰지 않는 태그
export const excludedTags = [
  '비짓제주',
  'visitjeju',
  '제주',
  '제주여행',
  '맑음',
  '가능',
  '불가능',
  '없음',
];
