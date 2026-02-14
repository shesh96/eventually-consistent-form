
import React from 'react';
import {
    CheckCircle,
    AlertCircle,
    Loader,
    RefreshCcw
} from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status, nextRetry }) => {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        SUCCESS: 'bg-green-100 text-green-800 border-green-200',
        RETRYING: 'bg-orange-100 text-orange-800 border-orange-200',
        ERROR: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
        PENDING: <Loader className="w-4 h-4 animate-spin" />,
        SUCCESS: <CheckCircle className="w-4 h-4" />,
        RETRYING: <RefreshCcw className="w-4 h-4 animate-spin-slow" />, // slow spin for retry wait
        ERROR: <AlertCircle className="w-4 h-4" />
    };

    return (
        <div className={clsx(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
            styles[status] || styles.ERROR
        )}>
            {icons[status]}
            <span className="uppercase tracking-wide">{status}</span>
            {status === 'RETRYING' && nextRetry && (
                <span className="text-[10px] opacity-75 ml-1">
                    (Retrying in {Math.ceil((nextRetry - Date.now()) / 1000)}s)
                </span>
            )}
        </div>
    );
};

export const TransactionList = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No transactions yet.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900 text-lg">${tx.data.amount.toFixed(2)}</span>
                                <span className="text-sm text-slate-500">to {tx.data.email}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                                ID: {tx.id.slice(0, 8)}... • {new Date(tx.timestamp).toLocaleTimeString()}
                            </span>
                        </div>

                        <StatusBadge status={tx.status} nextRetry={tx.nextRetry} />
                    </div>
                ))}
            </div>
        </div>
    );
};
