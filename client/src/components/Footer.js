import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-800 to-emerald-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">🚜</span>
              <h3 className="text-xl font-bold">Farm Management</h3>
            </div>
            <p className="text-green-100 text-sm">
              Streamlining farm operations with modern technology. Manage crops,
              livestock, and tasks efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/crops"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Crops
                </Link>
              </li>
              <li>
                <Link
                  to="/livestock"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Livestock
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Tasks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <a
                  href="mailto:support@farmmanagement.com"
                  className="hover:text-white transition-colors"
                >
                  support@farmmanagement.com
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+234 (0) 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-700 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-green-100">
          <p>© {currentYear} Farm Management System. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
