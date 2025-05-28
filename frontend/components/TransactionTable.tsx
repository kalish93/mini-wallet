/* eslint-disable @typescript-eslint/no-explicit-any */

interface Transaction {
    id: string;
    agentId: string;
    type: string; 
    amount: number; 
    status: string;
    externalTransactionId: string | null; 
    metadata: any; 
    createdAt: string; 
    updatedAt: string; 
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {

    const getStatusClasses = (status: string): string => {
        switch (status) {
            case 'SUCCESS':
                return 'bg-green-500';
            case 'FAILED':
                return 'bg-red-500';
            case 'PENDING':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500'; 
        }
    };

    const getTypeClasses = (type: string): string => {
        switch (type) {
            case 'CASH_IN':
                return 'text-green-700';
            case 'CASH_OUT':
                return 'text-red-700';
            default:
                return 'text-gray-700'; 
        }
    };

    const formatAmount = (amount: number, type: string): string => {
        const sign = (type === 'CASH_OUT') ? '-' : ''; 
        return `${sign}$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200 shadow-sm"> 
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold uppercase tracking-wider"> 
                        <th className="p-3">#</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Ext. Txn ID</th>
                        <th className="p-3">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {!transactions ? (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-500">
                                No transactions found for this agent.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((tx, index) => (
                            <tr key={tx.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200 ease-in-out"> {/* Added smooth hover transition */}
                                <td className="p-3 text-sm text-gray-800">{index + 1}</td>
                                <td className={`p-3 font-medium ${getTypeClasses(tx.type)}`}>
                                    {tx.type.replace(/_/g, ' ')} {/* Replaces underscores with spaces for readability */}
                                </td>
                                <td className="p-3 text-sm font-semibold text-gray-600">{formatAmount(tx.amount, tx.type)}</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(tx.status)} text-white`}> {/* Adjusted font size and weight for badge */}
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="p-3 text-xs text-gray-600">{tx.externalTransactionId || 'N/A'}</td> {/* Display N/A if null */}
                                <td className="p-3 text-xs text-gray-600">{new Date(tx.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}