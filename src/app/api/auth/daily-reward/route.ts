import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

const DAILY_REWARD_POINTS = 10;

// 檢查是否應該獲得每日獎勵
function shouldReceiveDailyReward(lastRewardDate?: Date): boolean {
  if (!lastRewardDate) return true;
  
  const now = new Date();
  const lastReward = new Date(lastRewardDate);
  
  // 如果是不同的天，就應該獲得獎勵
  const isNewDay = now.toDateString() !== lastReward.toDateString();
  
  return isNewDay;
}

async function dailyRewardHandler(req: AuthenticatedRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
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

    // 檢查是否已經獲得今日獎勵
    if (!shouldReceiveDailyReward(user.lastDailyRewardDate)) {
      return NextResponse.json({
        success: false,
        message: '您今天已經獲得過每日登錄獎勵了！',
        alreadyClaimed: true,
        nextRewardAvailable: getNextRewardTime(),
        user: {
          points: user.points,
          totalDailyRewardsEarned: user.totalDailyRewardsEarned,
          lastDailyRewardDate: user.lastDailyRewardDate,
        },
      });
    }

    // 給予每日獎勵
    user.points += DAILY_REWARD_POINTS;
    user.lastDailyRewardDate = new Date();
    user.totalDailyRewardsEarned += 1;
    user.lastActiveAt = new Date();
    
    await user.save();

    return NextResponse.json({
      success: true,
      message: `恭喜！您獲得了每日登錄獎勵 +${DAILY_REWARD_POINTS} 點數！🎉`,
      pointsAwarded: DAILY_REWARD_POINTS,
      user: {
        id: user._id as string,
        anonymousId: user.anonymousId,
        points: user.points,
        totalDailyRewardsEarned: user.totalDailyRewardsEarned,
        lastDailyRewardDate: user.lastDailyRewardDate,
      },
      nextRewardAvailable: getNextRewardTime(),
    });

  } catch (error) {
    console.error('Daily reward error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process daily reward',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// 計算下次可以獲得獎勵的時間
function getNextRewardTime(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // 設為明日午夜
  return tomorrow.toISOString();
}

export const POST = withAuth(dailyRewardHandler);