
import React, { useState } from 'react';
import { ViewState, Language, LANGUAGE_LABELS } from '../types';
import { Globe, Shield, Zap, ArrowRight, Layout, ChevronDown, Check, BarChart3, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  setView: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  const { language: currentLang, setLanguage: setLang, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Sort languages alphabetically for better UX
  const sortedLanguages = Object.values(Language).sort((a, b) => 
    LANGUAGE_LABELS[a].localeCompare(LANGUAGE_LABELS[b])
  );

  const trendingNews = [
    {
      id: 1,
      source: 'Bloomberg',
      time: '12m ago',
      title: 'Fed Signals Potential Rate Cuts as Inflation Cools to 2-Year Low',
      desc: 'Central bank officials suggest a policy pivot could arrive sooner than markets anticipated.',
      image: 'https://picsum.photos/800/600?random=101'
    },
    {
      id: 2,
      source: 'The Verge',
      time: '45m ago',
      title: 'Apple Unveils Revolutionary AR Glasses with All-Day Battery Life',
      desc: 'The new wearable device promises to replace smartphones within the decade.',
      image: 'https://picsum.photos/800/600?random=102'
    },
    {
      id: 3,
      source: 'Reuters',
      time: '2h ago',
      title: 'SpaceX Successfully Catches Super Heavy Booster on Launch Tower',
      desc: 'A historic milestone in reusable rocketry was achieved today in Texas.',
      image: 'https://picsum.photos/800/600?random=103'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      {/* Navigation - Floating Glass Effect */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-black/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                  <Globe className="w-4 h-4 text-white" />
               </div>
               <span className="font-bold text-lg tracking-tight text-black">NewsNexus</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-400 bg-white/50"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === Language.TraditionalChinese ? 'TC' : currentLang.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
                
                {isLangMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 max-h-[400px] overflow-y-auto z-50 scrollbar-hide">
                      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Region</div>
                      {sortedLanguages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLang(lang);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between
                            ${currentLang === lang ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'}
                          `}
                        >
                          <span>{LANGUAGE_LABELS[lang]}</span>
                          {currentLang === lang && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

              <button 
                onClick={() => setView('login')}
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {t('auth.submitLogin')}
              </button>
              <button 
                onClick={() => setView('register')}
                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:shadow-gray-400"
              >
                {t('home.cta')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-gray-100 via-gray-50 to-transparent rounded-[100%] blur-3xl -z-10 opacity-60"></div>

        <div className="text-center max-w-4xl mx-auto mb-16 space-y-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:border-gray-300 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
              {t('home.v2')}
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] text-balance">
              {t('home.headline')}
           </h1>
           
           <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto text-balance font-light">
              {t('home.sub')}
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <button 
               onClick={() => setView('register')}
               className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center shadow-xl shadow-black/10 hover:shadow-black/20 group min-w-[160px]"
             >
               {t('home.cta')}
               <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
             <div className="flex items-center gap-6 text-xs font-medium text-gray-500 px-6">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-black" /> {t('home.trial')}</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-black" /> {t('home.noCard')}</span>
             </div>
           </div>
        </div>

        {/* Abstract Interface Visualization */}
        <div className="relative max-w-5xl mx-auto perspective-1000 group">
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-32 bottom-0 w-full"></div>
           
           {/* Main Dashboard Interface Mockup */}
           <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden aspect-[16/9] transform group-hover:rotate-x-2 transition-transform duration-700 ease-out origin-bottom">
              {/* Header */}
              <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50/50">
                  <div className="flex gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
              </div>
              
              {/* Grid Content */}
              <div className="p-6 grid grid-cols-12 gap-6 h-full bg-dots-pattern">
                  {/* Sidebar */}
                  <div className="col-span-2 hidden md:block space-y-3">
                     {[1,2,3,4].map(i => <div key={i} className="h-8 w-full bg-gray-50 rounded-lg animate-pulse" style={{animationDelay: `${i*100}ms`}}></div>)}
                  </div>
                  
                  {/* Main */}
                  <div className="col-span-12 md:col-span-10 space-y-6">
                      <div className="flex gap-4">
                          <div className="w-1/3 h-24 rounded-lg bg-gray-50 border border-gray-100 p-4">
                              <div className="w-8 h-8 rounded bg-black/5 mb-2"></div>
                              <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="w-8 h-4 bg-black rounded"></div>
                          </div>
                          <div className="w-1/3 h-24 rounded-lg bg-gray-50 border border-gray-100 p-4">
                              <div className="w-8 h-8 rounded bg-black/5 mb-2"></div>
                              <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="w-8 h-4 bg-black rounded"></div>
                          </div>
                          <div className="w-1/3 h-24 rounded-lg bg-gray-50 border border-gray-100 p-4">
                              <div className="w-8 h-8 rounded bg-black/5 mb-2"></div>
                              <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="w-8 h-4 bg-black rounded"></div>
                          </div>
                      </div>
                      <div className="h-48 bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden">
                           <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4 pb-0 gap-1 opacity-50">
                               {[40, 60, 45, 70, 50, 60, 80, 75, 50, 60, 90, 85].map((h, i) => (
                                   <div key={i} className="flex-1 bg-black hover:bg-gray-800 transition-colors" style={{ height: `${h}%` }}></div>
                               ))}
                           </div>
                      </div>
                  </div>
              </div>
           </div>

           {/* Floating Glass Cards */}
           <div className="absolute -right-8 top-20 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 w-64 animate-float hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-black rounded-lg"><Globe className="w-4 h-4 text-white" /></div>
                 <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Status</div>
                    <div className="text-sm font-bold">System Operational</div>
                 </div>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-full animate-pulse"></div>
              </div>
           </div>
           
           <div className="absolute -left-8 bottom-20 bg-black text-white p-5 rounded-xl shadow-2xl w-64 animate-float-delayed hidden lg:block">
              <div className="flex justify-between items-end">
                 <div>
                    <div className="text-xs text-gray-400 mb-1">Total Crawled</div>
                    <div className="text-2xl font-bold">1,204,592</div>
                 </div>
                 <BarChart3 className="w-6 h-6 text-gray-500" />
              </div>
           </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">{t('home.trusted')}</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
                  {/* Mock Logos for Trust */}
                  <div className="flex items-center gap-2 font-bold text-xl text-gray-600"><div className="w-6 h-6 bg-gray-400 rounded-full"></div> Acme Corp</div>
                  <div className="flex items-center gap-2 font-bold text-xl text-gray-600"><div className="w-6 h-6 bg-gray-400 rounded-full"></div> GlobalNews</div>
                  <div className="flex items-center gap-2 font-bold text-xl text-gray-600"><div className="w-6 h-6 bg-gray-400 rounded-full"></div> FutureInc</div>
                  <div className="flex items-center gap-2 font-bold text-xl text-gray-600"><div className="w-6 h-6 bg-gray-400 rounded-full"></div> DataFlow</div>
              </div>
          </div>
      </section>

      {/* Features Grid (Bento Box Style) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.featureSectionTitle')}</h2>
              <p className="text-gray-500 text-lg">{t('home.featureSectionSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Large Card */}
              <div className="md:col-span-2 row-span-1 bg-gray-100 rounded-3xl p-8 relative overflow-hidden group hover:bg-gray-200 transition-colors">
                  <div className="relative z-10 max-w-md">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                          <Zap className="w-6 h-6 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('nav.crawler')}</h3>
                      <p className="text-gray-600 leading-relaxed">
                          {t('home.featureCrawlerDesc')}
                      </p>
                  </div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 translate-x-12 translate-y-12 bg-white rounded-tl-3xl shadow-xl p-6 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform">
                      <div className="space-y-3">
                          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-20 bg-gray-100 rounded w-full mt-4"></div>
                      </div>
                  </div>
              </div>

              {/* Tall Card */}
              <div className="md:col-span-1 row-span-1 md:row-span-2 bg-black rounded-3xl p-8 relative overflow-hidden text-white">
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                          <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{t('home.featureSecurityTitle')}</h3>
                      <p className="text-gray-400 leading-relaxed mb-8">
                          {t('home.featureSecurityDesc')}
                      </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-4 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                      <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-mono text-gray-300">{t('home.encryption')}</span>
                      </div>
                  </div>
              </div>

              {/* Medium Card */}
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 relative overflow-hidden group hover:border-black transition-colors">
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                      <div className="flex-1">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                              <Layout className="w-6 h-6 text-black" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('nav.dashboard')}</h3>
                          <p className="text-gray-600 leading-relaxed">
                              {t('home.featureDashboardDesc')}
                          </p>
                      </div>
                      <div className="flex-1 w-full bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                          {/* Mini Chart Mockup */}
                           <div className="flex items-end gap-2 h-32 opacity-70">
                              <div className="flex-1 bg-black h-[40%] rounded-t"></div>
                              <div className="flex-1 bg-gray-400 h-[70%] rounded-t"></div>
                              <div className="flex-1 bg-black h-[50%] rounded-t"></div>
                              <div className="flex-1 bg-gray-400 h-[80%] rounded-t"></div>
                              <div className="flex-1 bg-black h-[60%] rounded-t"></div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Demo Content Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-black pl-4">{t('home.trending')}</h2>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-white transition-colors"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                    <button className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"><ArrowRight className="w-5 h-5" /></button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trendingNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                        <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-gray-200">
                           <img 
                              src={news.image} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0" 
                              alt="News" 
                            />
                           <div className="absolute top-4 left-4">
                               <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('home.liveTag')}</span>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-semibold text-gray-900">{news.source}</span>
                              <span>•</span>
                              <span>{news.time}</span>
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:underline decoration-2 underline-offset-4">
                               {news.title}
                           </h3>
                           <p className="text-sm text-gray-600 line-clamp-2">
                               {news.desc}
                           </p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                  {/* Left Column */}
                  <div className="max-w-xs">
                      <div className="flex items-center gap-2 mb-6">
                          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <Globe className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-xl text-black tracking-tight">NewsNexus</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">
                          Empowering professionals with real-time global intelligence.
                      </p>
                  </div>
                  
                  {/* Right Column (Product) */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 text-xs uppercase tracking-widest">Product</h4>
                      <ul className="space-y-4 text-sm text-gray-600 font-medium">
                          <li>
                            <button onClick={() => setView('login')} className="hover:text-black transition-colors text-left">
                                {t('nav.crawler')}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => setView('login')} className="hover:text-black transition-colors text-left">
                                {t('nav.dashboard')}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => setView('login')} className="hover:text-black transition-colors text-left">
                                {t('home.linkApi')}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => setView('login')} className="hover:text-black transition-colors text-left">
                                {t('nav.payment')}
                            </button>
                          </li>
                      </ul>
                  </div>
              </div>
              
              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-400 font-medium">© 2024 NewsNexus. All rights reserved.</p>
                  <div className="flex gap-4">
                      {/* Social Icons */}
                      <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                      </a>
                      <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                        <span className="sr-only">GitHub</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                      </a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
