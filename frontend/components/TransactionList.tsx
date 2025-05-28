/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TransactionList({ transactions }: { transactions: any[] }) {
    return (
      <ul className="text-sm mt-2 space-y-1">
        { transactions && (transactions.map((tx, index) => (
          <li key={index} className={tx.type === 'CASH_IN' ? 'text-green-700' : 'text-red-700'}>
            {tx.type === 'CASH_IN' ? '+' : '-'} ${tx.amount} -  {tx.type === 'CASH_IN' ? 'cash in' : 'cash out'}
          </li>
        )))}
      </ul>
    );
  }
  