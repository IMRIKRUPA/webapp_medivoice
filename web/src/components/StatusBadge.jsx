function StatusBadge({ value }) {
  if (!value) {
    return null;
  }

  return <span className={`badge ${String(value).toLowerCase()}`}>{value}</span>;
}

export default StatusBadge;
