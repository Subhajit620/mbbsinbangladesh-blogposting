import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormData, AcademicInfo, Subject } from '../../context/FormDataContext';
import { Calendar, BookOpen, Calculator, Award } from 'lucide-react';

interface Props {
  goNext: () => void;
  goBack: () => void;
}

const Step2AcademicInfo: React.FC<Props> = ({ goNext, goBack }) => {
  const { data, setData } = useFormData();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AcademicInfo>({
    defaultValues: data.academic as any,
  });

  // Watch subjects for calculations
  const class10Subjects = watch('class10Subjects') as Subject[];
  const class12Subjects = watch('class12Subjects') as Subject[];

  const calculateAgg = (subjects: Subject[] = []) => {
    const totalFull = subjects.reduce((s, sub) => s + (Number(sub.fullMarks) || 0), 0);
    const totalObt = subjects.reduce((s, sub) => s + (Number(sub.obtainedMarks) || 0), 0);
    const percentage = totalFull ? (totalObt / totalFull) * 100 : 0;
    const gpa = totalFull ? (totalObt / totalFull) * 10 : 0;
    return { totalFull, totalObt, percentage: Number(percentage.toFixed(2)), gpa: Number(gpa.toFixed(2)) };
  };

  const class10Agg = calculateAgg(class10Subjects);
  const class12Agg = calculateAgg(class12Subjects);

  const onSubmit: SubmitHandler<AcademicInfo> = values => {
    setData({ academic: values });
    goNext();
  };

  // Ensure at least 5 subjects for class10, 3 for class12
  useEffect(() => {
    if (!class10Subjects || class10Subjects.length < 5) {
      const currentLen = class10Subjects?.length || 0;
      const fill = Array.from({ length: 5 - currentLen }, (_, i) => ({
        name: `Subject ${currentLen + i + 1}`,
        fullMarks: 100,
        obtainedMarks: 0
      }));
      setValue('class10Subjects', [...(class10Subjects || []), ...fill]);
    }
    if (!class12Subjects || class12Subjects.length < 3) {
      const defaultNames = ['Physics', 'Chemistry', 'Biology'];
      const currentLen = class12Subjects?.length || 0;
      const fill = defaultNames.slice(currentLen).map(name => ({
        name,
        fullMarks: 100,
        obtainedMarks: 0
      }));
      setValue('class12Subjects', [...(class12Subjects || []), ...fill]);
    }
  }, []);

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 transition-all font-medium";
  const labelClass = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1";

  // Years helper
  const currentYear = new Date().getFullYear();
  const passingYears = Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[580px] justify-between">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Step Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Academic Details</h2>
          <p className="text-xs text-gray-500 mt-1">Please enter your secondary and higher secondary school grade details.</p>
        </div>

        {/* Class X Card */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen className="text-blue-600 w-5 h-5" />
            <h3 className="text-base font-bold text-gray-800">Class X (Secondary) Details</h3>
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Year of Passing <span className="text-red-500">*</span></label>
            <select className={inputClass} {...register('class10Year', { required: 'Passing year is required' })}>
              <option value="">Select year</option>
              {passingYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.class10Year && <p className="text-red-600 text-xs mt-1 font-medium">{errors.class10Year.message}</p>}
          </div>

          {/* Subject Inputs Header */}
          <div className="grid grid-cols-3 gap-3 px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div>Subject Name</div>
            <div>Full Marks</div>
            <div>Obtained Marks</div>
          </div>

          {/* Subjects inputs */}
          <div className="space-y-3">
            {class10Subjects && class10Subjects.map((sub, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. English" 
                  className={inputClass} 
                  {...register(`class10Subjects.${idx}.name` as const, { required: true })} 
                />
                <input 
                  type="number" 
                  placeholder="Full Marks" 
                  className={inputClass} 
                  {...register(`class10Subjects.${idx}.fullMarks` as const, { valueAsNumber: true, required: true })} 
                />
                <input 
                  type="number" 
                  placeholder="Obtained" 
                  className={inputClass} 
                  {...register(`class10Subjects.${idx}.obtainedMarks` as const, { valueAsNumber: true, required: true })} 
                />
              </div>
            ))}
          </div>

          {/* Class X aggregates display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50/50 rounded-xl p-3 border border-blue-100/30 text-xs font-semibold text-gray-700">
            <div>Total Full Marks: <span className="text-blue-700 font-bold text-sm block mt-0.5">{class10Agg.totalFull}</span></div>
            <div>Total Obtained: <span className="text-blue-700 font-bold text-sm block mt-0.5">{class10Agg.totalObt}</span></div>
            <div>Percentage: <span className="text-blue-700 font-bold text-sm block mt-0.5">{class10Agg.percentage}%</span></div>
            <div>GPA Score: <span className="text-blue-700 font-bold text-sm block mt-0.5">{class10Agg.gpa}</span></div>
          </div>
        </motion.div>

        {/* Class XII Card */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen className="text-indigo-600 w-5 h-5" />
            <h3 className="text-base font-bold text-gray-800">Class XII (Higher Secondary) Details</h3>
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Year of Passing <span className="text-red-500">*</span></label>
            <select className={inputClass} {...register('class12Year', { required: 'Passing year is required' })}>
              <option value="">Select year</option>
              {passingYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.class12Year && <p className="text-red-600 text-xs mt-1 font-medium">{errors.class12Year.message}</p>}
          </div>

          {/* Subject Inputs Header */}
          <div className="grid grid-cols-3 gap-3 px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div>Subject Name</div>
            <div>Full Marks</div>
            <div>Obtained Marks</div>
          </div>

          {/* Subjects inputs */}
          <div className="space-y-3">
            {class12Subjects && class12Subjects.map((sub, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-3">
                <input 
                  type="text" 
                  readOnly 
                  className={`${inputClass} bg-gray-50/50 text-gray-500 border-gray-200/85 font-semibold`} 
                  {...register(`class12Subjects.${idx}.name` as const)} 
                />
                <input 
                  type="number" 
                  placeholder="Full Marks" 
                  className={inputClass} 
                  {...register(`class12Subjects.${idx}.fullMarks` as const, { valueAsNumber: true, required: true })} 
                />
                <input 
                  type="number" 
                  placeholder="Obtained" 
                  className={inputClass} 
                  {...register(`class12Subjects.${idx}.obtainedMarks` as const, { valueAsNumber: true, required: true })} 
                />
              </div>
            ))}
          </div>

          {/* Class XII aggregates display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/30 text-xs font-semibold text-gray-700">
            <div>Total Full Marks: <span className="text-indigo-700 font-bold text-sm block mt-0.5">{class12Agg.totalFull}</span></div>
            <div>Total Obtained: <span className="text-indigo-700 font-bold text-sm block mt-0.5">{class12Agg.totalObt}</span></div>
            <div>Percentage: <span className="text-indigo-700 font-bold text-sm block mt-0.5">{class12Agg.percentage}%</span></div>
            <div>GPA Score: <span className="text-indigo-700 font-bold text-sm block mt-0.5">{class12Agg.gpa}</span></div>
          </div>
        </motion.div>

        {/* Overall Academic Summary Dashboard */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Calculator className="text-indigo-300 w-5 h-5" />
            <h3 className="text-base font-bold">Academic Summary Dashboard</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Class X GPA</span>
              <span className="block text-xl font-bold mt-1 text-white">{class10Agg.gpa}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Class XII GPA</span>
              <span className="block text-xl font-bold mt-1 text-white">{class12Agg.gpa}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Combined GPA</span>
              <span className="block text-xl font-bold mt-1 text-white">
                {Number(((class10Agg.gpa + class12Agg.gpa) / 2).toFixed(2))}
              </span>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 text-white col-span-2 md:col-span-1 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                <Award size={12} /> Merit Score
              </span>
              <span className="block text-xl font-bold mt-1">
                {Number((((class10Agg.gpa + class12Agg.gpa) / 2) * 10).toFixed(1))}
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={goBack} 
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300"
        >
          ← Back
        </button>
        <button 
          type="submit" 
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
};

export default Step2AcademicInfo;
