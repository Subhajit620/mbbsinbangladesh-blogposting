import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFormData, DocumentFiles } from '../../context/FormDataContext';
import { UploadCloud, FileImage, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  goNext: () => void;
  goBack: () => void;
}

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const maxSize = 500 * 1024; // 500KB

const Step4DocumentUpload: React.FC<Props> = ({ goNext, goBack }) => {
  const { data, setData } = useFormData();
  const { handleSubmit } = useForm<DocumentFiles>({
    defaultValues: data.documents as any,
  });

  const [files, setFiles] = useState<Record<keyof DocumentFiles, File | null>>({
    passportPhoto: (data.documents?.passportPhoto as File) || null,
    authorizedSignature: (data.documents?.authorizedSignature as File) || null,
    candidateSignature: (data.documents?.candidateSignature as File) || null,
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate previews for existing files
    const newPreviews: Record<string, string> = {};
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        newPreviews[key] = URL.createObjectURL(file);
      }
    });
    setPreviews(newPreviews);

    return () => {
      Object.values(newPreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (file: File | undefined, key: keyof DocumentFiles) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [key]: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.' }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [key]: 'File is too large. Max size allowed is 500KB.' }));
      return;
    }

    // Clear errors
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    const newUrl = URL.createObjectURL(file);
    setPreviews(prev => {
      if (prev[key]) {
        URL.revokeObjectURL(prev[key]);
      }
      return { ...prev, [key]: newUrl };
    });

    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const removeFile = (key: keyof DocumentFiles) => {
    if (previews[key]) {
      URL.revokeObjectURL(previews[key]);
    }
    setPreviews(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setFiles(prev => ({ ...prev, [key]: null }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const onSubmit = () => {
    // Validate that all required files are uploaded
    const newErrors: Record<string, string> = {};
    if (!files.passportPhoto) newErrors.passportPhoto = 'Passport photo is required';
    if (!files.authorizedSignature) newErrors.authorizedSignature = 'Authorized signature is required';
    if (!files.candidateSignature) newErrors.candidateSignature = 'Candidate signature is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setData({ documents: files });
    goNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[580px] justify-between">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Step Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
          <p className="text-xs text-gray-500 mt-1">Upload scan copies of your photo, passport, and signatures. Format: JPG, JPEG, PNG | Max size: 500KB.</p>
        </div>

        {/* Upload Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['passportPhoto', 'authorizedSignature', 'candidateSignature'] as (keyof DocumentFiles)[]).map((key) => {
            const file = files[key];
            const preview = previews[key];
            const error = errors[key];
            const label = key === 'passportPhoto' 
              ? 'Passport Photo' 
              : key === 'authorizedSignature' 
              ? 'Authorized Signature' 
              : 'Candidate Signature';

            return (
              <div key={key} className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label} <span className="text-red-500">*</span></label>
                
                {/* Upload Zone */}
                <div 
                  className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 relative min-h-[180px] bg-white/50 backdrop-blur-sm transition-all duration-300 ${
                    error ? 'border-red-400 bg-red-50/20' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/10'
                  }`}
                >
                  {preview ? (
                    <div className="w-full flex flex-col items-center space-y-3 p-1">
                      <img src={preview} alt={label} className="h-28 object-contain rounded-xl shadow-sm border border-gray-100" />
                      <div className="flex items-center justify-between w-full bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200/50">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileImage size={16} className="text-blue-600 flex-shrink-0" />
                          <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[120px]">{file?.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(key)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 flex flex-col items-center cursor-pointer w-full h-full justify-center">
                      <input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => handleFileChange(e.target.files?.[0], key)}
                      />
                      <UploadCloud size={32} className="text-gray-400 mb-2" />
                      <p className="text-xs font-bold text-gray-700">Drag and drop file</p>
                      <p className="text-[10px] text-gray-400 mt-1">or click to browse</p>
                      <p className="text-[9px] text-gray-400/80 mt-2">JPG, JPEG, PNG (max 500KB)</p>
                    </div>
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                    <ShieldAlert size={12} /> {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
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

export default Step4DocumentUpload;
