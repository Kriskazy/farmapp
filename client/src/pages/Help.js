import React, { useState } from 'react';
import Card from '../components/common/Card';

const Help = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'features', title: 'Features Guide', icon: '✨' },
    { id: 'tutorials', title: 'Video Tutorials', icon: '📺' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
    { id: 'contact', title: 'Contact Support', icon: '💬' },
  ];

  const faqs = [
    {
      question: 'How do I add a new crop to my farm?',
      answer: 'Navigate to the Crops page from the sidebar, then click the "Add Crop" button. Fill in the crop details including type, quantity, planting date, and expected harvest date.',
    },
    {
      question: 'How does the AI Disease Detection work?',
      answer: 'Upload a clear photo of your crop leaves to the Disease Detection page. Our AI analyzes the image for signs of disease and provides diagnosis, confidence level, symptoms, and treatment recommendations.',
    },
    {
      question: 'Can I track multiple farms?',
      answer: 'Currently, each account is associated with one farm. For managing multiple farms, you can create separate accounts or contact us about enterprise solutions.',
    },
    {
      question: 'How do I generate financial reports?',
      answer: 'Go to the Finance page where you can view income, expenses, and generate PDF reports for any date range. You can also export data to Excel for further analysis.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption for data transmission and storage. Your farm data is backed up regularly and is never shared with third parties without your consent.',
    },
    {
      question: 'Can I access FarmApp on mobile?',
      answer: 'Yes, FarmApp is fully responsive and works on mobile browsers. We\'re also developing native mobile apps for iOS and Android.',
    },
  ];

  const tutorials = [
    { title: 'Getting Started with FarmApp', duration: '5 min', topic: 'Overview' },
    { title: 'Managing Your Crops', duration: '8 min', topic: 'Crops' },
    { title: 'Using AI Disease Detection', duration: '6 min', topic: 'AI Features' },
    { title: 'Tracking Livestock', duration: '7 min', topic: 'Livestock' },
    { title: 'Financial Management', duration: '10 min', topic: 'Finance' },
    { title: 'Creating & Managing Tasks', duration: '5 min', topic: 'Tasks' },
    { title: 'Field Mapping Tutorial', duration: '12 min', topic: 'Field Map' },
    { title: 'Inventory Management', duration: '8 min', topic: 'Inventory' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-primary-100 text-lg">
            Find answers, watch tutorials, and get support for FarmApp
          </p>
        </div>
      </div>

      {/* Search Box */}
      <Card>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          <input
            type="text"
            placeholder="Search for help topics, features, or questions..."
            className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-lg"
          />
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-6 rounded-2xl text-center transition-all duration-200 ${
              activeSection === section.id
                ? 'bg-primary-50 border-2 border-primary-500 shadow-lg'
                : 'bg-white border-2 border-slate-200 hover:border-primary-300 hover:shadow-md'
            }`}
          >
            <div className="text-4xl mb-2">{section.icon}</div>
            <p className="font-semibold text-sm text-slate-700">{section.title}</p>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === 'getting-started' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Getting Started</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl flex-shrink-0">
                  1️⃣
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Set Up Your Profile</h3>
                  <p className="text-slate-600 text-sm">
                    Navigate to Profile from the sidebar to update your information, upload a profile picture, and configure your farm details.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl flex-shrink-0">
                  2️⃣
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Add Your Crops</h3>
                  <p className="text-slate-600 text-sm">
                    Go to the Crops page and click "Add Crop" to start tracking your agricultural products, planting dates, and expected harvests.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl flex-shrink-0">
                  3️⃣
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Track Your Livestock</h3>
                  <p className="text-slate-600 text-sm">
                    Use the Livestock section to monitor your animals, track health records, breeding, and vaccination schedules.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl flex-shrink-0">
                  4️⃣
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Manage Finances</h3>
                  <p className="text-slate-600 text-sm">
                    Record income and expenses in the Finance section to track profitability and generate detailed financial reports.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeSection === 'features' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Features Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '📊',
                title: 'Dashboard',
                desc: 'Overview of your farm with key metrics, recent activities, and quick actions.',
              },
              {
                icon: '🌱',
                title: 'Crop Management',
                desc: 'Track planting, growth stages, and harvest schedules for all your crops.',
              },
              {
                icon: '🐄',
                title: 'Livestock Tracking',
                desc: 'Monitor animal health, breeding records, and vaccination schedules.',
              },
              {
                icon: '📸',
                title: 'AI Disease Detection',
                desc: 'Upload plant photos to detect diseases using AI-powered image analysis.',
              },
              {
                icon: '🗺️',
                title: 'Field Mapping',
                desc: 'Visualize and manage your farm fields with interactive mapping tools.',
              },
              {
                icon: '💰',
                title: 'Finance Management',
                desc: 'Track income, expenses, and generate comprehensive financial reports.',
              },
              {
                icon: '📦',
                title: 'Inventory Control',
                desc: 'Manage farm supplies, equipment, and materials with stock tracking.',
              },
              {
                icon: '📝',
                title: 'Task Management',
                desc: 'Create, assign, and track farm tasks to improve operational efficiency.',
              },
            ].map((feature, index) => (
              <Card key={index}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'tutorials' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Video Tutorials</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-4xl flex-shrink-0">
                    ▶️
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{tutorial.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <span>⏱️</span> {tutorial.duration}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {tutorial.topic}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'faq' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <h3 className="font-bold text-lg mb-3 text-slate-900 flex items-start gap-2">
                  <span className="text-primary-500">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 pl-6">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Contact Support</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="font-bold text-lg mb-2">Email Support</h3>
              <p className="text-slate-600 text-sm mb-3">Get help via email</p>
              <a
                href="mailto:support@farmapp.com"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                support@farmapp.com
              </a>
            </Card>

            <Card className="text-center">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="font-bold text-lg mb-2">Phone Support</h3>
              <p className="text-slate-600 text-sm mb-3">Call us directly</p>
              <a
                href="tel:+2341234567890"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                +234 (0) 123 456 7890
              </a>
            </Card>

            <Card className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Live Chat</h3>
              <p className="text-slate-600 text-sm mb-3">Chat with our team</p>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Start Chat →
              </button>
            </Card>
          </div>

          <Card>
            <h3 className="text-xl font-bold mb-4">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                  placeholder="Describe your question or issue..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg"
              >
                Send Message
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Help;
