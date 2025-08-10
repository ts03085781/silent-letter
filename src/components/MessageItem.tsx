'use client';

import { useState } from 'react';
import { Message } from '@/store/useMessageStore';
import ReplyForm from './ReplyForm';

interface MessageItemProps {
  message: Message;
  isInInbox: boolean;
}

export default function MessageItem({ message, isInInbox }: MessageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncatedContent = message.content.length > 150 
    ? message.content.substring(0, 150) + '...' 
    : message.content;

  const shouldShowExpand = message.content.length > 150;

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${
      !message.isRead && isInInbox 
        ? 'border-blue-300 bg-blue-50' 
        : 'border-gray-200 bg-white hover:shadow-md'
    }`}>
      {/* Message Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isInInbox 
              ? 'bg-gradient-to-br from-green-400 to-blue-500' 
              : 'bg-gradient-to-br from-purple-400 to-pink-500'
          }`}>
            <span className="text-white text-xs font-semibold">
              {isInInbox ? '📨' : '📤'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {isInInbox 
                ? (message.senderAnonymousId || 'Anonymous Sender')
                : `Sent to ${message.receiverAnonymousId || 'Anonymous User'}`
              }
            </p>
            <p className="text-xs text-gray-500">{formatDate(message.sentAt)}</p>
          </div>
        </div>
        
        {!message.isRead && isInInbox && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>

      {/* Message Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {isExpanded || !shouldShowExpand ? message.content : truncatedContent}
        </p>
        {shouldShowExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Replies Section */}
      {message.replies && message.replies.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
            <span className="mr-2">💬</span>
            {message.replies.length} {message.replies.length === 1 ? 'Reply' : 'Replies'}
          </h4>
          <div className="space-y-3">
            {message.replies.map((reply, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(reply.repliedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="text-xs text-gray-500">
          {message.replies.length > 0 
            ? `${message.replies.length} ${message.replies.length === 1 ? 'reply' : 'replies'}`
            : 'No replies yet'
          }
        </div>
        {isInInbox && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <span>💬</span>
            <span>{showReplyForm ? 'Cancel' : 'Reply'}</span>
          </button>
        )}
        {!isInInbox && (
          <div className="text-xs text-gray-500">
            {message.isRead ? '✅ Read by recipient' : '📍 Delivered'}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && isInInbox && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ReplyForm 
            messageId={message.id}
            onReplySubmitted={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}