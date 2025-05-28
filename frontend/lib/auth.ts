import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface JWTPayload {
    agentId: string;
    email: string;
    exp: number; 
    iat: number; 
}

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

export const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    if (!token) return false;

    try {
       
        const payloadString = atob(token.split('.')[1]);
        const decodedToken: JWTPayload = JSON.parse(payloadString);

        const currentTime = Date.now() / 1000; 

        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Error decoding or verifying token client-side:', error);
        return false;
    }
};

export const useAuthRedirect = (redirectTo: string = '/login'): boolean => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isAuthenticated()) {
                router.push(redirectTo);
            } else {
                setLoading(false);
            }
        }
    }, [router, redirectTo]); 

    
    return loading;
};


export interface CurrentAgentInfo {
    id: string;
    name: string;
    email: string;
}

export const getAgentInfo = (): CurrentAgentInfo | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const storedAgent = localStorage.getItem('agent'); 
        return storedAgent ? JSON.parse(storedAgent) as CurrentAgentInfo : null;
    } catch (error) {
        console.error('Error parsing agent info from localStorage:', error);
        return null;
    }
};