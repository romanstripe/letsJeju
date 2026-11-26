// Kakao Maps JavaScript SDK 를 한 번만 불러온다
let loading;

export function loadKakao() {
  loading ??= new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key) {
      reject(new Error('VITE_KAKAO_JS_KEY 가 .env.local 에 없습니다'));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=clusterer&autoload=false`;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao.maps));
    script.onerror = () => {
      script.remove();
      reject(new Error('Kakao Maps SDK 를 불러오지 못했습니다 (키, 도메인 등록, 네트워크 확인)'));
    };
    document.head.append(script);
  }).catch((err) => {
    loading = undefined;
    throw err;
  });
  return loading;
}
