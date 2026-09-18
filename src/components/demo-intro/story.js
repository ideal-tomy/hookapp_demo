const steps = [
  ["業者を比較", 5000, [0], "協力業者を、同じ評価軸で比較します。"],
  ["評価の内訳へ", 4000, [0, 1], "気になる業者を選び、評価の内訳へ。"],
  ["強みと実績", 6000, [1], "総合点だけでなく、納期・品質・実績まで確認。"],
  ["案件に合わせる", 4000, [1, 2], "次は案件に必要な協力体制を確認します。"],
  ["必要工種を確認", 5000, [2], "案件の規模と必要工種を、ひと目で把握。"],
  ["候補を見比べる", 4000, [2, 3], "必要な工種ごとに、協力業者の候補が並びます。"],
  ["協力体制を確認", 6000, [3], "誰にどの工種を任せるか、適合度と一緒に確認。"],
  ["要望を相談", 4000, [3, 4], "個別の要望は、選定アシスタントへ。"],
  ["言葉で伝える", 5000, [4], "工事内容と予算を、いつもの言葉で伝えます。"],
  ["提案が届く", 4000, [4, 5], "条件に合う候補を、理由付きで提案。"],
  ["理由を読んで選ぶ", 8000, [5], "提案理由を読み、次に相談する業者を検討できます。"],
];
export const panels = [
  { id: "ranking", title: "業者スコアリング", state: "一覧から選ぶ" },
  { id: "detail", title: "業者スコアリング", state: "選んだ業者の詳細" },
  { id: "project", title: "協業マッチング", state: "案件条件" },
  { id: "team", title: "協業マッチング", state: "推奨協力体制" },
  { id: "ask", title: "選定アシスタント", state: "要望を送る" },
  { id: "reply", title: "選定アシスタント", state: "候補と選定理由" },
];
export const scenes = steps.map(([title, duration, stars, caption]) => ({
  title, duration, stars, caption,
  x: (stars[0] + stars[stars.length - 1]) * 250 + 230,
  fit: stars.length === 2 ? 980 : 480,
}));
export const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
export function storyFrame(time) {
  let elapsed = ((time % totalDuration) + totalDuration) % totalDuration;
  let index = 0;
  while (index < scenes.length - 1 && elapsed >= scenes[index].duration) elapsed -= scenes[index++].duration;
  const scene = scenes[index];
  const previous = scenes[Math.max(0, index - 1)];
  const t = Math.min(1, elapsed / 1200);
  const ease = t * t * (3 - 2 * t);
  return { index, elapsed, scene, x: previous.x + (scene.x - previous.x) * ease, fit: previous.fit + (scene.fit - previous.fit) * ease };
}
