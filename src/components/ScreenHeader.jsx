import HeaderButtons from './HeaderButtons.jsx';

// 모든 화면 공통 위쪽 바: 왼쪽 제목과 설명, 오른쪽 버튼
export default function ScreenHeader({ title, highlight, subtitle, ...buttonProps }) {
  return (
    <header className="screen-header">
      <div>
        <h1 className="screen-title">{title}</h1>
        {subtitle && (
          <p className="screen-subtitle">
            {highlight && <strong className="screen-highlight">{highlight}</strong>}
            {subtitle}
          </p>
        )}
      </div>
      <HeaderButtons {...buttonProps} />
    </header>
  );
}
