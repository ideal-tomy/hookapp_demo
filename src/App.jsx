import { useState, useRef, useEffect } from "react";
import { RoiPaybackCta } from "./components/RoiPaybackCta";
import { DemoIntro } from "./components/demo-intro/DemoIntro";
import { generateDemoResponse } from "../api/_lib/demoChat";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";
import {
  Activity, Layers, MessageSquareText, ShieldCheck, Clock, Coins,
  Hammer, Users, MapPin, TrendingUp, TrendingDown, Send, Sparkles,
  CheckCircle2, ArrowRight, Building2, Search,
} from "lucide-react";

/* ============================ DATA ============================ */
const DIMS = [
  { key: "quality", label: "施工品質", w: 0.3, icon: Hammer },
  { key: "schedule", label: "納期遵守", w: 0.2, icon: Clock },
  { key: "cost", label: "コスト", w: 0.2, icon: Coins },
  { key: "comm", label: "対応力", w: 0.15, icon: Users },
  { key: "safety", label: "安全管理", w: 0.15, icon: ShieldCheck },
];

const VENDORS = [
  { id: "v1", name: "山田建設工業", trade: "建築・土木", area: "横浜市", projects: 142, claims: 1, lastEval: 4.6, trend: +3,
    s: { quality: 94, schedule: 82, cost: 71, comm: 80, safety: 90 } },
  { id: "v2", name: "東和電気", trade: "電気設備", area: "川崎市", projects: 98, claims: 0, lastEval: 4.7, trend: +5,
    s: { quality: 90, schedule: 93, cost: 78, comm: 85, safety: 88 } },
  { id: "v3", name: "丸新塗装", trade: "塗装・防水", area: "横浜市", projects: 76, claims: 2, lastEval: 4.1, trend: -2,
    s: { quality: 78, schedule: 80, cost: 91, comm: 74, safety: 82 } },
  { id: "v4", name: "三河内装", trade: "内装・造作", area: "東京都大田区", projects: 64, claims: 0, lastEval: 4.5, trend: +1,
    s: { quality: 85, schedule: 79, cost: 76, comm: 92, safety: 80 } },
  { id: "v5", name: "北野解体", trade: "解体・土木", area: "横須賀市", projects: 110, claims: 1, lastEval: 4.3, trend: 0,
    s: { quality: 80, schedule: 88, cost: 84, comm: 65, safety: 95 } },
  { id: "v6", name: "大島設備", trade: "給排水・空調", area: "横浜市", projects: 87, claims: 1, lastEval: 4.4, trend: +2,
    s: { quality: 83, schedule: 84, cost: 80, comm: 82, safety: 85 } },
  { id: "v7", name: "鉄建スチール", trade: "鉄骨・鍛冶", area: "藤沢市", projects: 53, claims: 0, lastEval: 4.6, trend: +4,
    s: { quality: 92, schedule: 74, cost: 73, comm: 76, safety: 91 } },
  { id: "v8", name: "緑化エクステリア", trade: "外構・造園", area: "横浜市", projects: 69, claims: 1, lastEval: 4.2, trend: +1,
    s: { quality: 81, schedule: 83, cost: 86, comm: 88, safety: 78 } },
];

const total = (s) => Math.round(DIMS.reduce((a, d) => a + s[d.key] * d.w, 0));
VENDORS.forEach((v) => (v.total = total(v.s)));

const scoreColor = (n) =>
  n >= 88 ? "var(--good)" : n >= 78 ? "var(--mid)" : "var(--bad)";

/* ============================ SHELL ============================ */
const TABS = [
  { id: "score", label: "業者スコアリング", sub: "自動査定", icon: Activity },
  { id: "match", label: "協業マッチング", sub: "外注先の自動抽出", icon: Layers },
  { id: "assist", label: "選定アシスタント", sub: "顧客向けAI", icon: MessageSquareText },
];

