// localStorage 를 못 쓰는 환경(사생활 보호 모드 등)에서도 화면은 동작해야 한다
export function load(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장하지 못하면 이번 화면에서만 유지
  }
}
