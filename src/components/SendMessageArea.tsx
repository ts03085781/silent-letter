'use client';

import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import useMessageStore from '@/store/useMessageStore';
import LoadingSpinner from './LoadingSpinner';

export default function SendMessageArea() {
  const { user, updatePoints } = useAuthStore();
  const { sendMessage, isLoading, error } = useMessageStore();
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    if (!user || user.points < 3) {
      alert('You need at least 3 points to send a message!');
      return;
    }

    try {
      setSuccess('');
      await sendMessage(content.trim());
      
      // 更新用戶點數
      updatePoints(user.points - 3);
      
      // 清空表單並顯示成功訊息
      setContent('');
      setSuccess('Your message has been sent to a random anonymous user! 🎉');
      
      // 5秒後清除成功訊息
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const characterCount = content.length;
  const maxCharacters = 2000;
  const canSend = content.trim().length > 0 && 
                  content.length <= maxCharacters && 
                  user && 
                  user.points >= 3 && 
                  !isLoading;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">📝</span>
          Send Anonymous Message
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          Share your thoughts with a random stranger
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your anonymous message here... Share your thoughts, feelings, or ask for advice. Someone out there might need to hear exactly what you have to say."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
              maxLength={maxCharacters}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                {characterCount}/{maxCharacters} characters
              </div>
              {user && (
                <div className={`text-sm ${user.points >= 3 ? 'text-green-600' : 'text-red-500'}`}>
                  {user.points >= 3 ? `${user.points} points available` : 'Need 3+ points to send'}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-gray-500 responsive-text">
              Cost: 3 points • Recipients earn 1 point for replying
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                ${canSend
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl focus-ring'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>✈️</span>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">How it works:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Your message will be sent to a random anonymous user</li>
            <li>• They can reply to you anonymously if they choose</li>
            <li>• You&apos;ll receive +1 point when someone replies to your message</li>
            <li>• Keep the conversation respectful and meaningful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}