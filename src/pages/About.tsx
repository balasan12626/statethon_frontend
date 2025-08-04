import { Target, Users, Award, Globe } from 'lucide-react';

const About = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About UAE NCO
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Revolutionizing job classification through AI-powered semantic search and natural language processing
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                The UAE National Classification of Occupation (NCO) system serves as the cornerstone for standardizing job classifications across the nation. Our platform leverages cutting-edge artificial intelligence to make this complex system accessible to everyone.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We believe that finding the right occupation code shouldn't require extensive manual searching through thousands of categories. Our AI-powered semantic search understands natural language descriptions and matches them with the most appropriate NCO codes.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Precision Matching</h3>
                  <p className="text-gray-600 dark:text-gray-300">95% accuracy in job classification</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3,600+</div>
                  <div className="text-gray-600 dark:text-gray-400">NCO Codes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">52</div>
                  <div className="text-gray-600 dark:text-gray-400">Industry Sectors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
                  <div className="text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">10k+</div>
                  <div className="text-gray-600 dark:text-gray-400">Daily Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose UAE NCO?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform combines government standards with modern technology to deliver unparalleled accuracy and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Multi-Language Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Search in 13+ Indian languages including Hindi, Bengali, Tamil, Telugu, and more with natural language processing
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User-Friendly Interface</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intuitive design that makes complex job classification simple and accessible to everyone
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Government Certified</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Official UAE government standards with regular updates and compliance verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Advanced AI Technology</h2>
                <p className="text-gray-300 mb-6">
                  Our platform utilizes state-of-the-art natural language processing and machine learning algorithms to understand job descriptions and match them with the most appropriate NCO codes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span>Semantic search with 95% accuracy</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Real-time processing and instant results</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Continuous learning and improvement</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    <span>Voice input and multi-language support</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Search Accuracy</span>
                      <span className="text-sm">95%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm">0.23s</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '98%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="text-sm">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{width: '96%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're dedicated to making job classification accessible, accurate, and efficient for all UAE residents and organizations
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Trusted by Government and Industry
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Our platform is officially recognized and used by government agencies, HR departments, and job seekers across the UAE. We maintain the highest standards of accuracy and compliance with national classification systems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Government Agencies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Official classification for policy and planning</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">HR Departments</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Streamlined job posting and candidate matching</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Job Seekers</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Accurate career guidance and opportunity discovery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;