import React from 'react';

interface WalletCardProps {
  balance: number;
}

export default function WalletCard({ balance }: WalletCardProps) {
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-md">
      <h3 className="text-white font-semibold text-lg mb-2">
        Wallet Balance
      </h3>
      <p className="text-4xl font-extrabold mt-2">
        ${balance}
      </p>
    </div>
  );
}
