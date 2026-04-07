function AlertBanner({ type = "info", message }) {
  if (!message) {
    return null;
  }

  return <div className={`alert ${type}`}>{message}</div>;
}

export default AlertBanner;
