import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import Message from '@/models/Message';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function sentHandler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const skip = (page - 1) * limit;

    // 獲取用戶信息
    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 獲取寄出的訊息
    const messages = await Message.find({
      senderId: user._id
    })
      .populate('receiverId', 'anonymousId')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit + 1); // 多獲取一條來檢查是否還有更多

    const hasMore = messages.length > limit;
    const actualMessages = hasMore ? messages.slice(0, limit) : messages;

    // 格式化訊息數據
    const formattedMessages = actualMessages.map(message => ({
      id: (message._id as string).toString(),
      senderId: (message.senderId as unknown as string).toString(),
      senderAnonymousId: user.anonymousId, // 寄件者就是當前用戶
      receiverId: (message.receiverId as unknown as { _id: string })._id.toString(),
      receiverAnonymousId: (message.receiverId as unknown as { anonymousId: string }).anonymousId,
      content: message.content,
      isRead: message.isRead,
      sentAt: message.sentAt.toISOString(),
      replies: message.replies.map(reply => ({
        content: reply.content,
        repliedAt: reply.repliedAt.toISOString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      hasMore,
      currentPage: page,
      totalMessages: await Message.countDocuments({ senderId: user._id }),
    });

  } catch (error) {
    console.error('Sent messages fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sent messages',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(sentHandler);