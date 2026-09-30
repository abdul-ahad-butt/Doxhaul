import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShieldCheck, BarChart3, Clock, UserPlus, FileSearch, Banknote, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';

const StatNumber = ({ end, label, prefix = '', suffix = '' }: { end: number, label: string, prefix?: string, suffix?: string }) => {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref as any} className="text-center p-6">
      <div className="text-4xl md:text-5xl font-extrabold text-brand-amber mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-700 font-medium uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
};

const RevealCard = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal-up h-full" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state if page is already scrolled
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 sm:px-12 flex justify-between items-center text-white ${isScrolled ? 'bg-navy-950/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="text-2xl font-bold tracking-tight">Doxhaul<span className="text-brand-blue">.</span></div>
        <div className="space-x-4 flex items-center">
          <button onClick={() => navigate('/login')} className="text-white hover:text-navy-100 font-medium transition-colors cursor-pointer bg-transparent border-none">Log In</button>
          <Button variant="primary" onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-navy-950 bg-gradient-to-br from-navy-950 via-navy-800 to-navy-950 animate-gradient-shift text-white pt-32 pb-20 px-6 sm:px-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Move freight with confidence.
          </h1>
          <p className="text-xl text-slate-50 mb-10 max-w-3xl mx-auto">
            The verified marketplace connecting trusted shippers, brokers, and carriers. Real-time tracking, seamless compliance, and total operational visibility.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="lg" className="text-lg px-8" onClick={() => navigate('/register')}>Join the Network</Button>
            <Button variant="outline-white" size="lg" className="text-lg px-8" onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <RevealCard delay={0}><StatNumber end={50} label="Freight Moved" prefix="$" suffix="M+" /></RevealCard>
          <RevealCard delay={100}><StatNumber end={10000} label="Active Carriers" suffix="+" /></RevealCard>
          <RevealCard delay={200}><StatNumber end={99} label="Uptime" suffix=".9%" /></RevealCard>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-12 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Seamlessly Integrates With Your Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">Samsara</div>
            <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">KeepTruckin</div>
            <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">QuickBooks</div>
            <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">DAT</div>
            <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">TruckStop</div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Built for every side of logistics</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <RevealCard delay={0}>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-brand-blue/30 cursor-pointer group">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PackageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Shippers</h3>
              <p className="text-slate-700 mb-6">Post your freight directly to a network of fully verified carriers. Monitor your shipments in real-time and control costs.</p>
            </div>
          </RevealCard>
          
          <RevealCard delay={100}>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-brand-blue/30 cursor-pointer group">
              <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Brokers</h3>
              <p className="text-slate-700 mb-6">Expand your capacity with trusted carriers. Manage your loads, track compliance, and automate status updates in one portal.</p>
            </div>
          </RevealCard>

          <RevealCard delay={200}>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-brand-blue/30 cursor-pointer group">
              <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Carriers</h3>
              <p className="text-slate-700 mb-6">Find high-quality freight from verified partners. Keep your trucks moving with instant booking and seamless status reporting.</p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-navy-900 mb-16">How Doxhaul Works</h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          
          <RevealCard delay={0}>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-blue/30 group">
              <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-blueHover">1</div>
              <UserPlus className="w-8 h-8 text-brand-blue mx-auto mb-4 group-hover:-rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-navy-900 mb-3">Create an Account</h3>
              <p className="text-slate-700">Sign up and verify your business credentials. We vet all users to keep our network secure.</p>
            </div>
          </RevealCard>

          <RevealCard delay={100}>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-blue/30 group">
              <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-blueHover">2</div>
              <FileSearch className="w-8 h-8 text-brand-blue mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-navy-900 mb-3">Post or Find Loads</h3>
              <p className="text-slate-700">Shippers and brokers post freight. Carriers search and instantly book loads that match their capacity.</p>
            </div>
          </RevealCard>

          <RevealCard delay={200}>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center h-full relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-blue/30 group">
              <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-blueHover">3</div>
              <Banknote className="w-8 h-8 text-brand-blue mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-navy-900 mb-3">Deliver & Get Paid</h3>
              <p className="text-slate-700">Complete the trip with real-time tracking, upload the POD, and receive fast, reliable payments.</p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 sm:px-12 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <RevealCard delay={0}>
            <div className="text-center group cursor-default">
              <ShieldCheck className="w-12 h-12 mx-auto text-brand-blue mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
              <h4 className="text-lg font-bold mb-2">Verified Businesses</h4>
              <p className="text-navy-300 text-sm group-hover:text-navy-200 transition-colors">Every participant is vetted through our rigorous compliance checks.</p>
            </div>
          </RevealCard>
          <RevealCard delay={100}>
            <div className="text-center group cursor-default">
              <BarChart3 className="w-12 h-12 mx-auto text-brand-blue mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
              <h4 className="text-lg font-bold mb-2">Smart Load Matching</h4>
              <p className="text-navy-300 text-sm group-hover:text-navy-200 transition-colors">Find exactly the equipment you need, right when you need it.</p>
            </div>
          </RevealCard>
          <RevealCard delay={200}>
            <div className="text-center group cursor-default">
              <ShieldCheck className="w-12 h-12 mx-auto text-brand-blue mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
              <h4 className="text-lg font-bold mb-2">Secure Compliance</h4>
              <p className="text-navy-300 text-sm group-hover:text-navy-200 transition-colors">Store DOT, MC, and insurance docs securely in the cloud.</p>
            </div>
          </RevealCard>
          <RevealCard delay={300}>
            <div className="text-center group cursor-default">
              <Clock className="w-12 h-12 mx-auto text-brand-blue mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
              <h4 className="text-lg font-bold mb-2">Trip Visibility</h4>
              <p className="text-navy-300 text-sm group-hover:text-navy-200 transition-colors">Real-time status updates from pickup to successful delivery.</p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Live Load Board Preview */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Live Load Board</h2>
          <p className="text-lg text-slate-700">Thousands of new loads posted daily. Here's a glimpse of what's available right now.</p>
        </div>
        
        <div className="relative rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
                  <th className="p-4">Origin &rarr; Destination</th>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Pickup Date</th>
                  <th className="p-4 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-navy-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Dallas, TX &rarr; Chicago, IL
                  </td>
                  <td className="p-4 text-slate-700">Reefer (53')</td>
                  <td className="p-4 text-slate-700">Today</td>
                  <td className="p-4 text-right font-bold text-brand-green">$2,450</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-navy-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Atlanta, GA &rarr; Miami, FL
                  </td>
                  <td className="p-4 text-slate-700">Dry Van</td>
                  <td className="p-4 text-slate-700">Tomorrow</td>
                  <td className="p-4 text-right font-bold text-brand-green">$1,800</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-navy-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Los Angeles, CA &rarr; Phoenix, AZ
                  </td>
                  <td className="p-4 text-slate-700">Flatbed</td>
                  <td className="p-4 text-slate-700">Oct 12</td>
                  <td className="p-4 text-right font-bold text-brand-green">$1,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Blurred Overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center top-1/3">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 text-center max-w-md mx-4">
              <h3 className="text-xl font-bold text-navy-900 mb-3">See 10,000+ Active Loads</h3>
              <p className="text-slate-700 mb-6">Create a free account to view full load details, broker information, and book instantly.</p>
              <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>Create Free Account</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24 px-6 sm:px-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Trusted by the Industry</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <RevealCard delay={0}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                <div className="flex gap-1 text-brand-amber mb-4 group-hover:scale-105 origin-left transition-transform duration-300">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-lg text-navy-900 font-medium mb-6 italic">"Doxhaul has completely transformed how we source capacity. The vetted carrier network gives us peace of mind, and the real-time tracking saves us hours of phone calls every day."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center font-bold text-lg">SJ</div>
                  <div>
                    <div className="font-bold text-navy-900">Sarah Jenkins</div>
                    <div className="text-sm text-slate-700">Logistics Manager, Apex Freight</div>
                  </div>
                </div>
              </div>
            </RevealCard>
            
            <RevealCard delay={100}>
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                <div className="flex gap-1 text-brand-amber mb-4 group-hover:scale-105 origin-left transition-transform duration-300">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-lg text-navy-900 font-medium mb-6 italic">"As an owner-operator, finding good paying loads fast is everything. The Doxhaul app is so easy to use, and I get paid on time, every time. Best load board I've used."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center font-bold text-lg">MR</div>
                  <div>
                    <div className="font-bold text-navy-900">Mike Rodriguez</div>
                    <div className="text-sm text-slate-700">Owner-Operator, Rodriguez Transport</div>
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Transparent, Pay-as-you-go Pricing</h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">No hidden fees, no complex tiers. You only pay when you successfully move freight on our platform.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <RevealCard delay={0}>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-blue/30">
              <h3 className="text-2xl font-bold text-navy-900 mb-2">Carriers</h3>
              <div className="text-4xl font-extrabold text-brand-blue mb-6">Free<span className="text-lg text-slate-500 font-normal"> / forever</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-700">
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-green w-5 h-5 flex-shrink-0" /> Unlimited load searches</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-green w-5 h-5 flex-shrink-0" /> Instant booking capabilities</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-green w-5 h-5 flex-shrink-0" /> Next-day quickpay access</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-green w-5 h-5 flex-shrink-0" /> Document management</li>
              </ul>
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => navigate('/register')}>Create Carrier Account</Button>
            </div>
          </RevealCard>

          <RevealCard delay={100}>
            <div className="bg-navy-950 text-white p-8 rounded-xl border border-navy-800 shadow-lg h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-blue/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Shippers & Brokers</h3>
              <div className="text-4xl font-extrabold text-brand-blue mb-6">$35<span className="text-lg text-navy-300 font-normal"> / matched load</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-navy-100">
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-blue w-5 h-5 flex-shrink-0" /> Unlimited load postings</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-blue w-5 h-5 flex-shrink-0" /> Access to verified carrier network</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-blue w-5 h-5 flex-shrink-0" /> Real-time GPS tracking</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-brand-blue w-5 h-5 flex-shrink-0" /> Automated compliance checks</li>
              </ul>
              <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>Start Posting Loads</Button>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-24 px-6 sm:px-12 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-700">Everything you need to know about the Doxhaul platform.</p>
          </div>
          
          <div className="space-y-4">
            <RevealCard delay={0}>
              <details className="group bg-white rounded-lg shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-navy-900">
                  How does the carrier verification process work?
                  <span className="transition duration-300 group-open:-rotate-180 text-brand-blue">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  We integrate directly with FMCSA databases to verify active operating authority, safety ratings, and insurance coverage. New carriers must also upload their W-9 and an active certificate of insurance before they can book loads.
                </div>
              </details>
            </RevealCard>
            
            <RevealCard delay={100}>
              <details className="group bg-white rounded-lg shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-navy-900">
                  How fast do carriers get paid?
                  <span className="transition duration-300 group-open:-rotate-180 text-brand-blue">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  Standard payment terms are Net 30 from the delivery date. However, we offer an optional QuickPay feature that pays out within 24 hours of POD approval for a small 2% processing fee.
                </div>
              </details>
            </RevealCard>

            <RevealCard delay={200}>
              <details className="group bg-white rounded-lg shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-navy-900">
                  Can I track my loads in real-time?
                  <span className="transition duration-300 group-open:-rotate-180 text-brand-blue">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  Yes! We integrate with major ELD providers (like Samsara and KeepTruckin) and also offer a lightweight mobile driver app that provides location updates without draining the driver's battery.
                </div>
              </details>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-blue relative overflow-hidden text-white py-24 px-6 sm:px-12 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to streamline your logistics?</h2>
          <p className="text-xl text-white/80 mb-10">Join thousands of shippers, brokers, and carriers moving freight efficiently on the Doxhaul network today.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button variant="secondary" size="lg" className="text-brand-blue font-bold text-lg px-8 py-4 w-full sm:w-auto hover:bg-white transition-transform hover:scale-105" onClick={() => navigate('/register')}>Get Started for Free</Button>
            <Button variant="outline-white" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto hover:bg-white/10" onClick={() => navigate('/login')}>Sign In to Dashboard</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-white pt-16 pb-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold tracking-tight mb-4">Doxhaul<span className="text-brand-blue">.</span></div>
            <p className="text-slate-50/70 text-sm mb-6 max-w-xs">Connecting the world's supply chain through a verified, transparent, and efficient digital marketplace.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-50/70">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">For Shippers</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">For Brokers</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">For Carriers</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-50/70">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Blog</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-50/70">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Security</button></li>
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Compliance</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-50/50 text-sm">© {new Date().getFullYear()} Doxhaul Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const PackageIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

const BriefcaseIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
);

export default LandingPage;
