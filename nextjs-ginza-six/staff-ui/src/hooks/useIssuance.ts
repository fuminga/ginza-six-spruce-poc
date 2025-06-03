import { useState } from 'react';
import { config, IssuanceFormData } from '../config';

interface IssuanceResult {
  qrData?: string;
  sessionId: string;
}

export const useIssuance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const issueCredential = async (params: IssuanceFormData): Promise<IssuanceResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create issuance session
      const sessionResponse = await fetch(`${config.apiUrl}/api/issuance/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: params.customerEmail,
          category: params.category,
          experience: params.experience,
        }),
      });
      
      if (!sessionResponse.ok) {
        throw new Error('Failed to create issuance session');
      }
      
      const sessionData = await sessionResponse.json();
      
      return {
        qrData: sessionData.qrData,
        sessionId: sessionData.sessionId,
      };
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    issueCredential,
    isLoading,
    error,
  };
};
