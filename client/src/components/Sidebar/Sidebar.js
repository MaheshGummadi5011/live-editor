// client/src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// --- Helper Functions ---
const userColors = {};
const getUserColor = (username) => {
    if (!username) return '#FFFFFF';
    if (userColors[username]) return userColors[username];
    const colors = ['#FFB86C', '#8BE9FD', '#FF79C6', '#BD93F9', '#FF5555'];
    const color = colors[Object.keys(userColors).length % colors.length];
    userColors[username] = color;
    return color;
};

const getInitials = (name = '') => name.charAt(0).toUpperCase();

// --- Main Component ---
const Sidebar = ({ clients = [], language, theme, onLanguageChange, onThemeChange, onRunCode, onCopyRoomId, onLeaveRoom }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, logout } = useAuth();
    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    return (
        <div className="flex h-full flex-col overflow-hidden bg-dark-accent p-4 text-light">
            {/* User List with Avatars */}
            <div className="min-h-0 flex-1 overflow-y-auto border-r border-gray-700 bg-dark-accent">
                <h3 className="mb-4 border-b border-gray-700 pb-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                    Connected
                </h3>
                <div className="flex flex-col gap-3">
                    {clients.length === 0 ? (
                        <div className="flex items-center justify-center h-16 text-gray-400">
                            No users connected
                        </div>
                    ) : (
                        clients.map((client) => (
                            <div className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-dark" key={client.socketId}>
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-dark"
                                    style={{ backgroundColor: getUserColor(client.username) }}
                                >
                                    {getInitials(client.username)}
                                </div>
                                <span className="font-semibold" style={{ color: getUserColor(client.username) }}>
                                    {client.username}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Controls Section */}
            <div className="mt-auto flex flex-col gap-3 border-t border-gray-700 pt-4">
                {/* Settings Panel */}
                {isSettingsOpen && (
                    <div className="flex animate-fade-in-down flex-col gap-4 rounded-md bg-dark p-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="language" className="text-sm font-semibold text-gray-400">Language</label>
                            <select id="language" value={language} onChange={onLanguageChange} className="w-full rounded-md border border-gray-600 bg-dark-accent p-2 font-semibold text-light outline-none focus:border-accent-blue">
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="theme" className="text-sm font-semibold text-gray-400">Theme</label>
                            <select id="theme" value={theme} onChange={onThemeChange} className="w-full rounded-md border border-gray-600 bg-dark-accent p-2 font-semibold text-light outline-none focus:border-accent-blue">
                                <option value="vs-dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="hc-black">High Contrast</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Main Action Buttons */}
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-600 p-2.5 text-center font-semibold text-light transition-colors hover:bg-gray-700"
                    onClick={toggleSettings}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-blue p-2.5 font-bold text-text-dark transition-opacity hover:opacity-90" onClick={onRunCode}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Code
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-300 p-2.5 font-bold text-text-dark transition-opacity hover:opacity-90" onClick={onCopyRoomId}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Room ID
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-red p-2.5 font-bold text-white transition-opacity hover:opacity-90" onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;