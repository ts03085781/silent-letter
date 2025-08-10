import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function meHandler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectMongoDB();

    const user = await User.findById(req.user!.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 更新最後活動時間
    user.lastActiveAt = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id as string,
        anonymousId: user.anonymousId,
        points: user.points,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
    });

  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get user information',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(meHandler);