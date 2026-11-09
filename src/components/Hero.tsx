import React, { useState, useEffect } from "react";

import { ArrowRight } from "lucide-react";

import WhyBangladesh from "./WhyBangladesh";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, X, ZoomIn, ChevronLeft, ChevronRight, Images } from "lucide-react";
import TopColleges from "./TopColleges";
import FeesStructureSection from "./FeesStructureSection";
import WhatWeHaveDone from "./WhatWeHaveDone";
import bannerStudent from "../assets/banner_student.jpg";

const stats = [
  {
    number: 10,
    suffix: "+",
    label: "Years of Experience",
  },
  {
    number: 1500,
    suffix: "+",
    label: "Students Placed",
  },
  {
    number: 60,
    suffix: "+",
    label: "NMC Eligible Colleges",
  },
  {
    number: 25,
    prefix: "₹",
    suffix: "L+",
    label: "Fees Starting From",
  },
];

const benefits = [
  {
    title: "5-Year Course Duration",
    desc: "Complete your MBBS in just 5 years — start your medical career sooner than in many other countries.",
  },
  {
    title: "Affordable Fee Structure",
    desc: "Total MBBS fees in Bangladesh generally range from 25–50 lakhs — far more affordable than private colleges in India.",
  },
  {
    title: "Similar Education System",
    desc: "The curriculum mirrors India's education pattern — easy adaptation, familiar subjects, and NMC-aligned syllabus.",
  },
  {
    title: "Low Cost of Living",
    desc: "Hostel, food, and daily expenses in Bangladesh are minimal — students can manage comfortably within budget.",
  },
  {
    title: "No Language Barrier",
    desc: "No IELTS, TOEFL or PTE required. Teaching is in English. Local population is familiar with Hindi.",
  },
];


const FAQS = [
  {
    q: "What is MBBS in Bangladesh?",
    a: "MBBS in Bangladesh is a 5-year undergraduate medical degree followed by a 1-year internship, recognized by the Bangladesh Medical and Dental Council (BMDC) and the World Health Organization (WHO).",
  },
  {
    q: "Is MBBS from Bangladesh valid in other countries?",
    a: "Yes. Degrees from BMDC-recognized medical colleges are accepted for licensing exams in many countries including India (FMGE/NExT), the UK (PLAB), the USA (USMLE), and others.",
  },
  {
    q: "What is the total fee for MBBS in Bangladesh?",
    a: "The total cost ranges from approximately $20,000 to $35,000 USD for the entire 5-year program, varying by college. This is significantly lower than many other countries.",
  },
  {
    q: "What is the medium of instruction?",
    a: "All MBBS courses in Bangladesh are taught entirely in English, making the transition smooth for international students.",
  },
   {
    q: "Is there an entrance exam for admission?",
    a: "Yes. Students must pass the centralized admission test conducted by the BMDC. Indian students also need a valid NEET score to be eligible.Professional and Enterprise customers receive dedicated onboarding sessions with a success manager.",
  }
   
];

const GALLERY = [
  {
    src: 'college1.jpg',
    thumb: 'https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&dpr=1',
    label: 'Dhaka Medical College — Main Building',
    tag: 'Campus',
    span: 'col-span-2 row-span-2',  // large featured card
  },
  {
    src: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Modern Anatomy Laboratory',
    tag: 'Facilities',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Students in Clinical Ward',
    tag: 'Student Life',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Rajshahi Medical College Library',
    tag: 'Library',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Surgical Skills Simulation Lab',
    tag: 'Facilities',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Graduation Ceremony 2024',
    tag: 'Events',
    span: 'col-span-2',  // wide card
  },
  {
    src: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'Chittagong Medical — Campus View',
    tag: 'Campus',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    thumb: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    label: 'International Student Orientation',
    tag: 'Student Life',
    span: '',
  },
];

const GALLERY_TAGS = ['All', 'Campus', 'Facilities', 'Student Life', 'Library', 'Events'];

const TAG_COLORS: Record<string, string> = {
  Campus:        'bg-emerald-100 text-emerald-700',
  Facilities:    'bg-orange-100 text-orange-700',
  'Student Life':'bg-blue-100 text-blue-700',
  Library:       'bg-purple-100 text-purple-700',
  Events:        'bg-rose-100 text-rose-700',
};

