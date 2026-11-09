import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Users, 
  FileText, 
  Home, 
  Activity, 
  ChevronDown, 
  ArrowRight, 
  PhoneCall, 
  ArrowUp,
  Download,
  Building,
  HeartPulse,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import logoJahurulIslam from '../../assets/logo/JIMCH.png';
import campusImg from '../../assets/colleges/jahurul-islam.jpg';
import { colleges } from '../../components/data/CollegesCard';

// Animation configurations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function JahurulIslamMedicalCollege() {
  const [activeTab, setActiveTab] = useState<'fees' | 'eligibility' | 'process'>('fees');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConsultTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-consult-us'));
  };

  // Find related colleges (excluding Jahurul Islam itself)
  const relatedColleges = colleges.filter(c => c.id !== '64b1f1a8e2b8f84d6c7b0019');

  // Auto-play interval for carousel
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % relatedColleges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered, relatedColleges.length]);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + relatedColleges.length) % relatedColleges.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % relatedColleges.length);
  };

  const faqs = [
    {
      q: "Is Jahurul Islam Medical College listed in the World Directory of Medical Schools (WDOMS)?",
      a: "Yes, Jahurul Islam Medical College (JIMC) is listed in the World Directory of Medical Schools (WDOMS). This enables graduates to sit for international licensing exams such as USMLE, PLAB, and other licensing certifications globally."
    },
    {
      q: "What is the NMC eligibility status for Indian students at JIMC?",
      a: "Graduates are eligible under current National Medical Commission (India) regulations, subject to applicable NMC rules. This qualifies them to sit for the NEXT / FMGE licensing exam upon returning to India."
    },
    {
      q: "Which university is the college affiliated with?",
      a: "Jahurul Islam Medical College is affiliated with the University of Dhaka, which is the most prestigious public university in Bangladesh, supervising all examination schedules and degrees."
    },
    {
      q: "Are hostel accommodations safe and secure for foreign students?",
      a: "Yes, the college provides secure, separate hostel facilities for male and female international students. Hostels are equipped with 24/7 security desks, high-speed Wi-Fi, dining services, and basic utilities."
    },
    {
      q: "What is the medium of instruction for MBBS?",
      a: "The entire MBBS program is taught in English. All lectures, textbooks, practical modules, and examination papers align with standard British-style medical curriculum guidelines."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white pt-20">
      <Navbar />

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed right-5 bottom-28 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100/80 border-b border-slate-200/50 py-3.5 px-5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <span>/</span>
          <Link to="/colleges" className="hover:text-emerald-600 transition">Colleges</Link>
          <span>/</span>
          <span className="text-slate-800">Jahurul Islam Medical College</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 px-5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900 z-0" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-emerald-400 uppercase"
            >
              <Award className="w-4 h-4" /> Listed in the WDOMS Directory
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            >
              Jahurul Islam <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Medical College (JIMC)</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-lg leading-relaxed max-w-xl"
            >
              Established in 1992, located in Bhagalpur, Bajitpur, Kishoreganj. Eligible under current National Medical Commission (India) regulations, subject to applicable NMC rules.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b0019"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.03] transition duration-300 text-center"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-4 px-8 rounded-xl hover:scale-[1.03] transition duration-300 cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download Brochure
              </button>
            </motion.div>
          </div>

          {/* Hero Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-30 animate-pulse" />
            <div className="relative bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img 
                src={campusImg} 
                alt="Jahurul Islam Medical College Campus" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center gap-3">
                  <img src={logoJahurulIslam} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1.5 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white">Jahurul Islam</h3>
                    <p className="text-xs text-slate-300">Kishoreganj, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts Section */}
      <section className="relative z-10 -mt-10 px-5 max-w-7xl mx-auto">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {[
            { label: "Established", value: "1992", icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Location", value: "Bajitpur, Kishoreganj", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Affiliation", value: "University of Dhaka", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Accredited by", value: "BMDC & WDOMS Listed", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Type", value: "Private", icon: Building, color: "text-pink-500", bg: "bg-pink-50" },
            { label: "Teaching Hospital", value: "JIMC Hospital", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" }
          ].map((fact, i) => {
            const Icon = fact.icon;
            return (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300"
              >
                <div className={`w-10 h-10 ${fact.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${fact.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{fact.label}</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">{fact.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-5 py-20 grid lg:grid-cols-12 gap-12">
        {/* Left Content Area */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* About Section */}
          <motion.section {...fadeInUp} id="about" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-emerald-600 w-8 h-8" /> About Jahurul Islam Medical College
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Jahurul Islam Medical College (JIMC), established in 1992, is one of the oldest private medical colleges in Bangladesh. Spanning a massive 53-acre fully residential campus in Bhagalpur, Bajitpur, the college offers students a quiet, highly focused, and natural environment.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The college is affiliated with the University of Dhaka, ensuring strict academic adherence to public medical frameworks. JIMC is accredited by the BMDC and listed in the World Directory of Medical Schools (WDOMS), validating its degree on a global level.
              </p>
            </div>
          </motion.section>

          {/* MBBS Highlights */}
          <motion.section {...fadeInUp} id="highlights" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Activity className="text-emerald-600 w-8 h-8" /> MBBS Highlights
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {[
                    { key: "Course Offered", val: "MBBS (Bachelor of Medicine & Bachelor of Surgery)" },
                    { key: "Course Duration", val: "5 Years + 1-Year Compulsory Internship" },
                    { key: "Language of Study", val: "English" },
                    { key: "University Affiliation", val: "University of Dhaka" },
                    { key: "Accreditation", val: "BMDC Accredited & WDOMS Listed" },
                    { key: "Teaching Hospital", val: "Jahurul Islam Medical College Hospital" },
                    { key: "Admission Intake", val: "January / February Admission Session" }
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="p-4 font-semibold text-slate-700 text-sm w-1/3 border-b border-slate-100">{row.key}</td>
                      <td className="p-4 text-slate-600 text-sm border-b border-slate-100">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Tabs Section (Fees, Eligibility, Process) */}
          <section className="space-y-6">
            <div className="flex border-b border-slate-200">
              {(['fees', 'eligibility', 'process'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-6 font-bold text-sm transition-all relative border-b-2 capitalize cursor-pointer ${
                    activeTab === tab 
                      ? 'border-emerald-600 text-emerald-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'fees' ? 'Fees Structure' : tab === 'eligibility' ? 'Eligibility Criteria' : 'Admission Process'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'fees' && (
                <motion.div
                  key="fees"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm text-center">
                    <p className="text-slate-600 font-semibold">Please contact our counselors to get the latest, verified fee structure for the current academic session.</p>
                    <button 
                      onClick={handleConsultTrigger}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Contact for Latest Fees <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'eligibility' && (
                <motion.div
                  key="eligibility"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-slate-900">MBBS Eligibility Guidelines for Indian Students</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { title: "NEET Scorecard", desc: "Must qualify the NEET-UG examination of the current year." },
                      { title: "Age Limit", desc: "Minimum age of 17 years by December 31st of the year of admission." },
                      { title: "Academic Background", desc: "10+2 with Physics, Chemistry, Biology, and English from a recognized board." },
                      { title: "GPA Requirements", desc: "Combined SSC (10th) and HSC (12th) GPA of 7.0 minimum, with a minimum Biology score of 60% (GPA 3.5)." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 border border-slate-100 rounded-xl p-4 bg-slate-50">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
                >
                  <div className="relative pl-6 border-l-2 border-emerald-500 space-y-6">
                    {[
                      { step: "Step 1: Application Submission", desc: "Submit verification copies of transcripts, passport, and NEET details to compile the eligibility portfolio." },
                      { step: "Step 2: Equivalency Evaluation", desc: "Evaluation of the high school credentials by the Ministry of Foreign Affairs/DGHS of Bangladesh." },
                      { step: "Step 3: Admission Acceptance", desc: "Pay the seat booking fee to obtain the confirmed admission letter from JIMC." },
                      { step: "Step 4: Visa & Arrival", desc: "Submit visa application under student category, finalize boarding, and report to the Kishoreganj campus." }
                    ].map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow" />
                        <h4 className="font-bold text-sm text-slate-800">{item.step}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Teaching Hospital Section */}
          <motion.section {...fadeInUp} id="hospital" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartPulse className="text-emerald-600 w-8 h-8" /> Teaching Hospital & Clinical Training
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The attached **Jahurul Islam Medical College Hospital** is an active, multi-specialty teaching hospital. Boasting a massive capacity, the hospital serves Kishoreganj and nearby districts, offering students rich clinical practice during clinical clerkships.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <h4 className="text-2xl font-black text-emerald-600">Attached</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Teaching Hospital</p>
                </div>
                <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <h4 className="text-2xl font-black text-emerald-600">Multi-Specialty</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Departments</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Hostel Section */}
          <motion.section {...fadeInUp} id="hostel" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Home className="text-emerald-600 w-8 h-8" /> Hostels & Student Accommodation
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-lg">Safe Hostels</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clean, well-furnished dormitories with single, double, or triple occupant choices are located near the college campus in Kishoreganj. Hostels feature 24/7 security desks and digital surveillance.
                </p>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-lg">Dining Options</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hostel dining options offer standard meals covering both vegetarian and non-vegetarian Indian palettes. The college has dedicated kitchen staff managing high food safety and hygiene controls.
                </p>
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section {...fadeInUp} id="faq" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Users className="text-emerald-600 w-8 h-8" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-emerald-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {faqOpen === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 text-sm text-slate-500 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Related Medical Colleges Slider */}
          <motion.section {...fadeInUp} id="related" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Building className="text-emerald-600 w-8 h-8" /> Related Medical Colleges
            </h2>
            
            <div 
              className="relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm overflow-hidden"
              onMouseEnter={() => setIsCarouselHovered(true)}
              onMouseLeave={() => setIsCarouselHovered(false)}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Explore Partner Colleges</p>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrev}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="relative min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full grid md:grid-cols-2 gap-6 items-center"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow">
                      <img 
                        src={relatedColleges[carouselIndex].image.startsWith('http') || relatedColleges[carouselIndex].image.startsWith('/') 
                          ? relatedColleges[carouselIndex].image 
                          : `/${relatedColleges[carouselIndex].image}`}
                        alt={relatedColleges[carouselIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                        {relatedColleges[carouselIndex].location}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{relatedColleges[carouselIndex].name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        Established in {relatedColleges[carouselIndex].established}, affiliated with {relatedColleges[carouselIndex].affiliatedUniversity}. Offers premium medical packages with strong clinical platforms.
                      </p>
                      <Link 
                        to={`/college/${relatedColleges[carouselIndex].slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {relatedColleges.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      carouselIndex === idx ? 'bg-emerald-600 w-6' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>

        </div>

        {/* Right Sticky Sidebar Widget */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-28 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Admission Open</h3>
              <p className="text-xs text-slate-500">Foreign quota seats are strictly limited and allocated on merit clearance. Book early.</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Program:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">MBBS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Session Intake:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">2026</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Total Term:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">6 Years</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b0019"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                className="flex items-center justify-center gap-2 w-full border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" /> Request Call Back
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white py-20 px-5 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-900 to-slate-900 z-0" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Begin Your Medical Career?</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Contact our advisors for equivalency calculations, offer letter processing, and student visa support.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/application/64b1f1a8e2b8f84d6c7b0019"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.03] transition duration-300"
            >
              Apply Online Now <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleConsultTrigger}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-4 px-8 rounded-xl hover:scale-[1.03] transition duration-300 cursor-pointer"
            >
              Contact Our Counselor
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
