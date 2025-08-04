const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="message-bubble message-ai">
        <div className="typing-indicator">
          <span className="text-sm">Gemini is typing</span>
          <div className="flex space-x-1 ml-2">
            <div className="typing-dot"></div>
            <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator; 