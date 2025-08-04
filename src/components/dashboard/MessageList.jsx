import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadOlderMessages } from '../../store/slices/chatSlice';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ chatroomId }) => {
  const dispatch = useDispatch();
  const { messages, isTyping, isLoading } = useSelector((state) => state.chat);
  const messagesList = messages[chatroomId] || [];
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messagesList.length, scrollToBottom]);

  // Load older messages when scrolling to top
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoading) return;

    if (container.scrollTop === 0 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(loadOlderMessages({ chatroomId, page: nextPage }))
        .unwrap()
        .then(() => {
          // Keep scroll position after loading older messages
          const newScrollHeight = container.scrollHeight;
          const oldScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - oldScrollHeight;
        })
        .catch(() => {
          setHasMore(false);
        });
    }
  }, [chatroomId, page, hasMore, isLoading, dispatch]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Reset page when changing chatrooms
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [chatroomId]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (messagesList.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4"
    >
      {/* Loading indicator for older messages */}
      {isLoading && page > 0 && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Messages */}
      {messagesList.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          time={formatTime(message.timestamp)}
          isLast={index === messagesList.length - 1}
        />
      ))}

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 