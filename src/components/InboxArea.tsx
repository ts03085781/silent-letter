'use client';

import { useEffect, useState } from 'react';
import useMessageStore from '@/store/useMessageStore';
import useAuthStore from '@/store/useAuthStore';
import MessageItem from './MessageItem';
import LoadingSpinner from './LoadingSpinner';

export default function InboxArea() {
  const { messages, sentMessages, isLoading, error, fetchMessages, fetchSentMessages, hasMore, page } = useMessageStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  useEffect(() => {
    if (user) {
      if (activeTab === 'inbox') {
        fetchMessages(1);
      } else {
        fetchSentMessages(1);
      }
    }
  }, [user, activeTab, fetchMessages, fetchSentMessages]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      if (activeTab === 'inbox') {
        fetchMessages(page + 1);
      } else {
        fetchSentMessages(page + 1);
      }
    }
  };

  // 取得當前標籤的訊息
  const currentMessages = activeTab === 'inbox' ? messages : sentMessages;
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">📬</span>
          您的訊息
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          {unreadCount > 0 
            ? `有 ${unreadCount} 封新訊息等待查看`
            : '全部都看完了！'
          }
        </p>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`cursor-pointer flex-1 py-3 sm:py-2 px-3 sm:px-4 rounded-md text-sm font-medium transition-all focus-ring ${
              activeTab === 'inbox'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="hidden sm:inline">📬 收件匣</span>
            <span className="sm:hidden">📬</span>
            {unreadCount > 0 && activeTab === 'inbox' && <span className="ml-1">({unreadCount})</span>}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`cursor-pointer flex-1 py-3 sm:py-2 px-3 sm:px-4 rounded-md text-sm font-medium transition-all focus-ring ${
              activeTab === 'sent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="hidden sm:inline">📤 已發送</span>
            <span className="sm:hidden">📤</span>
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {isLoading && currentMessages.length === 0 ? (
            <div className="text-center py-8">
              <LoadingSpinner size="md" />
              <p className="text-gray-500 mt-2">正在載入訊息...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => activeTab === 'inbox' ? fetchMessages(1) : fetchSentMessages(1)}
                  className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  重新試試
                </button>
              </div>
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-gray-400 text-4xl mb-4">
                  {activeTab === 'inbox' ? '📭' : '📤'}
                </div>
                <h3 className="text-gray-600 font-medium mb-2">
                  {activeTab === 'inbox' ? '還沒有訊息' : '還沒有已發送的訊息'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'inbox' 
                    ? '發送一封訊息開始與其他人連結！'
                    : '您發送的訊息將顯示在這裡。'
                  }
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isInInbox={activeTab === 'inbox'}
                />
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-2 mx-auto disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>正在載入...</span>
                      </>
                    ) : (
                      <>
                        <span>載入更多訊息</span>
                        <span>↓</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Instructions */}
        {activeTab === 'inbox' && currentMessages.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">回覆可獲得點數：</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 每次回覆可獲得 +1 點數</li>
              <li>• 保持體貨和支持的態度</li>
              <li>• 您的回覆將保持匿名</li>
              <li>• 幫助創建有意義的連結</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}