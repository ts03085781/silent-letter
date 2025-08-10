import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, generateAnonymousId } from '@/lib/auth';
import { withRateLimit } from '@/lib/middleware';

async function registerHandler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectMongoDB();

    // 生成匿名 ID（確保唯一性）
    let anonymousId: string;
    let existingUser;
    
    do {
      anonymousId = generateAnonymousId();
      existingUser = await User.findOne({ anonymousId });
    } while (existingUser);

    // 創建新用戶
    const user = new User({
      anonymousId,
      points: 10, // 起始點數
      isActive: true,
    });

    await user.save();

    // 生成 JWT Token
    const token = generateToken({
      userId: (user._id as string).toString(),
      anonymousId: user.anonymousId,
      points: user.points,
    });

    // 設置 HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id as string,
        anonymousId: user.anonymousId,
        points: user.points,
        createdAt: user.createdAt,
      },
      message: 'Anonymous user registered successfully',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to register user',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// 應用速率限制：每小時最多 3 次註冊請求
export const POST = withRateLimit(registerHandler, {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous',
});