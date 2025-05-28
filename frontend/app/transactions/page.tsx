/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'; 

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth'; 

export default function TransactionsPage() {

    const [transaction, setTransaction] = useState<any>(null);
    
        useEffect(() => {
          if (!isAuthenticated()) {
            return; 
          }
      
          const fetchData = async () => {
      
            try {
              const transactionData = await getTransactionHistory();
              setTransaction(transactionData.transactions); 
      
      
            } catch (err: unknown) {
              console.error('Failed to fetch dashboard data:', err);
            } finally {
            }
          };
      
          fetchData(); 
        }, []); 
      
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <Header title="Transactions" />
        <div className="bg-white shadow p-6 rounded-lg">
          <TransactionTable transactions={transaction} />
        </div>
      </main>
    </div>
  );
}
