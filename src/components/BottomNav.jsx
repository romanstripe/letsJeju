import Icon from './Icon.jsx';

const TABS = ['here', 'course', 'browse', 'log'];

export default function BottomNav({ t, tab, onSelect }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((id) => (
        <button
          key={id}
          type="button"
          className="nav-button"
          aria-current={tab === id ? 'page' : undefined}
          onClick={() => onSelect(id)}
        >
          <Icon name={id} />
          {t.nav[id]}
        </button>
      ))}
    </nav>
  );
}
