
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { getAgentInfo, removeAuthToken } from '../lib/auth'; 
import { useRouter } from 'next/navigation'; 
import { logoutAgent } from '../lib/api'; 
import { useState, useEffect } from 'react'; 

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [agentName, setAgentName] = useState<string | null>(null);

  useEffect(() => {
    const agent = getAgentInfo();
    if (agent) {
      setAgentName(agent.name);
    }
  }, []);


  const handleLogout = async () => {
    try {
      await logoutAgent(); 
      removeAuthToken(); 
      localStorage.removeItem('agent'); 
      router.push('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.'); 
    }
  };

  
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Cash In', href: '/cash-in', icon: 'PlusCircle' },
    { label: 'Cash Out', href: '/cash-out', icon: 'MinusCircle' },
    { label: 'Transactions', href: '/transactions', icon: 'ArrowLeftRight' },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-text-light shadow-xl p-6 fixed top-0 left-0 rounded-r-xl flex flex-col font-inter">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-primary-emerald text-center">
          Mini Wallet
        </h2>
        {agentName && (
          <p className="text-sm text-gray-400 text-center mt-2">
            Welcome, {agentName}!
          </p>
        )}
      </div>

      <nav className="flex-grow">
        <ul className="space-y-3">
          {navItems.map(({ label, href, icon: IconName }) => {
            const isActive = pathname === href;
           
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const Icon = require('lucide-react')[IconName];
            return (
              <li key={href}>
                <Link href={href} passHref>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-primary-emerald text-dark-background font-semibold shadow-md'
                        : 'text-text-light hover:bg-gray-700 hover:text-secondary-teal'
                      }`}
                  >
                    {Icon && <Icon size={20} />} 
                    <span>{label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-700 text-text-light rounded-lg font-semibold
                     hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="17 16 22 12 17 8"/><line x1="22" x2="10" y1="12" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}