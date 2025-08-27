// client/src/components/OutputTerminal.js
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

const OutputTerminal = ({ output, error }) => {
    const codeRef = useRef(null);

    // This effect runs every time the 'output' prop changes to re-apply highlighting
    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [output]);

    return (
        <div className="flex h-full flex-col gap-2 p-4">
            <h3 className="font-semibold uppercase tracking-wider text-accent-green">Output</h3>
            {/* The 'pre' tag preserves whitespace, ideal for code output */}
            <pre className="h-full w-full overflow-auto rounded-md bg-dark p-3 font-mono text-sm text-light">
                <code ref={codeRef} className={error ? 'text-accent-red' : ''}>
                    {output || 'Click "Run Code" to see the output here.'}
                </code>
            </pre>
        </div>
    );
};

export default OutputTerminal;