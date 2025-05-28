import { useState } from 'react';
import { markAlertAsRead } from '@/lib/api';
interface AlertBoxProps {
    message: string;
    id: string;
  }

export default function AlertBox({ message, id }: AlertBoxProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow relative">
      <button
        onClick={() => {setVisible(false)
            markAlertAsRead(id)
        }}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold cursor-pointer"
        aria-label="Close alert"
      >
        ×
      </button>
      <strong>Alert:</strong> {message}
    </div>
  );
}
