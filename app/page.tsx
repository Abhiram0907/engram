'use client';

import { useState } from 'react';

export default function Home() {
    const [payload, setPayload] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ status: string; txId: string; explorerUrl: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLog = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/notarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: payload }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to notarize');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-green-500 selection:bg-green-500 selection:text-black">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed left-0 top-0 flex w-full justify-center border-b border-green-900 bg-gradient-to-b from-zinc-800/30 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        AEGIS&nbsp;
                        <span className="font-bold">PROVENANCE LOG</span>
                    </p>
                </div>
            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-green-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-green-900 after:via-green-900 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-green-700 before:dark:opacity-10 after:dark:from-green-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
                {/* Cyberpunk Card */}
                <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-green-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)] backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center tracking-widest text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">
                        SECURE<span className="text-white">_</span>PAYLOAD
                    </h2>

                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                placeholder="ENTER SENSITIVE DATA..."
                                className="w-full bg-black/50 border border-green-700 text-green-300 px-4 py-3 rounded focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder-green-800 transition-all"
                            />
                            <div className="absolute inset-0 border border-green-500/0 group-hover:border-green-500/20 pointer-events-none rounded transition-all"></div>
                        </div>

                        <button
                            onClick={handleLog}
                            disabled={loading || !payload}
                            className={`w-full py-3 px-6 font-bold uppercase tracking-wider transition-all duration-200 clip-path-polygon
                ${loading
                                    ? 'bg-green-900 text-green-700 cursor-not-allowed border-green-900'
                                    : 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_10px_rgba(0,255,0,0.6)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)]'
                                }`}
                        >
                            {loading ? 'ENCRYPTING & LOGGING...' : 'IMMUTABLY LOG'}
                        </button>

                        {/* Output Area */}
                        {result && (
                            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/40 rounded animate-in fade-in slide-in-from-bottom-2">
                                <div className="text-xs text-green-600 mb-1 uppercase tracking-widest">Transaction Verified</div>
                                <div className="break-all font-mono text-sm">
                                    <span className="text-gray-500">ID: </span>
                                    <span className="text-green-300">{result.txId}</span>
                                </div>
                                <a
                                    href={result.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 block text-center text-xs bg-green-900/40 hover:bg-green-800/60 text-green-300 py-2 border border-green-600/30 rounded transition-colors"
                                >
                                    VIEW ON HASHSCAN [EXT]
                                </a>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/40 rounded text-red-400 text-sm text-center">
                                ERROR: {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
                {/* Footer info? */}
            </div>
        </main>
    );
}
