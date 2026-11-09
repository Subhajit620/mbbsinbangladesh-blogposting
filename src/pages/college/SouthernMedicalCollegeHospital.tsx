import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
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
  ChevronLeft,
  School,
  Stethoscope,
  BadgeCheck,
  ShieldCheck,
  Layers,
  Globe,
  Mail,
  UserCheck,
  Utensils,
  BookOpenCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import logoSouthernMedical from '../../assets/logo/SMMC.png';
import campusImg from '../../assets/colleges/southern-medical.jpg';
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

export default function SouthernMedicalCollegeHospital() {
  const [activeTab, setActiveTab] = useState<'fees' | 'eligibility' | 'process'>('fees');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sidebarCarouselIndex, setSidebarCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Scroll Progress Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Dynamic SEO Setup & Metadata Updates
  useEffect(() => {
    document.title = "Southern Medical College & Hospital (SMCH) | MBBS in Bangladesh";
    
    // Description Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Study MBBS at Southern Medical College & Hospital (SMCH), Chattogram, Bangladesh. Affiliated with Chittagong Medical University, recognized by BMDC & WDOMS.');

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Southern Medical College & Hospital | MBBS in Bangladesh' },
      { property: 'og:description', content: 'Study MBBS at Southern Medical College & Hospital, Chattogram. Affiliated with CMU, WDOMS listed.' },
      { property: 'og:image', content: campusImg },
      { property: 'og:type', content: 'website' }
    ];

    ogTags.forEach(tag => {
      let ogMeta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', tag.property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', tag.content);
    });
  }, []);

  // Structured Data Schema JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Southern Medical College & Hospital",
    "alternateName": "SMCH",
    "url": window.location.href,
    "logo": `${window.location.origin}/SMMC.png`,
    "description": "Southern Medical College & Hospital (SMCH) is a premium private medical college located in East Nasirabad, Khulshi, Chattogram, Bangladesh, offering WDOMS-listed MBBS courses.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "East Nasirabad, Khulshi",
      "addressLocality": "Chattogram",
      "addressCountry": "BD"
    },
    "founder": {
      "@type": "Person",
      "name": "Southern Medical College Trust"
    },
    "foundingDate": "2005",
    "alumni": {
      "@type": "EducationalAudience",
      "educationalRole": "Medical Student"
    }
  };

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

  // Find related colleges (excluding Southern itself)
  const relatedColleges = colleges.filter(c => c.id !== '64b1f1a8e2b8f84d6c7b002e');

  // Auto-play interval for main carousel
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % relatedColleges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered, relatedColleges.length]);

  // Auto-play interval for sidebar carousel
  useEffect(() => {
    if (isSidebarHovered) return;
    const interval = setInterval(() => {
      setSidebarCarouselIndex((prev) => (prev + 1) % relatedColleges.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSidebarHovered, relatedColleges.length]);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + relatedColleges.length) % relatedColleges.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % relatedColleges.length);
  };

  const faqs = [
    {
      q: "Is Southern Medical College & Hospital listed in the World Directory of Medical Schools (WDOMS)?",
      a: "Yes, Southern Medical College & Hospital (SMCH) is officially listed in the World Directory of Medical Schools (WDOMS). This enables graduates to register for licensing exams globally, including the USMLE and PLAB."
    },
    {
      q: "Is Southern Medical College suitable for Indian students?",
      a: "Yes, SMCH is highly suitable for Indian students. The curriculum is taught entirely in English, matches standard South Asian demographics, and fulfills all current NMC guidelines for studying MBBS abroad, allowing graduates to appear for the FMGE/NExT screening test."
    },
    {
      q: "Which university is Southern Medical College affiliated with?",
      a: "Southern Medical College & Hospital is affiliated with Chittagong Medical University (CMU), Chattogram. All final MBBS examinations and professional degrees are regulated and awarded under CMU."
    },
    {
      q: "What is the MBBS course duration at SMCH?",
      a: "The MBBS course duration is 5 years of academic study divided into 4 phases, followed by a compulsory 1-year clinical internship in the attached Southern Medical College Hospital."
    },
    {
      q: "What is the medium of instruction?",
      a: "The medium of instruction for all classes, examinations, and laboratory experiments is English."
    },
    {
      q: "Are hostel facilities available for international students?",
      a: "Yes, SMCH offers separate, fully-furnished hostels for male and female international students. The hostels have 24/7 security desks, dining facilities providing South Asian cuisine, and high-speed internet."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white pt-20">
      <Navbar />

      {/* Inject Structured Data Schema.org JSON-LD */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} 
      />

      {/* Floating Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top of the page"
            className="fixed right-5 bottom-28 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-slate-100/80 border-b border-slate-200/50 py-3.5 px-5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <span>/</span>
          <Link to="/colleges" className="hover:text-emerald-600 transition">Colleges</Link>
          <span>/</span>
          <span className="text-slate-800" aria-current="page">Southern Medical College</span>
        </div>
      </nav>

      {/* 2. Hero Banner */}
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
              <Award className="w-4 h-4" /> Listed in WDOMS Directory
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            >
              Southern Medical <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">College & Hospital (SMCH)</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-lg leading-relaxed max-w-xl"
            >
              Excellence in Medical Education & Healthcare services since 2005. Study at the heart of Chattogram under standard South Asian clinical frameworks.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={handleConsultTrigger}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={handleConsultTrigger}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3.5 px-7 rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                Download Brochure
              </button>
            </motion.div>
          </div>

          {/* Hero Banner Visual Panel */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-slate-700"
            >
              <img 
                src={campusImg} 
                alt="Southern Medical College & Hospital Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <img 
                  src={logoSouthernMedical} 
                  alt="SMCH Logo" 
                  className="w-14 h-14 bg-white rounded-2xl p-1.5 object-contain shadow-lg"
                />
                <div>
                  <p className="text-white font-black text-sm tracking-wide">SMCH Chattogram</p>
                  <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> East Nasirabad, Khulshi, BD
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-5 py-12 grid lg:grid-cols-12 gap-8">
        
        {/* Left Primary Details Section */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Quick Facts Section */}
          <motion.section 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { icon: Calendar, label: "Established", val: "2005" },
              { icon: MapPin, label: "Location", val: "East Nasirabad, BD" },
              { icon: School, label: "College Type", val: "Private College" },
              { icon: Building, label: "Affiliation", val: "Chittagong Medical Univ." },
              { icon: Stethoscope, label: "Teaching Hospital", val: "Southern Medical Hosp." },
              { icon: Clock, label: "MBBS Term", val: "5 Years + 1-Year Intern" }
            ].map((fact, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className="bg-emerald-50 p-3 rounded-xl shrink-0">
                  <fact.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">{fact.label}</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 leading-snug">{fact.val}</p>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* 4. About Southern Medical College & Hospital */}
          <motion.section {...fadeInUp} id="about" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <School className="text-emerald-600 w-8 h-8" /> About Southern Medical College & Hospital
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 leading-relaxed text-slate-600 text-sm md:text-base">
              <p>
                Southern Medical College & Hospital (SMCH) was established in 2005 with the vision of providing high-quality medical education and healthcare services. Located at East Nasirabad, Khulshi, in the city of Chattogram, the college offers a secure and academic atmosphere conducive to medical education.
              </p>
              <p>
                Approved by the Ministry of Health and Family Welfare (Bangladesh) and recognized by the Bangladesh Medical & Dental Council (BMDC), SMCH is affiliated with Chittagong Medical University. The college has dedicated itself to producing skilled, competent, and socially responsible doctors who can contribute to global healthcare standards.
              </p>
              <p>
                Through a robust clinical training platform hosted in the modern, multi-specialty Southern Medical College Hospital, medical students translate their theoretical classroom learning into real-world medical practices under the supervision of leading senior specialists in the country.
              </p>
            </div>
          </motion.section>

          {/* 5. Why Choose Southern Medical College & Hospital */}
          <motion.section {...fadeInUp} id="why-choose" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BadgeCheck className="text-emerald-600 w-8 h-8" /> Why Choose Southern Medical College & Hospital
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Experienced Faculty", desc: "Learn from highly experienced, specialized professors and medical scholars committed to mentorship." },
                { title: "English Medium MBBS", desc: "The entire MBBS program is taught in English, following global curriculum guidelines." },
                { title: "Strong Clinical Exposure", desc: "Gain clinical hands-on experience through the multi-specialty teaching hospital on campus." },
                { title: "Modern Laboratories", desc: "Equipped with state-of-the-art histopathology, physiology, and pathology laboratory stations." },
                { title: "Digitalized Library", desc: "Access thousands of medical books, foreign journals, reference manuals, and e-learning resources." },
                { title: "International Student Support", desc: "Dedicated international student desk to assist with documentation, security, and accommodation." }
              ].map((feat, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition">
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl mt-1 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{feat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 6. MBBS Highlights */}
          <motion.section {...fadeInUp} id="highlights" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Layers className="text-emerald-600 w-8 h-8" /> MBBS Program Highlights
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { key: "Course Offered", val: "MBBS (Bachelor of Medicine & Bachelor of Surgery)" },
                    { key: "Course Duration", val: "5 Years + 1-Year Compulsory Internship" },
                    { key: "Language of Study", val: "English" },
                    { key: "University Affiliation", val: "Chittagong Medical University" },
                    { key: "Accreditation", val: "BMDC Accredited & WDOMS Listed" },
                    { key: "Teaching Hospital", val: "Southern Medical College Hospital" },
                    { key: "Admission Intake", val: "January / February Session" }
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
                      Request Latest Fee Structure
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
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-3">
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Academic Qualifications</h4>
                      <ul className="space-y-2.5 text-xs text-slate-500 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Must have completed Class 12 / Higher Secondary (10+2 scheme) with Science.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Minimum aggregate GPA requirements in SSC and HSC as defined by the DGHS.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Mandatory high scores in Biology, Chemistry, and Physics.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-3">
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">NMC & NEET Eligibility</h4>
                      <ul className="space-y-2.5 text-xs text-slate-500 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Indian national applicants must possess a qualifying NEET scorecard for the admission session.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Meets the requirements under standard NMC criteria for foreign MBBS eligibility.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Valid passport with at least 6 months validity at the time of visa application.</span>
                        </li>
                      </ul>
                    </div>
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
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-8"
                >
                  <div className="relative border-l border-slate-200 ml-4 md:ml-6 space-y-8">
                    {[
                      { step: "Step 1", title: "Online Registration", desc: "Submit your academic credentials and clear pre-verification checklists." },
                      { step: "Step 2", title: "Document Submission", desc: "Upload transcripts, passport copies, physical fitness clearances, and photo cards." },
                      { step: "Step 3", title: "Eligibility Assessment", desc: "DGHS credentials verification and issuance of the official Offer Letter." },
                      { step: "Step 4", title: "Enrollment & Fee Clearance", desc: "Confirm your seat by transferring the required initial registration fees." },
                      { step: "Step 5", title: "Student Visa Endorsement", desc: "Complete visa verification interviews and secure travel clearance." }
                    ].map((item, idx) => (
                      <div key={idx} className="relative pl-8 md:pl-10">
                        <div className="absolute -left-[11px] top-1.5 w-[22px] h-[22px] bg-emerald-600 rounded-full border-4 border-white shadow" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.step}</span>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base mt-0.5">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 7. Required Documents */}
          <motion.section {...fadeInUp} id="documents" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <FileText className="text-emerald-600 w-8 h-8" /> Required Documents
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm grid sm:grid-cols-2 gap-4">
              {[
                "Certified copies of Class 10/12 Transcripts and Certificates",
                "Equivalent certificates from Bangladesh DGHS & Ministry of Foreign Affairs",
                "Valid International Passport copy (at least 6 months validity)",
                "Recently captured passport-size color photographs (white background)",
                "Medical fitness certificate signed by a registered practitioner",
                "NEET (India) qualifying scorecard (mandatory for Indian citizens)",
                "Declaration of sponsorship and bank statement of sponsor"
              ].map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-600 text-xs md:text-sm leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 8. Hostel & Accommodation */}
          <motion.section {...fadeInUp} id="hostel" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Home className="text-emerald-600 w-8 h-8" /> Hostel & Accommodation
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Secure Living Quarters</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Separate hostels for boys and girls on or near the college premises. Rooms are fully furnished with study tables, beds, and spacious storage. Facilities include round-the-clock power backup, high-speed Wi-Fi, and 24/7 security watch.
                </p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Dining & Meals</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The hostel dining hall serves hygienic, nutritious food designed to accommodate the culinary preferences of South Asian and Indian students. Dedicated kitchen staff ensure clean, high-standard food preparation daily.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 9. Campus Facilities */}
          <motion.section {...fadeInUp} id="facilities" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Building className="text-emerald-600 w-8 h-8" /> Campus Facilities
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "Modern Lecture Halls", desc: "Air-conditioned classrooms equipped with projection arrays and modern audio visual systems." },
                { title: "Advanced Laboratories", desc: "Fully-stocked labs for practical sessions in anatomy, biochemistry, pathology, and microbiology." },
                { title: "Digital Library", desc: "Access to thousands of reference books, foreign medical journals, and digital medical databases." }
              ].map((fac, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center space-y-3 hover:shadow-md transition">
                  <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center mx-auto">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{fac.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{fac.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 10. Teaching Hospital & Clinical Training */}
          <motion.section {...fadeInUp} id="hospital" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartPulse className="text-emerald-600 w-8 h-8" /> Teaching Hospital & Clinical Training
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 leading-relaxed text-slate-600 text-sm md:text-base">
              <p>
                Clinical instruction at Southern Medical College & Hospital is anchored in the **Southern Medical College Hospital**. The tertiary-care hospital is equipped with modern diagnostic facilities, emergency trauma centers, and intensive care units.
              </p>
              <p>
                Students participate in clinical rotations starting in their third year, gaining clinical exposure across essential departments including Internal Medicine, General Surgery, Obstetrics & Gynecology, Pediatrics, and Orthopedics.
              </p>
              <p>
                With high daily patient footfall, students gain hands-on clinical training, helping them develop essential clinical skills and confidence for their future careers.
              </p>
            </div>
          </motion.section>

          {/* 11. Student Life */}
          <motion.section {...fadeInUp} id="student-life" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Users className="text-emerald-600 w-8 h-8" /> Student Life
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 leading-relaxed text-slate-600 text-sm md:text-base">
              <p>
                Life at Southern Medical College & Hospital extends beyond the classrooms and laboratories. The campus fosters a vibrant student community where cultural festivals, national medical seminars, sports events, and debate forums are organized regularly.
              </p>
              <p>
                With a growing international student community, the college provides a welcoming environment that respects diverse cultures and celebrations. Hostels and recreational zones offer spaces for students to build lifelong friendships and professional networks.
              </p>
            </div>
          </motion.section>

          {/* 12. Recognition & Accreditation */}
          <motion.section {...fadeInUp} id="recognition" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Award className="text-emerald-600 w-8 h-8" /> Recognition & Accreditation
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "BMDC", desc: "Recognized by the Bangladesh Medical & Dental Council." },
                { title: "WDOMS", desc: "Listed in the World Directory of Medical Schools." },
                { title: "CMU Affiliation", desc: "Affiliated with Chittagong Medical University." },
                { title: "NMC compliant", desc: "Fulfills standard criteria for Indian medical licensing exams." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm text-center space-y-2">
                  <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xs md:text-sm">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 13. Frequently Asked Questions */}
          <motion.section {...fadeInUp} id="faqs" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BookOpenCheck className="text-emerald-600 w-8 h-8" /> Frequently Asked Questions
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

          {/* 14. Related Medical Colleges Carousel */}
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
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      carouselIndex === idx ? 'bg-emerald-600 w-6' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>

          {/* 15. Contact Information */}
          <motion.section {...fadeInUp} id="contact" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <MapPin className="text-emerald-600 w-8 h-8" /> Contact Information
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">College Address</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  East Nasirabad, Khulshi, Chattogram, Bangladesh
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Contact College Registry Office</span>
                </div>
              </div>
              <div className="aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                Map Integration Placeholder
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

            {/* Sidebar Related Colleges mini Slider */}
            <div 
              className="border-t border-slate-100 pt-4 space-y-3.5 overflow-hidden relative"
              onMouseEnter={() => setIsSidebarHovered(true)}
              onMouseLeave={() => setIsSidebarHovered(false)}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Highlights</p>
              <div className="relative min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sidebarCarouselIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{relatedColleges[sidebarCarouselIndex].name}</h4>
                    <p className="text-[10px] text-slate-400">{relatedColleges[sidebarCarouselIndex].location}</p>
                    <Link 
                      to={`/college/${relatedColleges[sidebarCarouselIndex].slug}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline"
                    >
                      Quick View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b002e"
                aria-label="Apply to Southern Medical College & Hospital"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                className="flex items-center justify-center gap-2 w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-4 rounded-xl transition cursor-pointer"
              >
                Download Brochure <Download className="w-4 h-4" />
              </button>
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow transition"
              >
                <PhoneCall className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </aside>

      </div>

      {/* 16. Call To Action Section */}
      <section className="bg-slate-900 text-white py-16 px-5 relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900 z-0" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Begin Your Medical Career?</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Get comprehensive admission counseling, eligibility assessments, document verification, offer letter assistance, and student visa processing guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button 
              onClick={handleConsultTrigger}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition cursor-pointer"
            >
              Apply Now
            </button>
            <button 
              onClick={handleConsultTrigger}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3.5 px-8 rounded-xl shadow-lg transition cursor-pointer"
            >
              Contact Counselors
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
