'use client';

import React, { useState } from 'react';
import { useVerification } from '../../hooks/useVerification';

export const VerificationForm: React.FC = () => {
  const [credentialInput, setCredentialInput] = useState('');
  const { verifyCredential, isLoading, result } = useVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialInput.trim()) {
      return;
    }

    await verifyCredential(credentialInput);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Verify Credential</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="credential">
            Credential (JSON format)
          </label>
          <textarea
            id="credential"
            className="w-full px-3 py-2 border rounded-md h-64"
            value={credentialInput}
            onChange={(e) => setCredentialInput(e.target.value)}
            placeholder="Paste credential JSON here..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading || !credentialInput.trim()}
        >
          {isLoading ? 'Verifying...' : 'Verify Credential'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 rounded-lg border">
          <h3 className="font-bold text-lg mb-2">Verification Result</h3>
          {result.isValid ? (
            <div className="text-green-600">
              <p className="font-bold">✓ Valid Credential</p>
              {result.subject && (
                <div className="mt-4">
                  <h4 className="font-semibold">Credential Details:</h4>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Category:</span> {result.subject.category}
                    </li>
                    <li>
                      <span className="font-medium">Experience:</span> {result.subject.experience}
                    </li>
                    <li>
                      <span className="font-medium">Issued On:</span> {result.subject.issuedOn}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              <p className="font-bold">✗ Invalid Credential</p>
              {result.error && <p className="mt-2">{result.error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
