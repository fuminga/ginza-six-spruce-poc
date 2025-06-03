'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIssuance } from '../../hooks/useIssuance';
import { issuanceSchema, IssuanceFormData } from '../../config';

export const IssuanceForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { issueCredential } = useIssuance();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssuanceFormData>({
    resolver: zodResolver(issuanceSchema),
    defaultValues: {
      category: 'Shizuka',
    }
  });
  
  const onSubmit = async (data: IssuanceFormData) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Generate QR code for customer to scan
      const response = await issueCredential({
        customerEmail: data.customerEmail,
        category: data.category,
        experience: data.experience,
      });
      
      setSessionId(response.sessionId);
      setResult({
        success: true,
        message: 'Credential issuance initiated. Please ask the customer to scan the QR code.',
      });
      
      // Reset form
      reset();
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to issue credential. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteIssuance = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issuance/credential`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete issuance');
      }
      
      const data = await response.json();
      
      setResult({
        success: true,
        message: 'Credential successfully issued to customer wallet.',
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to complete credential issuance.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Issue Sensibility VC</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="customerEmail">
            Customer Email
          </label>
          <input
            id="customerEmail"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            {...register('customerEmail')}
          />
          {errors.customerEmail && (
            <p className="text-red-500 mt-1">{errors.customerEmail.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Sensibility Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border rounded-md"
            {...register('category')}
          >
            <option value="Shizuka">Shizuka (Silent)</option>
            <option value="Kaori">Kaori (Fragrance)</option>
          </select>
          {errors.category && (
            <p className="text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="experience">
            Experience Name
          </label>
          <input
            id="experience"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., GINZA SILENT SALON"
            {...register('experience')}
          />
          {errors.experience && (
            <p className="text-red-500 mt-1">{errors.experience.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Session...' : 'Create Session'}
        </button>
      </form>
      
      {sessionId && (
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="font-bold mb-2">Session Created</h3>
          <p className="mb-4">Session ID: {sessionId}</p>
          <button
            onClick={handleCompleteIssuance}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? 'Issuing Credential...' : 'Issue Credential'}
          </button>
        </div>
      )}
      
      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
};
