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
import logoMainamoti from '../../assets/logo/Mainmoti2.png';
import campusImg from '../../assets/colleges/mainamoti-medical-new.jpg';
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

export default function MainamotiMedicalCollege() {
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
    document.title = "Mainamoti Medical College | MBBS in Bangladesh";
    
    // Description Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Study MBBS at Mainamoti Medical College, Cumilla, Bangladesh. Affiliated with Chittagong Medical University, recognized by BMDC & WDOMS.');

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Mainamoti Medical College | MBBS in Bangladesh' },
      { property: 'og:description', content: 'Study MBBS at Mainamoti Medical College. Affiliated with CMU, WDOMS listed.' },
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
    "name": "Mainamoti Medical College",
    "alternateName": "MMMCH",
    "url": window.location.href,
    "logo": `${window.location.origin}/Mainmoti2.png`,
    "description": "Mainamoti Medical College (also recorded as Moinamoti Medical College) is a premium private medical college located in Barapara, Cumilla, Bangladesh, offering WDOMS-listed MBBS courses.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Barapara, Chapapur, Union-6, Jagannathpur",
      "addressLocality": "Cumilla",
      "addressCountry": "BD"
    },
    "founder": {
      "@type": "Person",
      "name": "Mainamoti Trust"
    },
    "foundingDate": "2011",
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

  // Find related colleges (excluding Mainamoti itself)
  const relatedColleges = colleges.filter(c => c.id !== '64b1f1a8e2b8f84d6c7b0029');

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
      q: "Is Mainamoti Medical College recognized by BMDC?",
      a: "Mainamoti Medical College appears in the updated Bangladesh Medical & Dental Council list of non-government medical colleges under Chittagong Medical University."
    },
    {
      q: "Is Mainamoti Medical College listed in WDOMS?",
      a: "Multiple medical-education directories report that the college is listed in the World Directory of Medical Schools. Applicants should verify the current entry directly through the WDOMS search portal before admission. WDOMS also states that directory listing does not itself represent accreditation or endorsement."
    },
    {
      q: "Which university is Mainamoti Medical College affiliated with?",
      a: "The college is currently listed under Chittagong Medical University. It was previously associated with the University of Chittagong before the relevant medical-university affiliation system became operational."
    },
    {
      q: "When was Mainamoti Medical College established?",
      a: "The college was established in 2011. The DGME records its first Ministry of Health and Family Welfare approval date as 27 December 2011."
    },
    {
      q: "Where is Mainamoti Medical College located?",
      a: "The college is located at Barapara, Chapapur, Union-6, Jagannathpur, Cumilla, Bangladesh. BMDC also records its location as Cumilla, historically spelled Comilla."
    },
    {
      q: "What is the duration of the MBBS programme?",
      a: "The standard programme consists of five academic years followed by a one-year compulsory internship."
    },
    {
      q: "What is the medium of instruction?",
      a: "English is generally used for academic instruction, examinations and medical textbooks. Students also benefit from learning basic Bengali for effective communication with patients during clinical training."
    },
    {
      q: "How many MBBS seats are available?",
      a: "The Bangladesh DGME institutional profile records a present enrolment capacity of 100 seats. The number of seats available to foreign students may be considerably smaller and is determined separately."
    },
    {
      q: "Is NEET mandatory for Indian students?",
      a: "Indian citizens planning to obtain medical registration in India after completing an MBBS degree abroad must satisfy the applicable NEET and NMC requirements. Students should check the latest official NMC advisory before admission."
    },
    {
      q: "Does the college have an attached teaching hospital?",
      a: "Yes. The DGME profile records that the medical college and hospital are situated on the same campus."
    },
    {
      q: "Is hostel accommodation available?",
      a: "Hostel accommodation is commonly reported for students, but availability, room category and charges should be verified before confirming admission."
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
          <span className="text-slate-800" aria-current="page">Mainamoti Medical College</span>
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
              Mainamoti <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Medical College</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl"
            >
              Build your medical career in Cumilla, Bangladesh, at a private medical college offering an English-medium MBBS programme with an attached teaching hospital.
            </motion.p>
            <p className="text-[11px] text-slate-400 max-w-xl leading-relaxed">
              Indian students must satisfy the prevailing National Medical Commission regulations, NEET requirements and other applicable foreign medical graduate rules before taking admission. NMC regulations require, among other conditions, a foreign medical programme of at least 54 months followed by an internship of at least 12 months.
            </p>

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
                alt="Mainamoti Medical College Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <img 
                  src={logoMainamoti} 
                  alt="SMMC Logo" 
                  className="w-14 h-14 bg-white rounded-2xl p-1.5 object-contain shadow-lg"
                />
                <div>
                  <p className="text-white font-black text-sm tracking-wide">Mainamoti Cumilla</p>
                  <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Barapara, Cumilla
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
              { icon: Calendar, label: "Established", val: "2011" },
              { icon: MapPin, label: "Location", val: "Barapara, Cumilla" },
              { icon: School, label: "Affiliation", val: "Chittagong Medical University" },
              { icon: Building, label: "Accredited by", val: "BMDC Approved" },
              { icon: Stethoscope, label: "College Type", val: "Private Co-educational" },
              { icon: Clock, label: "Approved Intake", val: "100 MBBS Seats" }
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

          {/* 4. About Mainamoti Medical College */}
          <motion.section {...fadeInUp} id="about" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <School className="text-emerald-600 w-8 h-8" /> About Mainamoti Medical College
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 leading-relaxed text-slate-600 text-sm md:text-base">
              <p>
                Mainamoti Medical College, also recorded as Moinamoti Medical College in some Bangladesh government documents, is a private medical institution located at Barapara in Cumilla, Bangladesh. It was established in 2011 to provide undergraduate medical education and hospital-based clinical training.
              </p>
              <p>
                The college is listed by the Bangladesh Medical & Dental Council among the non-government medical colleges under Chittagong Medical University. Before the establishment of the medical university system, colleges in this region were affiliated with the University of Chittagong.
              </p>
              <p>
                The institution offers an MBBS programme consisting of academic study followed by a compulsory internship. The curriculum includes pre-clinical, para-clinical and clinical subjects, with students progressing from classroom and laboratory learning to supervised patient-based training.
              </p>
              <p>
                Mainamoti Medical College has its academic college and teaching hospital on the same campus. Government records report approximately 110,000 square feet of academic building space, approximately 120,000 square feet of hospital space and three lecture galleries.
              </p>
              <p>
                The college is also reported by multiple education directories as being listed in the World Directory of Medical Schools. Students should understand that WDOMS listing is a directory entry and does not, by itself, constitute accreditation, endorsement or eligibility to practise in another country.
              </p>
            </div>
          </motion.section>

          {/* 5. MBBS Highlights */}
          <motion.section {...fadeInUp} id="highlights" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Layers className="text-emerald-600 w-8 h-8" /> MBBS Highlights
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200">
                    <th className="p-4 text-left font-bold text-slate-700 text-sm w-1/3">Particular</th>
                    <th className="p-4 text-left font-bold text-slate-700 text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "Course Offered", val: "MBBS — Bachelor of Medicine and Bachelor of Surgery" },
                    { key: "Academic Duration", val: "5 Years" },
                    { key: "Internship", val: "1-Year Compulsory Internship" },
                    { key: "Total Programme Term", val: "Approximately 6 Years" },
                    { key: "Medium of Instruction", val: "English" },
                    { key: "University Affiliation", val: "Chittagong Medical University" },
                    { key: "Regulatory Recognition", val: "Bangladesh Medical & Dental Council" },
                    { key: "Directory Status", val: "Reported as WDOMS Listed" },
                    { key: "Approved MBBS Intake", val: "100 Seats" }
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-100">{row.key}</td>
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
                  className="space-y-6"
                >
                  <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200">
                          <th className="p-4 text-left font-bold text-slate-700 text-sm">Year</th>
                          <th className="p-4 text-left font-bold text-slate-700 text-sm">Tuition & Admission Fees</th>
                          <th className="p-4 text-left font-bold text-slate-700 text-sm">Hostel Facilities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { year: "1st Year — Admission", fee: "Contact Admission Office", hostel: "Available, subject to allotment" },
                          { year: "2nd Year", fee: "Contact Admission Office", hostel: "Available, subject to allotment" },
                          { year: "3rd Year", fee: "Contact Admission Office", hostel: "Available, subject to allotment" },
                          { year: "4th Year", fee: "Contact Admission Office", hostel: "Available, subject to allotment" },
                          { year: "5th Year", fee: "Contact Admission Office", hostel: "Available, subject to allotment" },
                          { year: "Internship", fee: "Confirm applicable charges", hostel: "As per college policy" }
                        ].map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                            <td className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-100">{row.year}</td>
                            <td className="p-4 text-slate-600 text-sm border-b border-slate-100">{row.fee}</td>
                            <td className="p-4 text-slate-600 text-sm border-b border-slate-100">{row.hostel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    * Fees are subject to revision by Mainamoti Medical College, the Government of Bangladesh and the relevant regulatory authorities. <br />
                    * Students should request an official fee letter showing tuition fees, hostel charges, food costs, university fees, examination fees, internship-related charges and any refundable deposits before making payment.
                  </p>
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm text-center">
                    <p className="text-slate-600 font-semibold">Please contact our counselors to get the latest verified fee structure, available foreign-student seats and payment schedule.</p>
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
                  <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">International Applicants Eligibility</h4>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Admission requirements are determined by the Government of Bangladesh, the concerned university and the regulations applicable in the student’s home country. International applicants are generally expected to:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2.5 text-xs text-slate-500 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Complete Class 10 and Class 12 or equivalent education.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Study Physics, Chemistry and Biology at the higher-secondary level.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Meet the minimum academic and GPA requirements prescribed for the applicable admission session.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Hold a valid passport.</span>
                        </li>
                      </ul>
                      <ul className="space-y-2.5 text-xs text-slate-500 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Obtain an eligibility or equivalence certificate wherever required.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Provide authenticated academic documents and complete required medical fitness formalities.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Qualify NEET-UG when required for Indian students and meet all prevailing NMC requirements.</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-100 pt-3">
                      * Meeting the college’s admission conditions does not automatically guarantee eligibility for medical registration in India. Indian applicants must independently confirm that the programme, internship, clinical training and licensing conditions comply with current NMC regulations.
                    </p>
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
                      { step: "Step 1", title: "Academic Assessment", desc: "Submit Class 10 and Class 12 mark sheets, passport details and NEET score for assessment." },
                      { step: "Step 2", title: "Document Verification", desc: "Academic records, identity documents and eligibility information are checked." },
                      { step: "Step 3", title: "College Application", desc: "The application is forwarded for admission consideration, subject to seat availability." },
                      { step: "Step 4", title: "Admission Letter", desc: "Eligible candidates may receive a provisional or confirmed admission letter." },
                      { step: "Step 5", title: "Government and University Formalities", desc: "Required permissions and equivalence documents are processed by the relevant authorities." },
                      { step: "Step 6", title: "Fee Payment", desc: "Students pay fees only according to the official payment schedule." },
                      { step: "Step 7", title: "Visa Processing", desc: "The student applies for the appropriate student visa after receiving the documents." },
                      { step: "Step 8", title: "Travel and Reporting", desc: "After visa approval, the student travels and reports to the college with original documents." }
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

          {/* 6. Teaching Hospital & Clinical Training */}
          <motion.section {...fadeInUp} id="hospital" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartPulse className="text-emerald-600 w-8 h-8" /> Teaching Hospital & Clinical Training
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Mainamoti Medical College operates with an attached teaching hospital on the same campus. The arrangement allows students to move gradually from academic and laboratory instruction to supervised clinical training. The hospital supports practical education through major medical and surgical departments. Students receive clinical exposure across multiple areas.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">100</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Approved MBBS Seats</p>
                </div>
                <div className="text-center space-y-1 border-x border-slate-100">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">5+1 Yrs</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Study and Internship</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">Same Campus</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">College & Hospital</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 7. Hostels & Student Facilities */}
          <motion.section {...fadeInUp} id="hostel" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Home className="text-emerald-600 w-8 h-8" /> Hostels & Student Facilities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Separate Student Accommodation</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Separate student accommodation is generally reported for male and female students. International students should request written clarification regarding room availability, furniture, security, electricity rules, and laundry.
                </p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Dining and Food Facilities</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Dining or cafeteria facilities are available for students. International students should confirm whether vegetarian, non-vegetarian and region-specific food options are available.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 8. Campus Facilities */}
          <motion.section {...fadeInUp} id="facilities" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Building className="text-emerald-600 w-8 h-8" /> Campus Facilities
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm grid sm:grid-cols-2 gap-4">
              {[
                "Academic Building",
                "Attached Teaching Hospital",
                "Lecture Galleries",
                "Anatomy Dissection Hall",
                "Physiology Laboratory",
                "Biochemistry Laboratory",
                "Pathology Laboratory",
                "Microbiology Laboratory",
                "Pharmacology Laboratory",
                "Forensic Medicine Facilities",
                "Community Medicine Department",
                "Clinical Teaching Areas",
                "Medical Library",
                "Reading Rooms",
                "Multimedia Teaching Facilities",
                "Practical Demonstration Rooms",
                "Cafeteria or Dining Facilities",
                "Hostel Accommodation"
              ].map((fac, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-600 text-xs md:text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 9. Frequently Asked Questions */}
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

          {/* 10. Related Medical Colleges Carousel */}
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

          {/* 11. Contact Information */}
          <motion.section {...fadeInUp} id="contact" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <MapPin className="text-emerald-600 w-8 h-8" /> Contact Information
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-xs md:text-sm">
                <h3 className="font-bold text-slate-800 text-lg">Mainamoti Medical College</h3>
                <p className="text-slate-600 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Barapara, Chapapur, Union-6, Jagannathpur, Cumilla, Bangladesh</span>
                </p>
                <p className="text-slate-600 leading-relaxed flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>info@bgctrustbd.org</span>
                </p>
                <p className="text-slate-600 leading-relaxed flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>081-65471</span>
                </p>
                <p className="text-slate-600 leading-relaxed flex items-center gap-2 font-bold text-emerald-600">
                  <Globe className="w-4 h-4 shrink-0" />
                  <a href="http://mmmch.edu.bd" target="_blank" rel="noopener noreferrer" className="hover:underline">mmmch.edu.bd</a>
                </p>
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
                to="/application/64b1f1a8e2b8f84d6c7b0029"
                aria-label="Apply to Mainamoti Medical College"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleConsultTrigger}
                className="flex items-center justify-center gap-2 w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-4 rounded-xl transition cursor-pointer"
              >
                Request Call Back <Download className="w-4 h-4" />
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

      {/* 12. Call To Action Section */}
      <section className="bg-slate-900 text-white py-16 px-5 relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-900 z-0" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Begin Your Medical Career?</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Contact our admission counselors for eligibility assessment, admission processing, document verification, visa assistance, and travel guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button 
              onClick={handleConsultTrigger}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition cursor-pointer"
            >
              Apply Online Now
            </button>
            <button 
              onClick={handleConsultTrigger}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3.5 px-8 rounded-xl shadow-lg transition cursor-pointer"
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
