import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export const Form = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !amount) return;

        // Simulate a brief "sending" state for the button feedback specifically
        setIsSubmitting(true);
        onSubmit({ email, amount: parseFloat(amount) });

        // Reset form
        setEmail('');
        setAmount('');

        // Reset submitting state after short delay to show interaction
        setTimeout(() => setIsSubmitting(false), 500);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">New Transaction</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="user@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Send Funds
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
