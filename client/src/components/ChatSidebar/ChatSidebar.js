// client/src/components/ChatSidebar/ChatSidebar.js
import React, { useEffect, useRef } from 'react';

const userColors = {};
const getUserColor = (username) => {
    if (!username) return '#FFFFFF';
    if (userColors[username]) return userColors[username];
    const colors = ['#FFB86C', '#8BE9FD', '#FF79C6', '#BD93F9', '#FF5555'];
    const color = colors[Object.keys(userColors).length % colors.length];
    userColors[username] = color;
    return color;
};

const ChatSidebar = ({ messages, currentMessage, onMessageChange, onSendMessage, onClose, onClearChat }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex h-full flex-col overflow-hidden p-6 text-light">
            <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-light">
                    Chat
                </h3>
                <div className="flex gap-2">
                    <button onClick={onClearChat} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white" title="Clear Chat">
                        {/* Clear icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6" />
                        </svg>
                    </button>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white" title="Close Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className="text-sm break-words">
                        <span className="mr-2 font-bold" style={{ color: getUserColor(msg.username) }}>
                            {msg.username}:
                        </span>
                        <span className="text-gray-300">{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex border-t border-gray-700 pt-4">
                <input
                    type="text"
                    className="flex-1 rounded-l-md border border-r-0 border-gray-600 bg-dark p-2 text-light outline-none focus:border-accent-blue"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={onMessageChange}
                    onKeyUp={(e) => { if (e.key === 'Enter') onSendMessage(); }}
                />
                <button
                    onClick={onSendMessage}
                    className="rounded-r-md border border-gray-600 bg-dark-accent px-4 font-semibold text-light transition-colors hover:bg-gray-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatSidebar;