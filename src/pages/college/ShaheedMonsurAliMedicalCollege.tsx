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
  ShieldCheck,
  Lightbulb,
  Briefcase,
  Layers,
  FlaskConical,
  Microscope,
  Stethoscope,
  Mail,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import logoDhakaNational from '../../assets/logo/Dhaka National Medical College.png';
import { colleges } from '../../components/data/CollegesCard';

import campusImg from '../../assets/colleges/shaheed-monsur-ali-medical-college.jpg';

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

export default function ShaheedMonsurAliMedicalCollege() {
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
    document.title = "Shaheed Monsur Ali Medical College (SMAMCH) | MBBS in Bangladesh";
    
    // Description Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Study MBBS at Shaheed Monsur Ali Medical College & Hospital (SMAMCH), Uttara, Dhaka. Affiliated with Dhaka University, listed in WDOMS.');

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Shaheed Monsur Ali Medical College | MBBS in Bangladesh' },
      { property: 'og:description', content: 'Study MBBS at Shaheed Monsur Ali Medical College & Hospital, Uttara, Dhaka.' },
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
    "name": "Shaheed Monsur Ali Medical College & Hospital",
    "alternateName": "SMAMCH",
    "url": window.location.href,
    "logo": `${window.location.origin}/Dhaka%20National%20Medical%20College.png`,
    "description": "Shaheed Monsur Ali Medical College & Hospital (SMAMCH) is a premium private medical college located in Uttara, Dhaka, Bangladesh, offering WDOMS-listed MBBS courses.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot# 26 & 28, Road# 10, Sector# 11, Uttara",
      "addressLocality": "Dhaka",
      "postalCode": "1230",
      "addressCountry": "BD"
    },
    "founder": {
      "@type": "Person",
      "name": "Shaheed Captain M. Monsur Ali"
    },
    "foundingDate": "1994",
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

  // Find related colleges (excluding Shaheed Monsur Ali itself)
  const relatedColleges = colleges.filter(c => c.id !== '64b1f1a8e2b8f84d6c7b0023');

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
      q: "Is Shaheed Monsur Ali Medical College listed in the World Directory of Medical Schools (WDOMS)?",
      a: "Yes, Shaheed Monsur Ali Medical College (SMAMCH) is listed in the World Directory of Medical Schools (WDOMS). This validates the degree globally and allows graduates to sit for international examinations such as USMLE and PLAB."
    },
    {
      q: "What is the NMC eligibility status for Indian students at SMAMCH?",
      a: "Graduates are eligible under current National Medical Commission (India) regulations, subject to applicable NMC rules. This allows them to sit for the FMGE/NExT licensing exams in India."
    },
    {
      q: "Which university is the college affiliated with?",
      a: "The college is affiliated with the University of Dhaka, which supervises all exam parameters, academic frameworks, and final degrees."
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
          <span className="text-slate-800" aria-current="page">Shaheed Monsur Ali Medical College</span>
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
              <Award className="w-4 h-4" /> Listed in the WDOMS Directory
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            >
              Shaheed Monsur Ali <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Medical College (SMAMCH)</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-lg leading-relaxed max-w-xl"
            >
              Located in Uttara, Dhaka, Bangladesh. Eligible under the current National Medical Commission (India) regulations, subject to applicable NMC rules.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link 
                to="/application/64b1f1a8e2b8f84d6c7b0023"
                aria-label="Apply Online Now"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.03] transition duration-300 text-center"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                aria-label="Download College Brochure"
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
                alt="Shaheed Monsur Ali Medical College Campus" 
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center gap-3">
                  <img src={logoDhakaNational} alt="College Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1.5" />
                  <div>
                    <h3 className="font-bold text-white">Shaheed Monsur Ali</h3>
                    <p className="text-xs text-slate-300">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Quick Facts Section */}
      <section className="relative z-10 -mt-10 px-5 max-w-7xl mx-auto" aria-label="Quick Facts">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {[
            { label: "Established", value: "1994", icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Location", value: "Uttara, Dhaka", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Affiliation", value: "University of Dhaka", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Accredited by", value: "BMDC & WDOMS Listed", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Type", value: "Private", icon: Building, color: "text-pink-500", bg: "bg-pink-50" },
            { label: "Teaching Hospital", value: "SMAMCH Hospital", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" }
          ].map((fact, i) => {
            const Icon = fact.icon;
            return (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300"
              >
                <div className={`w-10 h-10 ${fact.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${fact.color}`} aria-hidden="true" />
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
          
          {/* 4. Principal's Message */}
          <motion.section {...fadeInUp} id="principal" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <UserCheck className="text-emerald-600 w-8 h-8" /> Principal's Message
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="border-l-4 border-emerald-600 pl-4 italic text-slate-500">
                "Welcome to Shaheed Monsur Ali Medical College. Our institution is dedicated to fostering excellence in medical education and healthcare services. We prepare medical students to meet the challenges of modern clinical practice with empathy, dedication, and cutting-edge medical science knowledge."
              </div>
              <p className="text-sm font-bold text-slate-700 text-right">- Principal, Shaheed Monsur Ali Medical College</p>
            </div>
          </motion.section>

          {/* 5. About the College */}
          <motion.section {...fadeInUp} id="about" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-emerald-600 w-8 h-8" /> About the College
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Shaheed Monsur Ali Medical College & Hospital (SMAMCH) is a premier private medical college located in Uttara, Dhaka, Bangladesh. The college is dedicated to providing standard medical education, medical lectures, and comprehensive clinical training.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Affiliated with the University of Dhaka and accredited by the BMDC, the college offers students a quiet, highly focused, and modern environment to pursue medical sciences.
              </p>
            </div>
          </motion.section>

          {/* 6. College History */}
          <motion.section {...fadeInUp} id="history" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Calendar className="text-emerald-600 w-8 h-8" /> College History
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Founded in 1994, the college was established under the leadership of dedicated medical pioneers and named after Shaheed Captain M. Monsur Ali, a prominent national leader. Over the past three decades, SMAMCH has expanded its academic buildings and clinical departments to become a respected name in medical training.
              </p>
            </div>
          </motion.section>

          {/* 7. Why Choose Shaheed Monsur Ali Medical College & Hospital */}
          <motion.section {...fadeInUp} id="why-choose" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-emerald-600 w-8 h-8" /> Why Choose This College
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Prime Location", desc: "Located in Uttara, one of the most planned and secure metropolitan hubs in Dhaka, offering excellent transportation and living comfort." },
                { title: "Legacy & Trust", desc: "Established in 1994, SMAMCH holds a decades-long heritage of training competent global medical professionals." },
                { title: "Dhaka University Affiliation", desc: "Degrees are granted by the University of Dhaka, ensuring prestigious, highly recognized academic qualifications." },
                { title: "Hands-on Clinical Rotation", desc: "Extensive practical clinical rotations at the on-campus multi-specialty Shaheed Monsur Ali Hospital." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 8. MBBS Program Overview */}
          <motion.section {...fadeInUp} id="overview" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Clock className="text-emerald-600 w-8 h-8" /> MBBS Program Overview
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The MBBS course duration is 5 years followed by 1 year of compulsory rotating internship. The program is taught entirely in English, following the national medical curriculum guidelines established by the University of Dhaka and BMDC.
              </p>
            </div>
          </motion.section>

          {/* 9. Academic Departments */}
          <motion.section {...fadeInUp} id="departments" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Layers className="text-emerald-600 w-8 h-8" /> Academic Departments
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: "Pre-Clinical Phase", desc: "Anatomy, Physiology, Biochemistry departments focused on building basic medical terminology and structures.", icon: FlaskConical },
                { title: "Para-Clinical Phase", desc: "Pharmacology, Pathology, Microbiology, and Forensic Medicine departments mapping clinical pathways.", icon: Microscope },
                { title: "Clinical Rotations", desc: "General Surgery, Pediatrics, Internal Medicine, Gynecology, and Orthopedics practical departments.", icon: Stethoscope }
              ].map((dept, idx) => {
                const Icon = dept.icon;
                return (
                  <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{dept.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{dept.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* 10. Teaching Hospital & Clinical Training */}
          <motion.section {...fadeInUp} id="hospital" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartPulse className="text-emerald-600 w-8 h-8" /> Teaching Hospital & Clinical Training
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The attached **Shaheed Monsur Ali Medical College Hospital** is an active, multi-specialty teaching hospital. Located in Uttara, Dhaka, the hospital serves a large metropolitan referral population, offering students exceptional clinical training opportunities during clinical clerkships.
              </p>
            </div>
          </motion.section>

          {/* 11. Campus Overview */}
          <motion.section {...fadeInUp} id="campus" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Building className="text-emerald-600 w-8 h-8" /> Campus Overview
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The college features integrated academic blocks, administrative zones, lecture halls, and separate hostelry units, providing a complete campus experience for student and teacher communities.
              </p>
            </div>
          </motion.section>

          {/* 12. Library */}
          <motion.section {...fadeInUp} id="library" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-emerald-600 w-8 h-8" /> Library
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The **Central Library** at SMAMCH houses thousands of medical text collections, global medical journals, and digital medical reference volumes. Internet access is provided inside computer zones, giving students immediate access to scientific publications and e-libraries.
              </p>
            </div>
          </motion.section>

          {/* 13. Laboratories */}
          <motion.section {...fadeInUp} id="laboratories" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <FlaskConical className="text-emerald-600 w-8 h-8" /> Laboratories
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                The labs are equipped with high-quality instruments for physiology, biochemistry, pathology, and microbiology experiments, promoting practical learning.
              </p>
            </div>
          </motion.section>

          {/* 14. Hostel & Accommodation */}
          <motion.section {...fadeInUp} id="hostel" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Home className="text-emerald-600 w-8 h-8" /> Hostel & Accommodation
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-lg">Safe Hostels</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clean, well-furnished dormitories with single, double, or triple occupant choices are located near the college campus in Uttara, Dhaka. Hostels feature 24/7 security desks and digital surveillance.
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

          {/* 15. Student Life */}
          <motion.section {...fadeInUp} id="student-life" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Users className="text-emerald-600 w-8 h-8" /> Student Life
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Student life at SMAMCH is dynamic, containing regular athletic championships, cultural events, debate club sessions, and public health checkup camps organized by voluntary groups.
              </p>
            </div>
          </motion.section>

          {/* 16. Campus Gallery */}
          <motion.section {...fadeInUp} id="gallery" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Layers className="text-emerald-600 w-8 h-8" /> Campus Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-slate-200 rounded-xl overflow-hidden shadow hover:scale-[1.02] transition duration-300">
                  <img src={campusImg} alt={`Gallery grid item ${item}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.section>

          {/* 17. Recognition & Accreditation */}
          <motion.section {...fadeInUp} id="recognition" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Award className="text-emerald-600 w-8 h-8" /> Recognition & Accreditation
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                - Recognized by the Bangladesh Medical & Dental Council (BMDC)<br />
                - Affiliated with the University of Dhaka<br />
                - Listed in the World Directory of Medical Schools (WDOMS)
              </p>
            </div>
          </motion.section>

          {/* 18. Admission Process */}
          <motion.section {...fadeInUp} id="admission" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Clock className="text-emerald-600 w-8 h-8" /> Admission Process
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="relative pl-6 border-l-2 border-emerald-500 space-y-6">
                {[
                  { step: "Step 1: Application Submission", desc: "Submit verification copies of transcripts, passport, and NEET details to compile the eligibility portfolio." },
                  { step: "Step 2: Equivalency Evaluation", desc: "Evaluation of the high school credentials by the Ministry of Foreign Affairs/DGHS of Bangladesh." },
                  { step: "Step 3: Admission Acceptance", desc: "Pay the seat booking fee to obtain the confirmed admission letter from SMAMCH." },
                  { step: "Step 4: Visa & Arrival", desc: "Submit visa application under student category, finalize boarding, and report to the Uttara campus." }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow" />
                    <h4 className="font-bold text-sm text-slate-800">{item.step}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 19. Eligibility Criteria */}
          <motion.section {...fadeInUp} id="eligibility" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <CheckCircle className="text-emerald-600 w-8 h-8" /> Eligibility Criteria
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
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
            </div>
          </motion.section>

          {/* 20. Required Documents */}
          <motion.section {...fadeInUp} id="documents" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <FileText className="text-emerald-600 w-8 h-8" /> Required Documents
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "10th & 12th Marks Sheets & Pass Certificates",
                  "NEET Qualified Scorecard of current year",
                  "Valid Passport with minimum 6 months validity",
                  "Passport size photographs (White background)",
                  "Medical Clearance and Fitness Certificate"
                ].map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* 21. Fee Information */}
          <motion.section {...fadeInUp} id="fees" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Activity className="text-emerald-600 w-8 h-8" /> Fee Information
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm text-center">
              <p className="text-slate-600 font-semibold">Please contact our counselors to get the latest, verified fee structure for the current academic session.</p>
              <button 
                onClick={handleConsultTrigger}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition cursor-pointer"
              >
                Contact for Latest Fees <PhoneCall className="w-4 h-4" />
              </button>
            </div>
          </motion.section>

          {/* 22. Frequently Asked Questions */}
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

          {/* 23. Related Medical Colleges Carousel */}
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

          {/* 24. Contact Information */}
          <motion.section {...fadeInUp} id="contact" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <MapPin className="text-emerald-600 w-8 h-8" /> Contact Information
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">College Address</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Plot# 26 & 28, Road# 10, Sector# 11, Uttara, Dhaka-1230, Bangladesh
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
                to="/application/64b1f1a8e2b8f84d6c7b0023"
                aria-label="Apply to Shaheed Monsur Ali Medical College"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                aria-label="Request callback from counselors"
                className="flex items-center justify-center gap-2 w-full border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" /> Request Call Back
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* 25. Apply Now CTA Banner */}
      <section className="bg-slate-900 text-white py-20 px-5 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-900 to-slate-900 z-0" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Begin Your Medical Career?</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Contact our advisors for equivalency calculations, offer letter processing, and student visa support.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/application/64b1f1a8e2b8f84d6c7b0023"
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
