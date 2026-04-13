export default function DashboardCard({ title, value, longText = false }) {
  return (
    <div className="card dashboard-card">
      <h3>{title}</h3>
      <p className={longText ? "dashboard-value long" : "dashboard-value"}>{value}</p>
    </div>
  );
}