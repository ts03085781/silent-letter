import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import Message from '@/models/Message';
import { withAuthAndRateLimit, AuthenticatedRequest } from '@/lib/middleware';

async function sendMessageHandler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectMongoDB();

    const { content } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message content exceeds maximum length', code: 'CONTENT_TOO_LONG' },
        { status: 400 }
      );
    }

    // 獲取發送者信息
    const sender = await User.findById(req.user!.userId);
    if (!sender || !sender.isActive) {
      return NextResponse.json(
        { error: 'Sender not found or inactive', code: 'SENDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 檢查點數
    if (sender.points < 3) {
      return NextResponse.json(
        { error: 'Insufficient points. Need at least 3 points to send a message.', code: 'INSUFFICIENT_POINTS' },
        { status: 400 }
      );
    }

    // 隨機選擇一個接收者（排除發送者本身）
    const potentialReceivers = await User.aggregate([
      {
        $match: {
          _id: { $ne: sender._id },
          isActive: true
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (potentialReceivers.length === 0) {
      return NextResponse.json(
        { error: 'No available recipients found', code: 'NO_RECIPIENTS' },
        { status: 400 }
      );
    }

    const receiver = potentialReceivers[0];

    // 創建訊息
    const message = new Message({
      senderId: sender._id,
      receiverId: receiver._id,
      content: content.trim(),
      isRead: false,
    });

    await message.save();

    // 扣除發送者點數
    sender.points -= 3;
    await sender.save();

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        sentAt: message.sentAt,
        receiverAnonymousId: receiver.anonymousId,
      },
      newPoints: sender.points,
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// 應用認證和速率限制：每用戶每分鐘最多 3 則訊息
export const POST = withAuthAndRateLimit(sendMessageHandler, {
  maxRequests: 3,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (req) => (req as AuthenticatedRequest).user?.userId || 'anonymous',
});