import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useFormData } from '../../context/FormDataContext';
import { CheckCircle2, Edit3, Loader2, FileText, Award, Calendar, User } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Props {
  goBack: () => void;
  setStep: (step: number) => void;
  onFinish: () => void;
}

const Step5ReviewSubmit: React.FC<Props> = ({ goBack, setStep, onFinish }) => {
  const { data } = useFormData();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const calcAgg = (subjects: any[]) => {
    const totalFull = (subjects || []).reduce((s, x) => s + (Number(x.fullMarks) || 0), 0);
    const totalObt = (subjects || []).reduce((s, x) => s + (Number(x.obtainedMarks) || 0), 0);
    const percentage = totalFull ? (totalObt / totalFull) * 100 : 0;
    const gpa = totalFull ? (totalObt / totalFull) * 10 : 0;
    return {
      totalFull,
      totalObt,
      percentage: Number(percentage.toFixed(2)),
      gpa: Number(gpa.toFixed(2)),
    };
  };

  const getImageDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const personal = data.personal || {};
      const academic = data.academic || {};
      const neet = data.neet || {};
      const documents = data.documents || {};

      const class10Agg = calcAgg(academic.class10Subjects || []);
      const class12Agg = calcAgg(academic.class12Subjects || []);
      const combinedGPA = Number(((class10Agg.gpa + class12Agg.gpa) / 2).toFixed(2));
      const overallPercentage = Number(((class10Agg.percentage + class12Agg.percentage) / 2).toFixed(2));

      const primaryColor = '#1C2733';
      const accentColor = '#A9772E';
      const bodyColor = '#3C4856';
      const margin = 15;
      const width = 210;
      const height = 297;

      doc.setFillColor(28, 39, 51);
      doc.rect(0, 0, width, 32, 'F');

      doc.setTextColor('#FFFFFF');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('MBBS ADMISSION DOSSIER RECEIPT', margin, 14);

      doc.setTextColor('#A9772E');
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('OFFICIAL SUBMISSION RECEIPT • ASPIRING LIFE ADMISSIONS', margin, 20);

      doc.setTextColor('#FFFFFF');
      doc.setFontSize(7.5);
      doc.text(`Submitted On: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, width - margin - 52, 14);
      doc.text('Status: PENDING VERIFICATION', width - margin - 52, 20);

      const drawSectionTitle = (title: string, y: number) => {
        doc.setFillColor(169, 119, 46);
        doc.rect(margin, y - 3.5, 1.5, 4.5, 'F');
        doc.setTextColor(primaryColor);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(title, margin + 4, y);
      };

      let currentY = 40;
      const collegeLogo = (personal as any).collegeLogo;
      const collegeName = (personal as any).collegeName;

      if (collegeLogo) {
        try {
          const logoUrl = collegeLogo.startsWith('/') || collegeLogo.startsWith('data:') || collegeLogo.startsWith('http') || collegeLogo.startsWith('blob:')
            ? collegeLogo
            : `/logo/${collegeLogo}`;
          const logoDataUrl = await getImageDataUrl(logoUrl);
          doc.addImage(logoDataUrl, 'PNG', margin, currentY, 20, 20);
        } catch (e) {
          console.warn('Failed to load college logo for PDF:', e);
        }
      }

      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(collegeName || 'MBBS Bangladesh Partner College', margin + 24, currentY + 5);

      doc.setTextColor(bodyColor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Affiliated Medical University | Location: Bangladesh', margin + 24, currentY + 10);
      doc.text('Course: Bachelor of Medicine and Bachelor of Surgery (MBBS)', margin + 24, currentY + 15);

      currentY += 25;
      doc.setDrawColor(235, 230, 218);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, width - margin, currentY);

      currentY += 8;
      drawSectionTitle('STUDENT PROFILE DETAILS', currentY);

      if (documents.passportPhoto) {
        try {
          const photoDataUrl = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target?.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(documents.passportPhoto as File);
          });
          doc.addImage(photoDataUrl, 'JPEG', width - margin - 30, currentY + 3, 30, 36);
          doc.setDrawColor(169, 119, 46);
          doc.rect(width - margin - 30, currentY + 3, 30, 36);
        } catch (e) {
          console.warn('Failed to load student photo for PDF:', e);
        }
      }

      doc.setTextColor(bodyColor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      
      const detailsX = margin;
      const spacingY = 5.5;
      let infoY = currentY + 6;

      doc.text(`Full Name: ${personal.fullName || ''}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Gender: ${personal.gender || ''}  |  Date of Birth: ${personal.dateOfBirth || ''}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Email Address: ${personal.email || ''}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Mobile Number: ${personal.mobile || ''}`, detailsX, infoY);
      infoY += spacingY;
      if (personal.whatsapp) {
        doc.text(`WhatsApp: ${personal.whatsapp}`, detailsX, infoY);
        infoY += spacingY;
      }
      doc.text(`Mailing Address: ${personal.address || ''}, ${personal.city || ''}, ${personal.country || ''}`, detailsX, infoY);

      currentY += 46;
      doc.setDrawColor(235, 230, 218);
      doc.line(margin, currentY, width - margin, currentY);

      currentY += 8;
      drawSectionTitle('ACADEMIC TRANSCRIPT LEDGER', currentY);

      currentY += 4;
      doc.setFillColor(248, 246, 240);
      doc.rect(margin, currentY, width - margin * 2, 8, 'F');
      
      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('Examination Ledger', margin + 3, currentY + 5.5);
      doc.text('Passing Year', margin + 65, currentY + 5.5);
      doc.text('GPA / 10', margin + 110, currentY + 5.5);
      doc.text('Percentage', margin + 150, currentY + 5.5);

      currentY += 8;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Class X Secondary School Certificate', margin + 3, currentY + 5.5);
      doc.text(String(academic.class10Year || ''), margin + 65, currentY + 5.5);
      doc.text(class10Agg.gpa.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${class10Agg.percentage.toFixed(1)}%`, margin + 150, currentY + 5.5);
      doc.setDrawColor(245, 242, 235);
      doc.line(margin, currentY + 8, width - margin, currentY + 8);

      currentY += 8;
      doc.text('Class XII Higher Secondary Certificate', margin + 3, currentY + 5.5);
      doc.text(String(academic.class12Year || ''), margin + 65, currentY + 5.5);
      doc.text(class12Agg.gpa.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${class12Agg.percentage.toFixed(1)}%`, margin + 150, currentY + 5.5);
      doc.line(margin, currentY + 8, width - margin, currentY + 8);

      currentY += 8;
      doc.setFillColor(248, 246, 240);
      doc.rect(margin, currentY, width - margin * 2, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.text('Combined Academic Aggregates', margin + 3, currentY + 5.5);
      doc.text('-', margin + 65, currentY + 5.5);
      doc.text(combinedGPA.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${overallPercentage.toFixed(1)}%`, margin + 150, currentY + 5.5);

      currentY += 14;
      doc.setDrawColor(235, 230, 218);
      doc.line(margin, currentY, width - margin, currentY);

      currentY += 8;
      drawSectionTitle('NEET PERFORMANCE CARD', currentY);

      currentY += 4;
      doc.setFillColor(248, 246, 240);
      doc.rect(margin, currentY, width - margin * 2, 16, 'F');

      doc.setTextColor(bodyColor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`NEET Exam Year: ${neet.neetYear || ''}`, margin + 5, currentY + 6.5);
      doc.text(`NEET Performance Score: ${neet.neetScore || ''} / 720`, margin + 5, currentY + 11.5);

      doc.setFillColor(28, 39, 51);
      doc.rect(width - margin - 45, currentY + 3.5, 40, 9, 'F');
      doc.setTextColor('#FFFFFF');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ELIGIBLE FOR MBBS', width - margin - 40, currentY + 9.5);

      currentY += 22;
      doc.setDrawColor(235, 230, 218);
      doc.line(margin, currentY, width - margin, currentY);

      currentY += 8;
      drawSectionTitle('STUDENT CERTIFICATION DECLARATION', currentY);
      
      doc.setTextColor(bodyColor);
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.text('I hereby certify that all information submitted here is correct, authentic, and matches my school documents.', margin, currentY + 5);

      if (documents.candidateSignature) {
        try {
          const sigDataUrl = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target?.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(documents.candidateSignature as File);
          });
          doc.addImage(sigDataUrl, 'JPEG', width - margin - 40, currentY + 7, 35, 10);
        } catch (e) {
          console.warn('Failed to load candidate signature for PDF:', e);
        }
      }
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(primaryColor);
      doc.text('Candidate Signature', width - margin - 33, currentY + 21);

      doc.setFillColor(248, 246, 240);
      doc.rect(margin, height - margin - 10, width - margin * 2, 7, 'F');

      doc.setTextColor(accentColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ASPIRING LIFE ADMISSIONS PORTAL • OFFICIAL COMPLIANCE RECEIPT COPY', margin + 5, height - margin - 5.5);

      doc.save(`${(personal.fullName || 'MBBS_Student').replace(/\s+/g, '_')}_MBBS_Application.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      // Personal
      if (data.personal) {
        Object.entries(data.personal).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
      }
      // Academic
      if (data.academic) {
        formData.append('academic', JSON.stringify(data.academic));
      }
      // NEET
      if (data.neet) {
        formData.append('neet', JSON.stringify(data.neet));
      }
      // Documents – files are stored as File objects
      if (data.documents) {
        const { passportPhoto, authorizedSignature, candidateSignature } = data.documents;
        if (passportPhoto) formData.append('passportPhoto', passportPhoto);
        if (authorizedSignature) formData.append('authorizedSignature', authorizedSignature);
        if (candidateSignature) formData.append('candidateSignature', candidateSignature);
      }

      await axios.post('/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode, stepNumber: number) => (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
      <div className="flex items-center gap-2 text-gray-800">
        {icon}
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      </div>
      <button 
        type="button" 
        onClick={() => setStep(stepNumber)} 
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition font-bold"
      >
        <Edit3 size={12} /> Edit
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-[580px] justify-between relative">
      <AnimatePresence>
        {success ? (
          <motion.div 
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center p-6 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-4"
            >
              <CheckCircle2 size={64} className="text-emerald-500 mx-auto drop-shadow-md" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-850">Application Submitted!</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1.5 mb-6 leading-relaxed">
              Your student application dossier has been uploaded successfully. You can download a copy of your receipt below.
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <button
                type="button"
                onClick={generatePDF}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition hover:opacity-95"
              >
                <FileText size={14} /> Download PDF Receipt
              </button>
              <button
                type="button"
                onClick={onFinish}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer transition hover:bg-slate-800"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Step Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Review & Submit</h2>
          <p className="text-xs text-gray-500 mt-1">Double-check all entered information before submitting your final application.</p>
        </div>

        {/* 1. Personal Info */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderSectionHeader('Personal Details', <User size={16} className="text-blue-600" />, 1)}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-xs">
            <div>
              <p className="text-gray-400 font-medium">Full Name</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Date of Birth</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Gender</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.gender}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Email Address</p>
              <p className="text-gray-800 font-semibold mt-0.5 break-all">{data.personal?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Mobile Number</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.mobile}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">WhatsApp Number</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.whatsapp || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 font-medium">Full Address</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.address}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">City & Country</p>
              <p className="text-gray-800 font-semibold mt-0.5">{data.personal?.city}, {data.personal?.country}</p>
            </div>
          </div>
        </motion.div>

        {/* 2. Academic Info */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {renderSectionHeader('Academic Details', <FileText size={16} className="text-indigo-600" />, 2)}
          
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 font-medium">Class X Year of Passing</p>
                <p className="text-gray-800 font-bold mt-0.5">{data.academic?.class10Year}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Class XII Year of Passing</p>
                <p className="text-gray-800 font-bold mt-0.5">{data.academic?.class12Year}</p>
              </div>
            </div>

            {/* Subjects Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100/50">
              <div>
                <p className="text-gray-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Class X Subject Marks</p>
                <div className="space-y-1.5 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                  {data.academic?.class10Subjects?.map((sub, i) => (
                    <div key={i} className="flex justify-between font-medium">
                      <span className="text-gray-600">{sub.name}</span>
                      <span className="text-gray-800">{sub.obtainedMarks} / {sub.fullMarks}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Class XII Subject Marks</p>
                <div className="space-y-1.5 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                  {data.academic?.class12Subjects?.map((sub, i) => (
                    <div key={i} className="flex justify-between font-medium">
                      <span className="text-gray-600">{sub.name}</span>
                      <span className="text-gray-800">{sub.obtainedMarks} / {sub.fullMarks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. NEET details */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {renderSectionHeader('NEET Details', <Award size={16} className="text-amber-600" />, 3)}
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400 font-medium">NEET Appeared Year</p>
              <p className="text-gray-800 font-bold mt-0.5">{data.neet?.neetYear}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">NEET Score</p>
              <p className="text-gray-800 font-bold mt-0.5 text-sm text-emerald-600">{data.neet?.neetScore}</p>
            </div>
          </div>
        </motion.div>

        {/* 4. Uploaded Documents */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {renderSectionHeader('Uploaded Documents', <Calendar size={16} className="text-rose-600" />, 4)}
          
          <div className="grid grid-cols-3 gap-4">
            {data.documents && Object.entries(data.documents).map(([key, file]) => {
              if (!file) return null;
              const label = key === 'passportPhoto' 
                ? 'Passport Photo' 
                : key === 'authorizedSignature' 
                ? 'Authorized Sig' 
                : 'Candidate Sig';

              return (
                <div key={key} className="flex flex-col items-center space-y-1.5 p-2 bg-gray-50/50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-500 font-bold">{label}</span>
                  <img src={URL.createObjectURL(file as File)} alt={label} className="h-16 object-contain rounded-md" />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={goBack} 
          disabled={submitting}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
        >
          ← Back
        </button>
        <button 
          type="button" 
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );
};

export default Step5ReviewSubmit;
