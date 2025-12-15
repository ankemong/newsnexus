
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Globe, ArrowLeft, Search, Book, Code, Terminal, MessageCircle, Github, Slack, HelpCircle, Mail, MapPin, Phone, Shield, FileText, Cookie, ChevronRight, Smartphone, Layout } from 'lucide-react';

interface InfoPageProps {
  view: ViewState;
  setView: (view: ViewState) => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ view, setView }) => {
  const [activeDocSection, setActiveDocSection] = useState('Introduction');
  
  const renderNav = () => (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
           </div>
           <span className="font-bold text-lg text-black">NewsNexus</span>
        </div>
        <button 
          onClick={() => setView('home')}
          className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </nav>
  );

  const renderFooter = () => (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">© 2024 NewsNexus. Enterprise Intelligence Platform.</p>
        </div>
    </footer>
  );

  const renderDocsContent = () => {
      if (activeDocSection === 'Introduction') {
          return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-6 text-sm font-bold text-blue-600 font-mono">v2.1.0</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Introduction to NewsNexus API</h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl">
                    The NewsNexus API provides programmatic access to our global news intelligence platform. 
                    Use it to integrate real-time articles, sentiment analysis, and summarization capabilities directly into your applications.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div 
                        className="p-6 border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all cursor-pointer group bg-white"
                        onClick={() => setActiveDocSection('Quick Start')}
                    >
                        <Smartphone className="w-8 h-8 mb-4 text-gray-900 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Quick Start Guide</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Get your API key and make your first request in less than 5 minutes.</p>
                    </div>
                    <div 
                        className="p-6 border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all cursor-pointer group bg-white"
                        onClick={() => setActiveDocSection('API Reference')}
                    >
                        <div className="flex items-center gap-2 mb-4">
                             <span className="font-mono text-xl font-bold text-gray-900 group-hover:scale-110 transition-transform">{">_"}</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">API Reference</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Detailed endpoint definitions, parameters, and response schemas.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Usage</h2>
                <div className="bg-[#0F1117] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#161b22]">
                        <div className="flex gap-2">
                             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">cURL</span>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed text-gray-300">
{`curl -X GET "https://api.newsnexus.com/v1/search?q=tesla&lang=en" \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json"`}
                        </pre>
                    </div>
                </div>
            </div>
          );
      }

      return (
          <div className="animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>Documentation</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-black font-medium">{activeDocSection}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{activeDocSection}</h1>
              <div className="p-12 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Coming Soon</h3>
                  <p className="text-gray-500">We are currently updating the {activeDocSection} documentation.</p>
              </div>
          </div>
      );
  };

  const renderDocs = () => (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-white">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-gray-200 bg-gray-50/50 p-6 flex-shrink-0">
            <h4 className="font-bold text-gray-900 mb-4 px-2 text-sm uppercase tracking-wider">Documentation</h4>
            <div className="space-y-1 mb-8">
                {['Introduction', 'Quick Start', 'Authentication', 'API Reference', 'SDKs', 'Rate Limits', 'Errors'].map((item) => (
                    <button 
                        key={item} 
                        onClick={() => setActiveDocSection(item)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeDocSection === item 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            
            <h4 className="font-bold text-gray-900 mb-4 px-2 text-sm uppercase tracking-wider">Guides</h4>
            <div className="space-y-1">
                {['Keyword Tracking', 'Sentiment Analysis', 'Exporting Data'].map((item) => (
                    <button 
                        key={item} 
                        onClick={() => setActiveDocSection(item)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeDocSection === item 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 max-w-5xl mx-auto w-full">
            {renderDocsContent()}
        </div>
    </div>
  );

  const renderBlog = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">NewsNexus Insights</h1>
            <p className="text-xl text-gray-500">Engineering deep dives, product updates, and industry analysis.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="group cursor-pointer">
                     <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                         <img src={`https://picsum.photos/600/400?random=${i+20}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog cover" />
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600 mb-2">
                         <span>Engineering</span>
                         <span className="text-gray-300">•</span>
                         <span className="text-gray-500">Oct {10+i}, 2024</span>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:underline">Building a Distributed Crawler at Scale</h3>
                     <p className="text-gray-600 text-sm line-clamp-3">
                         How we handle petabytes of data daily using a custom-built distributed architecture on top of Kubernetes...
                     </p>
                 </div>
             ))}
        </div>
    </div>
  );

  const renderCommunity = () => (
      <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Join the Community</h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                  Connect with thousands of developers, data scientists, and journalists building the future of information intelligence.
              </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#5865F2] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <MessageCircle className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Discord Server</h3>
                  <p className="opacity-90 mb-8">Chat in real-time with the team and other users. Get help with API integrations.</p>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg font-bold group-hover:bg-white/20 transition-colors">
                      Join 12,500+ Members <ChevronRight className="w-4 h-4" />
                  </div>
              </div>
              <div className="bg-[#171515] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <Github className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">GitHub Discussions</h3>
                  <p className="opacity-90 mb-8">Report bugs, request features, and contribute to our open-source SDKs.</p>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg font-bold group-hover:bg-white/20 transition-colors">
                      View Repositories <ChevronRight className="w-4 h-4" />
                  </div>
              </div>
          </div>
      </div>
  );

  const renderHelp = () => (
      <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help?</h1>
              <div className="relative max-w-lg mx-auto">
                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search for articles..." className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
          </div>

          <div className="space-y-6">
              <div className="font-bold text-gray-900 border-b pb-2">Common Questions</div>
              {[
                  { q: "How do I upgrade my plan?", a: "Go to Billing settings in your dashboard." },
                  { q: "What is the request limit?", a: "500/mo for Free, 50k/mo for Pro." },
                  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time." },
                  { q: "Do you support custom sources?", a: "Enterprise plans support custom source crawling." }
              ].map((faq, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900 mb-1">{faq.q}</div>
                      <div className="text-gray-600 text-sm">{faq.a}</div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderLegal = (title: string, content: React.ReactNode) => (
      <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-8 border-b border-gray-200">{title}</h1>
          <div className="prose prose-lg prose-slate max-w-none text-gray-600">
              {content}
          </div>
      </div>
  );

  const renderContact = () => (
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-16">
          <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
              <p className="text-xl text-gray-500 mb-8">
                  Have questions about Enterprise plans or custom integrations? We'd love to help.
              </p>
              
              <div className="space-y-6">
                  <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-gray-900 mt-1" />
                      <div>
                          <div className="font-bold text-gray-900">Email</div>
                          <div className="text-gray-600">sales@newsnexus.com</div>
                          <div className="text-gray-600">support@newsnexus.com</div>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-gray-900 mt-1" />
                      <div>
                          <div className="font-bold text-gray-900">Office</div>
                          <div className="text-gray-600">
                              100 Innovation Drive, Suite 500<br/>
                              San Francisco, CA 94105
                          </div>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-gray-900 mt-1" />
                      <div>
                          <div className="font-bold text-gray-900">Phone</div>
                          <div className="text-gray-600">+1 (555) 123-4567</div>
                          <div className="text-sm text-gray-400">Mon-Fri, 9am - 5pm EST</div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white">
                          <option>Sales Inquiry</option>
                          <option>Technical Support</option>
                          <option>Partnership</option>
                          <option>Other</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                      <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none h-32"></textarea>
                  </div>
                  <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                      Send Message
                  </button>
              </form>
          </div>
      </div>
  );

  const getPageContent = () => {
    switch (view) {
      case 'docs': return renderDocs();
      case 'blog': return renderBlog();
      case 'community': return renderCommunity();
      case 'help': return renderHelp();
      case 'privacy': return renderLegal('Privacy Policy', (
        <>
            <p><strong>Effective Date:</strong> October 24, 2024</p>
            <p>At NewsNexus, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our API services.</p>
            <h3>1. Information Collection</h3>
            <p>We collect personal data that you provide to us (such as name, email address, payment info) and data automatically collected via cookies and usage logs.</p>
            <h3>2. Use of Data</h3>
            <p>We use your data to facilitate account creation, process payments, provide API access, and improve our crawling algorithms.</p>
            <h3>3. Data Protection</h3>
            <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
        </>
      ));
      case 'terms': return renderLegal('Terms of Service', (
        <>
            <p><strong>Last Updated:</strong> October 24, 2024</p>
            <p>Please read these Terms of Service carefully before using NewsNexus.</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
            <h3>2. API Usage</h3>
            <p>You may not use the API for any illegal purpose. Rate limits apply based on your subscription tier.</p>
            <h3>3. Intellectual Property</h3>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of NewsNexus and its licensors.</p>
        </>
      ));
      case 'cookie-policy': return renderLegal('Cookie Policy', (
        <>
            <p>This Cookie Policy explains how NewsNexus uses cookies and similar technologies to recognize you when you visit our website.</p>
            <h3>What are cookies?</h3>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p>
            <h3>Why do we use cookies?</h3>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate.</p>
        </>
      ));
      case 'contact': return renderContact();
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {renderNav()}
      <main className="flex-1">
        {getPageContent()}
      </main>
      {renderFooter()}
    </div>
  );
};

export default InfoPage;
