import HeaderButtons from './HeaderButtons.jsx';

// 모든 화면 공통 위쪽 바: 왼쪽 제목, 오른쪽 버튼
export default function ScreenHeader({ title, ...buttonProps }) {
  return (
    <header className="screen-header">
      <h1 className="screen-title">{title}</h1>
      <HeaderButtons {...buttonProps} />
    </header>
  );
}
