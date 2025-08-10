'use client';

import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

export default function DailyRewardButton() {
  const { user, claimDailyReward, isLoading } = useAuthStore();
  const [message, setMessage] = useState('');

  // 檢查是否今天已經領取過獎勵
  const canClaimToday = () => {
    if (!user?.lastDailyRewardDate) return true;
    
    const now = new Date();
    const lastReward = new Date(user.lastDailyRewardDate);
    
    return now.toDateString() !== lastReward.toDateString();
  };

  const handleClaim = async () => {
    try {
      setMessage('');
      const result = await claimDailyReward();
      
      if (result.alreadyClaimed) {
        setMessage('您今天已經獲得過每日獎勵了！明天再來吧！');
      } else if (result.success) {
        setMessage(`太棒了！獲得了 +${result.pointsAwarded} 點數！`);
      }
      
      // 5秒後清除訊息
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('獲取獎勵時發生錯誤，請稍後再試。');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const isAvailable = canClaimToday();

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎁</span>
          <div>
            <h3 className="font-semibold text-gray-800">每日登錄獎勵</h3>
            <p className="text-xs text-gray-600">每天可獲得 10 點數</p>
          </div>
        </div>
        
        {isAvailable ? (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        )}
      </div>

      <button
        onClick={handleClaim}
        disabled={!isAvailable || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
          isAvailable && !isLoading
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>領取中...</span>
          </>
        ) : isAvailable ? (
          <>
            <span>🎉</span>
            <span>領取今日獎勵</span>
          </>
        ) : (
          <>
            <span>✅</span>
            <span>今日已領取</span>
          </>
        )}
      </button>

      {message && (
        <div className={`mt-2 p-2 rounded-lg text-xs text-center ${
          message.includes('錯誤') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : message.includes('已經獲得')
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {user?.totalDailyRewardsEarned && user.totalDailyRewardsEarned > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          累計獲得 {user.totalDailyRewardsEarned} 次每日獎勵
        </div>
      )}
    </div>
  );
}