// frontend/app/page.tsx
import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-slideUp">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          {/* Icon/Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl tracking-tight">
            <span className="gradient-text">Todo</span> App
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium sm:text-2xl">
            Organize your tasks, boost your productivity
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Sign in to access your personalized todo list or create a new account to get started.
          </p>
        </div>

        {/* Authentication Form */}
        <AuthForm />

        {/* Footer Note */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Built with Next.js 16 and FastAPI
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Secure</span>
            <span>•</span>
            <span>Fast</span>
            <span>•</span>
            <span>Modern</span>
          </div>
        </div>
      </div>
    </div>
  );
}
