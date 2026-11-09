import { colleges } from '../../components/data/CollegesCard';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award, BookOpen, Clock, DollarSign, CheckCircle, Users, FileText, Home, Activity, ChevronDown, ArrowRight, ShieldCheck, PhoneCall, ArrowUp, Download, Building, HeartPulse, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import logoPopular from '../../assets/logo/popular Medical College.png';
import collegeImg from '../../assets/what-we-do/PMC (1).jpg';

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

export default function PopularMedicalCollege() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const relatedColleges = colleges.filter(c => c.id !== '64b1f1a8e2b8f84d6c7b0011');

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
  
  const [activeTab, setActiveTab] = useState<'fees' | 'eligibility' | 'process'>('fees');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConsultTrigger = () => {
    window.dispatchEvent(new CustomEvent('open-consult-us'));
  };

  const faqs = [
    {
      q: "Is Popular Medical College recognized by the National Medical Commission (NMC) of India?",
      a: "Yes, Popular Medical College is fully recognized by the NMC (formerly MCI) of India. Indian students who complete their MBBS from this college are eligible to appear for the FMGE/NExT licensing exam in India."
    },
    {
      q: "What is the affiliation and medium of instruction?",
      a: "The college is affiliated with the University of Dhaka, which is one of the oldest and most prestigious universities in Bangladesh. The entire MBBS curriculum and all clinical postings are conducted in English."
    },
    {
      q: "What is the bed capacity of the teaching hospital?",
      a: "Popular Medical College Hospital has a modern 500+ bed facility located in the heart of Dhaka, ensuring a massive patient load and diverse clinical exposure for students during their clinical rotations."
    },
    {
      q: "Are hostel facilities available for international students?",
      a: "Yes, the college provides secure, well-furnished hostels specifically designed for international students. The hostels have 24/7 security, high-speed internet, and dining halls serving nutritious Indian and local food."
    },
    {
      q: "What is the admission procedure for Indian students?",
      a: "Indian students must have a valid NEET-UG qualifying score and have passed 10+2 with Physics, Chemistry, and Biology (minimum aggregate GPA requirements apply). Applications are submitted along with academic transcripts and passport copies for verification and visa clearance."
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
          <span className="text-slate-800">Popular Medical College</span>
        </div>
      </div>

      {/* Hero Banner Section */}
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
              <Award className="w-4 h-4" /> WDOMS Listed & NMC Compliant
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            >
              Popular Medical <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">College, Dhaka</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-lg leading-relaxed max-w-xl"
            >
              Pursue a world-class, NMC-aligned MBBS program at the heart of Dhaka. High clinical volume, modern laboratories, and standard English-medium teaching.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b0011"
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
                src={collegeImg} 
                alt="Popular Medical College Campus" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center gap-3">
                  <img src={logoPopular} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1.5" />
                  <div>
                    <h3 className="font-bold text-white">Popular Medical College</h3>
                    <p className="text-xs text-slate-300">Dhaka, Bangladesh</p>
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
            { label: "Established", value: "2010", icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Location", value: "Dhaka", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Affiliation", value: "Dhaka University", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Recognition", value: "NMC, BMDC, WHO", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Type", value: "Private", icon: Building, color: "text-pink-500", bg: "bg-pink-50" },
            { label: "Hospital Beds", value: "500+ Beds", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" }
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

      {/* Main Layout Grid (Content & Sidebar) */}
      <main className="max-w-7xl mx-auto px-5 py-20 grid lg:grid-cols-12 gap-12">
        {/* Left Content Area */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* About Section */}
          <motion.section {...fadeInUp} id="about" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-emerald-600 w-8 h-8" /> About Popular Medical College
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Popular Medical College was established in 2010 in Dhanmondi, Dhaka, with the vision of offering high-standard medical education. Over the last decade, it has grown into one of the most prestigious private medical institutions in Bangladesh. The college is equipped with state-of-the-art anatomy labs, histology departments, air-conditioned lecture galleries, and research centers.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The primary strength of the college lies in its integration with the Popular Group, which operates the largest diagnostic network in Bangladesh. This integration ensures that medical students have access to top-notch clinical laboratories, advanced medical imaging facilities, and expert mentors during their clinical rotations.
              </p>
            </div>
          </motion.section>

          {/* Highlights Section */}
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
                    { key: "Medium of Instruction", val: "100% English" },
                    { key: "Affiliation", val: "University of Dhaka" },
                    { key: "Approved by", val: "NMC (India), BMDC (Bangladesh), WHO" },
                    { key: "Hospital Capacity", val: "500+ Beds (With high OPD volume)" },
                    { key: "Academic Year Intake", val: "January / February" }
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
                  <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-4 font-bold text-sm">Year</th>
                          <th className="p-4 font-bold text-sm">Tuition & Admission Fees</th>
                          <th className="p-4 font-bold text-sm">Hostel & Food Charges</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { year: "1st Year (Admission)", fee: "$15,000 USD (Approx. ₹12.5L)", hostel: "Included in Admission" },
                          { year: "2nd Year", fee: "$6,000 USD (Approx. ₹5.0L)", hostel: "$1,200 USD/Year" },
                          { year: "3rd Year", fee: "$6,000 USD (Approx. ₹5.0L)", hostel: "$1,200 USD/Year" },
                          { year: "4th Year", fee: "$6,000 USD (Approx. ₹5.0L)", hostel: "$1,200 USD/Year" },
                          { year: "5th Year", fee: "$6,000 USD (Approx. ₹5.0L)", hostel: "$1,200 USD/Year" }
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                            <td className="p-4 text-sm font-semibold text-slate-800">{row.year}</td>
                            <td className="p-4 text-sm font-bold text-emerald-600">{row.fee}</td>
                            <td className="p-4 text-sm text-slate-600">{row.hostel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    * Fees structures are approximate and subject to revision by the college management and official directives.
                  </p>
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
                  <h3 className="text-xl font-bold text-slate-900">Standard Eligibility Guidelines for Indian Students</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { title: "NEET Exam", desc: "Must qualify the NEET-UG exam of the current academic year." },
                      { title: "Age Requirement", desc: "Minimum 17 years of age on or before December 31st of the admission year." },
                      { title: "10+2 Subjects", desc: "Completed 10+2 with Physics, Chemistry, Biology, and English." },
                      { title: "GPA Metrics", desc: "Minimum GPA of 7.0 combined in SSC (10th) and HSC (12th), with a minimum GPA of 3.5 in Biology." }
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
                      { step: "Step 1: Document Verification", desc: "Submit class 10th & 12th marksheets, passport, and NEET scorecard for equivalency certificate processing by the DGHS." },
                      { step: "Step 2: Booking Seat", desc: "Pay the booking amount to reserve your seat and secure your official offer letter from the college." },
                      { step: "Step 3: Visa Clearance", desc: "Apply for a Student Visa (Category FS) at the nearest Bangladesh Embassy/High Commission." },
                      { step: "Step 4: College Joining", desc: "Report to the college campus, complete registration, pay the remaining first-year fee, and join classes." }
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

          {/* Hospital & Practical Training Section */}
          <motion.section {...fadeInUp} id="hospital" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartPulse className="text-emerald-600 w-8 h-8" /> Teaching Hospital & Clinical Training
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The attached **Popular Medical College Hospital** is an ultra-modern multi-specialty tertiary care hospital with over 500 beds. Because it is located in a densely populated commercial area of Dhanmondi, it registers a very high daily outpatient flow (OPD). This provides students with an abundance of practical clinical cases during their internal rotations.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <h4 className="text-3xl font-black text-emerald-600">500+</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Active Hospital Beds</p>
                </div>
                <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <h4 className="text-3xl font-black text-emerald-600">1,200+</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Daily Outpatients</p>
                </div>
                <div className="text-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <h4 className="text-3xl font-black text-emerald-600">24/7</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Emergency Trauma Care</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Hostel & Student Life Section */}
          <motion.section {...fadeInUp} id="hostel" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Home className="text-emerald-600 w-8 h-8" /> Hostel & Student Life
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-lg">Safe & Secure Hostels</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Excellent hostel facilities are situated near the campus with full-time security guards and surveillance systems. Rooms are clean, well-aerated, and available on double or triple-sharing basis.
                </p>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-lg">Dining & Dietary Options</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hostel messes serve both local Bengali and nutritious North/South Indian vegetarian and non-vegetarian food. Standard mineral water and high sanitation measures are implemented.
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
                    aria-label="Previous college card"
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <button 
                    onClick={handleNext}
                    aria-label="Next college card"
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
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                        {relatedColleges[carouselIndex].location}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{relatedColleges[carouselIndex].name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        Established in {relatedColleges[carouselIndex].established || 'N/A'}, affiliated with {relatedColleges[carouselIndex].affiliatedUniversity || 'N/A'}. Offers premium medical packages with strong clinical platforms.
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
                    aria-label={`Go to slide ${idx + 1}`}
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
              <p className="text-xs text-slate-500">Book your seat for the current session. Seats are strictly limited under foreign quota.</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Program:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">MBBS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Intake Session:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">2026</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Total Course:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">6 Years</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b0011"
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
            Get personalized guidance, document evaluation, and step-by-step assistance from our counselors.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/application/64b1f1a8e2b8f84d6c7b0011"
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