function GallerySection() {
  const [activeTag, setActiveTag] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeTag === 'All'
    ? GALLERY
    : GALLERY.filter((g) => g.tag === activeTag);

  const prev = () =>
    setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : 0));
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % filtered.length : 0));

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="gallery"
      className="py-24 bg-gradient-to-br from-emerald-50 via-white to-orange-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Gallery
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Life Inside{' '}
            <span className="text-emerald-600">Bangladesh Medical Colleges</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A visual tour of campuses, laboratories, student life, and graduation
            moments across top Bangladesh medical colleges.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GALLERY_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                activeTag === tag
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Masonry grid ── */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden
                  shadow-md hover:shadow-xl transition-shadow ${item.span || ''}`}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={item.thumb}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform
                    duration-500 group-hover:scale-110"
                />

                {/* Dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70
                  via-black/20 to-transparent opacity-0 group-hover:opacity-100
                  transition-opacity duration-300" />

                {/* Tag badge — always visible */}
                <span className={`absolute top-3 left-3 text-xs font-bold px-3
                  py-1 rounded-full shadow-sm ${TAG_COLORS[item.tag] || 'bg-gray-100 text-gray-700'}`}>
                  {item.tag}
                </span>

                {/* Zoom icon — appears on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full
                  bg-white/20 backdrop-blur-sm flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  border border-white/40">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>

                {/* Caption — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-4
                  translate-y-2 group-hover:translate-y-0 opacity-0
                  group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-semibold leading-snug drop-shadow">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Photo count ── */}
        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500">
          <Images className="w-4 h-4 text-emerald-500" />
          Showing{' '}
          <span className="font-bold text-emerald-600">{filtered.length}</span>{' '}
          photos
          {activeTag !== 'All' && (
            <span>
              in <span className="font-semibold text-gray-700">{activeTag}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm
              flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-full
                bg-white/10 hover:bg-white/20 border border-white/20
                flex items-center justify-center text-white transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Previous */}
            <button
              className="absolute left-4 sm:left-8 w-11 h-11 rounded-full
                bg-white/10 hover:bg-white/20 border border-white/20
                flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Active image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].label}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-base">
                    {filtered[lightbox].label}
                  </p>
                  <span className={`inline-block mt-1 text-xs font-bold px-3
                    py-1 rounded-full ${TAG_COLORS[filtered[lightbox].tag] || ''}`}>
                    {filtered[lightbox].tag}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {lightbox + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 sm:right-8 w-11 h-11 rounded-full
                bg-white/10 hover:bg-white/20 border border-white/20
                flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// FAQ ITEM

function FaqItem({ q, a }) {

  const [open, setOpen] = useState(false);


  return (

    <div className="border border-gray-200 rounded-xl overflow-hidden">


      <button

        onClick={() => setOpen(!open)}

        className="
        w-full
        flex
        items-center
        justify-between
        px-6
        py-4
        text-left
        hover:bg-gray-50
        transition
        "

      >

        <span className="font-semibold text-gray-800">
          {q}
        </span>


        <ChevronDown

          className={`
          w-5 
          h-5 
          text-gray-500 
          transition-transform
          ${open ? "rotate-180" : ""}
          `}

        />


      </button>



      {
        open && (

          <div

            className="
            px-6
            pb-5
            pt-4
            text-gray-600
            text-sm
            leading-relaxed
            border-t
            border-gray-100
            "

          >

            {a}

          </div>

        )
      }


    </div>

  );
}

function Counter({ value }) {

  const [count, setCount] = useState(0);


  useEffect(() => {


    let start = 0;

    const duration = 1500;

    const increment = value / (duration / 20);



    const timer = setInterval(() => {


      start += increment;


      if (start >= value) {

        setCount(value);

        clearInterval(timer);

      }

      else {

        setCount(Math.floor(start));

      }


    }, 20);



    return () => clearInterval(timer);

  }, [value]);

  return count;

}

const T = {
  ink: "#0F172A",
  teal: "#0D9488",
  mint: "#10B981",
  bone: "#1E293B",
  amber: "#D97706",
  line: "rgba(13,148,136,.12)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.mb-banner *{margin:0;padding:0;box-sizing:border-box}
.mb-banner{
  position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;
  font-family:'Outfit',system-ui,sans-serif;color:${T.bone};
  background:
    radial-gradient(120% 90% at 78% 18%, rgba(13,148,136,.15) 0%, transparent 60%),
    radial-gradient(90% 70% at 8% 92%, rgba(16,185,129,.08) 0%, transparent 55%),
    linear-gradient(160deg,#F8FAFC 0%,#F1F5F9 55%,#E2E8F0 100%);
}

.mb-grid{
  position:absolute;inset:0;pointer-events:none;opacity:.65;
  background-image:linear-gradient(${T.line} 1px,transparent 1px),
                   linear-gradient(90deg,${T.line} 1px,transparent 1px);
  background-size:56px 56px;
  -webkit-mask-image:radial-gradient(70% 60% at 50% 45%,#000 0%,transparent 82%);
  mask-image:radial-gradient(70% 60% at 50% 45%,#000 0%,transparent 82%);
  animation:mbDrift 26s linear infinite;
}
@keyframes mbDrift{to{background-position:56px 56px}}

.mb-ecg{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:260px;width:100%;opacity:.5;pointer-events:none}
.mb-ecg path{
  fill:none;stroke:${T.teal};stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:2400;stroke-dashoffset:2400;
  animation:mbTrace 6s cubic-bezier(.65,0,.35,1) 1.1s infinite;
  filter:drop-shadow(0 0 8px rgba(13,148,136,.3));
}
@keyframes mbTrace{
  0%{stroke-dashoffset:2400}
  55%{stroke-dashoffset:0}
  85%{stroke-dashoffset:0;opacity:1}
  100%{stroke-dashoffset:-2400;opacity:0}
}

.mb-wrap{position:relative;z-index:2;width:min(1180px,92vw);margin:0 auto;padding:120px 0 90px;display:grid;grid-template-columns:1.15fr .85fr;gap:72px;align-items:center}

.mb-eyebrow{
  display:inline-flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;
  font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:${T.teal};
  border:1px solid rgba(13,148,136,.18);border-radius:100px;padding:8px 16px 8px 12px;
  margin-bottom:30px;background:rgba(13,148,136,.05);
}
.mb-pulse{width:7px;height:7px;border-radius:50%;background:${T.teal};animation:mbBeat 2s ease-out infinite}
@keyframes mbBeat{
  0%{box-shadow:0 0 0 0 rgba(13,148,136,.6)}
  70%{box-shadow:0 0 0 11px rgba(13,148,136,0)}
  100%{box-shadow:0 0 0 0 rgba(13,148,136,0)}
}

.mb-banner h1{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(2.9rem,6.2vw,5.1rem);line-height:1.02;letter-spacing:-.025em;margin-bottom:26px;color:#0F172A}
.mb-em{font-style:italic;font-weight:400;color:${T.teal};position:relative;white-space:nowrap}
.mb-em::after{
  content:'';position:absolute;left:0;bottom:.06em;height:3px;width:100%;
  background:linear-gradient(90deg,${T.amber},transparent);
  transform:scaleX(0);transform-origin:left;
  animation:mbUnderline 1.1s cubic-bezier(.22,1,.36,1) 1.5s forwards;
}
@keyframes mbUnderline{to{transform:scaleX(1)}}

.mb-lede{font-size:clamp(1rem,1.25vw,1.15rem);font-weight:400;line-height:1.7;color:#334155;max-width:52ch;margin-bottom:42px}

.mb-actions{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:56px}
.mb-btn{
  font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:500;padding:15px 30px;
  border-radius:6px;border:1px solid transparent;cursor:pointer;text-decoration:none;
  display:inline-flex;align-items:center;gap:9px;
  transition:transform .35s cubic-bezier(.22,1,.36,1),background .3s,box-shadow .35s,border-color .3s;
}
.mb-primary{background:${T.teal};color:#ffffff;box-shadow:0 8px 26px -10px rgba(13,148,136,.4)}
.mb-primary:hover{transform:translateY(-3px);box-shadow:0 16px 38px -12px rgba(13,148,136,.5)}
.mb-ghost{border-color:rgba(15,23,42,.2);color:#0F172A}
.mb-ghost:hover{border-color:${T.teal};background:rgba(13,148,136,.07);transform:translateY(-3px)}
.mb-btn svg{transition:transform .3s}
.mb-btn:hover svg{transform:translateX(4px)}

.mb-stats{display:grid;grid-template-columns:repeat(3,auto);gap:44px;justify-content:start;padding-top:32px;border-top:1px solid ${T.line}}
.mb-stat b{display:block;font-family:'Fraunces',serif;font-weight:700;font-size:2.1rem;color:#0F172A;line-height:1;margin-bottom:7px}
.mb-stat b span{color:${T.amber}}
.mb-stat small{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:#64748B}

.mb-card{
  border:1px solid rgba(13,148,136,.15);border-radius:14px;padding:32px;
  background:#FFFFFF;box-shadow:0 30px 60px -15px rgba(15,23,42,.1);
  color:#1E293B;
}
@keyframes mbFloat{50%{transform:translateY(-13px)}}
.mb-card h3{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#0F766E;margin-bottom:22px}
.mb-row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:15px 0;border-bottom:1px dashed rgba(15,23,42,.08)}
.mb-row:last-of-type{border-bottom:none}
.mb-row span{font-size:.9rem;color:#475569;font-weight:400}
.mb-row strong{font-size:.95rem;font-weight:600;color:#0F172A;text-align:right}
.mb-note{margin-top:22px;padding:13px 15px;border-radius:8px;background:rgba(217,119,6,.06);border:1px solid rgba(217,119,6,.18);font-size:.82rem;line-height:1.55;color:#92400E}

.mb-rise{opacity:0;transform:translateY(26px);animation:mbRise .95s cubic-bezier(.22,1,.36,1) forwards}
@keyframes mbRise{to{opacity:1;transform:none}}

.mb-banner :focus-visible{outline:2px solid ${T.teal};outline-offset:3px;border-radius:4px}

@media(max-width:900px){
  .mb-wrap{grid-template-columns:1fr;gap:48px;padding:100px 0 70px}
  .mb-stats{gap:28px}
  .mb-stat b{font-size:1.7rem}
  .mb-card{animation:none}
}
@media(max-width:480px){
  .mb-stats{grid-template-columns:1fr 1fr;gap:24px}
  .mb-btn{flex:1;justify-content:center}
}
@media(prefers-reduced-motion:reduce){
  .mb-banner *{animation:none!important;transition:none!important}
  .mb-rise{opacity:1;transform:none}
  .mb-ecg path{stroke-dashoffset:0}
  .mb-em::after{transform:scaleX(1)}
}
`;

