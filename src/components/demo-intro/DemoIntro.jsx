import { useEffect, useRef, useState } from "react";
import { IntroScreens } from "./IntroScreens";
import { scenes, storyFrame, totalDuration } from "./story";
import "./intro.css";

export function DemoIntro({ renderScreen, onEnter }) {
  const viewport = useRef(null);
  const clock = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState(800);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    resize.observe(viewport.current);
    return () => { media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility); resize.disconnect(); };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    let frame;
    let last;
    const tick = now => {
      if (last !== undefined) clock.current = (clock.current + now - last) % totalDuration;
      last = now;
      setTime(clock.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reduced, visible]);
  const current = storyFrame(reduced ? totalDuration - 1 : time);
  const scale = Math.min(1, (width - 24) / current.fit);
  const restart = () => { clock.current = 0; setTime(0); setPaused(false); };
  return <div className="ti-intro">
    <div className="ti-heading"><p>TAKUMI NETWORK / PRODUCT TOUR</p><h1>協力業者選びに、<br />比較できる根拠を。</h1><div>評価を比べる。案件に合わせる。要望を相談する。<br />ひとつの画面で、候補を絞るまでの流れをご紹介します。</div></div>
    <section className="ti-story" aria-label="匠ネットワークの使い方">
      <div className="ti-story-top"><span>機能紹介</span><span>同じアプリの操作の流れ · サンプルデータ</span></div>
      <div className="ti-viewport" ref={viewport} data-scene={current.index} data-time={Math.round(time)} data-paused={paused || reduced}>
        <div className="ti-stage" aria-hidden="true" inert style={{ transform: `translate(${width / 2 - current.x * scale}px, ${(window.innerWidth <= 600 ? 174 : 220) - 210 * scale}px) scale(${scale})` }}>
          <IntroScreens stars={current.scene.stars} renderScreen={renderScreen} />
        </div>
        <div className="ti-caption"><div className="ti-dots" aria-hidden="true">{scenes.map((scene, i) => <span key={scene.title} className={i === current.index ? "is-current" : ""} />)}</div><p>{current.scene.caption}</p></div>
      </div>
      <div className="ti-controls"><span>{reduced ? "動きを抑えた表示" : `${current.index + 1} / ${scenes.length}　${current.scene.title}`}</span><div>{!reduced && <><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "紹介を再生する" : "紹介を一時停止する"}>{paused ? "▶ 再生" : "Ⅱ 一時停止"}</button><button type="button" onClick={restart}>最初から</button></>}</div></div>
    </section>
    <div className="ti-entry"><div><h2>実際の画面で、業者を比べてみる。</h2><p>登録8社のサンプルで、3つの機能を体験できます。</p></div><button type="button" onClick={() => onEnter("score")}>デモを体験する <span>→</span></button></div>
    <div className="ti-shortcuts">{[["score", "01", "評価の内訳を見る", "5つの評価軸と施工実績"], ["match", "02", "協力体制を確認する", "案件条件と工種別の候補"], ["assist", "03", "要望を相談する", "候補と選定理由を確認"]].map(([tab, n, title, note]) => <button key={tab} type="button" onClick={() => onEnter(tab)}><small>{n}</small><strong>{title} →</strong><span>{note}</span></button>)}</div>
    <p className="ti-disclosure">案件条件と推奨体制は固定サンプルです。選定アシスタントはルールベースのデモ応答を使用しています。</p>
  </div>;
}
