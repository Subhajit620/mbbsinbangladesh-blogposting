import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useFormData, PersonalInfo } from '../../context/FormDataContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

import { colleges } from '../data/CollegesCard';

interface Props {
  goNext: () => void;
  collegeId: string;
}

const Step1PersonalInfo: React.FC<Props> = ({ goNext, collegeId }) => {
  const { data, setData } = useFormData();
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
    defaultValues: data.personal as any,
  });
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const { data } = await axios.get(`/api/colleges/${collegeId}`);
        const localCollege = colleges.find((c) => String(c.id) === collegeId);
        if (localCollege) {
          data.logo = localCollege.logo;
          data.collegeName = localCollege.name;
          data.city = localCollege.location;
        }
        setCollege(data);
      } catch (e) {
        console.error(e);
        const localCollege = colleges.find((c) => String(c.id) === collegeId);
        if (localCollege) {
          setCollege({
            collegeName: localCollege.name,
            city: localCollege.location,
            country: 'Bangladesh',
            logo: localCollege.logo
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [collegeId]);

  const onSubmit = (values: PersonalInfo) => {
    setData({ personal: { ...values, collegeId, collegeName: college?.collegeName, collegeLogo: college?.logo } as any });
    goNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} 
          className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent" 
        />
      </div>
    );
  }

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

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="flex flex-col h-[580px] justify-between"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* College Card */}
        {college && (
          <motion.div 
            className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {/* Background pattern */}
            <div className="absolute right-0 top-0 w-32 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
            
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/30 text-blue-200 px-2.5 py-1 rounded-full border border-blue-400/20">
              Selected College
            </span>
            <div className="flex items-center gap-3 mt-2">
              {college.logo && (
                <img
                  src={college.logo.startsWith('/') || college.logo.startsWith('data:') || college.logo.startsWith('http') || college.logo.startsWith('blob:') ? college.logo : `/logo/${college.logo}`}
                  alt={`${college.collegeName} Logo`}
                  className="w-10 h-10 object-contain rounded-md border border-white/10 p-0.5 bg-white shrink-0"
                />
              )}
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">{college.collegeName}</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs text-blue-100/80 border-t border-white/10 pt-4">
              <div>
                <p className="text-blue-300 font-semibold uppercase tracking-wider text-[9px]">Course</p>
                <p className="font-semibold text-white mt-0.5">{college.courseName}</p>
              </div>
              <div>
                <p className="text-blue-300 font-semibold uppercase tracking-wider text-[9px]">Duration</p>
                <p className="font-semibold text-white mt-0.5">{college.duration}</p>
              </div>
              <div>
                <p className="text-blue-300 font-semibold uppercase tracking-wider text-[9px]">Total Fees</p>
                <p className="font-semibold text-white mt-0.5">{college.fees} TK</p>
              </div>
              <div>
                <p className="text-blue-300 font-semibold uppercase tracking-wider text-[9px]">Location</p>
                <p className="font-semibold text-white mt-0.5">{college.city}, {college.country}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
          <p className="text-xs text-gray-500 mt-1">Please provide your basic personal details for the admission process.</p>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.fullName)}>
              <User size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter your full name" 
                className={inputClass(errors.fullName)} 
                {...register('fullName', { required: 'Full Name is required' })} 
              />
            </div>
            {errors.fullName && <p className="text-red-600 text-xs font-medium">{errors.fullName.message}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date of Birth <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.dateOfBirth)}>
              <Calendar size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="date" 
                className={inputClass(errors.dateOfBirth)} 
                {...register('dateOfBirth', { required: 'Date of Birth is required' })} 
              />
            </div>
            {errors.dateOfBirth && <p className="text-red-600 text-xs font-medium">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gender <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.gender)}>
              <select 
                className={`${inputClass(errors.gender)} bg-transparent w-full`} 
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="" className="text-gray-400">Select gender</option>
                <option value="Male" className="text-gray-800 font-medium">Male</option>
                <option value="Female" className="text-gray-800 font-medium">Female</option>
                <option value="Other" className="text-gray-800 font-medium">Other</option>
              </select>
            </div>
            {errors.gender && <p className="text-red-600 text-xs font-medium">{errors.gender.message}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.email)}>
              <Mail size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className={inputClass(errors.email)} 
                {...register('email', { required: 'Email address is required' })} 
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs font-medium">{errors.email.message}</p>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mobile Number (+880) <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.mobile)}>
              <Phone size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="+8801XXXXXXXXX" 
                className={inputClass(errors.mobile)} 
                {...register('mobile', { required: 'Mobile number is required' })} 
              />
            </div>
            {errors.mobile && <p className="text-red-600 text-xs font-medium">{errors.mobile.message}</p>}
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">WhatsApp Number</label>
            <div className={inputWrapperClass(false)}>
              <Phone size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="+8801XXXXXXXXX" 
                className={inputClass(false)} 
                {...register('whatsapp')} 
              />
            </div>
          </div>

          {/* Full Address */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Address <span className="text-red-500">*</span></label>
            <div className={`${inputWrapperClass(errors.address)} items-start py-2.5`}>
              <MapPin size={18} className="mr-2.5 mt-1 text-gray-400" />
              <textarea 
                rows={2} 
                placeholder="Enter your complete correspondence address" 
                className="flex-1 bg-transparent focus:outline-none text-gray-800 text-sm font-medium resize-none" 
                {...register('address', { required: 'Full address is required' })} 
              />
            </div>
            {errors.address && <p className="text-red-600 text-xs font-medium">{errors.address.message}</p>}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.city)}>
              <MapPin size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter city"
                className={inputClass(errors.city)} 
                {...register('city', { required: 'City is required' })} 
              />
            </div>
            {errors.city && <p className="text-red-600 text-xs font-medium">{errors.city.message}</p>}
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country <span className="text-red-500">*</span></label>
            <div className={inputWrapperClass(errors.country)}>
              <MapPin size={18} className="mr-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter country"
                className={inputClass(errors.country)} 
                {...register('country', { required: 'Country is required' })} 
              />
            </div>
            {errors.country && <p className="text-red-600 text-xs font-medium">{errors.country.message}</p>}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
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

export default Step1PersonalInfo;
