import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import Message from '@/models/Message';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function inboxHandler(req: AuthenticatedRequest): Promise<NextResponse> {
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

    // 獲取收到的訊息
    const messages = await Message.find({
      receiverId: user._id
    })
      .populate('senderId', 'anonymousId')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit + 1); // 多獲取一條來檢查是否還有更多

    const hasMore = messages.length > limit;
    const actualMessages = hasMore ? messages.slice(0, limit) : messages;

    // 自動標記為已讀
    const unreadMessageIds = actualMessages
      .filter(msg => !msg.isRead)
      .map(msg => msg._id);

    if (unreadMessageIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { isRead: true }
      );
    }

    // 格式化訊息數據
    const formattedMessages = actualMessages.map(message => ({
      id: (message._id as string).toString(),
      senderId: (message.senderId as unknown as { _id: string })._id.toString(),
      senderAnonymousId: (message.senderId as unknown as { anonymousId: string }).anonymousId,
      receiverId: (message.receiverId as unknown as string).toString(),
      content: message.content,
      isRead: true, // 設為 true 因為我們剛剛標記為已讀
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
      totalMessages: await Message.countDocuments({ receiverId: user._id }),
    });

  } catch (error) {
    console.error('Inbox fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch inbox',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(inboxHandler);