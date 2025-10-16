import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold">
                  🚀 Next-Generation Farm Management
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Your Farm Operations
              </h1>
              <p className="text-xl lg:text-2xl text-green-50 mb-8 leading-relaxed">
                Streamline agriculture with intelligent task management,
                real-time crop tracking, and comprehensive livestock
                monitoring—all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl text-center"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl text-center"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/login"
                      className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all text-center"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="text-9xl animate-bounce">🌾</div>
                <div className="absolute top-10 right-10 text-7xl animate-pulse">
                  🚜
                </div>
                <div className="absolute bottom-10 left-10 text-6xl animate-bounce">
                  🐄
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                98%
              </div>
              <div className="text-gray-600 font-medium">
                Task Completion Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                45%
              </div>
              <div className="text-gray-600 font-medium">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600 font-medium">Acres Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">
                Real-time Monitoring
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your farm efficiently, all in one
              integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-green-100">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Crop Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track planting schedules, monitor growth stages, and optimize
                harvest timing with intelligent crop analytics and forecasting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-blue-100">
              <div className="text-5xl mb-4">🐄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Livestock Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive animal health monitoring, breeding records,
                vaccination schedules, and real-time livestock management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-purple-100">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Task Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Assign work to team members, track progress in real-time, and
                ensure every farm operation runs like clockwork.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-yellow-100">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Data-driven insights and comprehensive dashboards help you make
                informed decisions and maximize farm productivity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-red-100">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control, seamless communication, and
                coordinated workflows for your entire farm team.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 border border-indigo-100">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Mobile Ready
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access your farm management system anywhere, anytime with our
                fully responsive mobile-optimized platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Leading Farms Choose Us
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Increase Efficiency by 45%
                    </h3>
                    <p className="text-gray-600">
                      Automate routine tasks and optimize workflows to save
                      valuable time and resources.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Reduce Operational Costs
                    </h3>
                    <p className="text-gray-600">
                      Smart resource allocation and predictive analytics
                      minimize waste and maximize ROI.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Scale With Confidence
                    </h3>
                    <p className="text-gray-600">
                      Built for growth—from small family farms to large
                      commercial operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl text-white">
                <h3 className="text-3xl font-bold mb-6">
                  Ready to Transform Your Farm?
                </h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <span className="mr-3 text-2xl">✓</span>
                    <span className="text-lg">No credit card required</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-2xl">✓</span>
                    <span className="text-lg">Free 30-day trial</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-2xl">✓</span>
                    <span className="text-lg">Cancel anytime</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-2xl">✓</span>
                    <span className="text-lg">24/7 customer support</span>
                  </li>
                </ul>
                {!user && (
                  <Link
                    to="/register"
                    className="block w-full bg-white text-green-600 text-center px-8 py-4 rounded-xl font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Start Free Trial
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Thousands of Successful Farms
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Start optimizing your farm operations today with our comprehensive
            management platform
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
