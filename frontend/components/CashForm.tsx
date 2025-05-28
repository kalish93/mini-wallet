/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { cashIn, cashOut } from '@/lib/api';

interface CashFormProps {
    type: 'in' | 'out';
    onTransactionSuccess?: () => void; 
}

export default function CashForm({ type, onTransactionSuccess }: CashFormProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 

    const isCashIn = type === 'in';
    const formTitle = isCashIn ? 'Cash In' : 'Cash Out';
    const buttonText = isCashIn ? 'Process Cash In' : 'Process Cash Out';
    const buttonColorClass = isCashIn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault(); 

        setError(null);
        setSuccessMessage(null);

        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }

        setLoading(true); 

        try {
            let responseData;
            if(isCashIn){
                responseData = await cashIn(numericAmount, {});
                
            } else{
                responseData = await cashOut(numericAmount, {});   
            }
           
            setSuccessMessage(`${formTitle} successful! Transaction ID: ${ responseData.transactionId || 'N/A'}`);

            setAmount(''); 
            if (onTransactionSuccess) {
                onTransactionSuccess(); 
            }

        } catch (err: any) {
            console.error('Transaction submission error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false); 
        }
    }, [amount, type, isCashIn, formTitle, onTransactionSuccess]); 

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-md mx-auto bg-white p-8 shadow-lg rounded-xl border border-gray-100"
        >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{formTitle}</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            <label className="block">
                <span className="text-gray-700 text-lg font-medium mb-1 block">Amount</span>
                <input
                    type="number"
                    inputMode="decimal" 
                    min="0.01" 
                    step="0.01" 
                    className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 transition duration-150 ease-in-out text-lg text-gray-700"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={loading} 
                    placeholder={`Enter ${formTitle.toLowerCase()} amount`}
                />
            </label>

            <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 ease-in-out
                            ${buttonColorClass} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading} 
            >
                {loading ? (
                    
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    buttonText 
                )}
            </button>
        </form>
    );
}