import { Activity, Blocks, LayoutDashboard, ShieldAlert, ShieldCheck } from "lucide-react";

export default function Sidebar({ chainValid }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Blocks className="brand-icon" size={28} />
        </div>
        <div className="brand-text">
          <h1>MESH-BLOCK</h1>
          <span>Simulation Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">Overview</div>
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item">
          <Activity size={20} />
          <span>Network Realtime</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className={`status-badge ${chainValid ? "valid" : "invalid"}`}>
          {chainValid ? (
            <>
              <ShieldCheck size={18} />
              <span>Network Secure</span>
            </>
          ) : (
            <>
              <ShieldAlert size={18} />
              <span>Integrity Compromised</span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
