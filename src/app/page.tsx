'use client';

import { useState } from 'react';
import { Loader2, ExternalLink, ArrowRight } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; topicUrl?: string; status: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/notarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to notarize');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">EnGram</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Immutable logging via Hedera Consensus Service
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Message Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter data to log..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32 text-sm"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Log to Ledger <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center text-green-800 text-sm font-medium mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Successfully Logged
            </div>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 text-blue-600 hover:text-blue-800 text-sm flex items-center break-all transition-colors underline decoration-blue-200 hover:decoration-blue-800"
            >
              View Transaction
              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
            </a>
            {result.topicUrl && (
              <a
                href={result.topicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 text-sm flex items-center break-all transition-colors underline decoration-purple-200 hover:decoration-purple-800"
              >
                View Topic (Message Log)
                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
