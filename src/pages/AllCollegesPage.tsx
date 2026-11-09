import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import CollegeCard from "../components/CollegeCard";
import { colleges } from "../components/data/CollegesCard";

export default function AllCollegesPage() {
  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col justify-between pt-20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Header Section */}
        <div className="text-center mb-16 mt-8">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 rounded-3xl"
          >
            NMC Eligible Partner Colleges
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
          >
            All Medical Colleges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed"
          >
            Browse the complete directory of government-approved and WDOMS-listed medical colleges in Bangladesh offering top-quality, affordable MBBS programs.
          </motion.p>
        </div>

        {/* Colleges Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {colleges.map((college, index) => (
            <CollegeCard
              key={college.id}
              college={college}
              index={index}
            />
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
