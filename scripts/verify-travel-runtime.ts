/**
 * 运行时验证：直接调用 getTravelData()（真实代码路径），确认连拍/同景折叠生效。
 * 用法：npx tsx scripts/verify-travel-runtime.ts
 */
import { getTravelData } from '../src/lib/travel';

const data = getTravelData();
console.log('visible photos:', data.photos.length);

const byDate: Record<string, number> = {};
for (const p of data.photos) byDate[p.date] = (byDate[p.date] || 0) + 1;
console.log('visible by date:', JSON.stringify(byDate));

let fail = 0;

// 1) 显式同景组必须折叠成堆叠（代表帧 = 列表第一张）
const expectedStacks: Record<string, [size: number, kind: string]> = {
  lz02: [7, 'group'],
  lz13: [3, 'group'],
  lz16: [3, 'group'],
  ck02: [2, 'group'],
  ck04: [4, 'group'],
  ck08: [3, 'group'],
  dkx05672: [3, 'group'], // 天峻小狗
  // 抽查一段帧号连拍
  dkx06091: [60, 'burst'],
};
for (const [id, [size, kind]] of Object.entries(expectedStacks)) {
  const p = data.photos.find((x) => x.id === id);
  const got = p ? `${p.burst?.length ?? 0}/${p.stackKind}` : 'missing';
  const ok = !!p && p.burst?.length === size && p.stackKind === kind;
  console.log(`${ok ? 'OK  ' : 'FAIL'} stack ${id} expect ${size}/${kind} got ${got}`);
  if (!ok) fail++;
}

// 2) 被折叠的帧绝不能出现在可见列表里
const shouldBeHidden = [
  'lz03', 'lz04', 'lz05', 'lz06', 'lz07', 'lz08',
  'lz14', 'lz15', 'lz17', 'lz18',
  'ck03', 'ck05', 'ck06', 'ck07', 'ck09', 'ck10',
  'dkx05675', 'dkx05680',
];
for (const id of shouldBeHidden) {
  if (data.photos.some((x) => x.id === id)) {
    console.log('FAIL visible but should be hidden:', id);
    fail++;
  }
}

// 3) 人像必须单独可见、未被合并（solo / 无堆叠）
for (const id of ['dkx06190', 'dkx06196', 'dkx06213', 'dkx06215']) {
  const p = data.photos.find((x) => x.id === id);
  const ok = !!p && !p.burst;
  console.log(`${ok ? 'OK  ' : 'FAIL'} solo portrait ${id} visible=${!!p} burst=${p?.burst?.length ?? 0}`);
  if (!ok) fail++;
}

console.log(fail === 0 ? 'ALL PASS' : `${fail} FAILURE(S)`);
process.exit(fail === 0 ? 0 : 1);
