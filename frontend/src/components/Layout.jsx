import Sidebar from "./Sidebar";

export default function Layout({ children, chainValid }) {
  return (
    <div className="app-layout">
      <Sidebar chainValid={chainValid} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
