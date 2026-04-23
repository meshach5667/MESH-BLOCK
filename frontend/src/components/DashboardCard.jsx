export default function DashboardCard({ title, value, icon: Icon, valueClass }) {
  return (
    <div className="stat-card">
      <div className="stat-card__left">
        {Icon && (
          <div className="stat-card__icon">
            <Icon size={16} />
          </div>
        )}
        <span className="stat-card__label">{title}</span>
      </div>
      <div className={`stat-card__value ${valueClass ? `stat-card__value--${valueClass}` : ''}`}>
        {value}
      </div>
    </div>
  );
}