import React from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import Footer from '../components/Footer';

const InfoPageWrapper = () => {
  const location = useLocation();
  const page = location.pathname.substring(1); // Remove leading slash
  const currentYear = new Date().getFullYear();

  const content = {
    privacy: { title: 'Privacy Policy', icon: '🔒' },
    terms: { title: 'Terms of Service', icon: '📜' },
    cookies: { title: 'Cookie Policy', icon: '🍪' },
    security: { title: 'Data Security', icon: '🛡️' },
    licenses: { title: 'Third-Party Licenses', icon: '⚖️' },
    about: { title: 'About FarmApp', icon: '🌾' },
  };

  const pageContent = content[page] || content.about;

  const sections = {
    privacy: [
      { heading: '1. Information We Collect', text: 'We collect information you provide directly to us when you create an account, such as your name, email address, and farm details. We also collect usage data to improve our services.' },
      { heading: '2. How We Use Your Information', text: 'We use the information to provide, maintain, and improve our services, communicate with you, and protect against fraud and abuse.' },
      { heading: '3. Data Security', text: 'We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction.' },
      { heading: '4. Data Sharing', text: 'We do not sell your personal information. We may share data with service providers who assist in operating our platform, subject to confidentiality agreements.' },
      { heading: '5. Your Rights', text: 'You have the right to access, correct, or delete your personal data. Contact us at privacy@farmapp.com for any privacy-related requests.' },
    ],
    terms: [
      { heading: '1. Acceptance of Terms', text: 'By accessing and using FarmApp, you accept and agree to be bound by these Terms of Service.' },
      { heading: '2. Use License', text: 'We grant you a limited, non-exclusive, non-transferable license to use FarmApp for managing your farm operations.' },
      { heading: '3. User Responsibilities', text: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.' },
      { heading: '4. Prohibited Uses', text: 'You may not use FarmApp for any illegal purpose, to violate any laws, or to infringe upon the rights of others.' },
      { heading: '5. Termination', text: 'We reserve the right to terminate or suspend your account at our discretion if you violate these terms.' },
      { heading: '6. Limitation of Liability', text: 'FarmApp is provided "as is" without warranties. We are not liable for any damages arising from the use of our services.' },
    ],
    cookies: [
      { heading: '1. What Are Cookies', text: 'Cookies are small text files stored on your device to help us provide and improve our services.' },
      { heading: '2. How We Use Cookies', text: 'We use cookies for authentication, preferences, analytics, and security purposes.' },
      { heading: '3. Types of Cookies We Use', text: 'Essential cookies (required for functionality), Performance cookies (analytics), and Preference cookies (user settings).' },
      { heading: '4. Managing Cookies', text: 'You can control cookies through your browser settings. Note that disabling cookies may affect functionality.' },
    ],
    security: [
      { heading: '1. Encryption', text: 'All data transmission is encrypted using industry-standard SSL/TLS protocols.' },
      { heading: '2. Data Storage', text: 'Your farm data is stored in secure, encrypted databases with regular backups.' },
      { heading: '3. Access Control', text: 'We implement strict access controls to ensure only authorized personnel can access sensitive data.' },
      { heading: '4. Security Monitoring', text: 'Our systems are continuously monitored for security threats and vulnerabilities.' },
      { heading: '5. Incident Response', text: 'In the event of a security breach, we will notify affected users within 72 hours.' },
    ],
    licenses: [
      { heading: 'Open Source Software', text: 'FarmApp uses various open-source libraries and frameworks. We comply with all applicable open-source licenses.' },
      { heading: 'React', text: 'MIT License - Facebook Inc. and contributors' },
      { heading: 'Node.js', text: 'MIT License - Node.js contributors' },
      { heading: 'MongoDB', text: 'Server Side Public License (SSPL)' },
      { heading: 'Leaflet', text: 'BSD 2-Clause License - for interactive mapping' },
    ],
    about: [
      { heading: 'Our Mission', text: 'FarmApp is dedicated to empowering farmers with modern technology to improve efficiency, productivity, and profitability in agricultural operations.' },
      { heading: 'What We Do', text: 'We provide comprehensive farm management tools including crop tracking, livestock management, AI-powered disease detection, financial management, and field mapping.' },
      { heading: 'Our Vision', text: 'To become the leading farm management platform in Africa, helping farmers make data-driven decisions and achieve sustainable agricultural success.' },
      { heading: 'The Team', text: 'Our team consists of agricultural experts, software engineers, and data scientists passionate about transforming farming through technology.' },
      { heading: 'Contact Us', text: 'Email: info@farmapp.com | Phone: +234 (0) 123 456 7890 | Location: Lagos, Nigeria' },
    ],
  };

  const pageSections = sections[page] || sections.about;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto py-12 px-4 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{pageContent.icon}</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {pageContent.title}
          </h1>
          <p className="text-slate-600">
            Last updated: November 24, {currentYear}
          </p>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <div className="space-y-8">
            {pageSections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {section.heading}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Section */}
        {page !== 'about' && (
          <Card className="bg-primary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Questions?
              </h3>
              <p className="text-slate-600 mb-4">
                If you have any questions about this {pageContent.title.toLowerCase()}, 
                please contact us.
              </p>
              <a
                href="mailto:legal@farmapp.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <span>📧</span> Contact Legal Team
              </a>
            </div>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InfoPageWrapper;
