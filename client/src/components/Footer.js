import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Crop Management', path: '/crops' },
    { name: 'Livestock Tracking', path: '/livestock' },
    { name: 'AI Disease Detection', path: '/disease-detection' },
    { name: 'Field Mapping', path: '/map' },
    { name: 'Finance & Reports', path: '/finance' },
    { name: 'Inventory Control', path: '/inventory' },
    { name: 'Task Management', path: '/tasks' },
  ];

  const support = [
    { name: 'Help Center', path: '/help' },
    { name: 'Documentation', path: '/help#docs' },
    { name: 'Video Tutorials', path: '/help#tutorials' },
    { name: 'FAQ', path: '/help#faq' },
    { name: 'Contact Support', path: '/help#contact' },
    { name: 'Community Forum', href: '#' },
  ];

  const legal = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Data Security', path: '/security' },
    { name: 'Licenses', path: '/licenses' },
  ];

  const company = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Mission', path: '/about#mission' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Partners', href: '#' },
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', href: '#', color: 'hover:text-blue-400' },
    { icon: '🐦', name: 'Twitter', href: '#', color: 'hover:text-sky-400' },
    { icon: '💼', name: 'LinkedIn', href: '#', color: 'hover:text-blue-500' },
    { icon: '📸', name: 'Instagram', href: '#', color: 'hover:text-pink-400' },
    { icon: '📺', name: 'YouTube', href: '#', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          {/* Top Section - Brand */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30 mr-3">
                F
              </div>
              <div>
                <h3 className="text-2xl font-bold">FarmApp</h3>
                <p className="text-slate-400 text-sm">Modern Farm Management System</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-md">
              Empowering farmers with cutting-edge technology for efficient crop management, 
              livestock tracking, and data-driven decision making.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Features Column */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-400">Features</h4>
              <ul className="space-y-2">
                {features.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-400">Support</h4>
              <ul className="space-y-2">
                {support.map((item) => (
                  <li key={item.name}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-400">Company</h4>
              <ul className="space-y-2">
                {company.map((item) => (
                  <li key={item.name}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact Column */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-400">Legal & Contact</h4>
              <ul className="space-y-2 mb-6">
                {legal.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-slate-300 pt-4 border-t border-slate-700">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <a
                    href="mailto:support@farmapp.com"
                    className="hover:text-white transition-colors"
                  >
                    support@farmapp.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+234 (0) 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-slate-400">
              <p>© {currentYear} FarmApp. All rights reserved.</p>
              <p className="text-xs mt-1">Made with 💚 in Nigeria • v1.0.0</p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className={`text-2xl transition-colors ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Trust Badges / Additional Info */}
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="flex items-center">
                <span className="mr-1">🔒</span>
                <span>Secure</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <span className="mr-1">✓</span>
                <span>Verified</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <span className="mr-1">🌍</span>
                <span>Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
