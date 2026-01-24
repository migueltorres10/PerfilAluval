export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger", // danger | success
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modalBackdrop">
      <div className="modalCard">
        <h3>{title}</h3>
        <p style={{ marginTop: 8 }}>{message}</p>

        <div className="modalActions">
          <button type="button" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className={confirmVariant === "danger" ? "btnDanger" : "btnSuccess"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}