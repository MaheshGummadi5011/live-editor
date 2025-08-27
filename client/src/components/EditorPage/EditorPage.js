// client/src/components/EditorPage/EditorPage.js
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { ResizableBox } from 'react-resizable';
import { initSocket } from '../../socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import throttle from 'lodash.throttle';
import OutputTerminal from '../OutputTerminal';
import RemoteCursor from '../RemoteCursor';
import Sidebar from '../Sidebar/Sidebar';
import ChatSidebar from '../ChatSidebar/ChatSidebar';
import Split from 'react-split';

// --- Helper Functions ---
const createDynamicStyleSheet = (id, color) => {
    const styleId = `style-${id}`;
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .selection-for-${id} { background-color: ${color}60; }
            .cursor-for-${id} { background-color: ${color}; }
        `;
        document.head.appendChild(style);
    }
};
const userColors = {};
const getUserColor = (username) => {
    if (!username) return '#FFFFFF';
    if (userColors[username]) return userColors[username];
    const colors = ['#FFB86C', '#8BE9FD', '#FF79C6', '#BD93F9', '#FF5555'];
    const color = colors[Object.keys(userColors).length % colors.length];
    userColors[username] = color;
    return color;
};

// --- Main Component ---
const EditorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const [cursors, setCursors] = useState({});
    const [code, setCode] = useState('// Welcome to the collaborative editor!\n');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [outputError, setOutputError] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // Ensure chat sidebar is closed by default and never opened by any effect
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [bottomPanelHeight, setBottomPanelHeight] = useState(300);
    const [inputPanelWidth, setInputPanelWidth] = useState(300);
    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const decorationsRef = useRef({});

    const toggleChat = () => setIsChatVisible((prev) => !prev);

    useEffect(() => {
        if (!location.state?.username) {
            navigate('/', { state: { roomId } });
            return;
        }
        const handleMouseMove = throttle((e) => {
            if (socketRef.current) socketRef.current.emit('mouseMove', { roomId, x: e.clientX, y: e.clientY });
        }, 100);
        window.addEventListener('mousemove', handleMouseMove);
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e) { toast.error('Connection failed.'); navigate('/'); }
            socketRef.current.emit('joinRoom', { roomId, username: location.state?.username });
            socketRef.current.on('joined', ({ clients, language, code }) => {
                setClients(clients);
                setLanguage(language);
                if (code) setCode(code);
                toast.success(`${location.state?.username} joined the room.`);
                const initialCursors = {};
                clients.forEach(client => {
                    if (client.socketId !== socketRef.current.id) initialCursors[client.socketId] = { x: 0, y: 0, username: client.username };
                    createDynamicStyleSheet(client.socketId, getUserColor(client.username));
                });
                setCursors(initialCursors);
            });
            socketRef.current.on('userJoined', ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined.`);
                }
                setClients(clients);
                setCursors((prev) => ({ ...prev, [socketId]: { x: 0, y: 0, username } }));
                createDynamicStyleSheet(socketId, getUserColor(username));
            });
            socketRef.current.on('codeUpdate', ({ code }) => {
                if (code !== null) setCode(code);
            });
            socketRef.current.on('languageUpdate', ({ language }) => {
                setLanguage(language);
            });
            socketRef.current.on('codeOutput', ({ output, error }) => {
                setOutput(output);
                setOutputError(error);
            });
            socketRef.current.on('receiveMessage', (messageData) => {
                setMessages((prevMessages) => [...prevMessages, messageData]);
            });
            socketRef.current.on('cursorUpdate', ({ socketId, position, selection }) => {
                if (editorRef.current) {
                    const client = clients.find(c => c.socketId === socketId);
                    if (!client) return;
                    const newDecorations = [];
                    const selectionClassName = `other-selection selection-for-${socketId}`;
                    const cursorClassName = `other-cursor cursor-for-${socketId}`;
                    const isSelectionEmpty = selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn;
                    if (selection && !isSelectionEmpty) newDecorations.push({ range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn), options: { inlineClassName: selectionClassName } });
                    if (position) newDecorations.push({ range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column), options: { inlineClassName: cursorClassName } });
                    decorationsRef.current[socketId] = editorRef.current.deltaDecorations(decorationsRef.current[socketId] || [], newDecorations);
                }
            });
            socketRef.current.on('mouseUpdate', ({ socketId, x, y, username }) => {
                setCursors((prev) => ({ ...prev, [socketId]: { username, x, y } }));
            });
            socketRef.current.on('userLeft', ({ socketId, username }) => {
                toast.error(`${username} left.`);
                setClients((prev) => prev.filter((c) => c.socketId !== socketId));
                setCursors((prev) => {
                    const newCursors = { ...prev };
                    delete newCursors[socketId];
                    return newCursors;
                });
                if (editorRef.current && decorationsRef.current[socketId]) {
                    editorRef.current.deltaDecorations(decorationsRef.current[socketId], []);
                    delete decorationsRef.current[socketId];
                }
            });
        };
        init();
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('joined');
                socketRef.current.off('userJoined');
                socketRef.current.off('codeUpdate');
                socketRef.current.off('languageUpdate');
                socketRef.current.off('userLeft');
                socketRef.current.off('cursorUpdate');
                socketRef.current.off('codeOutput');
                socketRef.current.off('mouseUpdate');
                socketRef.current.off('receiveMessage');
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editor.onDidChangeCursorPosition(throttle(() => {
            if (socketRef.current) socketRef.current.emit('cursorChange', { roomId, position: editor.getPosition(), selection: editor.getSelection() });
        }, 50));
    };

    const runCode = () => { if (socketRef.current) { setOutput('Executing...'); setOutputError(false); socketRef.current.emit('runCode', { roomId, language, code, input }); } };
    const handleEditorChange = (value) => { setCode(value); if (socketRef.current) socketRef.current.emit('codeChange', { roomId, code: value }); };
    const handleLanguageChange = (e) => { const lang = e.target.value; setLanguage(lang); if (socketRef.current) socketRef.current.emit('languageChange', { roomId, language: lang }); };
    const handleThemeChange = (e) => setTheme(e.target.value);
    const handleMessageChange = (e) => setCurrentMessage(e.target.value);
    const handleSendMessage = () => { if (currentMessage.trim() !== '' && socketRef.current) { socketRef.current.emit('sendMessage', { roomId, message: currentMessage }); setCurrentMessage(''); } };
    async function copyRoomId() { try { await navigator.clipboard.writeText(roomId); toast.success('Room ID copied'); } catch (err) { toast.error('Could not copy Room ID'); } }
    function leaveRoom() { navigate('/'); }
    const handleClearChat = () => setMessages([]);

    if (!location.state?.username) return null;

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-dark text-light">
            {/* Main Content Area */}
            <div className="flex flex-row h-full w-full">
                <div className="sidebar-container border-r border-gray-700 bg-dark-accent" style={{ width: 250, minWidth: 200, maxWidth: 500, height: '100%' }}>
                    <Sidebar
                        clients={clients}
                        language={language}
                        theme={theme}
                        onLanguageChange={handleLanguageChange}
                        onThemeChange={handleThemeChange}
                        onRunCode={runCode}
                        onCopyRoomId={copyRoomId}
                        onLeaveRoom={leaveRoom}
                    />
                </div>
                <div className="main-content flex-1 flex flex-col h-full">
                    <Split
                        direction="vertical"
                        sizes={[70, 30]}
                        minSize={100}
                        gutterSize={8}
                        className="flex flex-col h-full"
                    >
                        <div className="relative flex-grow flex-col h-full w-full overflow-hidden">
                            <Editor
                                height="100%"
                                language={language}
                                theme={theme}
                                value={code}
                                onChange={handleEditorChange}
                                onMount={handleEditorDidMount}
                                options={{ fontSize: 16, minimap: { enabled: false } }}
                            />
                        </div>
                        <div className="flex border-t border-gray-700 bg-dark-accent h-full w-full">
                            <div className="flex flex-1 w-full">
                                <div className="flex-1 flex flex-col gap-2 p-4 border-r border-gray-700">
                                    <h3 className="font-semibold uppercase tracking-wider text-accent-yellow">Input (stdin)</h3>
                                    <textarea
                                        className="h-full w-full resize-none rounded-md border border-gray-600 bg-dark p-3 font-mono text-light outline-none focus:border-accent-blue"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex-1 flex min-w-0 flex-col">
                                    <OutputTerminal output={output} error={outputError} />
                                </div>
                            </div>
                        </div>
                    </Split>
                </div>
            </div>
            {/* Floating Chat Toggle Button */}
            <button
                onClick={toggleChat}
                className="absolute top-4 right-4 z-30 rounded-full bg-dark-accent p-3 text-light shadow-lg transition-colors hover:bg-gray-700"
                title={isChatVisible ? "Close Chat" : "Open Chat"}
            >
                {isChatVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>
            {/* Chat Sidebar Panel (Overlay) */}
            {isChatVisible && (
                <div
                    className="absolute top-0 right-0 z-20 h-full w-[300px] border-l border-gray-700 bg-dark-accent shadow-lg transition-transform duration-300 ease-in-out"
                >
                    <ChatSidebar
                        messages={messages}
                        currentMessage={currentMessage}
                        onMessageChange={handleMessageChange}
                        onSendMessage={handleSendMessage}
                        onClose={toggleChat}
                        onClearChat={handleClearChat}
                    />
                </div>
            )}
            {Object.entries(cursors).map(([socketId, { x, y, username }]) => (
                <RemoteCursor key={socketId} x={x} y={y} username={username} />
            ))}
        </div>
    );
};

export default EditorPage;