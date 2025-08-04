
import { Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 dark:bg-gray-900 text-white border-t border-gray-700 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* NCO Semantic Search */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">NCO Semantic Search</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
              Making occupation classification accessible through AI-powered natural language search.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-gray-300 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">support@nco.gov.in</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  NCO-2015 Manual
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Classification Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Training Materials
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Government */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Government</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-4">
              Ministry of Statistics and Programme Implementation Government of India
            </p>
            <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-400 mb-3">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91-11-2306 0000</span>
            </div>
            <div className="flex items-start space-x-2 text-gray-300 dark:text-gray-400 mb-4">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span className="text-sm">Sardar Patel Bhawan, Sansad Marg, New Delhi - 110001</span>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © 2025 Ministry of Statistics and Programme Implementation, Government of India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;