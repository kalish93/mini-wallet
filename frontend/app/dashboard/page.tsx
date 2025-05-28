/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import WalletCard from '@/components/WalletCard';
import TransactionList from '@/components/TransactionList';
import { getWalletBalance, getTransactionHistory, getMyAlerts } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth'; 
import AlertBox from '@/components/AlertBox'; 



export default function DashboardPage() {
    const router = useRouter();

    const [balance, setBalance] = useState<any>(null);
    const [transaction, setTransaction] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
      if (!isAuthenticated()) {
        router.replace('/login'); 
        return; 
      }
  
      const fetchData = async () => {
        
  
        try {
          const walletData = await getWalletBalance();
          setBalance(walletData.balance); 
          const transactionData = await getTransactionHistory();
          setTransaction(transactionData.transactions); 

          const alertData = await getMyAlerts();
          setAlerts(alertData.alerts); 
  
  
        } catch (err: unknown) {
          console.error('Failed to fetch dashboard data:', err);
        } finally {
        }
      };
  
      fetchData();
    }, [router]); 
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <Header title="Dashboard" />
        { alerts.map((alert) => <AlertBox key={alert.id} message={alert.message} id={alert.id} />)}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletCard balance={balance} />
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-green-700">Recent Transactions</h3>
            <TransactionList transactions={transaction.slice(0, 4)} />
          </div>
        </div>
      </main>
    </div>
  );
}

