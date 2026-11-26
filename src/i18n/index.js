import ko from './ko.js';
import en from './en.js';
import zhCN from './zh-CN.js';
import zhTW from './zh-TW.js';
import ja from './ja.js';

export const messages = { ko, en, 'zh-CN': zhCN, 'zh-TW': zhTW, ja };

// 언어 고르기 화면의 버튼 순서
export const LANGS = ['ko', 'en', 'zh-CN', 'zh-TW', 'ja'];
export const DEFAULT_LANG = 'ko';
