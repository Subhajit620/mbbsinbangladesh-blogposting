import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, X, MapPin, GraduationCap, Maximize2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import all images from local assets folder
import * as images from '../assets/what-we-do';

interface CollegeShowcase {
  name: string;
  location: string;
  image: string;
  established: string;
}

const colleges: CollegeShowcase[] = [
  { name: 'Anwer Khan Modern Medical College', location: 'Dhaka', image: images.akmmc, established: 'Est. 2008' },
  { name: 'Prime Medical College', location: 'Rangpur', image: images.primemc, established: 'Est. 2002' },
  { name: 'Popular Medical College', location: 'Dhaka', image: images.pmc, established: 'Est. 2010' },
  { name: 'Kumudini Women\'s Medical College', location: 'Tangail', image: images.kumudini, established: 'Est. 2001' },
  { name: 'Delta Medical College', location: 'Dhaka', image: images.dcimc, established: 'Est. 2006' },
  { name: 'Community Based Medical College', location: 'Mymensingh', image: images.communityBased, established: 'Est. 1995' },
  { name: 'Holy Family Red Crescent Medical College', location: 'Dhaka', image: images.hfrcmc, established: 'Est. 2000' },
  { name: 'B.G.C Trust Medical College', location: 'Chittagong', image: images.bgcTrust, established: 'Est. 2002' },
  { name: 'City Medical College', location: 'Gazipur', image: images.cityMedical, established: 'Est. 2012' },
  { name: 'Brahmanbaria Medical College', location: 'Brahmanbaria', image: images.brahmanbaria, established: 'Est. 2010' },
  { name: 'Shahabuddin Medical College', location: 'Dhaka', image: images.untitledDesign41, established: 'Est. 2003' },
  { name: 'Mainamoti Medical College', location: 'Comilla', image: images.maynamati, established: 'Est. 2011' },
  { name: 'Aich Medical College', location: 'Dhaka', image: images.aich, established: 'Est. 2012' },
  { name: 'Dhaka National Medical College', location: 'Dhaka', image: images.dnmc, established: 'Est. 1994' },
  { name: 'TMSS Medical College', location: 'Bogra', image: images.tmss, established: 'Est. 2008' },
  { name: 'Eastern Medical College', location: 'Comilla', image: images.easternMedical, established: 'Est. 2005' },
  { name: 'Medical College for Women & Hospital', location: 'Dhaka', image: images.medicalCollegeWomen, established: 'Est. 1992' },
  { name: 'Jahurul Islam Medical College', location: 'Kishoreganj', image: images.jahurulIslam, established: 'Est. 1989' }
];

export default function WhatWeHaveDone() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % colleges.length);
    }
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + colleges.length) % colleges.length);
    }
  };

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden" id="what-we-have-done">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <motion.span
              className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-xs uppercase tracking-[0.2em] bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100/80 mb-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GraduationCap className="w-4.5 h-4.5" />
              Our Partner Institutions
            </motion.span>
            <motion.h2
              className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What We Have Done
            </motion.h2>
            <motion.p
              className="text-slate-500 mt-4 text-base sm:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Helping hundreds of students successfully secure MBBS admissions in top medical colleges across Bangladesh. Explore our elite network of verified partner institutions.
            </motion.p>
          </div>

          {/* Navigation Controls */}
          <motion.div 
            className="flex items-center gap-3 self-start md:self-end"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => swiper?.slidePrev()}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm hover:shadow-md hover:border-orange-500 hover:text-orange-600 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm hover:shadow-md hover:border-orange-500 hover:text-orange-600 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Carousel Slider */}
        <motion.div
          className="relative px-1 py-2"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            onSwiper={setSwiper}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
            }}
            className="swiper-showcase !pb-14"
          >
            {colleges.map((college, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  className="relative h-[380px] rounded-3xl overflow-hidden shadow-sm group cursor-pointer border border-slate-200/60 bg-white flex flex-col justify-end"
                  whileHover={{ y: -8, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  onClick={() => setLightboxIndex(idx)}
                >
                  {/* Image wrapper to create parallax scale on hover */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={college.image}
                      alt={college.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Glassy Overlay with modern gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />
                  </div>

                  {/* Maximize Icon that fades in */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Content Container */}
                  <div className="relative p-6 z-10 flex flex-col justify-end w-full h-1/2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] uppercase font-black text-orange-400 tracking-widest bg-orange-950/40 border border-orange-500/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        Partner College
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300">
                        {college.established}
                      </span>
                    </div>

                    <h4 className="text-white text-lg font-bold tracking-tight leading-snug drop-shadow-md group-hover:text-orange-300 transition-colors duration-300">
                      {college.name}
                    </h4>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1 text-slate-350 text-xs mt-3 opacity-90">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{college.location}, Bangladesh</span>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* Lightbox Gallery Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 sm:-top-2 sm:-right-2 bg-white/10 hover:bg-white/20 text-white w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all border border-white/20 hover:scale-105 active:scale-95 z-50 cursor-pointer"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Container */}
              <div className="relative w-full flex-1 flex items-center justify-center max-h-[75vh]">
                <img
                  src={colleges[lightboxIndex].image}
                  alt={colleges[lightboxIndex].name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />

                {/* Left Arrow inside Lightbox */}
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow inside Lightbox */}
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* College Detail Overlay Card */}
              <div className="w-full max-w-2xl bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-orange-400 tracking-wider">
                    Verified Partner College
                  </span>
                  <h3 className="text-white text-xl font-bold mt-1 tracking-tight">
                    {colleges[lightboxIndex].name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-350 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{colleges[lightboxIndex].location}, Bangladesh</span>
                  </div>
                </div>
                <div className="shrink-0 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Foundation</span>
                  <span className="text-white text-sm font-bold mt-0.5 block">{colleges[lightboxIndex].established}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
