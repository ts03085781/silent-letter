import SendMessageArea from '../components/SendMessageArea';
import InboxArea from '../components/InboxArea';
import UserProfile from '../components/UserProfile';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SL</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Silent Letter</h1>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="animate-fadeInUp">
            <SendMessageArea />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <InboxArea />
          </div>
        </div>
      </main>

      <footer className="mt-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Silent Letter - Connect hearts through anonymous messages
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Express yourself freely and receive meaningful replies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
