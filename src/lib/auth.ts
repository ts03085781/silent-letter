import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JWTPayload {
  userId: string;
  anonymousId: string;
  points: number;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in your environment variables');
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d', // Token 有效期 30 天
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateAnonymousId(): string {
  const adjectives = [
    'Silent', 'Peaceful', 'Gentle', 'Quiet', 'Soft', 'Calm', 'Serene', 'Tranquil',
    'Mystic', 'Secret', 'Hidden', 'Mysterious', 'Whispering', 'Dreaming', 'Floating',
    'Wandering', 'Distant', 'Remote', 'Elusive', 'Subtle'
  ];
  
  const nouns = [
    'Letter', 'Writer', 'Voice', 'Soul', 'Heart', 'Mind', 'Spirit', 'Dream',
    'Thought', 'Whisper', 'Echo', 'Shadow', 'Light', 'Wind', 'Star', 'Moon',
    'River', 'Ocean', 'Mountain', 'Forest'
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${adjective}${noun}${number}`;
}

export function hashPassword(password: string): string {
  // 由於是匿名系統，暫時不需要密碼哈希
  // 如果未來需要可以使用 bcryptjs
  return password;
}

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}