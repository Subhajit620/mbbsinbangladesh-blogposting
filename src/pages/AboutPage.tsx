import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import {
  Shield,
  Award,
  Globe,
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Star,
  ArrowRight,
  Heart,
  Zap,
  Target,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Quote,
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
/* ── Animated counter hook ── */
function useCounter(target: number, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);

  return { count, ref };
}

/* ── Stat counter pill ── */
function StatPill({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCounter(value, 2.2);
  return (
    <div className="flex flex-col items-center p-2">
      <span className={`text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums ${color}`}>
        <span ref={ref}>{count}</span>{suffix}
      </span>
      <span className="text-xs sm:text-sm text-gray-500 font-bold mt-1.5">{label}</span>
    </div>
  );
}

/* ── Section heading ── */
function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center mb-10 sm:mb-16 px-4"
    >
      <span className="inline-block text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 px-3.5 py-1 bg-orange-50 rounded-full border border-orange-100">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2 leading-tight">{title}</h2>
      {sub && <p className="text-gray-555 text-xs sm:text-base lg:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

/* ─────────────────────────────────────────── */

const TEAM = [
  {
    name: 'Dr. Arjun Mehta',
    role: 'Founder & Chief Counsellor',
    bio: '20+ years in medical admissions. Former NMC consultant and MBBS graduate from Dhaka Medical College.',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    tag: 'NMC Expert',
    color: 'emerald',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Student Affairs',
    bio: 'Dedicated to student support from pre-departure to graduation. Fluent in Hindi, English, and Bengali.',
    avatar: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    tag: 'Student Welfare',
    color: 'orange',
  },
  {
    name: 'Md. Tariqul Islam',
    role: 'Bangladesh Operations Head',
    bio: 'Based in Dhaka, Tariqul manages college liaisons, visa processing, and on-ground student support.',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    tag: 'Dhaka Based',
    color: 'emerald',
  },
];

const MILESTONES = [
  { year: '2009', title: 'Founded in Delhi', desc: 'Started as a small counselling desk with a bold vision to democratise MBBS access.', icon: Target },
  { year: '2013', title: '500 Students', desc: 'Crossed 500 successful placements across top Bangladesh medical colleges.', icon: TrendingUp },
  { year: '2018', title: 'Dhaka Office', desc: 'Opened a dedicated operations office in Dhaka to better serve enrolled students.', icon: MapPin },
  { year: '2024', title: '1500+ Placed', desc: 'Over 1,500 students successfully admitted with a 98% visa success rate.', icon: Award },
];

const VALUES = [
  { icon: Shield, title: 'Full Transparency', desc: 'No hidden fees, no false promises. We tell you exactly what to expect at every stage of your journey.', color: 'emerald' },
  { icon: Heart, title: 'Student-First', desc: 'Every decision we make is guided by the best interest of the student, not the commission or quota.', color: 'rose' },
  { icon: Award, title: 'Excellence Only', desc: 'We only recommend BMDC-approved, NMC-recognised colleges with proven academic track records.', color: 'orange' },
  { icon: Zap, title: 'Speed & Efficiency', desc: 'From documents to visa — our streamlined process gets you enrolled in as little as 30 days.', color: 'blue' },
  { icon: Globe, title: 'Global Reach', desc: 'We serve students from India, the Middle East, Africa, and Southeast Asia across 40+ countries.', color: 'emerald' },
  { icon: Users, title: 'Alumni Network', desc: 'A thriving community of 1,500+ graduates who mentor, guide, and support new students.', color: 'orange' },
];

const RECOGNITIONS = [
  { icon: Shield, label: 'NMC India', sub: 'National Medical Commission', bg: 'bg-emerald-50', ring: 'ring-emerald-200', icon_color: 'text-emerald-600' },
  { icon: Globe, label: 'WHO', sub: 'World Health Organization', bg: 'bg-blue-50', ring: 'ring-blue-200', icon_color: 'text-blue-600' },
  { icon: BookOpen, label: 'BMDC', sub: 'Bangladesh Med. Council', bg: 'bg-orange-50', ring: 'ring-orange-200', icon_color: 'text-orange-500' },
  { icon: GraduationCap, label: 'FAIMER', sub: "Int'l Medical Education", bg: 'bg-purple-50', ring: 'ring-purple-200', icon_color: 'text-purple-600' },
];

const TESTIMONIALS = [
  { name: 'Aarav Singh', from: 'Delhi, India', text: "Moving to Bangladesh for MBBS was the best decision of my life. The team handled everything — visa, hostel, enrollment. I'm now in 3rd year.", stars: 5, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
  { name: 'Fatima Al-Rashid', from: 'Riyadh, KSA', text: "Exceptional guidance from start to finish. The counsellors were available 24/7 and never once made me feel like just another application.", stars: 5, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
  { name: 'Ravi Menon', from: 'Kerala, India', text: "WHO recognised degree, English medium, affordable fees — Bangladesh ticks every box. My FMGE prep support is also outstanding.", stars: 5, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
];

/* ─────────── MAIN COMPONENT ─────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="pt-16 overflow-x-hidden">
  <Navbar />
      {/* ══════════════════════════════════════
          HERO — parallax
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-950">

        {/* Parallax bg image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1"
            alt="Team"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/50 to-gray-950" />
        </motion.div>

        {/* Animated gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px] z-0"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[100px] z-0"
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-14 sm:py-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8 uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trusted Since 2009
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6"
          >
            Your Trusted Bridge to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              MBBS Bangladesh
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10"
          >
            We are a premier medical education consultancy with 15+ years of experience placing aspiring doctors in top Bangladesh medical colleges — with full transparency, end-to-end support, and zero hidden costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-consult-us'))}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3.5 sm:py-4 rounded-2xl transition-all shadow-2xl shadow-emerald-900/50 hover:-translate-y-1 cursor-pointer"
            >
              Start Free Consultation <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 sm:py-4 rounded-2xl transition-all backdrop-blur-sm cursor-pointer">
              Meet Our Team
            </button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <span className="text-gray-400 text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-4.5 h-7 rounded-full border-2 border-white/20 flex items-start justify-center pt-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          ANIMATED STATS
      ══════════════════════════════════════ */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center divide-y-0 divide-x-0 sm:divide-x divide-gray-150"
          >
            <StatPill value={1500} suffix="+" label="Students Placed" color="text-emerald-600" />
            <StatPill value={60} suffix="+" label="Partner Colleges" color="text-orange-500" />
            <StatPill value={15} suffix="+" label="Years Experience" color="text-emerald-600" />
            <StatPill value={98} suffix="%" label="Visa Success Rate" color="text-orange-500" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION — split layout
      ══════════════════════════════════════ */}
      <section className="py-14 sm:py-28 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Left: image stack */}
            <div className="relative h-[340px] sm:h-[420px] md:h-[520px] w-full max-w-[28rem] mx-auto lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, x: -60, rotate: -4 }}
                whileInView={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 w-[55%] h-[200px] sm:w-[52%] sm:h-[260px] md:w-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1" alt="Students" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 3 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                viewport={{ once: true }}
                className="absolute bottom-0 right-0 w-[55%] h-[200px] sm:w-[52%] sm:h-[260px] md:w-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1" alt="Campus" className="w-full h-full object-cover" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-xl px-4 py-3 sm:px-6 sm:py-5 text-center z-10 border border-gray-100 min-w-[120px] sm:min-w-[160px]"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <GraduationCap className="w-7 h-7 sm:w-10 sm:h-10 text-emerald-500 mx-auto mb-1.5 sm:mb-2" />
                </motion.div>
                <div className="text-lg sm:text-2xl font-black text-gray-900">NMC</div>
                <div className="text-xs text-emerald-600 font-semibold">Recognised</div>
              </motion.div>

              {/* Decorative ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-emerald-200 animate-spin" style={{ animationDuration: '20s' }} />
            </div>

            {/* Right: copy */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-orange-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 px-3.5 py-1 bg-orange-50 rounded-full border border-orange-100">
                Our Mission
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2 sm:mt-4 mb-4 sm:mb-6 leading-tight">
                Making world-class medicine{' '}
                <span className="text-emerald-600">accessible to every student</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 text-left">
                We believe every deserving student should have the chance to become a doctor — regardless of financial background or geography. Bangladesh offers that opportunity, and we are the bridge that makes it real.
              </p>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 text-left">
                {[
                  'Free, unbiased counselling — no pressure, no commissions',
                  'Complete end-to-end admission and student visa support',
                  'Post-arrival: hostel, orientation, academic guidance',
                  'FMGE / NEXT coaching partnerships for returning graduates',
                ].map((point, i) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 sm:py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-xl cursor-pointer">
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-28 bg-gray-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 75% 50%, #f97316 0%, transparent 50%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title={<>Our Core <span className="text-emerald-400">Values</span></>}
            sub="Six principles that guide every decision we make — from the first counselling call to graduation day."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => {
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
                orange: 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
                rose: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white',
                blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
              };
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl p-5 sm:p-7 cursor-default transition-all"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 transition-all duration-300 ${colorMap[color]}`}>
                    <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{desc}</p>
                  <div className={`absolute top-6 right-6 w-1.5 h-1.5 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'orange' ? 'bg-orange-500' : color === 'rose' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE / MILESTONES
      ══════════════════════════════════════ */}
      <section className="py-14 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Journey"
            title={<>15 Years of <span className="text-emerald-600">Making Doctors</span></>}
            sub="From a single desk in New Delhi to the most trusted MBBS Bangladesh consultancy — here's our story."
          />
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-orange-200 to-emerald-200 -translate-x-1/2 hidden lg:block" />

            <div className="space-y-8 sm:space-y-12">
              {MILESTONES.map(({ year, title, desc, icon: Icon }, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center gap-6 sm:gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`bg-gray-50 hover:bg-white border border-gray-100 hover:border-emerald-200 rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}
                      >
                        <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-3">{year}</span>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
                      </motion.div>
                    </div>

                    {/* Center icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                      viewport={{ once: true }}
                      className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0 hidden lg:flex"
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>

                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM
      ══════════════════════════════════════ */}
      <section className="py-14 sm:py-28 bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Team"
            title={<>The Experts Behind <span className="text-emerald-600">Your Admission</span></>}
            sub="Experienced professionals who have walked the path and know exactly how to guide you through every step."
          />
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-10">
            {TEAM.map(({ name, role, bio, avatar, tag, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${color === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {tag}
                  </span>
                  {/* Stars */}
                  <div className="absolute bottom-4 left-4 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 sm:p-6 text-left">
                  <h3 className="font-black text-gray-900 text-base sm:text-lg">{name}</h3>
                  <p className={`text-xs sm:text-sm font-semibold mb-2.5 ${color === 'emerald' ? 'text-emerald-600' : 'text-orange-500'}`}>{role}</p>
                  <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">{bio}</p>
                </div>

                {/* Bottom border accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-14 sm:py-28 bg-gray-950 text-white relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-[80px]"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Student Stories"
            title={<>Real Voices, <span className="text-emerald-400">Real Results</span></>}
            sub="From their first call to the day they became doctors — here's what our students say."
          />
          <div className="grid sm:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, from, text, stars, avatar }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-3xl p-5 sm:p-8 transition-all group"
              >
                <Quote className="w-8 h-8 text-emerald-500 mb-5 opacity-60" />
                <div className="flex gap-1 mb-4">
                  {[...Array(stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-7 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-500 transition-all" />
                  <div className="text-left">
                    <div className="font-bold text-white text-sm">{name}</div>
                    <div className="text-emerald-400 text-xs">{from}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RECOGNITIONS
      ══════════════════════════════════════ */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-10"
          >
            Recognised & Accredited By
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {RECOGNITIONS.map(({ icon: Icon, label, sub, bg, ring, icon_color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`${bg} rounded-3xl p-4 sm:p-6 text-center ring-1 ${ring} hover:shadow-xl transition-all cursor-default`}
              >
                <Icon className={`w-10 h-10 mx-auto mb-3 ${icon_color}`} />
                <div className="font-black text-gray-900 text-sm">{label}</div>
                <div className="text-xs text-gray-450 mt-1">{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="py-14 sm:py-28 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border-[60px] border-white/5"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-[40px] border-white/5"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Ready to Begin Your
              <br />
              <span className="text-emerald-200">Medical Journey?</span>
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              Join 1,500+ students who trusted us. Get your free consultation today — no pressure, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-extrabold px-8 py-3.5 sm:py-4 rounded-2xl shadow-2xl text-sm sm:text-base transition-colors cursor-pointer"
              >
                Apply Now — It's Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Our Experts
              </motion.button>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-emerald-200 text-xs sm:text-sm">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" />info@mbbsbangladesh.app</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-emerald-400" />
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" />+91 98765 43210</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-emerald-400" />
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />New Delhi & Dhaka</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
