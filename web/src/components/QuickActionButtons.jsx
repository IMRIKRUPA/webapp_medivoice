function QuickActionButtons({ actions = [], onAction }) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action}
          type="button"
          className="quick-action-button"
          onClick={() => onAction(action)}
        >
          {action}
        </button>
      ))}
    </div>
  );
}

export default QuickActionButtons;
