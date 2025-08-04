import { useDispatch, useSelector } from 'react-redux';
import { setShowDeleteConfirmModal, setChatroomToDelete } from '../../store/slices/uiSlice';
import { Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ onConfirm }) => {
  const dispatch = useDispatch();
  const { chatroomToDelete } = useSelector((state) => state.ui);
  const { chatrooms } = useSelector((state) => state.chat);

  const chatroom = chatrooms.find(room => room.id === chatroomToDelete);

  const handleClose = () => {
    dispatch(setShowDeleteConfirmModal(false));
    dispatch(setChatroomToDelete(null));
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Chatroom
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mr-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {chatroom && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Chatroom to delete:
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {chatroom.title}
              </p>
              {chatroom.messageCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {chatroom.messageCount} message{chatroom.messageCount !== 1 ? 's' : ''} will be lost
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Chatroom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 