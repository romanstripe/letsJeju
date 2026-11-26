// 태그 묶음 점검 스크립트 (저장된 data/visitjeju_kr.json 사용, API 호출 없음)
// 실행: node scripts/check-tags.mjs
import { readFile } from 'node:fs/promises';
import { themeGroups, amenityGroups } from '../src/data/tagGroups.js';

const NAMES = {
  nature: '자연·풍경', oreum: '오름', sea: '바다', photo: '사진 명소', rest: '쉬어가기',
  cafe: '카페', activity: '놀거리·체험', walk: '걷기', culture: '문화·역사', withKids: '아이와',
  withParents: '부모님과', withPartner: '연인과', withFriends: '친구와', solo: '혼자',
  restroom: '화장실', parking: '주차장', wifi: '와이파이', convenienceStore: '편의점',
  cardPayment: '카드결제', barrierFree: '무장애', rainyDay: '비 오는 날', sunriseSunset: '일출·일몰',
};
const KEYWORDS = ['러닝', '자전거', '올레', '일출', '일몰', '실내'];

const raw = await readFile(new URL('../data/visitjeju_kr.json', import.meta.url), 'utf8');
const items = JSON.parse(raw).map((i) => ({
  category: i.contentscd?.value,
  tags: new Set(String(i.alltag ?? '').split(',').map((t) => t.trim()).filter(Boolean)),
}));
const noStay = items.filter((i) => i.category !== 'c3');

const count = (list, tags) => list.filter((i) => tags.some((t) => i.tags.has(t))).length;

function printGroups(title, groups) {
  console.log(`\n=== ${title} (장소 수, 묶음 안 중복은 한 번) ===`);
  console.log('묶음\t전체\t숙박 제외\t그중 행사(c5)');
  for (const { id, tags } of groups) {
    const events = count(items.filter((i) => i.category === 'c5'), tags);
    console.log(`${NAMES[id] ?? id}\t${count(items, tags)}\t${count(noStay, tags)}\t${events}`);
  }
}

console.log(`항목 ${items.length} / 숙박(c3) 제외 ${noStay.length}`);
printGroups('테마', themeGroups);
printGroups('편의 필터', amenityGroups);

const allTags = new Set(items.flatMap((i) => [...i.tags]));
for (const keyword of KEYWORDS) {
  const found = [...allTags]
    .filter((t) => t.includes(keyword))
    .map((t) => [t, count(items, [t])])
    .sort((a, b) => b[1] - a[1]);
  console.log(
    `\n=== "${keyword}" 포함 태그 ${found.length}종, 해당 장소 ${count(items, found.map((f) => f[0]))}곳 (숙박 제외 ${count(noStay, found.map((f) => f[0]))}) ===`,
  );
  console.log(found.map(([t, n]) => `${t} ${n}`).join(' | '));
}
