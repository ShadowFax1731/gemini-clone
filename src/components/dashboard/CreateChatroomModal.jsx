import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createChatroom } from '../../store/slices/chatSlice';
import { setShowCreateChatroomModal } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const createChatroomSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(50, 'Title must be at most 50 characters')
});

const CreateChatroomModal = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(createChatroomSchema),
    defaultValues: {
      title: ''
    }
  });

  const onSubmit = (data) => {
    dispatch(createChatroom({ title: data.title, userId: user?.id }));
    toast.success('Chatroom created successfully!');
    dispatch(setShowCreateChatroomModal(false));
    reset();
  };

  const handleClose = () => {
    dispatch(setShowCreateChatroomModal(false));
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Chatroom
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chatroom Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="input-field"
              placeholder="Enter chatroom title..."
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Creating...' : 'Create Chatroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatroomModal; 