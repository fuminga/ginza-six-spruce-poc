'use client';

import { useState } from 'react';
import { config } from '../config';

interface VerificationResult {
  isValid: boolean;
  subject?: {
    category: string;
    experience: string;
    issuedOn: string;
  };
  error?: string;
}

export const useVerification = ( ) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyCredential = async (credentialJson: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let credential;
      try {
        credential = JSON.parse(credentialJson);
      } catch (_e) {
        throw new Error('Invalid JSON format');
      }

      const response = await fetch(`${config.apiUrl}/api/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        throw new Error('Verification request failed');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err: unknown) {
      // エラーメッセージを安全に取得
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during verification';
      setError(errorMessage);
      setResult({
        isValid: false,
        error: errorMessage,
      });
      return {
        isValid: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyCredential,
    isLoading,
    error,
    result,
  };
};
