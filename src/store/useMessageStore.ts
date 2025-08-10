import { create } from 'zustand';

export interface Reply {
  content: string;
  repliedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  replies: Reply[];
  senderAnonymousId?: string;
  receiverAnonymousId?: string;
}

interface MessageState {
  messages: Message[];
  sentMessages: Message[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

interface MessageActions {
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markAsRead: (messageId: string) => void;
  addReply: (messageId: string, reply: Reply) => void;
  clearMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
  fetchMessages: (page?: number) => Promise<void>;
  fetchSentMessages: (page?: number) => Promise<void>;
  replyToMessage: (messageId: string, content: string) => Promise<void>;
}

export interface MessageStore extends MessageState, MessageActions {}

const useMessageStore = create<MessageStore>((set, get) => ({
  // Initial state
  messages: [],
  sentMessages: [],
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,

  // Actions
  setMessages: (messages: Message[]) => {
    set({ messages, error: null });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [message, ...state.messages],
    }));
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
      sentMessages: state.sentMessages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  markAsRead: (messageId: string) => {
    const { updateMessage } = get();
    updateMessage(messageId, { isRead: true });
  },

  addReply: (messageId: string, reply: Reply) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, replies: [...msg.replies, reply] }
          : msg
      ),
      sentMessages: state.sentMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, replies: [...msg.replies, reply] }
          : msg
      ),
    }));
  },

  clearMessages: () => {
    set({
      messages: [],
      sentMessages: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },

  sendMessage: async (content: string) => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // 訊息發送成功，不需要立即更新 UI，因為不會顯示在收件箱
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  fetchMessages: async (page = 1) => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/messages/inbox?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages');
      }

      if (page === 1) {
        set({
          messages: data.messages,
          hasMore: data.hasMore,
          page: 1,
        });
      } else {
        set((state) => ({
          messages: [...state.messages, ...data.messages],
          hasMore: data.hasMore,
          page,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  fetchSentMessages: async (page = 1) => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/messages/sent?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sent messages');
      }

      if (page === 1) {
        set({
          sentMessages: data.messages,
          hasMore: data.hasMore,
          page: 1,
        });
      } else {
        set((state) => ({
          sentMessages: [...state.sentMessages, ...data.messages],
          hasMore: data.hasMore,
          page,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sent messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  replyToMessage: async (messageId: string, content: string) => {
    const { setLoading, setError, addReply } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reply to message');
      }

      // 添加回覆到本地狀態
      addReply(messageId, {
        content,
        repliedAt: new Date().toISOString(),
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reply to message';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },
}));

export default useMessageStore;