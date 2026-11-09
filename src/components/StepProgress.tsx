import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const StepProgress: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10 rounded-full" />
        
        {/* Animated Progress Fill Line */}
        <motion.div 
          className="absolute top-5 left-10 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: 'calc(100% - 80px)' }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#FFFFFF',
                  borderColor: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#D1D5DB',
                  color: isCompleted || isActive ? '#FFFFFF' : '#4B5563',
                  boxShadow: isActive ? '0 0 15px rgba(37, 99, 235, 0.4)' : 'none'
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm z-10`}
              >
                {isCompleted ? (
                  <Check size={18} className="stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <span 
                className={`mt-2 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? 'text-blue-700 font-bold' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile/Compact Stepper */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-bold text-gray-800 mt-0.5">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div className="flex gap-1.5 items-center">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            return (
              <motion.div
                key={step.id}
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#D1D5DB'
                }}
                className="h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
