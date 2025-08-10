import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IReply {
  content: string;
  repliedAt: Date;
}

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  isRead: boolean;
  sentAt: Date;
  replies: IReply[];
  expiresAt?: Date;
}

const ReplySchema: Schema<IReply> = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  repliedAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageSchema: Schema<IMessage> = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  replies: [ReplySchema],
  expiresAt: {
    type: Date,
    // 30天後自動刪除訊息（可選）
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
});

// TTL 索引用於自動刪除過期訊息
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 複合索引優化查詢
MessageSchema.index({ receiverId: 1, isRead: 1, sentAt: -1 });
MessageSchema.index({ senderId: 1, sentAt: -1 });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;