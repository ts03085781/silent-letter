import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import Message from '@/models/Message';
import { withAuthAndRateLimit, AuthenticatedRequest } from '@/lib/middleware';
import { isValidObjectId } from '@/lib/auth';

async function replyHandler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectMongoDB();

    const { messageId, content } = await req.json();

    if (!messageId || !isValidObjectId(messageId)) {
      return NextResponse.json(
        { error: 'Valid message ID is required', code: 'INVALID_MESSAGE_ID' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reply content is required', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Reply content exceeds maximum length', code: 'CONTENT_TOO_LONG' },
        { status: 400 }
      );
    }

    // 獲取用戶信息
    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 獲取原始訊息
    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found', code: 'MESSAGE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 確保只有訊息接收者可以回覆
    if (message.receiverId.toString() !== (user._id as unknown as string).toString()) {
      return NextResponse.json(
        { error: 'You can only reply to messages you received', code: 'UNAUTHORIZED_REPLY' },
        { status: 403 }
      );
    }

    // 檢查是否已經回覆過（可選限制，這裡允許多次回覆）
    
    // 添加回覆
    message.replies.push({
      content: content.trim(),
      repliedAt: new Date(),
    });

    await message.save();

    // 給回覆者增加點數
    user.points += 1;
    await user.save();

    return NextResponse.json({
      success: true,
      reply: {
        content: content.trim(),
        repliedAt: new Date().toISOString(),
      },
      newPoints: user.points,
      message: 'Reply sent successfully and earned 1 point!',
    });

  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send reply',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// 應用認證和速率限制：每用戶每分鐘最多 5 則回覆
export const POST = withAuthAndRateLimit(replyHandler, {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (req) => (req as AuthenticatedRequest).user?.userId || 'anonymous',
});