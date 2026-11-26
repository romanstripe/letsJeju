// 아이콘 라이브러리 없이 직접 그린 선 아이콘
const PATHS = {
  logo: <path d="M3 18l6-10 4 6 2-3 6 7z" />,
  home: <path d="M4 11l8-7 8 7v9H4z" />,
  map: <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" />,
  events: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  theme: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  translate: <path d="M3 5h10M8 3v2M11 5c-1 5-4 8-8 10M5 9c2 3 4 5 7 6M12 21l4.5-10L21 21M13.8 17h5.4" />,
  weather: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 2v1M2 8h1M3.8 3.8l.7.7M12.2 3.8l-.7.7M9 20a4 4 0 010-8 5 5 0 019.5 1.5A3.3 3.3 0 0118 20z" />
    </>
  ),
  brightness: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 010 16z" fill="currentColor" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
};

export default function Icon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
