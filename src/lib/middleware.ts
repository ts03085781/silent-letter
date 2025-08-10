import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const token = req.cookies.get('token')?.value || 
                   req.headers.get('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'NO_TOKEN' },
          { status: 401 }
        );
      }

      const user = verifyToken(token);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
          { status: 401 }
        );
      }

      // 將用戶信息添加到請求對象
      (req as AuthenticatedRequest).user = user;
      
      return await handler(req as AuthenticatedRequest);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed', code: 'AUTH_ERROR' },
        { status: 500 }
      );
    }
  };
}

// Rate limiting utility
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function withRateLimit(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
  }
) {
  const { maxRequests, windowMs, keyGenerator } = options;

  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const key = keyGenerator 
        ? keyGenerator(req)
        : req.user?.userId || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';

      const now = Date.now();
      const userRateLimit = rateLimitStore[key];

      if (!userRateLimit || now > userRateLimit.resetTime) {
        rateLimitStore[key] = {
          count: 1,
          resetTime: now + windowMs,
        };
      } else {
        userRateLimit.count += 1;
      }

      if (rateLimitStore[key].count > maxRequests) {
        return NextResponse.json(
          { 
            error: 'Too many requests', 
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
          },
          { status: 429 }
        );
      }

      return await handler(req);
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      return NextResponse.json(
        { error: 'Rate limit check failed', code: 'RATE_LIMIT_ERROR' },
        { status: 500 }
      );
    }
  };
}

// 組合中間件
export function withAuthAndRateLimit(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  rateLimitOptions: {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
  }
) {
  return withAuth(withRateLimit(handler, rateLimitOptions));
}