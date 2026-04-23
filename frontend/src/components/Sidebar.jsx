import { Activity, Blocks, LayoutDashboard, ShieldCheck, ShieldAlert } from "lucide-react";

export default function Sidebar({ chainValid }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Blocks size={20} />
        </div>
        <div>
          <div className="sidebar__brand-name">Mesh-Block</div>
          <div className="sidebar__brand-sub">Simulator v1.0</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__nav-label">Navigation</div>
        <a href="#" className="sidebar__nav-item sidebar__nav-item--active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="sidebar__nav-item">
          <Activity size={18} />
          <span>Network Explorer</span>
        </a>
      </nav>

      <div className="sidebar__footer">
        <div className={`sidebar__status sidebar__status--${chainValid ? "valid" : "invalid"}`}>
          <div className="sidebar__status-dot" />
          {chainValid ? (
            <>
              <ShieldCheck size={16} />
              <span>Network Secure</span>
            </>
          ) : (
            <>
              <ShieldAlert size={16} />
              <span>Chain Compromised</span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