function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mousePos, setMousePos] = useState({ x: 78, y: 18 });

  // Rotate card by max 10 degrees based on cursor position relative to center
  const rotateX = useTransform(y, [-190, 190], [10, -10]);
  const rotateY = useTransform(x, [-142, 142], [-10, 10]);

  // Premium spring physics for smooth, heavy inertia dampening
  const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (

    <div>




      <style>{CSS}</style>
      <section 
        className="mb-banner"
        onMouseMove={handleSectionMouseMove}
        style={{
          background: `
            radial-gradient(120% 90% at ${mousePos.x}% ${mousePos.y}%, rgba(13,148,136,.15) 0%, transparent 65%),
            radial-gradient(90% 70% at 8% 92%, rgba(16,185,129,.08) 0%, transparent 55%),
            linear-gradient(160deg,#F8FAFC 0%,#F1F5F9 55%,#E2E8F0 100%)
          `
        }}
      >
        <div className="mb-grid" />
        <svg className="mb-ecg" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,130 L300,130 L322,130 L334,96 L346,172 L360,58 L374,196 L388,130 L700,130 L722,130 L734,104 L746,160 L760,72 L774,184 L788,130 L1100,130 L1440,130" />
        </svg>

        <div className="mb-wrap">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-eyebrow"
            >
              <i className="mb-pulse" />
              Session 2026–27 • SAARC & Non-SAARC Admission Open
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Study MBBS in
              <br />
              <span className="mb-em">Bangladesh</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-lede"
            >
              NMC & WHO-listed medical colleges, English-medium instructions, and a curriculum mirroring Indian standards (identical medical books, syllabus, and clinical rotations). Benefit from the highest FMGE/NExT passing rates and affordable tuition fee structures.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-actions"
            >
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-consult-us'))}
                className="mb-btn mb-primary cursor-pointer"
              >
                Check your eligibility <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('colleges');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mb-btn mb-ghost cursor-pointer"
              >
                Browse colleges
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-stats"
            >
              <div className="mb-stat">
                <b>
                  <Counter value={60} />
                  <span>+</span>
                </b>
                <small>Approved Medical Colleges</small>
              </div>
              <div className="mb-stat">
                <b>
                  <Counter value={5} />
                  <span>Yr</span>
                </b>
                <small>Course + 1 Yr Internship</small>
              </div>
              <div className="mb-stat">
                <b>
                  <span>₹</span>
                  <Counter value={25} />
                  <span>L+</span>
                </b>
                <small>Total package from</small>
              </div>
            </motion.div>
          </div>

          <motion.aside 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-[380px] lg:max-w-full aspect-[3/4]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
              }}
              className="w-full h-full rounded-[24px] overflow-hidden border border-slate-200/60 bg-slate-100 relative cursor-grab active:cursor-grabbing text-left flex items-center justify-center shadow-lg group"
            >
              <motion.img 
                src={bannerStudent} 
                alt="Medical Student" 
                className="w-full h-full object-cover origin-center"
                draggable="false"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Shimmer diagonal sweep sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-20" />
              
              {/* Glass badge overlay at the bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-lg flex justify-between items-center z-10">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-teal-800">SAARC & Non-SAARC Quota</span>
                  <span className="text-xs font-bold text-slate-800">Session 2026–27</span>
                </div>
                <span className="bg-teal-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  NMC Approved
                </span>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </section>

              


      {/* stats */}
      <section
        id="stats"
        className="py-16 px-5 bg-slate-50 border-y border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {
            stats.map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                viewport={{
                  once: true
                }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-black text-slate-900">
                  <span className="text-teal-600 mr-0.5">{item.prefix}</span>
                  <Counter value={item.number} />
                  <span className="text-teal-600 ml-0.5">{item.suffix}</span>
                </div>

                <p className="mt-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            ))
          }
        </div>
      </section>

