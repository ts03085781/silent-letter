'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function DailyRewardModal() {
  const { 
    showDailyRewardModal, 
    setShowDailyRewardModal, 
    dailyRewardInfo,
    setDailyRewardInfo
  } = useAuthStore();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showDailyRewardModal && dailyRewardInfo?.receivedDailyReward) {
      setIsVisible(true);
    }
  }, [showDailyRewardModal, dailyRewardInfo]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowDailyRewardModal(false);
      setDailyRewardInfo(null);
    }, 300);
  };

  if (!showDailyRewardModal || !dailyRewardInfo?.receivedDailyReward) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="h-full w-full inset-0 bg-black/50 absolute" />
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header with animation */}
        <div className="text-center py-8 px-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            每日登錄獎勵！
          </h2>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg py-3 px-4 mb-4">
            <p className="text-lg font-semibold">
              恭喜獲得 +{dailyRewardInfo.pointsAwarded} 點數！
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            感謝您的每日回訪！點數已自動添加到您的帳戶中。
          </p>
        </div>

        {/* Points animation */}
        <div className="px-6 pb-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <span className="text-2xl">💎</span>
              <span className="font-medium">連續登錄可獲得更多獎勵！</span>
            </div>
            <p className="text-xs text-blue-500 mt-1">
              明天再來獲得更多點數吧！
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            太棒了！繼續探索
          </button>
        </div>
      </div>
    </div>
  );
}