import { LANGS, messages } from '../i18n/index.js';

export default function LanguageScreen({ current, onChoose }) {
  const t = messages[current].language;
  const others = LANGS.filter((code) => code !== current);

  return (
    <div className="language">
      <h1 className="language-title">{t.title}</h1>
      <p className="language-subtitle">
        {others.map((code, index) => (
          <span key={code}>
            {index > 0 && ' / '}
            <span lang={code}>{messages[code].language.title}</span>
          </span>
        ))}
      </p>
      <div className="language-grid">
        {LANGS.map((code) => {
          // 지금 언어의 버튼에는 영어 이름을, 나머지에는 지금 언어로 된 이름을 보여준다
          const subLang = code === current ? 'en' : current;
          return (
            <button
              key={code}
              type="button"
              className="language-card"
              aria-pressed={code === current}
              onClick={() => onChoose(code)}
            >
              <span className="language-native" lang={code}>
                {messages[code].nativeName}
              </span>
              <span className="language-sub" lang={subLang}>
                {messages[subLang].language.names[code]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="language-hint">{t.hint}</p>
    </div>
  );
}
