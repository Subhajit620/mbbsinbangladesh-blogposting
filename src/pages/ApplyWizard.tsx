import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FormDataProvider } from '../context/FormDataContext';
import StepProgress from '../components/StepProgress';
import Step1PersonalInfo from '../components/steps/Step1PersonalInfo';
import Step2AcademicInfo from '../components/steps/Step2AcademicInfo';
import Step3NeetDetails from '../components/steps/Step3NeetDetails';
import Step4DocumentUpload from '../components/steps/Step4DocumentUpload';
import Step5ReviewSubmit from '../components/steps/Step5ReviewSubmit';
import { GraduationCap, Award, MapPin } from 'lucide-react';

import { colleges } from '../components/data/CollegesCard';

const steps = [
  { id: 1, label: 'Personal Information' },
  { id: 2, label: 'Academic Information' },
  { id: 3, label: 'NEET Details' },
  { id: 4, label: 'Documents Upload' },
  { id: 5, label: 'Review & Submit' },
];

const ApplyWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { collegeId } = useParams<{ collegeId: string }>();

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleFinish = () => navigate('/');

  useEffect(() => {
    const fetchCollege = async () => {
      if (!collegeId) return;
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo goNext={goNext} collegeId={collegeId!} />;
      case 2:
        return <Step2AcademicInfo goNext={goNext} goBack={goBack} />;
      case 3:
        return <Step3NeetDetails goNext={goNext} goBack={goBack} />;
      case 4:
        return <Step4DocumentUpload goNext={goNext} goBack={goBack} />;
      case 5:
        return <Step5ReviewSubmit goBack={goBack} setStep={setCurrentStep} onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} 
          className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent" 
        />
      </div>
    );
  }

  return (
    <FormDataProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-8 px-4 md:py-12">
        {/* Main Application Container */}
        <div className="w-full max-w-4xl space-y-6">
          
          {/* 1. Application Header Section */}
          <motion.div 
            className="w-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated floating background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/20 text-blue-200 border border-blue-400/20">
                  <GraduationCap size={14} /> Student Admission Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Student Application Form
                </h1>
                <p className="text-sm text-slate-300 max-w-lg">
                  Complete your application in a few simple steps. Ensure all details match your educational credentials.
                </p>
              </div>

              {/* College Quick Info badge */}
              {college && (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-xs max-w-xs">
                  {college.logo && (
                    <img
                      src={college.logo.startsWith('/') || college.logo.startsWith('data:') || college.logo.startsWith('http') || college.logo.startsWith('blob:') ? college.logo : `/logo/${college.logo}`}
                      alt={`${college.collegeName} Logo`}
                      className="w-10 h-10 object-contain rounded-md border border-white/10 p-0.5 bg-white shrink-0"
                    />
                  )}
                  <div className="flex flex-col space-y-1">
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Applying to</p>
                    <p className="font-bold text-sm text-white line-clamp-2 leading-snug">{college.collegeName}</p>
                    <div className="flex items-center gap-1 text-slate-300 font-semibold mt-0.5">
                      <MapPin size={12} className="text-emerald-400" />
                      <span>{college.city}, {college.country}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stepper Progress Section */}
          <motion.div 
            className="w-full bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <StepProgress steps={steps} currentStep={currentStep} />
          </motion.div>

          {/* Main Form Content Area */}
          <motion.div 
            className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 overflow-hidden"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </FormDataProvider>
  );
};

export default ApplyWizard;
