'use client';

import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';

export const CredentialList: React.FC = () => {
  const { credentials, isLoading } = useWallet();
  const [selectedCredential, setSelectedCredential] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return <div className="text-center p-4">Loading credentials...</div>;
  }

  if (credentials.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <p className="text-gray-600">No credentials found in your wallet.</p>
        <p className="mt-2">
          You can add credentials by scanning a QR code or entering a session ID.
        </p>
      </div>
    );
  }

  const handleShowCredential = (index: number) => {
    setSelectedCredential(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Credentials</h2>
      <div className="space-y-4">
        {credentials.map((credential, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">
              {credential.credentialSubject.category} Credential
            </h3>
            <p className="text-gray-600">
              Experience: {credential.credentialSubject.experience}
            </p>
            <p className="text-gray-500 text-sm">
              Issued: {new Date(credential.issuanceDate).toLocaleDateString()}
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleShowCredential(index)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCredential !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Credential Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(credentials[selectedCredential], null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