export default function App() {
  const readTab = () => ["score", "match", "assist"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "intro";
  const [tab, setTab] = useState(readTab);
  useEffect(() => {
    const update = () => setTab(readTab());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const enter = (next) => { location.hash = next === "intro" ? "" : next; setTab(next); window.scrollTo(0, 0); };
  return (
    <div className="tk-root">
      <style>{CSS}</style>
      <header className="tk-head">
        <div className="tk-brand">
          <div className="tk-logo"><Building2 size={20} strokeWidth={2.4} /></div>
          <div>
            <div className="tk-name">匠ネットワーク <span>TAKUMI&nbsp;NETWORK</span></div>
            <div className="tk-tag">登録業者の査定・マッチング・選定を自動化する協力業者プラットフォーム</div>
          </div>
        </div>
        <div className="tk-meta">
          {tab !== "intro" && <button className="ti-back" type="button" onClick={() => enter("intro")}>紹介を見る</button>}
          <span className="tk-pill">登録業者 <b>{VENDORS.length}</b> 社</span>
          <span className="tk-pill tk-pill--demo">DEMO</span>
        </div>
      </header>

      {tab !== "intro" && <nav className="tk-tabs">
        {TABS.map((t) => {
          const I = t.icon;
          return (
            <button key={t.id} onClick={() => enter(t.id)}
              className={"tk-tab" + (tab === t.id ? " is-on" : "")}>
              <I size={17} strokeWidth={2.2} />
              <span className="tk-tab-l">{t.label}</span>
              <span className="tk-tab-s">{t.sub}</span>
            </button>
          );
        })}
      </nav>}

      <main className="tk-main">
        {tab === "intro" && <DemoIntro renderScreen={renderIntroScreen} onEnter={enter} />}
        {tab === "score" && <ScoringView />}
        {tab === "match" && <MatchingView />}
        {tab === "assist" && <AssistantView />}
      </main>

      <RoiPaybackCta />

      <footer className="tk-foot">
        <span>Powered by <b>AXEON</b> — 株式会社アクシオン</span>
        <span className="tk-foot-r">査定ロジックはデモ用のサンプルデータに基づきます</span>
      </footer>
    </div>
  );
}

/* ===================== 1. SCORING ===================== */
function ScoringView({ preview = false } = {}) {
  const [sel, setSel] = useState(preview ? VENDORS[1] : VENDORS[0]);
  const radarData = DIMS.map((d) => ({ dim: d.label, v: sel.s[d.key] }));
  return (
    <div className="tk-grid2">
      <section className="tk-card tk-list-wrap">
        <div className="tk-card-head">
          <h2>登録業者ランキング</h2>
          <p className="tk-note">実績件数・完工評価・納期実績・クレーム件数を統合し自動スコア化（100点満点）</p>
        </div>
        <div className="tk-list">
          {[...VENDORS].sort((a, b) => b.total - a.total).map((v, i) => (
            <button key={v.id} onClick={() => setSel(v)}
              className={"tk-row" + (sel.id === v.id ? " is-on" : "")}>
              <span className="tk-rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="tk-row-main">
                <span className="tk-row-name">{v.name}</span>
                <span className="tk-row-sub">{v.trade}・{v.area}</span>
              </span>
              <span className="tk-row-score" style={{ color: scoreColor(v.total) }}>
                {v.total}
                <span className="tk-trend">
                  {v.trend > 0 ? <TrendingUp size={12} /> : v.trend < 0 ? <TrendingDown size={12} /> : null}
                  {v.trend !== 0 && Math.abs(v.trend)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="tk-card tk-detail">
        <div className="tk-detail-top">
          <div>
            <div className="tk-detail-name">{sel.name}</div>
            <div className="tk-detail-trade"><MapPin size={13} /> {sel.trade}・{sel.area}</div>
          </div>
          <div className="tk-bigscore" style={{ color: scoreColor(sel.total) }}>
            {sel.total}<small>/100</small>
          </div>
        </div>

        <div className="tk-radar">
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="#cfc8b8" />
              <PolarAngleAxis dataKey="dim" tick={{ fill: "#5a5446", fontSize: 12 }} />
              <Radar dataKey="v" stroke="var(--steel)" fill="var(--steel)" fillOpacity={0.22} strokeWidth={2} isAnimationActive={!preview} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="tk-dims">
          {DIMS.map((d) => {
            const I = d.icon; const val = sel.s[d.key];
            return (
              <div key={d.key} className="tk-dim">
                <div className="tk-dim-l"><I size={14} /> {d.label}</div>
                <div className="tk-bar"><div className="tk-bar-fill"
                  style={{ width: val + "%", background: scoreColor(val) }} /></div>
                <div className="tk-dim-v">{val}</div>
              </div>
            );
          })}
        </div>

        <div className="tk-stats">
          <div><b>{sel.projects}</b><span>累計施工</span></div>
          <div><b>★ {sel.lastEval}</b><span>平均完工評価</span></div>
          <div><b>{sel.claims}</b><span>直近クレーム</span></div>
        </div>
      </section>
    </div>
  );
}

/* ===================== 2. MATCHING ===================== */
const PROJECT = {
  name: "サンライズ横浜 大規模修繕工事",
  spec: "RC造12階・約2,400㎡", area: "横浜市", budget: "1.2億円", term: "6ヶ月",
  trades: [
    { t: "仮設・足場", need: "schedule", v: "v1" },
    { t: "塗装・防水", need: "cost", v: "v3" },
    { t: "外構・造園", need: "comm", v: "v8" },
    { t: "給排水・空調更新", need: "quality", v: "v6" },
    { t: "電気設備", need: "schedule", v: "v2" },
  ],
};
function MatchingView() {
  const find = (id) => VENDORS.find((v) => v.id === id);
  const team = PROJECT.trades.map((tr) => {
    const v = find(tr.v);
    const fit = Math.round((v.s[tr.need] * 0.6 + v.total * 0.4));
    return { ...tr, v, fit };
  });
  const teamFit = Math.round(team.reduce((a, t) => a + t.fit, 0) / team.length);
  return (
    <div className="tk-grid2">
      <section className="tk-card">
        <div className="tk-card-head">
          <h2>案件条件</h2>
          <p className="tk-note">条件を入力すると、登録業者から最適な協力体制を自動編成します</p>
        </div>
        <div className="tk-proj">
          <div className="tk-proj-name">{PROJECT.name}</div>
          <dl className="tk-proj-grid">
            <div><dt>構造・規模</dt><dd>{PROJECT.spec}</dd></div>
            <div><dt>エリア</dt><dd>{PROJECT.area}</dd></div>
            <div><dt>予算</dt><dd>{PROJECT.budget}</dd></div>
            <div><dt>工期</dt><dd>{PROJECT.term}</dd></div>
          </dl>
          <div className="tk-req">
            <span className="tk-req-l">必要工種</span>
            {PROJECT.trades.map((t) => <span key={t.t} className="tk-chip">{t.t}</span>)}
          </div>
        </div>
        <div className="tk-logic">
          <Sparkles size={14} />
          <span>抽出ロジック：工種カバー率・エリア近接・過去協業実績・工程重複・各社の強みスコアを評価</span>
        </div>
      </section>

      <section className="tk-card">
        <div className="tk-card-head tk-match-head">
          <h2>推奨協力体制</h2>
          <div className="tk-teamfit" style={{ color: scoreColor(teamFit) }}>
            適合度 <b>{teamFit}</b>
          </div>
        </div>
        <div className="tk-team">
          {team.map((t) => (
            <div key={t.t} className="tk-team-row">
              <div className="tk-team-trade">{t.t}</div>
              <ArrowRight size={15} className="tk-arrow" />
              <div className="tk-team-v">
                <div className="tk-team-name">{t.v.name}</div>
                <div className="tk-team-sub">{t.v.area}・総合{t.v.total}</div>
              </div>
              <div className="tk-team-fit" style={{ color: scoreColor(t.fit) }}>{t.fit}</div>
            </div>
          ))}
        </div>
        <div className="tk-checks">
          {["全工種カバー（充足率100%）", "全社が横浜近郊エリア", "過去に同一現場での協業実績あり", "工期重複なし（着工順を自動調整）"].map((c) => (
            <div key={c} className="tk-check"><CheckCircle2 size={15} /> {c}</div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ===================== 3. ASSISTANT ===================== */
const SUGGESTIONS = [
  "店舗の外壁が剥がれてきたので塗装し直したい。予算は150万くらい。",
  "駐車場の外構工事を急ぎでお願いしたい業者を探しています。",
  "RCマンションの給排水管を全面更新したい。実績重視で選びたい。",
];
const INTRO_QUESTION = "店舗の外壁が剥がれてきたので塗装し直したい。予算は150万くらい。";
const INTRO_MESSAGES = [
  { role: "user", text: INTRO_QUESTION },
  { role: "assistant", text: generateDemoResponse([{ role: "user", text: INTRO_QUESTION }]) },
];

function renderIntroScreen(id) {
  if (id === "ranking" || id === "detail") return <ScoringView preview />;
  if (id === "project" || id === "team") return <MatchingView />;
  return <AssistantView preview={id} />;
}

function AssistantView({ preview = null } = {}) {
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: "ご要望をお聞かせください。条件に合う登録業者を、理由つきでご提案します。（工種・エリア・予算・重視点などをお書きください）" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { if (!preview) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy, preview]);
  const shownMessages = preview ? (preview === "ask" ? INTRO_MESSAGES.slice(0, 1) : INTRO_MESSAGES) : msgs;

  const send = async (text) => {
    if (preview) return;
    const q = (text ?? input).trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const txt = data.text || "申し訳ありません、うまく取得できませんでした。";
      setMsgs((m) => [...m, { role: "assistant", text: txt }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "通信エラーが発生しました。もう一度お試しください。" }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tk-card tk-chat">
      <div className="tk-chat-head">
        <div className="tk-chat-ai"><Sparkles size={15} /> AI業者選定アシスタント</div>
        <p className="tk-note">登録業者のスコアを根拠に、顧客の言葉から最適な業者を提案します（デモ用の自動応答です／AI連携は準備中）</p>
      </div>
      <div className="tk-chat-body">
        {shownMessages.map((m, i) => (
          <div key={i} className={"tk-msg tk-msg--" + m.role}>
            <div className="tk-bubble">{preview === "reply" && m.role === "assistant" ? m.text.split("\n\n").slice(1).join("\n\n") : m.text}</div>
          </div>
        ))}
        {busy && <div className="tk-msg tk-msg--assistant"><div className="tk-bubble tk-typing"><span /><span /><span /></div></div>}
        <div ref={endRef} />
      </div>
      {!preview && msgs.length <= 1 && (
        <div className="tk-sugg">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="tk-sugg-btn" onClick={() => send(s)}><Search size={12} /> {s}</button>
          ))}
        </div>
      )}
      <div className="tk-chat-input">
        <input value={input} disabled={Boolean(preview)} aria-label="業者選定の相談内容" onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="ご要望を入力（例：外壁塗装を予算150万で…）" />
        <button aria-label="相談を送信" onClick={() => send()} disabled={Boolean(preview) || busy || !input.trim()}><Send size={16} /></button>
      </div>
    </div>
  );
}

/* ============================ STYLE ============================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Saira:wght@500;600;700&family=Spline+Sans+Mono:wght@500;600&display=swap');
.tk-root{
  --paper:#F4F0E8; --card:#FBF9F4; --ink:#1A1D22; --sub:#6B6354;
  --steel:#23415C; --amber:#D2622E; --good:#3E7C5A; --mid:#C08A24; --bad:#B5462F;
  --line:#E2DBCB;
  font-family:'Zen Kaku Gothic New',sans-serif; color:var(--ink);
  background:var(--paper);
  background-image:linear-gradient(#e7e0d010 1px,transparent 1px),linear-gradient(90deg,#e7e0d010 1px,transparent 1px);
  background-size:26px 26px;
  min-height:100vh; padding:18px; box-sizing:border-box;
}
.tk-root *{box-sizing:border-box;}
.font-num{font-family:'Spline Sans Mono',monospace;}

.tk-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;}
.tk-brand{display:flex;align-items:center;gap:13px;}
.tk-logo{width:42px;height:42px;border-radius:11px;background:var(--steel);color:#fff;display:grid;place-items:center;flex:none;box-shadow:0 6px 16px -6px rgba(35,65,92,.55);}
.tk-name{font-weight:900;font-size:20px;letter-spacing:.02em;line-height:1.1;}
.tk-name span{font-family:'Saira',sans-serif;font-weight:600;font-size:11px;color:var(--amber);letter-spacing:.18em;margin-left:6px;}
.tk-tag{font-size:11.5px;color:var(--sub);margin-top:3px;}
.tk-meta{display:flex;gap:8px;align-items:center;}
.tk-pill{font-size:11px;background:var(--card);border:1px solid var(--line);padding:5px 11px;border-radius:999px;color:var(--sub);}
.tk-pill b{color:var(--ink);font-family:'Saira',sans-serif;}
.tk-pill--demo{background:var(--ink);color:#fff;border-color:var(--ink);font-family:'Saira',sans-serif;letter-spacing:.16em;font-size:10px;}

.tk-tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.tk-tab{flex:1;min-width:150px;display:flex;flex-direction:column;align-items:flex-start;gap:1px;
  background:var(--card);border:1px solid var(--line);border-radius:13px;padding:12px 15px;cursor:pointer;
  transition:.18s;position:relative;text-align:left;}
.tk-tab svg{color:var(--sub);transition:.18s;margin-bottom:4px;}
.tk-tab-l{font-weight:700;font-size:14.5px;}
.tk-tab-s{font-size:10.5px;color:var(--sub);font-family:'Saira',sans-serif;letter-spacing:.04em;}
.tk-tab:hover{transform:translateY(-1px);border-color:#cfc6b2;}
.tk-tab.is-on{background:var(--steel);border-color:var(--steel);box-shadow:0 10px 24px -12px rgba(35,65,92,.7);}
.tk-tab.is-on .tk-tab-l,.tk-tab.is-on .tk-tab-s{color:#fff;}
.tk-tab.is-on svg{color:var(--amber);}

.tk-main{margin-bottom:14px;}
.tk-grid2{display:grid;grid-template-columns:1fr 1.1fr;gap:14px;}
@media(max-width:760px){.tk-grid2{grid-template-columns:1fr;}.tk-tab{min-width:110px;}}

.tk-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;animation:rise .4s ease both;}
@keyframes rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.tk-card-head h2{margin:0;font-size:16px;font-weight:900;}
.tk-note{margin:5px 0 0;font-size:11.5px;color:var(--sub);line-height:1.5;}

.tk-list{margin-top:14px;display:flex;flex-direction:column;gap:6px;}
.tk-row{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;border:1px solid transparent;
  background:transparent;cursor:pointer;transition:.15s;text-align:left;width:100%;}
.tk-row:hover{background:#fff;border-color:var(--line);}
.tk-row.is-on{background:#fff;border-color:var(--steel);box-shadow:0 4px 14px -8px rgba(35,65,92,.5);}
.tk-rank{font-family:'Saira',sans-serif;font-weight:700;color:#bcb29c;font-size:13px;width:22px;}
.tk-row-main{flex:1;display:flex;flex-direction:column;}
.tk-row-name{font-weight:700;font-size:14px;}
.tk-row-sub{font-size:11px;color:var(--sub);}
.tk-row-score{font-family:'Spline Sans Mono',monospace;font-weight:600;font-size:22px;display:flex;align-items:baseline;gap:5px;}
.tk-trend{display:inline-flex;align-items:center;gap:1px;font-size:11px;}

.tk-detail-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.tk-detail-name{font-size:18px;font-weight:900;}
.tk-detail-trade{font-size:12px;color:var(--sub);display:flex;align-items:center;gap:4px;margin-top:3px;}
.tk-bigscore{font-family:'Spline Sans Mono',monospace;font-weight:600;font-size:40px;line-height:1;}
.tk-bigscore small{font-size:14px;color:var(--sub);font-weight:500;}
.tk-radar{margin:6px 0 2px;}
.tk-dims{display:flex;flex-direction:column;gap:9px;margin:8px 0 16px;}
.tk-dim{display:flex;align-items:center;gap:10px;font-size:12.5px;}
.tk-dim-l{display:flex;align-items:center;gap:6px;width:96px;flex:none;color:var(--sub);}
.tk-bar{flex:1;height:7px;background:#ece5d5;border-radius:99px;overflow:hidden;}
.tk-bar-fill{height:100%;border-radius:99px;transition:width .6s cubic-bezier(.2,.8,.2,1);}
.tk-dim-v{font-family:'Spline Sans Mono',monospace;font-weight:600;width:26px;text-align:right;}
.tk-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;border-top:1px solid var(--line);padding-top:14px;}
.tk-stats div{display:flex;flex-direction:column;gap:2px;}
.tk-stats b{font-family:'Spline Sans Mono',monospace;font-size:18px;color:var(--steel);}
.tk-stats span{font-size:10.5px;color:var(--sub);}

.tk-proj{margin-top:14px;border:1px dashed var(--line);border-radius:12px;padding:14px;background:#fff;}
.tk-proj-name{font-weight:900;font-size:15px;margin-bottom:10px;}
.tk-proj-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0;}
.tk-proj-grid dt{font-size:10.5px;color:var(--sub);}
.tk-proj-grid dd{margin:1px 0 0;font-weight:700;font-size:13.5px;}
.tk-req{margin-top:13px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.tk-req-l{font-size:10.5px;color:var(--sub);margin-right:2px;}
.tk-chip{font-size:11px;background:var(--paper);border:1px solid var(--line);padding:3px 9px;border-radius:7px;}
.tk-logic{margin-top:13px;display:flex;gap:8px;align-items:flex-start;font-size:11px;color:var(--sub);line-height:1.5;}
.tk-logic svg{color:var(--amber);flex:none;margin-top:1px;}

.tk-match-head{display:flex;justify-content:space-between;align-items:center;}
.tk-teamfit{font-size:12px;color:var(--sub);}
.tk-teamfit b{font-family:'Spline Sans Mono',monospace;font-size:26px;margin-left:4px;}
.tk-team{margin-top:14px;display:flex;flex-direction:column;gap:7px;}
.tk-team-row{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:11px;padding:10px 13px;}
.tk-team-trade{font-size:12px;font-weight:700;width:96px;flex:none;color:var(--steel);}
.tk-arrow{color:#cabfa8;flex:none;}
.tk-team-v{flex:1;}
.tk-team-name{font-weight:700;font-size:13.5px;}
.tk-team-sub{font-size:10.5px;color:var(--sub);}
.tk-team-fit{font-family:'Spline Sans Mono',monospace;font-weight:600;font-size:19px;}
.tk-checks{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;}
@media(max-width:520px){.tk-checks,.tk-proj-grid{grid-template-columns:1fr;}}
.tk-check{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#3a4a3f;}
.tk-check svg{color:var(--good);flex:none;}

.tk-chat{display:flex;flex-direction:column;max-width:760px;margin:0 auto;height:560px;}
.tk-chat-head{flex:none;}
.tk-chat-ai{display:flex;align-items:center;gap:6px;font-weight:900;font-size:15px;}
.tk-chat-ai svg{color:var(--amber);}
.tk-chat-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:11px;padding:16px 2px;margin-top:8px;}
.tk-msg{display:flex;}
.tk-msg--user{justify-content:flex-end;}
.tk-bubble{max-width:80%;padding:11px 14px;border-radius:15px;font-size:13.5px;line-height:1.65;white-space:pre-wrap;}
.tk-msg--assistant .tk-bubble{background:#fff;border:1px solid var(--line);border-top-left-radius:4px;}
.tk-msg--user .tk-bubble{background:var(--steel);color:#fff;border-top-right-radius:4px;}
.tk-typing{display:flex;gap:4px;}
.tk-typing span{width:7px;height:7px;border-radius:50%;background:#c3b9a4;animation:blink 1.2s infinite;}
.tk-typing span:nth-child(2){animation-delay:.2s;}.tk-typing span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,60%,100%{opacity:.3;}30%{opacity:1;}}
.tk-sugg{display:flex;flex-direction:column;gap:6px;margin-bottom:10px;}
.tk-sugg-btn{display:flex;align-items:center;gap:7px;text-align:left;font-size:12px;color:var(--steel);
  background:#fff;border:1px solid var(--line);border-radius:9px;padding:8px 11px;cursor:pointer;transition:.15s;}
.tk-sugg-btn:hover{border-color:var(--steel);transform:translateX(2px);}
.tk-sugg-btn svg{color:var(--amber);flex:none;}
.tk-chat-input{flex:none;display:flex;gap:8px;border-top:1px solid var(--line);padding-top:12px;}
.tk-chat-input input{flex:1;border:1px solid var(--line);border-radius:11px;padding:11px 14px;font-size:13.5px;
  font-family:inherit;background:#fff;outline:none;}
.tk-chat-input input:focus{border-color:var(--steel);}
.tk-chat-input button{width:46px;border:none;border-radius:11px;background:var(--steel);color:#fff;cursor:pointer;display:grid;place-items:center;transition:.15s;}
.tk-chat-input button:disabled{opacity:.4;cursor:default;}
.tk-chat-input button:not(:disabled):hover{background:var(--amber);}

.tk-foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:10.5px;color:var(--sub);padding:0 4px;}
.tk-foot b{color:var(--steel);}
.roiPaybackCta{margin:12px 4px 0;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;}
.roiPaybackCtaTitle{margin:0;font-size:13px;font-weight:600;line-height:1.5;color:var(--ink);}
.roiPaybackCtaLead{margin:6px 0 12px;font-size:11.5px;line-height:1.6;color:var(--sub);}
.roiPaybackCtaButton{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:11px;font-size:12px;font-weight:600;color:#fff;background:var(--steel);text-decoration:none;}
.roiPaybackCtaButton:hover{filter:brightness(0.95);}
`;
