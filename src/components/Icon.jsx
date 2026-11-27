// 아이콘 라이브러리 없이 직접 그린 선 아이콘
const PATHS = {
  map: <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" />,
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
  locate: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.500" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
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
  pause: <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />,
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
