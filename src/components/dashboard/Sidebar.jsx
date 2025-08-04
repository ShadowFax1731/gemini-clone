import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import { 
  setSearchQuery, 
  setShowCreateChatroomModal,
  setShowDeleteConfirmModal,
  setChatroomToDelete,
  toggleDarkMode 
} from '../../store/slices/uiSlice';
import { setCurrentChatroom, deleteChatroom } from '../../store/slices/chatSlice';
import { logout } from '../../store/slices/authSlice';
import { 
  Plus, 
  Search, 
  Moon, 
  Sun, 
  LogOut, 
  Trash2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateChatroomModal from './CreateChatroomModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { 
    searchQuery, 
    darkMode, 
    showCreateChatroomModal, 
    showDeleteConfirmModal,
    chatroomToDelete
  } = useSelector((state) => state.ui);
  const { chatrooms, currentChatroom } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update search query when debounced value changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter(chatroom =>
    chatroom.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChatroom = () => {
    dispatch(setShowCreateChatroomModal(true));
  };

  const handleDeleteChatroom = (chatroomId) => {
    dispatch(setChatroomToDelete(chatroomId));
    dispatch(setShowDeleteConfirmModal(true));
  };

  const handleConfirmDelete = () => {
    if (chatroomToDelete) {
      dispatch(deleteChatroom({ chatroomId: chatroomToDelete, userId: user?.id }));
      toast.success('Chatroom deleted successfully');
      dispatch(setShowDeleteConfirmModal(false));
      dispatch(setChatroomToDelete(null));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-primary-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gemini Chat
            </h1>
          </div>
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search chatrooms..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chatrooms List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chatrooms
            </h2>
            <button
              onClick={handleCreateChatroom}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {filteredChatrooms.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateChatroom}
                  className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
                >
                  Create your first chatroom
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatroom?.id === chatroom.id
                      ? 'bg-primary-100 dark:bg-primary-900 border border-primary-200 dark:border-primary-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => dispatch(setCurrentChatroom(chatroom))}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chatroom.title}
                      </h3>
                      {chatroom.lastMessage && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {chatroom.lastMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(chatroom.createdAt)}
                      </p>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChatroom(chatroom.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.phoneNumber}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateChatroomModal && <CreateChatroomModal />}
      {showDeleteConfirmModal && <DeleteConfirmModal onConfirm={handleConfirmDelete} />}
    </div>
  );
};

export default Sidebar; 