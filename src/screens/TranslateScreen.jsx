import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { messages } from '../i18n/index.js';
import { listen, speak, stopSpeaking } from '../speech.js';

const DRIVER = 'ko';
const EMPTY = { original: '', translated: '', error: null, busy: false };
const ERRORS = { 'not-allowed': 'denied', 'service-not-allowed': 'denied', 'no-speech': 'noSpeech', network: 'network' };

async function translate(text, source, target) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, source, target }),
  });
  if (!res.ok) throw new Error(`/api/translate ${res.status}`);
  return (await res.json()).text;
}

// 한쪽 대화 칸. 말한 사람의 말이 크게, 상대 언어 번역이 아래에.
function Side({ who, lang, other, label, state, listening, onMic }) {
  const text = messages[lang].translate;
  const status = state.error ? text.errors[state.error] : listening ? text.listening : null;
  return (
    <section className={`card talk talk-${who}`}>
      <p className="talk-label" lang={lang}>
        {label} · {messages[lang].nativeName}
      </p>
      <div className="talk-body" aria-live="polite">
        {state.original ? (
          <p className="talk-original" lang={lang}>
            {state.original}
          </p>
        ) : (
          <p className="talk-hint" lang={lang}>
            {text.hint}
          </p>
        )}
        {state.busy && (
          <p className="talk-translated" lang={lang}>
            {text.translating}
          </p>
        )}
        {state.translated && (
          // 번역을 누르면 다시 읽어 준다
          <button type="button" className="talk-translated" lang={other} onClick={() => speak(state.translated, other)}>
            {state.translated}
          </button>
        )}
        {status && (
          <p className="talk-status" lang={lang} role="status">
            {status}
          </p>
        )}
      </div>
      <button
        type="button"
        className="mic-button"
        aria-label={listening ? text.micStop : text.micStart}
        aria-pressed={listening}
        onClick={onMic}
      >
        <Icon name="mic" size={34} />
      </button>
    </section>
  );
}

export default function TranslateScreen({ passenger }) {
  const [sides, setSides] = useState({ passenger: EMPTY, driver: EMPTY });
  const [listening, setListening] = useState(null);
  const recognition = useRef(null);
  const latest = useRef(0); // 늦게 온 이전 번역은 버린다
  const lang = { passenger, driver: DRIVER };

  const update = (who, patch) => setSides((prev) => ({ ...prev, [who]: { ...prev[who], ...patch } }));

  function cancel() {
    latest.current += 1;
    recognition.current?.abort();
    recognition.current = null;
    setListening(null);
    stopSpeaking();
    setSides((prev) => ({
      passenger: { ...prev.passenger, busy: false },
      driver: { ...prev.driver, busy: false },
    }));
  }

  useEffect(
    () => () => {
      latest.current += 1;
      recognition.current?.abort();
      stopSpeaking();
    },
    [],
  );

  function toggleMic(who) {
    if (listening === who) {
      recognition.current?.stop();
      return;
    }
    cancel();
    const turn = latest.current;
    const other = who === 'passenger' ? 'driver' : 'passenger';
    const session = listen(lang[who], {
      onText: (original) => update(who, { original }),
      onEnd: async (original, error) => {
        recognition.current = null;
        setListening(null);
        if (!original) {
          update(who, { error: ERRORS[error] ?? (error === 'aborted' ? null : 'noSpeech') });
          return;
        }
        update(who, { original, busy: true });
        try {
          const translated = await translate(original, lang[who], lang[other]);
          if (latest.current !== turn) return;
          update(who, { translated, busy: false });
          speak(translated, lang[other]);
        } catch (err) {
          console.error(err.message);
          if (latest.current === turn) update(who, { error: 'translate', busy: false });
        }
      },
    });
    if (!session) {
      update(who, { ...EMPTY, error: 'unsupported' });
      return;
    }
    recognition.current = session;
    setListening(who);
    update(who, EMPTY);
  }

  // 자주 쓰는 말은 미리 번역해 둔 문장이라 API 를 부르지 않는다
  function sayPhrase(index) {
    cancel();
    const korean = messages[DRIVER].translate.phrases[index];
    update('passenger', { original: messages[passenger].translate.phrases[index], translated: korean, error: null });
    speak(korean, DRIVER);
  }

  return (
    <div className="translate">
      <div className="talks">
        {['passenger', 'driver'].map((who) => (
          <Side
            key={who}
            who={who}
            lang={lang[who]}
            other={who === 'passenger' ? DRIVER : passenger}
            label={messages[lang[who]].translate[who]}
            state={sides[who]}
            listening={listening === who}
            onMic={() => toggleMic(who)}
          />
        ))}
      </div>
      <div className="phrases" lang={passenger}>
        {messages[passenger].translate.phrases.map((phrase, index) => (
          <button key={phrase} type="button" className="filter-button" onClick={() => sayPhrase(index)}>
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
}
