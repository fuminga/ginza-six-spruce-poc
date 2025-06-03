'use client';

import { useState, useEffect } from 'react';
import { config } from '../config';

interface Credential {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    category: string;
    experience: string;
    issuedOn: string;
  };
}

export const useWallet = ( ) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ローカルストレージからの資格情報の読み込み
  useEffect(() => {
    try {
      const storedCredentials = localStorage.getItem('ginza-six-credentials');
      if (storedCredentials) {
        setCredentials(JSON.parse(storedCredentials));
      }
    } catch (err) {
      console.error('Failed to load credentials from storage', err);
    }
  }, []);

  // 資格情報の保存
  const saveCredential = (credential: Credential) => {
    try {
      const updatedCredentials = [...credentials, credential];
      setCredentials(updatedCredentials);
      localStorage.setItem('ginza-six-credentials', JSON.stringify(updatedCredentials));
      return true;
    } catch (err) {
      console.error('Failed to save credential', err);
      return false;
    }
  };

  // セッションIDから資格情報を取得
  const fetchCredential = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiUrl}/api/issuance/credential`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credential');
      }

      const data = await response.json();
      saveCredential(data.credential);
      return data.credential;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    fetchCredential,
    saveCredential,
    isLoading,
    error,
  };
};
