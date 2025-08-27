// client/src/components/HomePage/HomePage.js
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & Username is required.');
            return;
        }
        navigate(`/editor/${roomId}`, { state: { username } });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-dark bg-gradient-to-br from-dark to-dark-accent">
            <div className="w-[450px] max-w-[90%] rounded-lg border border-gray-700 bg-dark-accent/50 p-8 shadow-2xl backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-center gap-3">
                    {/* Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-accent-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                    </svg>
                    <h1 className="text-3xl font-bold text-light">
                        Live Code Editor
                    </h1>
                </div>

                <h4 className="mb-1 text-gray-300">
                    Paste invitation ROOM ID
                </h4>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        className="rounded-md border border-gray-600 bg-dark p-3 text-light outline-none transition-colors duration-200 placeholder:text-gray-500 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="rounded-md border border-gray-600 bg-dark p-3 text-light outline-none transition-colors duration-200 placeholder:text-gray-500 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button
                        className="btn ml-auto mt-2 w-32 rounded-md bg-accent-green text-lg font-semibold text-text-dark transition-all duration-200 hover:bg-green-400"
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <span className="mt-2 text-center text-gray-400">
                        If you don't have an invite, create a&nbsp;
                        <button
                            onClick={createNewRoom}
                            className="cursor-pointer border-none bg-transparent font-medium text-accent-green underline underline-offset-2 transition-colors hover:text-green-400"
                        >
                            new room
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;