function DashboardCard({ icon, label, value, helper }) {
  return (
    <div className="card metric-card">
      <div className="icon-wrap">{icon}</div>
      <h3>{label}</h3>
      <div className="metric-value">{value}</div>
      <p>{helper}</p>
    </div>
  );
}

export default DashboardCard;
