export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500 opacity-10 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Find and Reserve the Perfect Table
            </h1>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 mb-8">
              We make your dining experience simple and enjoyable. Easily
              reserve a table at your favorite restaurant with just a few
              clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/restaurants"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find Restaurants
              </a>
              <a
                href="/auth/signup"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-orange-600 font-medium rounded-lg shadow-md transition-colors duration-300 border border-orange-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Find</h3>
            <p className="text-gray-600 text-center">
              Browse through our curated list of restaurants and find the
              perfect place for your next meal.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Reserve</h3>
            <p className="text-gray-600 text-center">
              Quickly book a table for your desired time and date with our
              simple reservation system.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Enjoy</h3>
            <p className="text-gray-600 text-center">
              Show up and enjoy your meal! No waiting in line or worrying about
              table availability.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to discover your next favorite restaurant?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Join thousands of food lovers who use EasyTable to simplify their
            dining experience.
          </p>
          <a
            href="/restaurants"
            className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors duration-300"
          >
            Browse Restaurants
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
