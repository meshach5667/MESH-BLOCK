export default function DashboardCard({ title, value, icon: Icon, longText, valueClass = '' }) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <h3>{title}</h3>
        {Icon && <Icon className="metric-icon" size={20} />}
      </div>
      <div className={`metric-value ${longText ? "mono " : ""}${valueClass}`}>
        {value}
      </div>
    </div>
  );
}