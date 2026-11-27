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
  here: (
    <>
      <path d="M12 21c-4.5-4.6-7-8-7-11.5a7 7 0 0114 0c0 3.500-2.500 6.900-7 11.500z" />
      <circle cx="12" cy="9.500" r="2.500" />
    </>
  ),
  course: (
    <>
      <circle cx="6" cy="18" r="2.500" />
      <circle cx="18" cy="6" r="2.500" />
      <path d="M8 16l8-8" />
    </>
  ),
  browse: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </>
  ),
  log: <path d="M6 21V4h12l-3 4.500 3 4.500H6" />,
  play: <path d="M8 5l11 7-11 7z" fill="currentColor" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" />
    </>
  ),
  swap: <path d="M4 9h15l-4-4M20 15H5l4 4" />,
  car: (
    <>
      <path d="M4 16v-4l2-5h12l2 5v4zM4 12h16" />
      <path d="M7 16v2M17 16v2" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.500" r="1.500" />
      <path d="M12 8l-2 6 3 3v4M10 14l-2 7M12 8l3 4h3M12 8l-4 2v3" />
    </>
  ),
  ferry: <path d="M5 13V8h14v5M12 8V4M3 13l9-2 9 2-3 6H6zM3 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
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
