
// Simulates a backend API with eventual consistency
// Returns a Promise that resolves or rejects based on random chance

export const submitTransaction = async (data, idempotencyKey) => {
    console.log(`[API] Received request: ${idempotencyKey}`, data);

    // Simulate network latency (500ms - 1500ms)
    const latency = 500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, latency));

    const random = Math.random();

    // 30% chance of Temporary Failure (503)
    if (random < 0.3) {
        console.warn(`[API] 503 Service Unavailable: ${idempotencyKey}`);
        throw { status: 503, message: "Service Unavailable" };
    }

    // 20% chance of Delayed Success (Eventual Consistency)
    // The API returns 200 OK, but the side effect might take longer to propagate (simulated by a long delay before "finishing" if we were polling, 
    // but for this assignment, "responds after 5-10 seconds" might mean the API connection hangs open for that long).
    // The requirement says: "responds randomly with... delayed success (responds after 5–10 seconds)"
    // So we will actually wait that long before resolving.
    if (random < 0.5) {
        console.log(`[API] Processing slowly...: ${idempotencyKey}`);
        const heavyLoadDelay = 5000 + Math.random() * 5000; // 5-10 seconds
        await new Promise((resolve) => setTimeout(resolve, heavyLoadDelay));
    }

    // Success (200)
    console.log(`[API] 200 OK: ${idempotencyKey}`);
    return { status: 200, message: "Transaction Received", id: idempotencyKey };
};
