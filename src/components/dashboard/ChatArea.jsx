import { useSelector } from 'react-redux';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';

const ChatArea = () => {
  const { currentChatroom } = useSelector((state) => state.chat);

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Gemini Chat
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select a chatroom from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentChatroom.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created {new Date(currentChatroom.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList chatroomId={currentChatroom.id} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <MessageInput chatroomId={currentChatroom.id} />
      </div>
    </div>
  );
};

export default ChatArea; 