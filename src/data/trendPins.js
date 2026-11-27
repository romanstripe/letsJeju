// "요즘 제주"에 언급 수와 상관없이 항상 먼저 넣는 곳. 넣고 빼려면 이 파일만 고친다.
// 주소·좌표는 네이버 지역 검색 결과 (2026-11-27 확인). 지점이 여러 곳이면 한 곳만 적었다.
export const trendPins = [
  {
    placeName: '거부기밥',
    category: '분식>주먹밥',
    address: '제주특별자치도 제주시 관덕로14길 16 제주동문시장 8번게이트 야시장',
    lat: 33.5116532,
    lng: 126.5260888,
  },
  {
    placeName: '아베베 베이커리 제주',
    category: '카페,디저트>베이커리',
    address: '제주특별자치도 제주시 동문로6길 4 1-3층',
    lat: 33.5126449,
    lng: 126.5287932,
  },
  {
    placeName: '다정이네 올레시장 본점',
    placeId: 'CNTS_200000000012717', // 비짓제주
    category: '분식>김밥',
    address: '제주특별자치도 서귀포시 동문로 59-1',
    lat: 33.2494066,
    lng: 126.5667821,
  },
];

// 저장 데이터에 사진이 없는 곳에 직접 넣는 사진 (가게 바깥 사진 등, 써도 되는 것만).
// 파일은 public/trend-photos/ 에 두고 '카드에 보이는 이름': '/trend-photos/파일.jpg' 로 적는다.
// 인스타 캡처는 계정 주인의 허락을 받기 전까지 개발용 (public/trend-photos/ 는 git 에 올리지 않는다)
export const trendPhotos = {
  '거부기밥': '/trend-photos/geobugibap.png',
  '고결 고등어 숯불 반상': '/trend-photos/gogyeol.png',
  '무신사 스탠다드 제주 도남점': '/trend-photos/musinsa.png',
  '픽업카페 애월점': '/trend-photos/pickup.png',
};

// 상세 화면의 추천 메뉴. 확인한 것만 직접 적는다 (없으면 안 보임).
// '카드에 보이는 이름': '메뉴, 메뉴'
export const trendMenus = {};
