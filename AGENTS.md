# 제주 관광 태블릿 웹앱

- 한국어로 설명해줘. 바꾼 파일과 이유를 짧게 요약해줘.
- 한 번에 한 단계만. 끝나면 내가 확인할 방법을 알려주고 멈춰.
- Vite + React. 라이브러리 추가는 먼저 물어봐.
- 화면: 태블릿 가로 1280x800 기준. 세로 모드는 신경 안 씀. 터치 버튼은 최소 44px.
- 디자인은 design/ 폴더의 시안 이미지를 따라. 화면을 만들기 전에 해당 이미지를 먼저 열어 봐.
  01_Language, 02_Main(홈), 03_Map, 04_Course, 05_Events, 06_Trend, 07_Theme, 08_Translate
  각각 \_dark, \_light 두 장. 시안의 지도 그림은 자리 표시일 뿐, 실제는 카카오 지도로.
- 사용자: 제주 택시 승객, 렌터카 관광객. 그래서 다국어가 기본.
  - 지원 언어: ko, en, ja, zh-CN, zh-TW. 화면 글자는 src/i18n/ 에 언어별 파일로. 하드코딩 금지.
  - 비짓제주 locale 매핑: ko→kr, en→en, ja→jp, zh-CN→cn, zh-TW→zh
- 다크/라이트 모드. 색은 CSS 변수로만 (아래 토큰).
- API 키는 절대 화면 코드에 넣지 마. VITE_KAKAO_JS_KEY만 예외.
  비짓제주(https), 관광공사, 카카오 REST는 /api/... 를 거쳐서 부른다.
  개발 중: vite.config.js 의 server.proxy, 배포: Vercel 함수(api/ 폴더).
- 실제 데이터가 없는 자리는 [ ]로 비워 두고, 지어낸 가게 이름이나 숫자 넣지 마.
- 브랜드 이름, 로고 쓰지 마.

## 색 토큰

다크: bg #121517, card #1B2023, chip #1D2225, item #22282B, line #3A4146,
text #F2F0EB, sub #C9C6BF, faint #9E9B94, accent #F28C28(감귤), teal #4FB3BF, on-accent #121517
라이트(제주 바다): bg #EEF6FA, card #FFFFFF, chip #E3EFF6, item #F1F7FB, line #C3D7E3,
text #0F2A3A, sub #46606F, faint #5B7483, accent #0A6EAD, teal #0E7C86, on-accent #FFFFFF
글꼴: 한국어/영어 Pretendard, 일본어 Pretendard JP, 중국어 Noto Sans SC/TC

## 화면 구성

아래 메뉴 6개: 홈, 지도·코스, 행사, 트렌드, 테마, 번역
처음 켜면 언어 고르기 화면. 오른쪽 위에 언어 버튼, 밝기 버튼 항상 있음.
나레이션(위치 기반 설명)은 나중 단계. 지금은 만들지 마.

## API 메모

- 비짓제주: 5,943건. 장소 정보의 기본 출처. kr 전체, en 1페이지만 확인함.
  요청: GET https://api.visitjeju.net/vsjApi/contents/searchList?apiKey=&locale=&page=
  검색 조건이 page, cid 뿐. 한 페이지 100개. 전부 받아서 저장해 두고 쓴다.
  쓸 필드: contentsid, contentscd(분류), title, region1cd/region2cd, address, roadaddress,
  alltag/tag(테마·편의시설·소요시간), introduction, latitude, longitude, phoneno, repPhoto
  좌표 없는 항목 883건 → 나중에 TourAPI 이름 매칭, 안 되면 카카오 주소 검색으로 채움.
  alltag 에 편의시설·난이도·테마가 섞여 있음. 쓸 때는 반드시 src/data/tagGroups.js 를 거쳐.
  숙박(숙소, 펜션, 바비큐 등)은 이 앱에서 안 씀.
- TourAPI: KorService2. 제주는 lDongRegnCd=50 (제주시 110, 서귀포시 130). areaCode 쓰지 마.
  행사(searchFestival2)는 날짜가 있어서 행사 화면의 출처. 비짓제주 행사(c5)는 날짜가 없어서 행사 화면에 안 씀.
  다국어 서비스(Eng/Jpn/Chs/Cht)는 아직 미신청 → 지금은 한국어만.
  좌표가 전부 있으니 좌표 보충용으로도 씀.
- 행사 화면은 두 칸: "행사"(TourAPI 날짜 기준, 지금 진행 중이거나 예정) + "제철"(월별로 직접 적은 목록, src/data/seasonal.js).
  행사가 0건이면 빈 화면 대신 "지금은 예정된 행사가 없어요" + 제철 칸을 먼저 보여줘.
- 카카오: 지도는 JavaScript SDK, 길찾기·주소검색은 REST 키로 서버에서만.
