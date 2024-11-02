import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Zap, 
  Target, 
  ArrowRight, 
  Play,
  ChevronRight,
  Star,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      title: "Real-time Analytics",
      description: "Track design metrics and performance in real-time with our advanced dashboard"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Team Collaboration",
      description: "Seamlessly collaborate with your team and stakeholders in one platform"
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: "Instant Insights",
      description: "Get actionable insights and recommendations to improve your designs"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Goal Tracking",
      description: "Set and monitor design goals with our intelligent tracking system"
    }
  ];

  const stats = [
    { number: "98%", label: "Customer Satisfaction" },
    { number: "2x", label: "Faster Iterations" },
    { number: "500+", label: "Design Teams" },
    { number: "50M+", label: "Designs Analyzed" }
  ];

  return (
    <div className="min-h-screen font-sans antialiased">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DesignMetrics</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Transform Your Design Process with 
                <span className="text-blue-600"> Data-Driven Insights</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                Empower your design team with real-time analytics, actionable insights, and collaborative tools to create exceptional user experiences.
              </p>
              <div className="flex items-center space-x-4">
                <button className="px-8 py-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-4 rounded-full border border-gray-300 hover:border-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Watch Demo</span>
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-3"></div>
                <img 
                  src="/images/Hero.avif"
                  alt="Dashboard Preview" 
                  className="relative rounded-lg shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Design Teams</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to analyze, track, and improve your design process</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Leading Design Teams</h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Adobe', 'Figma', 'Sketch', 'InVision'].map((company) => (
                <div key={company} className="h-16 flex items-center justify-center">
                  <div className="text-xl font-semibold text-gray-400">{company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Transform Your Design Process?</h2>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center space-x-2">
            <span>Get Started Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="mt-4 text-blue-100">14-day free trial · No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>hello@designmetrics.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© 2024 DesignMetrics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;