import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, GraduationCap, DollarSign, Building, Award, CheckCircle } from 'lucide-react';

interface CollegeFee {
  id: string;
  name: string;
  university: string;
  totalPackage: number;
  admissionFee: number;
  hostelNotes: string;
}

const feeData: CollegeFee[] = [
  { id: '64b1f1a8e2b8f84d6c7b0002', name: 'Anwer Khan Modern Medical College', university: 'Dhaka University', totalPackage: 45000, admissionFee: 20000, hostelNotes: 'HOSTEL FEE (NON A/C) – 7000 BDT, (A/C) – 15000 BDT, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0011', name: 'Popular Medical College', university: 'Dhaka University', totalPackage: 43000, admissionFee: 20000, hostelNotes: 'Hostel 75–100 USD/month, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0004', name: 'Dhaka National Medical College', university: 'Dhaka University', totalPackage: 48000, admissionFee: 20000, hostelNotes: 'Hostel & Food approx. 100 USD/month' },
  { id: '64b1f1a8e2b8f84d6c7b0013', name: "Ad-Din Women's Medical College", university: 'Dhaka University', totalPackage: 43000, admissionFee: 23000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0014', name: 'Ad-Din Momin Medical College', university: 'Dhaka University', totalPackage: 35000, admissionFee: 18000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0015', name: 'Holy Family Red Crescent Medical College', university: 'Dhaka University', totalPackage: 50250, admissionFee: 16250, hostelNotes: 'Tuition approx. 3,800 USD/year, Hostel 3,500–10,000 BDT/month' },
  { id: '64b1f1a8e2b8f84d6c7b0016', name: 'Enam Medical College & Hospital', university: 'Dhaka University', totalPackage: 40000, admissionFee: 20000, hostelNotes: 'Hostel 70–90 USD/month, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0017', name: 'Tairunnessa Medical College & Hospital', university: 'Dhaka University', totalPackage: 36000, admissionFee: 19000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0018', name: 'Bangladesh Medical College', university: 'Dhaka University', totalPackage: 49000, admissionFee: 25000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0019', name: 'Jahurul Islam Medical College', university: 'Dhaka University', totalPackage: 42000, admissionFee: 19600, hostelNotes: 'Hostel Included, Food approx. 60 USD/month' },
  { id: '64b1f1a8e2b8f84d6c7b0003', name: 'Delta Medical College', university: 'Dhaka University', totalPackage: 47500, admissionFee: 16500, hostelNotes: 'N/A' },
  { id: '64b1f1a8e2b8f84d6c7b001a', name: "Kumudini Women's Medical College", university: 'Dhaka University', totalPackage: 45300, admissionFee: 15000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b001b', name: 'Ibrahim Medical College', university: 'Dhaka University', totalPackage: 44500, admissionFee: 16000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b001c', name: 'Medical College for Women & Hospital', university: 'Dhaka University', totalPackage: 45000, admissionFee: 15000, hostelNotes: 'Hostel & Food Excluded' },
  { id: '64b1f1a8e2b8f84d6c7b001d', name: 'Shahabuddin Medical College', university: 'Dhaka University', totalPackage: 45000, admissionFee: 21000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b001e', name: 'Marks Medical College', university: 'Dhaka University', totalPackage: 39000, admissionFee: 15000, hostelNotes: 'Hostel Fees Included' },
  { id: '64b1f1a8e2b8f84d6c7b001f', name: 'Z. H. Sikder Women\'s Medical College', university: 'Dhaka University', totalPackage: 42000, admissionFee: 25000, hostelNotes: 'Food 100 USD' },
  { id: '64b1f1a8e2b8f84d6c7b0020', name: 'International Medical College', university: 'Dhaka University', totalPackage: 44000, admissionFee: 20000, hostelNotes: 'Hostel Included, A/C Room 3,500 BDT' },
  { id: '64b1f1a8e2b8f84d6c7b0021', name: 'City Medical College', university: 'Dhaka University', totalPackage: 40000, admissionFee: 17000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0022', name: 'President Abdul Hamid Medical College', university: 'Dhaka University', totalPackage: 38000, admissionFee: 15000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0006', name: 'MH Samorita Medical College', university: 'Dhaka University', totalPackage: 44000, admissionFee: 20000, hostelNotes: 'N/A' },
  { id: '64b1f1a8e2b8f84d6c7b0023', name: 'Shaheed Monsur Ali Medical College', university: 'Dhaka University', totalPackage: 45000, admissionFee: 20000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0024', name: 'Diabetic Association Medical College', university: 'Dhaka University', totalPackage: 42000, admissionFee: 15000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0025', name: 'Universal Medical College', university: 'Dhaka University', totalPackage: 45000, admissionFee: 20000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0026', name: 'Ibn Sina Medical College', university: 'Dhaka University', totalPackage: 44000, admissionFee: 20000, hostelNotes: 'Hostel 70 USD/month, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0027', name: 'Community Based Medical College', university: 'Dhaka University', totalPackage: 45600, admissionFee: 23000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0028', name: 'East West Medical College', university: 'Dhaka University', totalPackage: 46000, admissionFee: 15000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0029', name: 'Mainamoti Medical College', university: 'Chittagong Medical University', totalPackage: 40000, admissionFee: 10000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002a', name: 'Central Medical College', university: 'Chittagong Medical University', totalPackage: 41000, admissionFee: 16000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002b', name: 'B.G.C Trust Medical College', university: 'Chittagong Medical University', totalPackage: 33000, admissionFee: 13000, hostelNotes: 'Utility Charges 3,000 BDT/month, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002c', name: 'Eastern Medical College', university: 'Chittagong Medical University', totalPackage: 43000, admissionFee: 12000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002d', name: 'Institute of Applied Health Science (IAHS)', university: 'Chittagong Medical University', totalPackage: 42000, admissionFee: 12000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002e', name: 'Southern Medical College & Hospital', university: 'Chittagong Medical University', totalPackage: 41000, admissionFee: 15000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0005', name: 'Jalalabad Ragib-Rabeya Medical College', university: 'Sylhet Medical University', totalPackage: 46950, admissionFee: 20000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b002f', name: 'North East Medical College', university: 'Sylhet Medical University', totalPackage: 42500, admissionFee: 12500, hostelNotes: 'N/A' },
  { id: '64b1f1a8e2b8f84d6c7b0030', name: "Sylhet Women's Medical College", university: 'Sylhet Medical University', totalPackage: 45000, admissionFee: 18000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0008', name: 'Parkview Medical College', university: 'Sylhet Medical University', totalPackage: 36000, admissionFee: 12000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0001', name: 'Ad-Din Akij Medical College', university: 'Sheikh Hasina Medical University', totalPackage: 33000, admissionFee: 13000, hostelNotes: 'Hostel Included, Food 40 USD/month' },
  { id: '64b1f1a8e2b8f84d6c7b0031', name: 'Khwaja Yunus Ali Medical College', university: 'Rajshahi Medical University', totalPackage: 48500, admissionFee: 16500, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0032', name: "Ad-Din Sakina Women's Medical College", university: 'Rajshahi Medical University', totalPackage: 33000, admissionFee: 13000, hostelNotes: 'Premium Room options available' },
  { id: '64b1f1a8e2b8f84d6c7b0033', name: 'TMSS Medical College', university: 'Rajshahi Medical University', totalPackage: 45000, admissionFee: 20000, hostelNotes: 'Hostel & Food Included' },
  { id: '64b1f1a8e2b8f84d6c7b0009', name: 'Prime Medical College', university: 'Rajshahi Medical University', totalPackage: 42500, admissionFee: 14500, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0034', name: 'Khulna City Medical College', university: 'Rajshahi Medical University', totalPackage: 40000, admissionFee: 12000, hostelNotes: 'Hostel 4,000 BDT/month, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0012', name: 'Rangpur Community Medical College & Hospital', university: 'Rajshahi Medical University', totalPackage: 44500, admissionFee: 20000, hostelNotes: 'Hostel Included, Food Self' },
  { id: '64b1f1a8e2b8f84d6c7b0035', name: 'North Bengal Medical College', university: 'Rajshahi Medical University', totalPackage: 38000, admissionFee: 18000, hostelNotes: 'Hostel Included, Food Self' }
];

export default function FeesStructureSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniv, setSelectedUniv] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Universities list for dropdown filter
  const universities = useMemo(() => {
    const list = new Set(feeData.map(c => c.university));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter and Sort Logic
  const processedData = useMemo(() => {
    let result = [...feeData];

    // Search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // University filter
    if (selectedUniv !== 'All') {
      result = result.filter(c => c.university === selectedUniv);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'packageAsc') {
        return a.totalPackage - b.totalPackage;
      }
      if (sortBy === 'packageDesc') {
        return b.totalPackage - a.totalPackage;
      }
      if (sortBy === 'admissionAsc') {
        return a.admissionFee - b.admissionFee;
      }
      if (sortBy === 'admissionDesc') {
        return b.admissionFee - a.admissionFee;
      }
      return 0;
    });

    return result;
  }, [searchTerm, selectedUniv, sortBy]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const activeData = processedData.length > 0 ? processedData : feeData;
    const packages = activeData.map(c => c.totalPackage);
    const univs = new Set(activeData.map(c => c.university));
    return {
      total: activeData.length,
      lowest: Math.min(...packages),
      highest: Math.max(...packages),
      univs: univs.size
    };
  }, [processedData]);

  // Pagination Helper
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;

  const handleReset = () => {
    setSearchTerm('');
    setSelectedUniv('All');
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="fees-structure">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-5">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.span
            className="text-orange-500 font-bold text-xs uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Fees Overview
          </motion.span>
          <motion.h2
            className="text-4xl font-extrabold text-slate-900 mt-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            MBBS Fees Structure in Bangladesh
          </motion.h2>
          <motion.p
            className="text-slate-500 max-w-3xl mx-auto mt-4 text-base leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Compare the latest MBBS fee structures of NMC (formerly MCI) and BMDC-approved medical colleges in Bangladesh. View total package fees, admission fees, affiliated universities, and hostel information in one place.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Colleges Listed', value: stats.total, icon: Building, color: 'text-blue-600 bg-blue-50' },
            { label: 'Lowest Package', value: `$${stats.lowest.toLocaleString()} USD`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Highest Package', value: `$${stats.highest.toLocaleString()} USD`, icon: Award, color: 'text-orange-600 bg-orange-50' },
            { label: 'Universities Covered', value: stats.univs, icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="p-5 rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-md shadow-sm flex items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-lg md:text-xl font-bold text-slate-800 mt-1">{stat.value}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by college name..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white text-sm shadow-inner transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* University Dropdown Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full md:w-auto shadow-sm">
              <Filter className="text-slate-400 shrink-0" size={16} />
              <select
                value={selectedUniv}
                onChange={e => {
                  setSelectedUniv(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none w-full cursor-pointer"
              >
                {universities.map((u, i) => (
                  <option key={i} value={u}>{u === 'All' ? 'All Universities' : u}</option>
                ))}
              </select>
            </div>

            {/* Sorting Select */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full md:w-auto shadow-sm">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none w-full cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="packageAsc">Package: Low to High</option>
                <option value="packageDesc">Package: High to Low</option>
                <option value="admissionAsc">Admission Fee: Low to High</option>
                <option value="admissionDesc">Admission Fee: High to Low</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm w-full md:w-auto shrink-0 cursor-pointer"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Fees Table */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 w-16 text-center">Sl. No.</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[260px]">College Name</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[220px]">Affiliated University</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right min-w-[150px]">Total Package (5 Years)</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right min-w-[130px]">Admission Fee</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[250px]">Hostel / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => {
                    const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">{globalIdx}</td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                            {item.name}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                            <CheckCircle size={10} />
                            NMC Rules Met
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-500">{item.university}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-800 text-right">
                          <span className="text-xs text-slate-400 font-normal mr-0.5">$</span>
                          {item.totalPackage.toLocaleString()}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">USD</span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">
                          <span className="text-xs text-slate-400 font-normal mr-0.5">$</span>
                          {item.admissionFee.toLocaleString()}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">USD</span>
                        </td>
                        <td className="py-4 px-6 text-xs font-medium text-slate-400 italic leading-relaxed">{item.hostelNotes}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-400">
                      No colleges match your filter criteria. Click reset to clear.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {processedData.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value={10}>10 Rows</option>
                  <option value={15}>15 Rows</option>
                  <option value={20}>20 Rows</option>
                </select>
                <p className="text-xs font-medium text-slate-400">
                  Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} Colleges
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
                >
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
                >
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