<WhyBangladesh/>

      {/* BENEFITS */}


      <section

        id="Benefit"

        className="
        py-20
        px-5
        bg-slate-50
        "

      >


        <div

          className="
          max-w-7xl
          mx-auto
          grid
          lg:grid-cols-2
          gap-14
          items-center
          "

        >



          <div>


            <span

              className="
              inline-block
              bg-emerald-100
              text-emerald-600
              px-5
              py-2
              rounded-full
              text-sm
              font-semibold
              mb-5
              "

            >

              Benefits

            </span>




            <h2

              className="
              text-4xl
              md:text-5xl
              font-bold
              text-slate-900
              leading-tight
              "

            >

              Advantages of

              <span className="text-emerald-500">
                {" "}MBBS
              </span>

              <br />

              in Bangladesh

            </h2>




            <div className="w-20 h-1 bg-emerald-500 rounded-full my-7" />




            <div className="space-y-5">


              {
                benefits.map((item, index) => (


                  <div

                    key={index}

                    className="
                    flex
                    gap-5
                    bg-white
                    p-5
                    rounded-2xl
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition
                    "

                  >


                    <div

                      className="
                      min-w-10
                      h-10
                      rounded-full
                      bg-emerald-500
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                      "

                    >

                      ✓

                    </div>



                    <div>

                      <h3 className="font-semibold text-lg text-slate-900">

                        {item.title}

                      </h3>



                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">

                        {item.desc}

                      </p>


                    </div>


                  </div>


                ))
              }


            </div>


          </div>






          <div className="group">


            <img

              src={bannerStudent}

              alt="Students studying MBBS in Bangladesh"

              className="
              w-full
              rounded-3xl
              shadow-2xl
              transition
              duration-500
              group-hover:scale-105
              "

            />


          </div>


        </div>


      </section>




<TopColleges/>
{/* after the Top Colleges section */}
<FeesStructureSection />
<WhatWeHaveDone />


      {/* FAQ */}


      <section className="py-24 bg-white">


        <div className="max-w-3xl mx-auto px-5">


          <div className="text-center mb-14">


            <span className="text-green-600 font-semibold text-sm uppercase">

              FAQ

            </span>



            <h2 className="text-4xl font-extrabold text-gray-900 mt-3">

              Common questions

            </h2>



            <p className="text-gray-500 mt-3">

              Quick answers to the things we hear most often.

            </p>


          </div>




          <div className="space-y-3">


            {
              FAQS.map((faq) => (

                <FaqItem

                  key={faq.q}

                  {...faq}

                />

              ))
            }


          </div>


        </div>


      </section>





    </div>

  );

}


export default Hero;