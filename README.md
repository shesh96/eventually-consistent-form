# Eventually Consistent Form App

 This project implements a robust form submission system that handles eventual consistency, network failures, and duplicate prevention.

## Features

- **Eventual Consistency**: Handles delayed API responses while keeping the user informed.
- **Retry Logic**: Automatically retries on 503 "Service Unavailable" errors using exponential backoff.
- **Duplicate Prevention**: Intellegently prevents double submissions for the same request.
- **Feedback UI**: Clear visual indicators for pending, success, retrying, and error states.

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Implementation Details

### State Transitions
The application manages each transaction through a defined lifecycle:
1.  **Pending**: API request initiated.
2.  **Success**: API returned 200 OK.
3.  **Retrying**: API returned 503 Service Unavailable. The system waits and retries automatically.
4.  **Error**: Permanent failure after max retries or critical error.

### Retry Logic
When the mock API returns a `503` status (simulated 30% chance), the client:
- Catches the error.
- Calculates a backoff delay (1s, 2s, 4s...).
- Updates the UI to show a "Retrying" state.
- Re-attempts the request up to 5 times.

### Duplicate Prevention
To prevent processing the same transaction twice:
- The system checks the `transactionQueue` before every submission.
- If a transaction with the exact same email and amount is already `PENDING` or `RETRYING`, the new submission is blocked.
- The submit button is also disabled during processing to prevent accidental double-clicks.
