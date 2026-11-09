import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { colleges } from "./data/CollegesCard";
import CollegeCard from "./CollegeCard";

export default function TopColleges() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? colleges : colleges.filter((c) => c.tag === activeFilter);

  return (
    <section className="relative py-20 overflow-hidden bg-white/5 backdrop-blur-3xl border-y border-white/10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 rounded-3xl">
            Top NMC Eligible Colleges
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Top Medical Colleges</h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg">
            Choose from the best government medical colleges in Bangladesh offering
            affordable MBBS education for Indian students.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(0, 12).map((college, index) => (
            <CollegeCard
              key={college.id}
              college={college}
              index={index}
              className={index >= 6 ? "lg:justify-self-center" : ""}
            />
          ))}
        </div>

        {/* More Button */}
        <div className="mt-16 text-center">
          <Link to="/colleges">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -5px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-amber-600 cursor-pointer text-base border border-orange-400/20"
            >
              Explore More Colleges
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}