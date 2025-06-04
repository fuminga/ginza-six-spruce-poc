'use client';

import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';

export const SessionInput: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { fetchCredential, isLoading } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim()) {
      setStatus({ type: 'error', message: 'Please enter a session ID' });
      return;
    }

    try {
      setStatus(null);
      await fetchCredential(sessionId);
      setStatus({ type: 'success', message: 'Credential successfully added to your wallet!' });
      setSessionId('');
    } catch (_error) {
      setStatus({ type: 'error', message: 'Failed to fetch credential. Please check the session ID.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Add Credential</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="sessionId" className="block text-gray-700 mb-2">
            Session ID
          </label>
          <input
            id="sessionId"
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your session ID"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Add Credential'}
        </button>
      </form>
      {status && (
        <div
          className={`mt-4 p-3 rounded ${
            status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};
