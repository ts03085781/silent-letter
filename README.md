# Silent Letter 🤫✉️

A beautiful anonymous messaging platform that connects hearts through silent letters. Send your thoughts anonymously to random strangers and receive meaningful replies.

## Features

🎭 **Anonymous Communication** - Send and receive messages without revealing your identity  
💎 **Point System** - Start with 10 points, spend 3 to send, earn 1 for replies  
🎯 **Random Matching** - Your messages are sent to random users for authentic connections  
💬 **Reply System** - Recipients can reply anonymously to create meaningful conversations  
📱 **Responsive Design** - Beautiful interface that works perfectly on all devices  
🔒 **Secure** - JWT authentication with rate limiting and content validation  

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Zustand with persistence
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd silent-lettar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   
   # JWT Secret (use a strong random key)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Next.js
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **MongoDB Atlas Setup**
   
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Get your connection string and add it to MONGODB_URI

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Add the same environment variables from `.env.local`
   - Make sure NEXTAUTH_URL points to your production domain

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong secret key for JWT signing
- `NEXTAUTH_SECRET`: NextAuth secret for session encryption
- `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)

## Project Structure

```
silent-lettar/
├── src/app/                  # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── messages/        # Message-related endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── AuthWrapper.tsx      # Authentication wrapper
│   ├── SendMessageArea.tsx  # Send message interface
│   ├── InboxArea.tsx        # Inbox interface
│   ├── MessageItem.tsx      # Individual message component
│   ├── ReplyForm.tsx        # Reply form component
│   ├── UserProfile.tsx      # User profile dropdown
│   ├── LoadingSpinner.tsx   # Loading indicator
│   └── ErrorBoundary.tsx    # Error handling
├── store/                   # Zustand stores
│   ├── useAuthStore.ts      # Authentication state
│   └── useMessageStore.ts   # Message state
├── lib/                     # Utility functions
│   ├── auth.ts              # JWT utilities
│   ├── middleware.ts        # API middleware
│   └── mongodb.ts           # Database connection
├── models/                  # Mongoose schemas
│   ├── User.ts              # User model
│   └── Message.ts           # Message model
└── PRD.md                   # Product Requirements Document
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register anonymous user
- `GET /api/auth/me` - Get current user info

### Messages
- `POST /api/messages/send` - Send anonymous message
- `GET /api/messages/inbox` - Get received messages
- `POST /api/messages/reply` - Reply to a message

## Point System

- **Starting Points**: 10 points for new users
- **Send Message**: Costs 3 points
- **Receive Reply**: Earn 1 point when someone replies to your message
- **Minimum to Send**: Need at least 3 points to send a message

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents spam and abuse
- **Content Validation**: Input sanitization and length limits
- **Anonymous IDs**: Beautiful auto-generated anonymous identities
- **HTTP-only Cookies**: Secure token storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Silent Letter** - *Connecting hearts through anonymous messages* 💙