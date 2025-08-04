import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Message = ({ message, time, isLast }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`group relative max-w-xs lg:max-w-md ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        {/* Message Bubble */}
        <div
          className={`message-bubble ${
            isUser ? 'message-user' : 'message-ai'
          }`}
        >
          {/* Image if present */}
          {message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Message content */}
          <p className="text-balance whitespace-pre-wrap">{message.content}</p>
          
          {/* Timestamp */}
          <p className={`text-xs mt-1 ${
            isUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {time}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`absolute top-2 ${
            isUser ? 'left-2' : 'right-2'
          } opacity-0 group-hover:opacity-100 p-1 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-200`}
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Message; 