import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  ArrowRight,
  Sparkles
} from "lucide-react";
import logo from "../assets/logo.png";

function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleConsultTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-consult-us'));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmailInput("");
    }, 3000);
  };

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      color: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      color: "hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 hover:text-white hover:border-purple-500",
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      color: "hover:bg-red-600 hover:text-white hover:border-red-600",
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
        </svg>
      )
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "hover:bg-blue-700 hover:text-white hover:border-blue-700",
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    }
  ];

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Quick Consultation Call To Action */}
      <div className="max-w-7xl mx-auto px-5 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-900/30 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Direct Support Channel
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">Need Immediate Admission Guidance?</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Get an eligibility evaluation directly from our consultants for studying MBBS in Bangladesh medical universities.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center shrink-0">
            <button 
              onClick={handleConsultTrigger}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Consult Counselors
            </button>
            <a 
              href="tel:+919051773700"
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow transition duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
            >
              Call Helpline
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        
        {/* Core Footer Link Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3.5 group cursor-pointer">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src={logo} 
                  alt="Aspiring Life Logo" 
                  className="relative h-12 w-auto object-contain bg-white rounded-2xl p-2 shadow-xl shadow-emerald-950/20 border border-slate-100/10 transition-all duration-500 group-hover:scale-105" 
                />
              </div>
              <div>
                <span className="text-white font-black text-xl tracking-tight uppercase block leading-none">
                  Aspiring <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Life</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block mt-1.5">
                  Admission Partner
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Your trusted admission partner for medical education in Bangladesh and abroad. We guide you at every step of your MBBS journey.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "MBBS in Bangladesh", href: "/mbbs-in-bangladesh" },
                { name: "MBBS Abroad", href: "/mbbs-abroad" },
                { name: "Medical Colleges", href: "/colleges" },
                { name: "Contact Us", href: "#contact" }
              ].map((link, idx) => (
                <li key={idx} className="group flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-250 -ml-5 group-hover:ml-0" />
                  <a href={link.href} className="hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Student Support */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Student Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Eligibility Assessment",
                "College Selection",
                "Admission Processing",
                "Document Verification",
                "Visa Assistance",
                "Travel Guidance"
              ].map((support, idx) => (
                <li key={idx} className="group flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-250 -ml-5 group-hover:ml-0" />
                  <button 
                    onClick={handleConsultTrigger}
                    className="hover:text-emerald-400 text-left transition-colors duration-200 cursor-pointer"
                  >
                    {support}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Box */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get updates on seat availability, equivalence deadlines, and official announcements.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address" 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition duration-300"
                />
                <button 
                  type="submit" 
                  aria-label="Submit newsletter form"
                  className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition duration-200 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {isSubmitted && (
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Successfully subscribed!
                </p>
              )}
            </form>
            <div className="space-y-2.5 pt-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal documents</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                {["Privacy Policy", "Terms and Conditions", "Disclaimer"].map((legal, idx) => (
                  <a key={idx} href="#" className="hover:text-emerald-400 transition-colors">{legal}</a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Horizontal Contact Row */}
        <div className="border-t border-slate-900 pt-8 pb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 bg-slate-900/40 p-4.5 rounded-2xl border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-300 text-xs uppercase tracking-wider">India Helpline</p>
              <p className="text-slate-400 font-medium text-xs mt-1.5">+91 9051773700 / +91 9051772900</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-900/40 p-4.5 rounded-2xl border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-300 text-xs uppercase tracking-wider">Email Address</p>
              <p className="text-slate-400 font-medium text-xs mt-1.5">info@aspiringlife.org</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-900/40 p-4.5 rounded-2xl border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-300 text-xs uppercase tracking-wider">Corporate Office</p>
              <p className="text-slate-400 font-medium text-xs mt-1.5">Kolkata, West Bengal, India</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Panel */}
        <div className="border-t border-slate-900 pt-6 pb-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 flex items-start gap-4 shadow-inner">
            <ShieldCheck className="w-5.5 h-5.5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] leading-relaxed text-slate-500">
              <span className="font-bold text-slate-400 uppercase tracking-wide block mb-1">Important Disclaimer</span>
              College fees, hostel charges, seat availability, recognition status, admission rules, affiliations and licensing regulations may change. Students must verify all information through the college, Bangladesh government authorities, BMDC, WDOMS and the National Medical Commission before admission or payment.
            </p>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© 2026 Aspiring Life Consultants Pvt. Ltd. All rights reserved.</span>
          <div className="flex gap-3">
            {socialLinks.map((soc, idx) => (
              <a 
                key={idx} 
                href={soc.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={soc.label}
                className={`p-2 bg-slate-900 border border-slate-800 rounded-xl transition-all duration-300 text-slate-400 ${soc.color}`}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;