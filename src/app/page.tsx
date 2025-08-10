'use client';

import { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import WelcomePage from '../components/WelcomePage';
import MainApp from '../components/MainApp';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { currentPage, hasSeenWelcome, markWelcomeSeen } = useAppStore();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // 當用戶首次登入時，顯示歡迎頁面
  useEffect(() => {
    if (isAuthenticated && user && !hasSeenWelcome) {
      // 確保顯示歡迎頁面
      useAppStore.getState().setCurrentPage('welcome');
    }
  }, [isAuthenticated, user, hasSeenWelcome]);

  const handleGetStarted = () => {
    markWelcomeSeen();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">正在初始化您的匿名身分...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✉️</span>
          </div>
          <p className="text-gray-600">正在準備您的匿名體驗...</p>
        </div>
      </div>
    );
  }

  return currentPage === 'welcome' ? (
    <WelcomePage onGetStarted={handleGetStarted} />
  ) : (
    <MainApp />
  );
}
