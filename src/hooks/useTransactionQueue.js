import { useState, useCallback, useRef, useEffect } from 'react';
import { submitTransaction } from '../utils/api';

export const useTransactionQueue = () => {
    const [transactions, setTransactions] = useState([]);

    // Ref to track active timeouts for cleanup
    const timeoutsRef = useRef(new Set());

    // Helper to ensure we always use latest state/logic if needed.

    const processTransaction = useCallback(async (id, data, retryCount = 0) => {
        // 1. Update State to Pending/Retrying
        setTransactions(prev => prev.map(tx =>
            tx.id === id
                ? { ...tx, status: retryCount > 0 ? 'RETRYING' : 'PENDING', retryCount }
                : tx
        ));

        try {
            // 2. Call API
            const response = await submitTransaction(data, id);

            // 3. Success
            setTransactions(prev => prev.map(tx =>
                tx.id === id ? { ...tx, status: 'SUCCESS', response } : tx
            ));
        } catch (error) {
            // 4. Handle Errors
            if (error.status === 503 && retryCount < 5) {
                // Backoff: 1s, 2s, 4s, 8s, 10s...
                const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);

                console.log(`[Queue] Retry ${retryCount + 1} for ${id} in ${delay}ms`);

                // Update UI to show we are waiting to retry
                setTransactions(prev => prev.map(tx =>
                    tx.id === id ? { ...tx, status: 'RETRYING', nextRetry: Date.now() + delay } : tx
                ));

                const timeoutId = setTimeout(() => {
                    processTransaction(id, data, retryCount + 1);
                    timeoutsRef.current.delete(timeoutId);
                }, delay);

                timeoutsRef.current.add(timeoutId);
            } else {
                // Permanent Fail
                setTransactions(prev => prev.map(tx =>
                    tx.id === id ? { ...tx, status: 'ERROR', error: error.message || "Failed" } : tx
                ));
            }
        }
    }, []);

    const addTransaction = useCallback((data) => {
        // Duplicate Prevention (Logical consistency)
        // Check if there's already a PENDING or RETRYING transaction with same data
        setTransactions(prev => {
            const isDuplicate = prev.some(tx =>
                tx.data.email === data.email &&
                tx.data.amount === data.amount &&
                (tx.status === 'PENDING' || tx.status === 'RETRYING')
            );

            if (isDuplicate) {
                console.warn("Duplicate submission prevented:", data);
                return prev;
            }

            const id = crypto.randomUUID();
            const newTx = {
                id,
                data,
                status: 'PENDING', // Initial state
                timestamp: Date.now(),
                retryCount: 0
            };

            // Trigger processing asynchronously
            setTimeout(() => processTransaction(id, data, 0), 0);

            return [newTx, ...prev];
        });
    }, [processTransaction]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    return {
        transactions,
        addTransaction
    };
};
