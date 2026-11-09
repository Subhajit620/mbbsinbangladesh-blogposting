import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormData, NeetInfo } from '../../context/FormDataContext';
import { Calendar, Award } from 'lucide-react';

interface Props {
  goNext: () => void;
  goBack: () => void;
}

const Step3NeetDetails: React.FC<Props> = ({ goNext, goBack }) => {
  const { data, setData } = useFormData();
  const { register, handleSubmit, formState: { errors } } = useForm<NeetInfo>({
    defaultValues: data.neet as any,
  });

  const onSubmit = (values: NeetInfo) => {
    setData({ neet: values });
    goNext();
  };

  const inputClass = (hasError: any) => `
    flex-1 bg-transparent py-2.5 focus:outline-none text-gray-800 text-sm font-medium
    placeholder:text-gray-400 placeholder:font-normal
  `;

  const inputWrapperClass = (hasError: any) => `
    flex items-center border rounded-xl px-3 bg-white/50 backdrop-blur-sm transition-all duration-300
    ${hasError 
      ? 'border-red-500 focus-within:ring-4 focus-within:ring-red-100/50' 
      : 'border-gray-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/50'
    }
  `;

  // Recent years helper for NEET
  const currentYear = new Date().getFullYear();
  const neetYears = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[580px] justify-between">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Step Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">NEET Information</h2>
          <p className="text-xs text-gray-500 mt-1">Provide your NEET qualification details required for eligibility checks.</p>
        </div>

        {/* NEET Details Card */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
        >
          {/* NEET Appeared Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">NEET Appeared Year <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.neetYear)}>
              <Calendar size={18} className="mr-2.5 text-gray-400" />
              <select 
                className={`${inputClass(errors.neetYear)} bg-transparent w-full`} 
                {...register('neetYear', { required: 'NEET appeared year is required' })}
              >
                <option value="">Select Year</option>
                {neetYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errors.neetYear && <p className="text-red-600 text-xs font-medium">{errors.neetYear.message}</p>}
          </div>

          {/* NEET Score */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">NEET Score <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.neetScore)}>
              <Award size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="number" 
                placeholder="Enter score (e.g. 350)"
                className={inputClass(errors.neetScore)} 
                {...register('neetScore', { 
                  required: 'NEET score is required', 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Score must be positive' },
                  max: { value: 720, message: 'Max NEET score is 720' }
                })} 
              />
            </div>
            {errors.neetScore && <p className="text-red-600 text-xs font-medium">{errors.neetScore.message}</p>}
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

export default Step3NeetDetails;
