/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AgentInfo {
    id: string;
    name: string;
    email: string;
    idNumber: string;
    createdAt: string;
}

export interface LoginResponse {
    token: string;
    agent: AgentInfo;
    message: string;
}

export interface RegisterResponse {
    agent: Omit<AgentInfo, 'idNumber' | 'createdAt'>; 
    message: string;
}

export interface WalletBalanceResponse {
    balance: number; 
    currency: string;
}

export interface Transaction {
    id: string;
    agentId: string;
    type: 'CASH_IN' | 'CASH_OUT';
    amount: number; 
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    externalTransactionId: string | null;
    metadata: Record<string, any>; 
    createdAt: string; 
    updatedAt: string; 
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
}

export interface TransactionResponse {
    message: string;
    transactionId: string;
    amount: number;
    type: 'CASH_IN' | 'CASH_OUT';
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    externalTransactionId: string | null;
    receipt: Record<string, any>; 
}

export interface Alert {
    id: string;
    agentId: string;
    type: string; 
    message: string;
    isRead: boolean;
    thresholdValue: number | null;
    createdAt: string; 
    updatedAt: string; 
}

export interface AlertsResponse {
    alerts: Alert[];
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface CustomRequestConfig extends Omit<RequestInit, 'body'> {
    
    body?: Record<string, any>;
}


export async function api<T>(
    endpoint: string,
    { body, ...customConfig }: CustomRequestConfig = {} 
): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const fetchConfig: RequestInit = {
        method: body ? 'POST' : 'GET', 
        ...customConfig, 
        headers: {
            ...headers, 
            ...(customConfig.headers || {}), 
        },
    };

    
    if (body) {
        fetchConfig.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchConfig);

        if (!response.ok) {
            let errorData: { message?: string } = {};
            try {
                errorData = await response.json(); 
            } catch (jsonError) {
                errorData.message = response.statusText;
                console.log(jsonError)
            }
            const error = new Error(errorData.message || 'Something went wrong with the API request.');
            (error as any).statusCode = response.status; 
            throw error;
        }

        if (response.status === 204) { 
            return null as T; 
        }

        return await response.json() as T;
    } catch (error: any) { 
        console.error('API call error:', error);
        if (error.statusCode === 401 || error.statusCode === 403) {
            console.warn('Authentication failed (401/403), clearing token and redirecting.');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
               
            }
        }
        throw error; 
    }
}


export const loginAgent = (email: string, password: string): Promise<LoginResponse> =>
    api<LoginResponse>('/auth/login', { body: { email, password } });

export const registerAgent = (name: string, email: string, password: string, idNumber: string): Promise<RegisterResponse> =>
    api<RegisterResponse>('/auth/register', { body: { name, email, password, idNumber } });

export const logoutAgent = (): Promise<null> => 
    api<null>('/auth/logout', { method: 'POST' });

// Wallet Endpoints
export const getWalletBalance = (): Promise<WalletBalanceResponse> =>
    api<WalletBalanceResponse>('/wallet/balance');

export const getTransactionHistory = (limit: number = 50): Promise<TransactionHistoryResponse> =>
    api<TransactionHistoryResponse>(`/wallet/transactions?limit=${limit}`);

export const cashIn = (amount: number, metadata: Record<string, any>): Promise<TransactionResponse> =>
    api<TransactionResponse>('/wallet/cash-in', { body: { amount, metadata } });

export const cashOut = (amount: number, metadata: Record<string, any>): Promise<TransactionResponse> =>
    api<TransactionResponse>('/wallet/cash-out', { body: { amount, metadata } });

// Alerts Endpoints
export const getMyAlerts = (): Promise<AlertsResponse> =>
    api<AlertsResponse>('/alerts');

export const markAlertAsRead = (alertId: string): Promise<Alert> =>
    api<Alert>(`/alerts/${alertId}/read`, { method: 'PUT' });