const DIMS = [
  { key: "quality", w: 0.3 },
  { key: "schedule", w: 0.2 },
  { key: "cost", w: 0.2 },
  { key: "comm", w: 0.15 },
  { key: "safety", w: 0.15 },
];

const total = (s) => Math.round(DIMS.reduce((a, d) => a + s[d.key] * d.w, 0));

export const VENDORS = [
  { id: "v1", name: "山田建設工業", trade: "建築・土木", area: "横浜市", projects: 142, claims: 1, lastEval: 4.6,
    keywords: ["建築", "土木", "足場", "仮設", "RC", "マンション", "修繕"],
    s: { quality: 94, schedule: 82, cost: 71, comm: 80, safety: 90 } },
  { id: "v2", name: "東和電気", trade: "電気設備", area: "川崎市", projects: 98, claims: 0, lastEval: 4.7,
    keywords: ["電気", "設備", "配線", "分電盤"],
    s: { quality: 90, schedule: 93, cost: 78, comm: 85, safety: 88 } },
  { id: "v3", name: "丸新塗装", trade: "塗装・防水", area: "横浜市", projects: 76, claims: 2, lastEval: 4.1,
    keywords: ["塗装", "防水", "外壁", "ペイント"],
    s: { quality: 78, schedule: 80, cost: 91, comm: 74, safety: 82 } },
  { id: "v4", name: "三河内装", trade: "内装・造作", area: "東京都大田区", projects: 64, claims: 0, lastEval: 4.5,
    keywords: ["内装", "造作", "店舗", "リフォーム"],
    s: { quality: 85, schedule: 79, cost: 76, comm: 92, safety: 80 } },
  { id: "v5", name: "北野解体", trade: "解体・土木", area: "横須賀市", projects: 110, claims: 1, lastEval: 4.3,
    keywords: ["解体", "土木", "安全"],
    s: { quality: 80, schedule: 88, cost: 84, comm: 65, safety: 95 } },
  { id: "v6", name: "大島設備", trade: "給排水・空調", area: "横浜市", projects: 87, claims: 1, lastEval: 4.4,
    keywords: ["給排水", "空調", "配管", "設備", "更新", "実績"],
    s: { quality: 83, schedule: 84, cost: 80, comm: 82, safety: 85 } },
  { id: "v7", name: "鉄建スチール", trade: "鉄骨・鍛冶", area: "藤沢市", projects: 53, claims: 0, lastEval: 4.6,
    keywords: ["鉄骨", "鍛冶", "構造"],
    s: { quality: 92, schedule: 74, cost: 73, comm: 76, safety: 91 } },
  { id: "v8", name: "緑化エクステリア", trade: "外構・造園", area: "横浜市", projects: 69, claims: 1, lastEval: 4.2,
    keywords: ["外構", "造園", "駐車場", "エクステリア", "急ぎ", "納期"],
    s: { quality: 81, schedule: 83, cost: 86, comm: 88, safety: 78 } },
];

VENDORS.forEach((v) => {
  v.total = total(v.s);
});

export { total };
