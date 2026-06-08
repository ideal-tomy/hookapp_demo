import { VENDORS } from "../_data/vendors.js";

const KEYWORD_RULES = [
  { words: ["塗装", "外壁", "防水", "ペイント"], vendorId: "v3", reason: (v) => `塗装・防水が専門で、コストスコア${v.s.cost}点と予算重視の案件に適しています。` },
  { words: ["外構", "駐車場", "造園", "エクステリア"], vendorId: "v8", reason: (v) => `外構・造園の実績があり、対応力スコア${v.s.comm}点で急ぎの相談にも柔軟に対応できます。` },
  { words: ["給排水", "配管", "空調", "設備", "更新"], vendorId: "v6", reason: (v) => `給排水・空調更新の実績${v.projects}件があり、品質スコア${v.s.quality}点で安心感があります。` },
  { words: ["電気", "配線"], vendorId: "v2", reason: (v) => `電気設備の納期遵守スコア${v.s.schedule}点が高く、工程厳守の案件向きです。` },
  { words: ["内装", "店舗", "造作"], vendorId: "v4", reason: (v) => `内装・造作に強く、対応力スコア${v.s.comm}点で打ち合わせがスムーズです。` },
  { words: ["解体", "土木"], vendorId: "v5", reason: (v) => `安全管理スコア${v.s.safety}点が突出しており、安全重視の現場に最適です。` },
  { words: ["鉄骨", "構造"], vendorId: "v7", reason: (v) => `鉄骨・鍛冶の施工品質${v.s.quality}点が高く、構造工事の信頼性があります。` },
  { words: ["建築", "足場", "仮設", "修繕", "RC", "マンション"], vendorId: "v1", reason: (v) => `建築・土木の総合スコア${v.total}点で、大規模修繕の主担当として実績豊富です。` },
];

function scoreVendor(v, query, priority) {
  let score = v.total * 0.3;
  if (v.keywords.some((k) => query.includes(k))) score += 40;
  if (v.trade.split("・").some((t) => query.includes(t))) score += 20;
  if (v.area.replace("市", "").split("・").some((a) => query.includes(a))) score += 10;
  if (priority === "cost" && (query.includes("予算") || query.includes("コスト") || query.includes("安"))) score += v.s.cost * 0.3;
  if (priority === "schedule" && (query.includes("急") || query.includes("納期"))) score += v.s.schedule * 0.3;
  if (priority === "quality" && (query.includes("実績") || query.includes("品質"))) score += v.s.quality * 0.3;
  return score;
}

function pickReason(v, query) {
  const rule = KEYWORD_RULES.find((r) => r.words.some((w) => query.includes(w)) && r.vendorId === v.id);
  if (rule) return rule.reason(v);
  if (query.includes("予算") || query.includes("コスト")) return `コストスコア${v.s.cost}点で、費用対効果のバランスが良好です。`;
  if (query.includes("急") || query.includes("納期")) return `納期遵守スコア${v.s.schedule}点で、短期案件にも対応可能です。`;
  if (query.includes("実績") || query.includes("品質")) return `施工品質${v.s.quality}点・累計施工${v.projects}件と実績が豊富です。`;
  return `総合スコア${v.total}点・${v.area}エリアで、ご要望に適合度が高いです。`;
}

function detectPriority(query) {
  if (query.includes("予算") || query.includes("コスト") || query.includes("安")) return "cost";
  if (query.includes("急") || query.includes("納期")) return "schedule";
  if (query.includes("実績") || query.includes("品質")) return "quality";
  return null;
}

function pickVendors(query) {
  const priority = detectPriority(query);
  const ranked = [...VENDORS]
    .map((v) => ({ v, score: scoreVendor(v, query, priority) }))
    .sort((a, b) => b.score - a.score);

  const keywordMatch = KEYWORD_RULES.find((r) => r.words.some((w) => query.includes(w)));
  const primary = keywordMatch
    ? VENDORS.find((v) => v.id === keywordMatch.vendorId) || ranked[0].v
    : ranked[0].v;
  const secondary = ranked.find((r) => r.v.id !== primary.id)?.v;

  return secondary ? [primary, secondary] : [primary];
}

export function generateDemoResponse(messages) {
  const lastUser = [...(messages || [])].reverse().find((m) => m.role === "user");
  const query = (lastUser?.text || "").toLowerCase();

  if (!query) {
    return "ご要望をもう少し詳しく教えてください。工種・エリア・予算・重視点が分かると、最適な業者をご提案できます。";
  }

  const picks = pickVendors(query);
  const lines = picks.map((v, i) => {
    const rank = i === 0 ? "【第1候補】" : "【第2候補】";
    return `${rank} ${v.name}（${v.trade}／${v.area}）\n→ ${pickReason(v, query)}`;
  });

  return `ご要望をもとに、登録業者から以下をご提案します（デモ用の自動応答）。\n\n${lines.join("\n\n")}`;
}
