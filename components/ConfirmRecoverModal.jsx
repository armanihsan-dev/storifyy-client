const ConfirmRecoverModal = ({ open, onCancel, onConfirm, user }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h3 className="text-lg font-semibold text-green-600">Recover User?</h3>

        <p className="text-gray-600 mt-2">
          Are you sure you want to recover{' '}
          <span className="font-medium">{user?.name}</span>?
        </p>

        <div className="flex justify-between mt-6 gap-3">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            Yes, Recover
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRecoverModal;
