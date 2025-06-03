'use client';

import { IssuanceForm } from '../components/issuance/IssuanceForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">GINZA SIX Staff Portal</h1>
        <p className="text-center mb-8">Use this portal to issue Verifiable Credentials to customers</p>
        
        <div className="max-w-md mx-auto">
          <IssuanceForm />
        </div>
      </div>
    </main>
  );
}
