// 브라우저에 들어 있는 음성 인식(Web Speech API)과 읽기(speechSynthesis)
const CODES = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW' };

// 듣기를 시작한다. 지원하지 않으면 null.
// onText(지금까지 알아들은 글), onEnd(최종 글, 오류 코드)
export function listen(lang, { onText, onEnd }) {
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = CODES[lang];
  recognition.interimResults = true;
  let heard = '';
  let error = null;
  recognition.onresult = (event) => {
    heard = Array.from(event.results, (result) => result[0].transcript).join('');
    onText(heard);
  };
  recognition.onerror = (event) => {
    error = event.error;
  };
  recognition.onend = () => onEnd(heard.trim(), error);
  recognition.start();
  return {
    stop: () => recognition.stop(),
    abort: () => {
      recognition.onend = null;
      recognition.abort();
    },
  };
}

export function speak(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = CODES[lang];
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
