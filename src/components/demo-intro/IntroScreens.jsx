import { memo } from "react";
import { panels } from "./story";

export const IntroScreens = memo(function IntroScreens({ stars, renderScreen }) {
  return panels.map((panel, i) => <div key={panel.id} className={`ti-panel ti-state-${panel.id}${stars.includes(i) ? " is-star" : ""}`} style={{ left: i * 500 }}>
    <div className="ti-panel-bar"><span className="ti-window-dots">● ● ●</span><b>{panel.title}</b><span>{panel.state}</span></div>
    <div className="ti-panel-content">{renderScreen(panel.id)}</div>
  </div>);
});
