class MockExternalAPI {
    static async call(transactionType, amount) {
        console.log(`Mock API: Simulating ${transactionType} for amount ${amount}`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100)); 

        const success = Math.random() > 0.1; 
        const externalTransactionId = `EXT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        if (success) {
            return {
                status: 'SUCCESS',
                message: `${transactionType.replace('_', ' ')} successful.`,
                externalTransactionId: externalTransactionId,
                data: {
                    customer_account_ref: 'CUST12345' 
                }
            };
        } else {
            const errorMessages = [
                'External service unavailable.',
                'Insufficient funds on external account.', 
                'Transaction declined by external provider.',
                'Network error.'
            ];
            const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            return {
                status: 'FAILED',
                message: `Mock API: ${errorMessage}`,
                externalTransactionId: null 
            };
        }
    }
}

module.exports = MockExternalAPI;