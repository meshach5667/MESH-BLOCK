import Sidebar from "./Sidebar";

export default function Layout({ children, rightPanel, chainValid }) {
  return (
    <div className="app-shell">
      <Sidebar chainValid={chainValid} />
      <main className="main">
        {children}
      </main>
      {rightPanel && (
        <aside className="panel">
          <div className="panel__inner">
            {rightPanel}
          </div>
        </aside>
      )}
    </div>
  );
}
