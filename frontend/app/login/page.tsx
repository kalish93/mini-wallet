/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { loginAgent, registerAgent } from '../../lib/api'; 
import { setAuthToken, isAuthenticated } from '../../lib/auth'; 
import Head from 'next/head'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>(''); 
  const [idNumber, setIdNumber] = useState<string>(''); 
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard'); 
    }
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); 

    setIsLoading(true);
    setErrorMessage(''); 
    setSuccessMessage(''); 

    try {
      if (isRegisterMode) {
        if (!name || !idNumber || !email || !password) {
          throw new Error("All fields (Full Name, ID Number, Email, Password) are required for registration.");
        }
        const response = await registerAgent(name, email, password, idNumber);
        setSuccessMessage(response.message || 'Registration successful! You can now log in.');
        setIsRegisterMode(false); 
        setEmail('');
        setPassword('');
        setName('');
        setIdNumber('');
      } else {
        if (!email || !password) {
          throw new Error("Email and Password are required for login.");
        }
        const response = await loginAgent(email, password);
        setAuthToken(response.token);
        localStorage.setItem('agent', JSON.stringify(response.agent));
        setSuccessMessage('Login successful! Redirecting...');
        router.push('/dashboard'); 
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let msg = 'An unexpected error occurred during authentication.';
      if (err.message) {
          msg = err.message;
      } else if (err.statusCode === 401) {
          msg = 'Invalid email or password.';
      } else if (err.statusCode === 409) {
          msg = 'Email or ID number already registered.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegisterMode(prevMode => !prevMode);
    setErrorMessage(''); 
    setSuccessMessage(''); 
    setEmail('');
    setPassword('');
    setName('');
    setIdNumber('');
  };

  return (
    <>
      <Head>
        <title>{isRegisterMode ? 'Register' : 'Login'} - Mini Wallet</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-text-light p-4 font-inter">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl border-primary-emerald">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-primary-emerald">
            Mini Wallet {isRegisterMode ? 'Register' : 'Login'}
          </h2>

          {errorMessage && (
            <div className="bg-red-800 text-text-light p-3 rounded-md mb-4 text-center border border-red-600">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-800 text-text-light p-3 rounded-md mb-4 text-center border border-green-600">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegisterMode && (
              <>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-text-light">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-teal text-text-light placeholder-gray-400 transition-colors duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="idNumber" className="block mb-2 text-sm font-medium text-text-light">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-teal text-text-light placeholder-gray-400 transition-colors duration-200"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-light">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-teal text-text-light placeholder-gray-400 transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-light">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-teal text-text-light placeholder-gray-400 transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-emerald text-text-light py-3 rounded-lg font-semibold hover:bg-secondary-teal transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary-teal focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (isRegisterMode ? 'Registering...' : 'Logging In...') : (isRegisterMode ? 'Register' : 'Login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-secondary-teal hover:underline text-sm font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              {isRegisterMode ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
