import React from 'react';
import { Form } from './components/Form';
import { TransactionList } from './components/TransactionList';
import { useTransactionQueue } from './hooks/useTransactionQueue';
import { ShieldCheck } from 'lucide-react';

function App() {
  const { transactions, addTransaction } = useTransactionQueue();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Secure Transfer
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Experience our eventually consistent payment processing system.
          </p>
        </header>

        <main className="w-full grid md:grid-cols-2 gap-8 items-start">
          <section className="flex flex-col items-center md:items-stretch gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:hidden">
              <h2 className="font-semibold text-slate-800 mb-2">How it works</h2>
              <p className="text-sm text-slate-600">
                Submissions are processed asynchronously. Failures are automatically retried.
                Double submissions are prevented.
              </p>
            </div>

            <Form onSubmit={addTransaction} />
          </section>

          <section className="flex flex-col gap-4">
            <TransactionList transactions={transactions} />
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>Mock API Environment • Eventual Consistency Demo</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
