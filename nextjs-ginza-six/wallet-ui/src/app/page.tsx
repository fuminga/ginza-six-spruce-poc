'use client';

import { SessionInput } from '../components/wallet/SessionInput';
import { CredentialList } from '../components/wallet/CredentialList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">GINZA SIX Wallet</h1>
        <p className="text-center mb-8">Store and manage your GINZA SIX Verifiable Credentials</p>
        
        <div className="max-w-md mx-auto">
          <SessionInput />
          <CredentialList />
        </div>
      </div>
    </main>
  );
}
