'use client';

import SendMessageArea from './SendMessageArea';
import InboxArea from './InboxArea';
import UserProfile from './UserProfile';
import useAppStore from '@/store/useAppStore';

export default function MainApp() {
  const { setCurrentPage } = useAppStore();

  const showWelcomePage = () => {
    setCurrentPage('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={showWelcomePage}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">SL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Silent Letter
                </h1>
                <p className="text-sm text-gray-500">匿名心靈連結平台</p>
              </div>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="animate-fadeInUp">
            <SendMessageArea />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <InboxArea />
          </div>
        </div>
      </main>

      <footer className="mt-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Silent Letter - 透過匿名訊息連結心靈
            </p>
            <p className="text-xs mt-2 text-gray-500">
              自由表達自己，收穫有意義的回覆
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}