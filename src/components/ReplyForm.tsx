'use client';

import { useState } from 'react';
import useMessageStore from '@/store/useMessageStore';
import useAuthStore from '@/store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

interface ReplyFormProps {
  messageId: string;
  onReplySubmitted: () => void;
}

export default function ReplyForm({ messageId, onReplySubmitted }: ReplyFormProps) {
  const { replyToMessage, isLoading, error } = useMessageStore();
  const { user, updatePoints } = useAuthStore();
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      setSuccess('');
      await replyToMessage(messageId, content.trim());
      
      // 用戶獲得 1 點數
      if (user) {
        updatePoints(user.points + 1);
      }
      
      setContent('');
      setSuccess('Reply sent! You earned +1 point! 🎉');
      
      // 2秒後關閉表單
      setTimeout(() => {
        setSuccess('');
        onReplySubmitted();
      }, 2000);
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const characterCount = content.length;
  const maxCharacters = 1000;
  const canReply = content.trim().length > 0 && 
                   content.length <= maxCharacters && 
                   !isLoading;

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
        <span className="mr-2">✍️</span>
        Reply Anonymously
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your anonymous reply... Be supportive, thoughtful, and kind."
            className="w-full h-32 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-sm"
            maxLength={maxCharacters}
          />
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">
              {characterCount}/{maxCharacters} characters
            </div>
            <div className="text-xs text-green-600">
              +1 point for replying
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <p className="text-green-700 text-xs">{success}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-blue-600">
            Your reply will be anonymous and earn you 1 point
          </div>
          <button
            type="submit"
            disabled={!canReply}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2
              ${canReply
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
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
                <span>💌</span>
                <span>Send Reply</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}