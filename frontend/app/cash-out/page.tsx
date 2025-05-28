import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CashForm from '@/components/CashForm';

export default function CashOutPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <Header title="Cash Out" />
        <CashForm type="out" />
      </main>
    </div>
  );
}
