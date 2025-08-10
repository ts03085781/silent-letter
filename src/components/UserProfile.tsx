'use client';

import useAuthStore from '@/store/useAuthStore';
import useAppStore from '@/store/useAppStore';
import { useState } from 'react';

export default function UserProfile() {
  const { user, logout, isLoading } = useAuthStore();
  const { setCurrentPage } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    if (confirm('您確定要創建新的匿名身分嗎？此操作無法撤銷。')) {
      await logout();
      window.location.reload(); // 刷新頁面以觸發新用戶註冊
    }
  };

  const handleShowWelcome = () => {
    setCurrentPage('welcome');
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="cursor-pointer flex items-center space-x-3 bg-white rounded-lg shadow-md px-4 py-2 hover:shadow-lg transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.anonymousId.slice(0, 2)}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-800">{user.anonymousId}</p>
          <p className="text-xs text-gray-500">{user.points} points</p>
        </div>
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">匿名身分</h3>
              <p className="text-sm text-gray-600 mt-1">{user.anonymousId}</p>
              <div className="mt-2 flex items-center">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">點數</div>
                  <div className="text-lg font-semibold text-blue-600">{user.points}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    加入於 {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              <button
                onClick={handleShowWelcome}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                📝 查看使用說明
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? '正在創建新身分...' : '🔄 創建新身分'}
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-lg">
              <div className="text-xs text-gray-600">
                <h4 className="font-medium mb-1">點數系統：</h4>
                <ul className="space-y-1">
                  <li>• 發送訊息：-3 點</li>
                  <li>• 收到回覆：+1 點</li>
                  <li>• 起始點數：10 點</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}