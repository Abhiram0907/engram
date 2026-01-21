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
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans">
            <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800">
                <h1 className="text-2xl font-semibold mb-2 tracking-tight">Aegis Log</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Stateless Provenance on Hedera
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Payload
                        </label>
                        <input
                            type="text"
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            placeholder="Enter data to notarize..."
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={handleLog}
                        disabled={loading || !payload}
                        className={`w-full py-2.5 px-4 rounded-md font-medium transition-all
              ${loading
                                ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Log to Network'}
                    </button>

                    {/* Result Section */}
                    {result && (
                        <div className="mt-4 p-4 rounded-md bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">Success</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all mb-3">
                                {result.txId}
                            </p>
                            <a
                                href={result.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                                View Explorer
                                <span className="text-lg leading-none">&rarr;</span>
                            </a>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/30">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
