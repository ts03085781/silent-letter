'use client';

import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import UserProfile from './UserProfile';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: '🎭',
      title: '完全匿名',
      description: '無需註冊，自動生成詩意的匿名身分，保護您的隱私',
      details: [`自動生成如「${user?.anonymousId}」的美麗身分`, '不收集任何個人資訊', '真正的匿名體驗']
    },
    {
      icon: '🎯',
      title: '隨機連結',
      description: '您的訊息會隨機發送給其他匿名用戶，創造意外的連結',
      details: ['演算法隨機配對', '每次都是新的邂逅', '無法預知會遇見誰']
    },
    {
      icon: '💎',
      title: '點數機制',
      description: '智慧的點數系統鼓勵有意義的互動',
      details: ['每日登入獲得10點數', '起始 10 點數', '發送訊息花費 3 點', '收到回覆獲得 1 點','回覆訊息獲得 1 點']
    },
    {
      icon: '🔒',
      title: '30天生命週期',
      description: '身分會在停用30天後自動刪除，確保真正的匿名性',
      details: ['30天內保持同一身分', '超過期限自動移除身份', '保護長期隱私','身份移除後不保留任何資料']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
            {/* <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <span className="text-blue-600 text-sm font-medium">您的身分：</span>
              <span className="text-blue-800 font-semibold">{user?.anonymousId}</span>
              <span className="text-blue-600 text-sm">({user?.points} 點數)</span>
            </div> */}
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              歡迎來到 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Silent Letter</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              在這個數位時代，我們創造了一個純粹的匿名交流空間。
              <br />
              讓心靈的話語跨越界限，與陌生人建立真摯的連結。
            </p>
          </div>

          {/* Mobile Identity Card */}
          <div className="sm:hidden mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-sm mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">您的匿名身分</p>
                <p className="text-lg font-bold text-gray-800">{user?.anonymousId}</p>
                <p className="text-sm text-blue-600">{user?.points} 點數可用</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12 mb-16 border border-blue-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            使用流程
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">寫下心聲</h4>
              <p className="text-gray-600 text-sm">用 3 點數發送匿名訊息給隨機用戶</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full font-bold text-lg mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">等待回音</h4>
              <p className="text-gray-600 text-sm">對方可以選擇匿名回覆您的訊息</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full font-bold text-lg mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">建立連結</h4>
              <p className="text-gray-600 text-sm">收到回覆獲得 1 點數，延續對話</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-2">重要提醒：30天身分週期</h4>
              <div className="text-amber-700 text-sm space-y-2">
                <p>為了保護您的長期隱私，我們設計了自動安全機制：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>您的匿名身分會在 30 天內保持有效</li>
                  <li>超過 30 天未使用，身分將自動重置</li>
                  <li>所有相關訊息和數據也會一併清除</li>
                  <li>這確保了真正的匿名性和隱私保護</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              準備好開始您的匿名旅程了嗎？
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              以 <span className="font-semibold text-blue-600">{user?.anonymousId}</span> 的身分，
              開始與世界各地的陌生人分享您的想法和感受。
            </p>
            
            <button
              onClick={onGetStarted}
              className="cursor-pointer inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <span className="mr-3 text-xl">✈️</span>
              開始匿名寄信
              <span className="ml-3 text-xl">💙</span>
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              您目前有 <span className="font-semibold text-blue-600">{user?.points} 點數</span>，
              足夠發送 <span className="font-semibold">{Math.floor((user?.points || 0) / 3)} 封訊息</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SL</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">Silent Letter</span>
            </div>
            <p className="text-gray-600 mb-2">
              連結心靈，傳遞溫暖 - 在匿名中找到真摯的人性光輝
            </p>
            <p className="text-xs text-gray-500">
              讓每一封無聲的信件，都成為世界上最溫柔的邂逅 💙
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}