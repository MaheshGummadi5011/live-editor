// client/src/components/RemoteCursor.js
import React from 'react';

const RemoteCursor = ({ x, y, username }) => {
    // We don't render the cursor if its position is the default (0,0)
    if (x === 0 && y === 0) {
        return null;
    }

    // Styles for the container must remain inline due to dynamic x/y coordinates
    const cursorContainerStyle = {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'left 0.05s linear, top 0.05s linear', // Adds smoothing to the cursor movement
    };

    // More realistic mouse pointer SVG with drop shadow
    return (
        <div style={cursorContainerStyle}>
            <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
                <polygon
                    points="2,2 30,16 18,18 20,30 14,28 12,18 2,2"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="absolute left-7 top-2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white shadow-lg border border-white">
                {username}
            </span>
        </div>
    );
};

export default RemoteCursor;