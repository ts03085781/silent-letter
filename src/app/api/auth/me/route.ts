import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// 檢查是否應該獲得每日獎勵
function shouldReceiveDailyReward(lastRewardDate?: Date): boolean {
  if (!lastRewardDate) return true;
  
  const now = new Date();
  const lastReward = new Date(lastRewardDate);
  
  // 如果是不同的天，就應該獲得獎勵
  const isNewDay = now.toDateString() !== lastReward.toDateString();
  
  return isNewDay;
}

// 處理每日登錄獎勵
async function processDailyReward(user: IUser) {
  if (shouldReceiveDailyReward(user.lastDailyRewardDate)) {
    const DAILY_REWARD_POINTS = 10;
    
    user.points += DAILY_REWARD_POINTS;
    user.lastDailyRewardDate = new Date();
    user.totalDailyRewardsEarned += 1;
    
    return {
      receivedDailyReward: true,
      pointsAwarded: DAILY_REWARD_POINTS,
    };
  }
  
  return {
    receivedDailyReward: false,
    pointsAwarded: 0,
  };
}

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

    // 處理每日登錄獎勵
    const dailyRewardResult = await processDailyReward(user);
    
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
        totalDailyRewardsEarned: user.totalDailyRewardsEarned,
        lastDailyRewardDate: user.lastDailyRewardDate,
      },
      dailyReward: dailyRewardResult,
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