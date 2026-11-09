import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  FileCheck,
  Compass,
  FileSpreadsheet,
  PlaneTakeoff,
  ShieldCheck,
  FileText,
  BadgeDollarSign,
  Heart,
  ChevronLeft,
  ChevronRight,
  Send,
  MapPin,
  Clock,
  Award,
  Users,
  AlertTriangle,
  BookOpen,
  HelpCircle as QuestionIcon,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Check,
  Star,
  ArrowRight,
  ClipboardList,
  Search,
  Percent
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

// Import colleges list from direct database
import { colleges } from "../components/data/CollegesCard";

// GSAP Imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Animated Counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (value - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Helper to parse fees string like "₹28–34 L" or similar into numeric range in Lakhs INR
function parseFeeRange(feeStr: string): { min: number; max: number } {
  const cleanStr = feeStr.replace(/[^0-9–-]/g, ""); // leaves only numbers and dash
  const parts = cleanStr.split(/[–-]/);
  if (parts.length === 2) {
    return { min: parseInt(parts[0]), max: parseInt(parts[1]) };
  } else if (parts.length === 1) {
    const val = parseInt(parts[0]) || 30;
    return { min: val, max: val };
  }
  return { min: 25, max: 40 };
}

// Eligibility & Budget Evaluator Widget
function EligibilityEvaluator() {
  const [biologyMarks, setBiologyMarks] = useState<number>(65);
  const [combinedGpa, setCombinedGpa] = useState<number>(7.5);
  const [neetScore, setNeetScore] = useState<number>(220);
  const [neetQualified, setNeetQualified] = useState<boolean>(true);
  const [category, setCategory] = useState<"general" | "reserved">("general");
  const [budgetLimit, setBudgetLimit] = useState<number>(35); // in Lakhs INR
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");

  const neetThreshold = category === "general" ? 144 : 113;

  // BMDC Guidelines: Combined GPA >= 7.0, Biology marks >= 60% (GP 3.5), NEET Qualified >= threshold
  const isGpaValid = combinedGpa >= 7.0;
  const isBioValid = biologyMarks >= 60;
  const isNeetValid = neetQualified && neetScore >= neetThreshold;
  const isEligible = isGpaValid && isBioValid && isNeetValid;

  // Filter actual colleges from data source
  const matchingColleges = colleges.filter((c) => {
    if (selectedRegion !== "All Regions" && !c.location.toLowerCase().includes(selectedRegion.toLowerCase())) {
      return false;
    }
    const range = parseFeeRange(c.fees);
    if (range.min > budgetLimit) {
      return false;
    }
    return true;
  });

  const regions = ["All Regions", "Dhaka", "Sylhet", "Chattogram", "Rajshahi", "Bogura", "Khulna"];

  return (
    <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-3 sm:p-8 md:p-10 relative overflow-hidden text-left max-w-4xl mx-auto md:min-h-[510px] flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-900" />
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sm:pb-5 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <ClipboardList className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-blue-900 text-xs sm:text-base md:text-lg leading-tight">MBBS Admission Evaluator</h3>
            <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-mono">Verify BMDC Guidelines & Budget Compatibility</p>
          </div>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start flex-1">
        
        {/* Left Column: Input Panel */}
        <div className="md:col-span-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            
            {/* Section 1: Academic Scores Card */}
            <div className="bg-slate-50/45 hover:bg-slate-50/70 border border-slate-200/50 hover:border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/40 relative overflow-hidden group flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Academic Scores</h4>
              </div>
              <div className="space-y-3 sm:space-y-3.5">
                {/* Biology Marks Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-700">
                    <span>Class XII Biology Marks</span>
                    <span className="text-blue-900 font-mono font-bold bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-lg text-[10px]">{biologyMarks}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={biologyMarks}
                    onChange={(e) => setBiologyMarks(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200/70 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                  <p className="text-[8px] sm:text-[9px] text-slate-405 leading-none">Biology criteria: Min 60% expected.</p>
                </div>

                {/* Combined GPA Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-700">
                    <span>Combined GPA (SSC + HSC)</span>
                    <span className="text-blue-900 font-mono font-bold bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-lg text-[10px]">{combinedGpa} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={combinedGpa}
                    onChange={(e) => setCombinedGpa(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200/70 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                  <p className="text-[8px] sm:text-[9px] text-slate-405 leading-none">Equivalence rule: Combined GPA ≥ 7.0.</p>
                </div>
              </div>
            </div>

            {/* Section 2: NEET Qualification Card */}
            <div className="bg-slate-50/45 hover:bg-slate-50/70 border border-slate-200/50 hover:border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/40 relative overflow-hidden group flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">NEET Qualification</h4>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="space-y-1">
                  <label className="block text-[8px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const cat = e.target.value as "general" | "reserved";
                      setCategory(cat);
                      const thresh = cat === "general" ? 144 : 113;
                      setNeetQualified(neetScore >= thresh);
                    }}
                    className="w-full px-2 py-1 border border-slate-200 rounded-xl text-[10px] sm:text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-900 bg-white hover:border-slate-350 transition duration-150 cursor-pointer"
                  >
                    <option value="general">General (OC)</option>
                    <option value="reserved">SC / ST / OBC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">NEET Score</label>
                  <input
                    type="number"
                    min="100"
                    max="720"
                    value={neetScore}
                    onChange={(e) => {
                      const val = Math.min(parseInt(e.target.value) || 0, 720);
                      setNeetScore(val);
                      const thresh = category === "general" ? 144 : 113;
                      setNeetQualified(val >= thresh);
                    }}
                    className="w-full px-2 py-1 border border-slate-200 rounded-xl text-[10px] sm:text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-900 bg-white hover:border-slate-350 transition duration-150"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">NEET Status</label>
                  <div className={`w-full py-1 border rounded-xl text-[10px] sm:text-xs font-bold text-center transition duration-250 ${
                    neetQualified
                      ? "bg-emerald-50 border-emerald-200 text-emerald-850"
                      : "bg-rose-50 border-rose-200 text-rose-850"
                  }`}>
                    {neetQualified ? `Qualify (≥ ${neetThreshold})` : `Failed (< ${neetThreshold})`}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Preference & Budget Card */}
            <div className="bg-slate-50/45 hover:bg-slate-50/70 border border-slate-200/50 hover:border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/40 relative overflow-hidden group lg:col-span-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Budget & Location</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                {/* Budget Limit in Lakhs */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-700">
                    <span>Tuition Budget Limit</span>
                    <span className="text-blue-900 font-mono font-bold bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-lg text-[10px]">₹{budgetLimit} Lakhs</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="45"
                    step="1"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200/70 rounded-lg appearance-none cursor-pointer accent-blue-900"
                  />
                  <p className="text-[8px] sm:text-[9px] text-slate-400 leading-none">Filter tuition fee bounds.</p>
                </div>

                {/* Region Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Preferred Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-[10px] sm:text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-900 bg-white hover:border-slate-350 transition duration-150 cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Output Report & Matching Colleges */}
        <div className="md:col-span-5 space-y-3.5 md:space-y-5 h-full flex flex-col justify-between">
          <div className={`p-4 rounded-2xl border transition duration-300 ${
            isEligible 
              ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" 
              : "bg-slate-50 border-slate-200 text-slate-900"
          }`}>
            <h4 className="font-extrabold text-[9px] sm:text-xs uppercase tracking-widest text-slate-500 mb-2 sm:mb-3">Evaluation Summary</h4>
            
            <div className="space-y-1.5 md:space-y-2 text-[10px] sm:text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Biology Criteria (≥ 60%)</span>
                {isBioValid ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">Passed <Check className="w-3 h-3" /></span>
                ) : (
                  <span className="text-rose-600 font-extrabold flex items-center gap-0.5">Ineligible <AlertTriangle className="w-3 h-3" /></span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/40 pt-1.5 md:pt-2">
                <span className="font-bold text-slate-600">Combined GPA (≥ 7.0)</span>
                {isGpaValid ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">Passed <Check className="w-3 h-3" /></span>
                ) : (
                  <span className="text-rose-600 font-extrabold flex items-center gap-0.5">Ineligible <AlertTriangle className="w-3 h-3" /></span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/40 pt-1.5 md:pt-2">
                <span className="font-bold text-slate-600">NEET Score (≥ {neetThreshold})</span>
                {isNeetValid ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">Passed <Check className="w-3 h-3" /></span>
                ) : (
                  <span className="text-rose-600 font-extrabold flex items-center gap-0.5">Ineligible <AlertTriangle className="w-3 h-3" /></span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200/60 mt-3 md:mt-4 pt-2.5 flex justify-between items-center">
              <span className="text-[10px] sm:text-xs font-bold text-slate-650 font-sans">Combined Verdict</span>
              {isEligible ? (
                <span className="text-[10px] sm:text-xs font-extrabold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-sm">
                  ELIGIBLE
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-extrabold text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-sm">
                  INELIGIBLE
                </span>
              )}
            </div>
          </div>

          {/* Matching Colleges List */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
              <span className="text-[8px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Matching Colleges</span>
              <span className="text-[10px] sm:text-xs font-black text-blue-900 font-mono">
                {isEligible ? matchingColleges.length : 0} Listed
              </span>
            </div>

            {isEligible && matchingColleges.length > 0 ? (
              <div className="max-h-[120px] md:max-h-[220px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin flex-1 mt-2">
                {matchingColleges.map((c) => (
                  <div key={c.id} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-900 transition flex items-center justify-between text-[10px] sm:text-xs shadow-sm">
                    <div className="space-y-0.5 text-left">
                      <p className="font-extrabold text-slate-800 leading-tight">{c.name}</p>
                      <p className="text-[8px] sm:text-[9px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" /> {c.location}
                      </p>
                    </div>
                    <span className="font-bold text-blue-900 text-[8px] sm:text-[10px] font-mono shrink-0 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {c.fees}
                    </span>
                  </div>
                ))}
              </div>
            ) : isEligible ? (
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold py-4 text-center">
                No matching colleges found. Try increasing budget limit.
              </p>
            ) : (
              <p className="text-[9px] sm:text-[11px] text-rose-600 bg-rose-50/50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl font-bold leading-relaxed text-left border border-rose-100">
                Adjust inputs to satisfy SSC/HSC combined GPA ≥ 7.0, Biology marks ≥ 60%, and NEET score ≥ {neetThreshold} to unlock matching college list.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


export default function ServicesPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "pre" | "post">("all");
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Scroll Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".services-card", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.06,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".services-grid-container",
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(".why-card",
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".why-grid-container",
          start: "top 80%"
        }
      }
    );
  }, []);

  const handleConsultTrigger = () => {
    window.dispatchEvent(new CustomEvent("open-consult-us"));
  };

  const SERVICES = [
    {
      icon: Compass,
      title: "Career Counselling",
      desc: "One-on-one profiles assessment sessions mapping marks, financial expectations, and aspirations to pick suitable paths.",
      badge: "Counselling",
      category: "pre"
    },
    {
      icon: GraduationCap,
      title: "University Selection",
      desc: "Detailed insights into Bangladesh medical universities, hostel configurations, and compliance checks.",
      badge: "Matching",
      category: "pre"
    },
    {
      icon: CheckCircle2,
      title: "Admission Assistance",
      desc: "Liaising directly with university registrars to reserve your seat and secure formal admission offer letters.",
      badge: "Processing",
      category: "pre"
    },
    {
      icon: FileCheck,
      title: "Documentation Support",
      desc: "Transcript conversions, MoFA attestation filings, and DGHS equivalency mark mapping.",
      badge: "Verification",
      category: "pre"
    },
    {
      icon: FileText,
      title: "Visa Assistance",
      desc: "Documentation files compilation and embassy coordinating to ensure 100% stamp success ratios.",
      badge: "Visa",
      category: "pre"
    },
    {
      icon: ShieldCheck,
      title: "Hostel & Accommodation",
      desc: "Pre-booking separate, CCTV-monitored student rooms right inside the medical campuses.",
      badge: "Settling",
      category: "post"
    },
    {
      icon: PlaneTakeoff,
      title: "Travel Assistance",
      desc: "Departing in batched groups accompanied by our counselors with pre-departure briefing check sheets.",
      badge: "Logistics",
      category: "pre"
    },
    {
      icon: Users,
      title: "Airport Pickup",
      desc: "On-ground coordinators pick up students in private transit buses directly from Dhaka airport.",
      badge: "Arrival",
      category: "post"
    },
    {
      icon: BadgeDollarSign,
      title: "Loan & Financial Guidance",
      desc: "Guidance drafting university fee certificates to clear national banking student loan checks.",
      badge: "Finance",
      category: "pre"
    },
    {
      icon: Clock,
      title: "Post Admission Support",
      desc: "SIM cards, local banking setup, and priority student welfare checks active for the next 6 years.",
      badge: "Welfare",
      category: "post"
    }
  ];

  const filteredServices = activeTab === "all" ? SERVICES : SERVICES.filter(s => s.category === activeTab);

  const WHY_CHOOSE_US = [
    {
      icon: Award,
      title: "Trusted Admission Experts",
      desc: "Over 10 years of verified placement records across leading Bangladesh medical campuses."
    },
    {
      icon: CheckCircle2,
      title: "NMC Guideline Compliant",
      desc: "All partnered medical colleges strictly follow the 54-month syllabus guidelines required by the NMC."
    },
    {
      icon: BookOpen,
      title: "WHO Listed Colleges",
      desc: "Private institutions listed in the World Directory of Medical Schools for international licensures."
    },
    {
      icon: BadgeDollarSign,
      title: "Affordable Tuition Fees",
      desc: "Total tuition fees range from $34,000 to $48,000, spread in standard yearly installments directly to colleges."
    },
    {
      icon: FileText,
      title: "Transparent Process",
      desc: "No hidden charges, agents commission, or secondary donations. Complete pricing integrity."
    },
    {
      icon: ShieldCheck,
      title: "No Capitation Charges",
      desc: "All placements are secured pure based on Class 12 board marks and NEET scores."
    },
    {
      icon: Compass,
      title: "English Medium Classes",
      desc: "lectures, exams, and case evaluations are conducted fully in English."
    },
    {
      icon: Heart,
      title: "Indian Dining Mess",
      desc: "Hostels run dedicated Indian food kitchens catering North & South Indian meals."
    },
    {
      icon: ShieldCheck,
      title: "Secure On-Campus Hostels",
      desc: "Separated residential facilities under 24/7 security gates and warden locks."
    },
    {
      icon: Users,
      title: "Dedicated Support Desks",
      desc: "Local coordinators based directly inside major cities for immediate support."
    }
  ];

  const TIMELINE = [
    { step: "01", title: "Free Career Counselling", desc: "Profile assessment mapping board marks and budget matching options.", duration: "1-2 Days" },
    { step: "02", title: "Profile Evaluation", desc: "Verifying boards GPA score aggregates and NEET qualified status.", duration: "1 Day" },
    { step: "03", title: "University Selection", desc: "Shortlisting colleges based on clinical bed counts and city choices.", duration: "2-3 Days" },
    { step: "04", title: "Application Submission", desc: "Filing registration requests and reserving seats from the registrar.", duration: "3-5 Days" },
    { step: "05", title: "Admission Confirmation", desc: "Receiving the formal offer letter direct from the respective college.", duration: "7 Working Days" },
    { step: "06", title: "Visa Processing", desc: "Compiling equivalence files, MoFA attestation, and visa stamp filing.", duration: "15-20 Days" },
    { step: "07", title: "Travel Assistance", desc: "Batched group flight booking led by our escorts to Dhaka.", duration: "1 Day" },
    { step: "08", title: "Join Your Medical College", desc: "Campus induction, hostel room check-in, and start of classes.", duration: "Immediate" }
  ];

  const COLLEGES = colleges.filter((c) =>
    [
      "holy-family-red-crescent-medical-college",
      "tairunnessa-medical-college-hospital",
      "enam-medical-college-hospital",
      "bgc-trust-medical-college"
    ].includes(c.slug)
  ).map((c) => ({
    name: c.name,
    city: c.location,
    est: c.established || "2000",
    fee: c.fees,
    image: c.image,
    rating: c.slug.includes("enam") ? 4.9 : c.slug.includes("holy") ? 4.8 : 4.6,
    beds: c.slug.includes("enam") ? "1000+ Beds" : c.slug.includes("holy") ? "800+ Beds" : "500+ Beds"
  }));

  const TESTIMONIALS = [
    {
      name: "Anjali Mukhopadhyay",
      college: "Holy Family Red Crescent Medical College",
      state: "West Bengal, India",
      review: "Aspiring Life managed my entire admission dossier. The campus has separate hostels, and having North and South Indian food mess made settling in very easy.",
      stars: 5,
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Devendra Patil",
      college: "Enam Medical College & Hospital",
      state: "Maharashtra, India",
      review: "The clinical exposure at Savar is massive. The admissions team was completely transparent about fees, and we paid directly to the college account.",
      stars: 5,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Karan Nair",
      college: "Tairunnessa Memorial Medical College",
      state: "Kerala, India",
      review: "The transition to an English-medium curriculum was smooth. Aspiring Life escorted our batch flight directly and helped us get local SIM cards and bank accounts on our first day.",
      stars: 5,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120"
    }
  ];

  const FAQS = [
    {
      q: "Why choose Bangladesh for MBBS?",
      a: "Bangladesh offers highly affordable private medical education with an identical syllabus structure to India, high bed capacity hospitals, English-medium coursework, and shared cultural familiarity."
    },
    {
      q: "Is MBBS in Bangladesh approved by NMC?",
      a: "Yes, medical colleges in Bangladesh are recognized by the Bangladesh Medical and Dental Council (BMDC) and listed in the WHO Directory, complying with curriculum standards expected by the National Medical Commission (NMC) of India."
    },
    {
      q: "Is NEET mandatory for MBBS in Bangladesh?",
      a: "Yes. Qualifying in the NEET exam during the year of application is mandatory to process DGHS equivalence certificates and practice in India."
    },
    {
      q: "What is the total tuition fee?",
      a: "Total tuition fees range between $34,000 and $48,000 across 5 years, which can be paid in flexible annual installments directly to the colleges."
    },
    {
      q: "Are SAARC scholarships available?",
      a: "Yes. The Government of Bangladesh reserves a set of scholarship slots for SAARC students, offering complete tuition waivers for candidates with perfect GPA marks in Biology, physics, and chemistry."
    },
    {
      q: "Are hostel accommodations available?",
      a: "Yes, all our partner private colleges offer separate, secure, CCTV-monitored hostels for boys and girls on or right next to the campus."
    },
    {
      q: "Is Indian food available in hostels?",
      a: "Yes. Most hostels run dedicated Indian kitchens serving both North and South Indian vegetarian and non-vegetarian meals."
    },
    {
      q: "What documents are required?",
      a: "You require your Class X & XII original marksheets, pass certificates, passport, NEET scorecard, and passport-size photographs."
    },
    {
      q: "How long does the admission process take?",
      a: "The complete process, from registration and DGHS equivalence attestation to visa stamping, takes approximately 6 to 8 weeks."
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-slate-700 selection:bg-blue-600 selection:text-white relative font-sans antialiased">
      <Navbar />

      {/* Clean Educational Hero Section */}
      <section className="relative bg-slate-50 pt-36 pb-24 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100">
              <Award className="w-4 h-4" /> Trusted Admissions Partner Since 2014
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-900 leading-tight tracking-tight animate-fade-in">
              Comprehensive MBBS Admission Services for Your Medical Career
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Aspiring Life provides end-to-end guidance for Indian students seeking MBBS admission in Bangladesh. From GPE eligibility checks and attestation to visa processing and hostel settlement, our specialists secure your medical career path.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 pt-2">
              <button
                onClick={handleConsultTrigger}
                className="px-4 sm:px-8 py-3.5 sm:py-4 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition duration-200 cursor-pointer shadow-md shadow-blue-900/10 text-center"
              >
                Apply Now
              </button>
              <button
                onClick={handleConsultTrigger}
                className="px-4 sm:px-8 py-3.5 sm:py-4 bg-white border border-slate-350 hover:border-slate-400 text-blue-900 font-extrabold text-xs sm:text-sm rounded-xl transition duration-200 cursor-pointer text-center"
              >
                Free Counselling
              </button>
            </div>
          </div>

          {/* Hero Right Content: Live Eligibility Evaluator */}
          <div className="lg:col-span-7 w-full">
            <EligibilityEvaluator />
          </div>

        </div>
      </section>

      {/* Trust Statistics Section */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-center">
          <div className="space-y-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900"><AnimatedCounter value={5000} />+</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students Guided</p>
          </div>
          <div className="space-y-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900"><AnimatedCounter value={25} />+</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partner Colleges</p>
          </div>
          <div className="space-y-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900"><AnimatedCounter value={10} />+</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Years of Experience</p>
          </div>
          <div className="space-y-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900"><AnimatedCounter value={98} />%</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visa Success Rate</p>
          </div>
          <div className="space-y-1 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900">100%</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admission Assistance</p>
          </div>
        </div>
      </section>

      {/* Categorized Services Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-5 max-w-7xl mx-auto services-grid-container">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-[10px] sm:text-xs uppercase font-extrabold tracking-widest rounded-full border border-blue-100 mb-2">Our Offerings</span>
          <h2 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight leading-tight">Complete Admission Assistance</h2>
        </div>

        {/* Capsule Segmented Control Switcher */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex p-1 bg-slate-100/90 border border-slate-200/50 rounded-2xl max-w-full overflow-x-auto scrollbar-none snap-x">
            {(["all", "pre", "post"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition duration-200 cursor-pointer snap-align-none shrink-0 ${
                  activeTab === tab
                    ? "bg-white text-blue-900 shadow-md border border-slate-200/30"
                    : "text-slate-500 hover:text-blue-900 bg-transparent border border-transparent"
                }`}
              >
                <span className="hidden sm:inline">{tab === "all" ? "All Services" : tab === "pre" ? "Pre-Departure Support" : "Post-Admission Care"}</span>
                <span className="inline sm:hidden">{tab === "all" ? "All" : tab === "pre" ? "Pre-Departure" : "Post-Admission"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-stretch w-full">
          <AnimatePresence mode="wait">
            {filteredServices.map((srv, idx) => {
              const IconComponent = srv.icon;
              return (
                <motion.div
                  key={srv.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="services-card bg-white border border-slate-200/80 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl hover:border-blue-900/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[140px] md:min-h-[195px] h-auto relative group overflow-hidden w-[calc(50%-8px)] md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-900 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  <div className="space-y-2 md:space-y-3 flex flex-col items-stretch md:items-center w-full">
                    <div className="flex justify-between md:justify-center items-start md:items-center w-full relative">
                      <div className="w-8 h-8 md:w-11 md:h-11 bg-blue-50/70 border border-blue-100/50 text-blue-900 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-350">
                        <IconComponent className="w-4 h-4 md:w-5.5 md:h-5.5" />
                      </div>
                      <span className="hidden md:inline-block absolute top-0 right-0 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 leading-snug group-hover:text-blue-900 transition-colors duration-200 text-left md:text-center w-full">{srv.title}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-3 text-left md:text-center w-full">{srv.desc}</p>
                  </div>
                  <button
                    onClick={handleConsultTrigger}
                    className="text-[9px] sm:text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer pt-2 group-hover:translate-x-0.5 transition-transform duration-200 self-start md:self-center"
                  >
                    Learn More <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-blue-600" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Why Choose Aspiring Life */}
      <section className="py-12 sm:py-24 bg-slate-50 border-y border-slate-100 why-grid-container">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[11px] font-extrabold text-blue-650 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900">Your Trusted Admission Guides</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="why-card bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between min-h-[140px] md:min-h-0 space-y-2.5 sm:space-y-3">
                  <div className="space-y-2 sm:space-y-3 text-left">
                    <div className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-blue-900 leading-snug">{item.title}</h4>
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-[11px] leading-relaxed text-left">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Accordion Timeline */}
      <section className="py-12 sm:py-24 bg-white timeline-container">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[11px] font-extrabold text-blue-650 uppercase tracking-widest">Process Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900">The Admission Process</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-2.5 sm:space-y-4">
            {TIMELINE.map((item, idx) => {
              const isActive = activeJourneyStep === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition duration-200 overflow-hidden ${
                    isActive ? "border-blue-900 bg-slate-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setActiveJourneyStep(idx)}
                    className="w-full px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-bold text-blue-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <span className="text-xs sm:text-base">{item.title}</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-blue-800 bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase self-start sm:self-auto">
                      {item.duration}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-1 pl-6 sm:pl-18 text-slate-650 text-xs sm:text-sm leading-relaxed border-t border-slate-250/20">
                          {item.desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Private Medical Colleges Grid */}
      <section className="py-12 sm:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[11px] font-extrabold text-blue-650 uppercase tracking-widest">Colleges</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900">Partner Private Medical Colleges</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COLLEGES.map((college, idx) => (
              <div key={idx} className="bg-white border border-slate-205 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between">
                {/* College Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/75 text-emerald-400 text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    Est. {college.est}
                  </div>
                </div>

                {/* College info details */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {college.city}</span>
                      <span className="text-blue-900 font-bold">★ {college.rating}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-blue-900 leading-snug line-clamp-2">{college.name}</h4>
                    <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">{college.beds}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">Tuition Fees</p>
                      <p className="text-xs font-bold text-slate-800 font-mono">{college.fee}</p>
                    </div>
                    <button
                      onClick={handleConsultTrigger}
                      className="text-[10px] font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials Grid */}
      <section className="py-12 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[11px] font-extrabold text-blue-650 uppercase tracking-widest text-center">Student Success</span>
            <h2 className="text-3xl font-black text-blue-900 text-center font-sans">Alumni Feedback</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 sm:p-8 rounded-2xl flex flex-col justify-between min-h-[180px] sm:min-h-[310px] h-full shadow-sm hover:shadow-md transition duration-200">
                <div className="space-y-2.5 sm:space-y-4 text-left">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-450 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-medium italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-slate-200/60 pt-5 text-left">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-extrabold text-blue-900 text-xs">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="py-12 sm:py-24 px-5 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl font-black text-blue-900">Frequently Asked Questions</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="space-y-2.5 sm:space-y-4 text-left">
          {FAQS.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-350 transition duration-300"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-blue-900 text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-800" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-650 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Corporate Call To Action Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-5 max-w-5xl mx-auto relative z-10 text-center">
        <div className="bg-blue-900 border border-blue-950 rounded-3xl p-6 sm:p-14 space-y-6 text-white shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white font-sans">Begin Your Medical Career with Confidence</h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Speak with our experienced counsellors and receive personalized guidance to secure admission to a top NMC-compliant medical college in Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={handleConsultTrigger}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm rounded-xl transition duration-200 cursor-pointer shadow-md text-center"
            >
              Apply Now
            </button>
            <button
              onClick={handleConsultTrigger}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-blue-800 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl border border-blue-700 transition duration-200 cursor-pointer text-center"
            >
              Contact Our Experts
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
