'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading, fetchUser, register } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // 首先嘗試獲取現有用戶信息
      await fetchUser();
      
      // 如果沒有認證用戶，自動註冊匿名用戶
      if (!useAuthStore.getState().isAuthenticated) {
        await register();
      }
    };

    initAuth();
  }, [fetchUser, register]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Silent Letter...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Silent Letter</h1>
          <p className="text-gray-600 mb-6">Connecting hearts through anonymous messages</p>
          <LoadingSpinner size="md" />
          <p className="mt-4 text-sm text-gray-500">Creating your anonymous identity...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}