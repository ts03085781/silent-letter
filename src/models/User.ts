import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  anonymousId: string;
  points: number;
  createdAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
  lastDailyRewardDate?: Date;
  totalDailyRewardsEarned: number;
}

const UserSchema: Schema<IUser> = new Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  points: {
    type: Number,
    required: true,
    default: 10,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastDailyRewardDate: {
    type: Date,
  },
  totalDailyRewardsEarned: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// 更新 lastActiveAt 的中間件
UserSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastActiveAt = new Date();
  }
  next();
});

// 防止重複編譯
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;