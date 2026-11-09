import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CollegeCard as CollegeCardType } from "./data/CollegesCard";

interface CollegeCardProps {
  college: CollegeCardType;
  index: number;
  className?: string;
}

export default function CollegeCard({ college, index, className = "" }: CollegeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 ${className}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={college.image.startsWith('http') || college.image.startsWith('/') ? college.image : `/${college.image}`}
          alt={college.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          NMC Compliant
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition">
          {college.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 mt-3">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{college.location}</span>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-sm text-gray-500">Total Fees</p>
            <h4 className="text-2xl font-bold text-emerald-600">{college.fees}</h4>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="mt-5 flex gap-2">
          {/* View Details Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Link
              to={`/college/${college.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-medium hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Apply Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Link
              to={`/application/${college.id}`}
              state={{ college }}
              className="flex items-center justify-center w-full py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
