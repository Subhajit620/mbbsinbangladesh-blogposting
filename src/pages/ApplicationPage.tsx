import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  User,
  GraduationCap,
  ClipboardList,
  UploadCloud,
  BadgeCheck,
  X,
  Pencil,
  Loader2,
  ImageOff,
  MapPin,
  Wallet,
  FileText,
} from 'lucide-react';
import { colleges, CollegeCard } from '../components/data/CollegesCard';

/* ------------------------------------------------------------------ */
/*  Design tokens — "admission dossier" system                        */
/*  Paper ground + ink type + a brass seal accent that fills the       */
/*  stepper rail as the applicant moves through the ledger.            */
/* ------------------------------------------------------------------ */
const T = {
  paper: '#F7F4EC',
  paperRaised: '#FFFFFF',
  ink: '#1C2733',
  inkSoft: '#3C4856',
  mist: '#6B7686',
  hairline: '#E4DECF',
  brass: '#A9772E',
  brassSoft: '#F1E4CC',
  sage: '#4B7A5B',
  sageSoft: '#E5EEE7',
  brick: '#B23B32',
  brickSoft: '#F6E7E5',
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');";

const displayFont = "'Fraunces', Georgia, serif";
const bodyFont = "'Inter', system-ui, sans-serif";
const monoFont = "'IBM Plex Mono', ui-monospace, monospace";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Subject {
  name: string;
  fullMarks: number;
  obtainedMarks: number;
}

interface FormValues {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  address: string;
  city: string;
  country: string;
  class10Year: string;
  class10Subjects: Subject[];
  class12Year: string;
  class12Subjects: Subject[];
  neetYear: string;
  neetScore: number;
}

type DocKey = 'userPhoto' | 'passportPhoto' | 'authorizedSignature' | 'candidateSignature';

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
const schema = yup
  .object({
    fullName: yup.string().required('Full name is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    gender: yup.string().oneOf(['Male', 'Female', 'Other']).required('Gender is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile: yup
      .string()
      .matches(/^\d{6,12}$/, 'Enter a valid number (digits only)')
      .required('Mobile number is required'),
    whatsapp: yup
      .string()
      .optional()
      .nullable()
      .transform((v) => (v === '' ? null : v))
      .matches(/^\d{6,12}$/, {
        message: 'Enter a valid number (digits only)',
        excludeEmptyString: true,
      }),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    class10Year: yup.string().required('Year of passing is required'),
    class12Year: yup.string().required('Year of passing is required'),
    neetYear: yup.string().required('NEET year is required'),
    neetScore: yup
      .number()
      .typeError('NEET score must be a number')
      .required('NEET score is required'),
  })
  .required();

const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

/* Country dial codes for the mobile / WhatsApp fields. Bangladesh first since
   most applicants file from there; the rest cover the applicant pool this
   admission dossier is built for (South Asia, Gulf, Africa, and beyond). */
interface CountryCode {
  name: string;
  iso2: string;
  dial: string;
  flag: string;
}

const COUNTRIES: CountryCode[] = [
  { name: 'Bangladesh', iso2: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'India', iso2: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Pakistan', iso2: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Nepal', iso2: 'NP', dial: '+977', flag: '🇳🇵' },
  { name: 'Sri Lanka', iso2: 'LK', dial: '+94', flag: '🇱🇰' },
  { name: 'Bhutan', iso2: 'BT', dial: '+975', flag: '🇧🇹' },
  { name: 'Maldives', iso2: 'MV', dial: '+960', flag: '🇲🇻' },
  { name: 'Myanmar', iso2: 'MM', dial: '+95', flag: '🇲🇲' },
  { name: 'Indonesia', iso2: 'ID', dial: '+62', flag: '🇮🇩' },
  { name: 'Malaysia', iso2: 'MY', dial: '+60', flag: '🇲🇾' },
  { name: 'Saudi Arabia', iso2: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'United Arab Emirates', iso2: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Qatar', iso2: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', iso2: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Oman', iso2: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Bahrain', iso2: 'BH', dial: '+973', flag: '🇧🇭' },
  { name: 'Nigeria', iso2: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Kenya', iso2: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Sudan', iso2: 'SD', dial: '+249', flag: '🇸🇩' },
  { name: 'South Africa', iso2: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'Egypt', iso2: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'United Kingdom', iso2: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', iso2: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Canada', iso2: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Australia', iso2: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'China', iso2: 'CN', dial: '+86', flag: '🇨🇳' },
  { name: 'Philippines', iso2: 'PH', dial: '+63', flag: '🇵🇭' },
];

const DEFAULT_COUNTRY = COUNTRIES[0];


/* Which fields must be valid before the applicant may advance past each step */
const STEP_FIELDS: (keyof FormValues)[][] = [
  ['fullName', 'dateOfBirth', 'gender', 'email', 'mobile', 'whatsapp', 'address', 'city', 'country'],
  ['class10Year', 'class12Year'],
  ['neetYear', 'neetScore'],
  [],
  [],
];

const STEPS = [
  { label: 'Personal Details', icon: User },
  { label: 'Academic Details', icon: GraduationCap },
  { label: 'NEET Details', icon: ClipboardList },
  { label: 'Upload Documents', icon: UploadCloud },
  { label: 'Review & Submit', icon: BadgeCheck },
];

const DOC_LABELS: Record<DocKey, string> = {
  userPhoto: 'Your Photo',
  passportPhoto: 'Passport Photo',
  authorizedSignature: 'Authorized Signature',
  candidateSignature: 'Candidate Signature',
};

/* Documents required on Step 4 (Upload Documents) — userPhoto is collected
   earlier, on Step 1 (Personal Details), so it's excluded here. */
const STEP4_DOCS: DocKey[] = ['passportPhoto', 'authorizedSignature', 'candidateSignature'];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
const Field: React.FC<{ label: string; required?: boolean; error?: string; className?: string; children: React.ReactNode }> = ({
  label,
  required,
  error,
  className,
  children,
}) => (
  <div className={className}>
    <label className="block text-sm mb-1.5" style={{ color: T.inkSoft, fontFamily: bodyFont, fontWeight: 500 }}>
      {label} {required && <span style={{ color: T.brick }}>*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs mt-1" style={{ color: T.brick, fontFamily: bodyFont }}>
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  'w-full rounded-md px-3.5 py-2.5 text-[15px] outline-none transition-colors duration-150 bg-white';

function inputStyle(hasError?: boolean, options?: { borderLeft?: string; borderRight?: string }): React.CSSProperties {
  const borderColor = hasError ? T.brick : T.hairline;
  const style: React.CSSProperties = {
    fontFamily: bodyFont,
    color: T.ink,
  };
  if (options) {
    style.borderTop = `1.5px solid ${borderColor}`;
    style.borderBottom = `1.5px solid ${borderColor}`;
    style.borderLeft = options.borderLeft !== undefined ? options.borderLeft : `1.5px solid ${borderColor}`;
    style.borderRight = options.borderRight !== undefined ? options.borderRight : `1.5px solid ${borderColor}`;
  } else {
    style.border = `1.5px solid ${borderColor}`;
  }
  return style;
}

/* ------------------------------------------------------------------ */
/*  Country code picker — used by the phone number fields               */
/* ------------------------------------------------------------------ */
const CountryCodeSelect: React.FC<{ value: string; onChange: (dial: string) => void; hasError?: boolean }> = ({
  value,
  onChange,
  hasError,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find((c) => c.dial === value) || DEFAULT_COUNTRY;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.dial.includes(query),
  );

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 h-full px-3 py-2.5 rounded-l-md whitespace-nowrap"
        style={{
          borderTop: `1.5px solid ${hasError ? T.brick : T.hairline}`,
          borderBottom: `1.5px solid ${hasError ? T.brick : T.hairline}`,
          borderLeft: `1.5px solid ${hasError ? T.brick : T.hairline}`,
          borderRight: 'none',
          background: T.paperRaised,
          fontFamily: bodyFont,
        }}
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-[15px]" style={{ fontFamily: monoFont, color: T.ink }}>
          {selected.dial}
        </span>
        <ChevronDown size={14} style={{ color: T.mist }} />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1.5 w-72 rounded-lg overflow-hidden shadow-lg"
          style={{ background: T.paperRaised, border: `1px solid ${T.hairline}` }}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: T.hairline }}>
            <Search size={14} style={{ color: T.mist }} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full text-sm outline-none bg-transparent"
              style={{ fontFamily: bodyFont, color: T.ink }}
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-3 text-sm" style={{ color: T.mist, fontFamily: bodyFont }}>
                No matching country
              </p>
            )}
            {filtered.map((c) => (
              <button
                key={c.iso2}
                type="button"
                onClick={() => {
                  onChange(c.dial);
                  setOpen(false);
                  setQuery('');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors duration-100"
                style={{
                  fontFamily: bodyFont,
                  color: T.ink,
                  background: c.dial === value ? T.brassSoft : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (c.dial !== value) e.currentTarget.style.background = T.paper;
                }}
                onMouseLeave={(e) => {
                  if (c.dial !== value) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span style={{ fontFamily: monoFont, color: T.mist }}>{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const Stepper: React.FC<{ current: number; furthest: number; onJump: (i: number) => void }> = ({
  current,
  furthest,
  onJump,
}) => {
  const pct = (current / (STEPS.length - 1)) * 100;
  return (
    <div
      className="sticky top-0 z-20 border-b"
      style={{ background: 'rgba(247,244,236,0.92)', backdropFilter: 'blur(8px)', borderColor: T.hairline }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* mobile: compact current-step readout */}
        <div className="flex sm:hidden items-center justify-between mb-2">
          <span className="text-xs tracking-wide uppercase" style={{ color: T.mist, fontFamily: bodyFont }}>
            Step {current + 1} of {STEPS.length}
          </span>
          <span className="text-sm font-medium" style={{ color: T.ink, fontFamily: displayFont }}>
            {STEPS[current].label}
          </span>
        </div>

        <div className="relative flex items-start justify-between">
          {/* base rail */}
          <div className="absolute top-4 left-4 right-4 h-[2px]" style={{ background: T.hairline }} />
          {/* filled rail */}
          <motion.div
            className="absolute top-4 left-4 h-[2px]"
            style={{ background: T.brass }}
            initial={false}
            animate={{ width: `calc(${pct}% - ${pct === 0 ? 0 : 32}px * ${pct / 100})` }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i < current;
            const active = i === current;
            const reachable = i <= furthest;
            return (
              <button
                key={step.label}
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                className="relative z-10 flex flex-col items-center gap-1.5 flex-1 group"
                style={{ cursor: reachable ? 'pointer' : 'default' }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: done ? T.sage : active ? T.brass : T.paperRaised,
                    border: `1.5px solid ${done ? T.sage : active ? T.brass : T.hairline}`,
                    color: done || active ? '#fff' : T.mist,
                  }}
                >
                  {done ? <Check size={15} strokeWidth={2.5} /> : <Icon size={14} strokeWidth={2} />}
                </span>
                <span
                  className="hidden sm:block text-[11.5px] text-center leading-tight max-w-[84px]"
                  style={{
                    fontFamily: bodyFont,
                    fontWeight: active ? 600 : 500,
                    color: active ? T.ink : done ? T.inkSoft : T.mist,
                  }}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Document upload card — drag & drop, preview, validation            */
/* ------------------------------------------------------------------ */
const UploadCard: React.FC<{
  docKey: DocKey;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
}> = ({ docKey, file, onChange, error }) => {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = (f: File | undefined) => {
    if (!f) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(f.type)) {
      toast.error(`${DOC_LABELS[docKey]} must be JPG, JPEG or PNG`);
      return;
    }
    if (f.size > 500 * 1024) {
      toast.error(`${DOC_LABELS[docKey]} must be smaller than 500KB`);
      return;
    }
    onChange(f);
  };

  return (
    <div>
      <p className="text-sm mb-1.5" style={{ color: T.inkSoft, fontFamily: bodyFont, fontWeight: 500 }}>
        {DOC_LABELS[docKey]} <span style={{ color: T.brick }}>*</span>
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          acceptFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => !file && inputRef.current?.click()}
        className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center text-center transition-colors duration-150"
        style={{
          minHeight: 168,
          border: `1.5px dashed ${dragging ? T.brass : error ? T.brick : T.hairline}`,
          background: dragging ? T.brassSoft : T.paperRaised,
          cursor: file ? 'default' : 'pointer',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
        {preview ? (
          <>
            <img src={preview} alt={DOC_LABELS[docKey]} className="max-h-32 object-contain" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: T.ink, color: '#fff' }}
            >
              <X size={14} />
            </button>
            <span
              className="absolute bottom-2 left-2 right-2 text-[11px] truncate px-2 py-1 rounded"
              style={{ background: 'rgba(255,255,255,0.9)', color: T.mist, fontFamily: bodyFont }}
            >
              {file?.name}
            </span>
          </>
        ) : (
          <div className="px-4">
            <UploadCloud size={22} style={{ color: T.brass, margin: '0 auto 8px' }} />
            <p className="text-[13px]" style={{ color: T.inkSoft, fontFamily: bodyFont }}>
              Drag & drop, or <span style={{ color: T.brass, fontWeight: 600 }}>browse</span>
            </p>
            <p className="text-[11px] mt-1" style={{ color: T.mist, fontFamily: bodyFont }}>
              JPG or PNG, up to 500KB
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: T.brick, fontFamily: bodyFont }}>
          {error}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Academic score ledger — read-only, mono figures on a brass tint     */
/* ------------------------------------------------------------------ */
const LedgerRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-[13px]" style={{ color: T.inkSoft, fontFamily: bodyFont }}>
      {label}
    </span>
    <span className="text-[14px]" style={{ color: T.ink, fontFamily: monoFont, fontWeight: 600 }}>
      {value}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const ApplicationPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // The college card the applicant clicked passes its full data via router
  // state (see TopColleges' <Link state={{ college }}>), so it renders here
  // with no flash of missing data. If the page is opened directly (e.g. a
  // bookmarked or shared /application/:id URL), fall back to looking it up
  // in the shared colleges list by id.
  const stateCollege = (location.state as { college?: CollegeCard } | null)?.college;
  const [college] = useState<CollegeCard | null>(
    stateCollege ?? colleges.find((c) => String(c.id) === collegeId) ?? null,
  );
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [docErrors, setDocErrors] = useState<Partial<Record<DocKey, string>>>({});
  const [docs, setDocs] = useState<Record<DocKey, File | null>>({
    userPhoto: null,
    passportPhoto: null,
    authorizedSignature: null,
    candidateSignature: null,
  });
  const [mobileCountry, setMobileCountry] = useState(DEFAULT_COUNTRY.dial);
  const [whatsappCountry, setWhatsappCountry] = useState(DEFAULT_COUNTRY.dial);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: 'onTouched',
    defaultValues: {
      class10Subjects: Array.from({ length: 5 }, () => ({ name: '', fullMarks: 0, obtainedMarks: 0 })),
      class12Subjects: [
        { name: 'Physics', fullMarks: 0, obtainedMarks: 0 },
        { name: 'Chemistry', fullMarks: 0, obtainedMarks: 0 },
        { name: 'Biology', fullMarks: 0, obtainedMarks: 0 },
      ],
      city: 'Dhaka',
      country: 'Bangladesh',
    },
  });

  const class10Subjects = watch('class10Subjects');
  const class12Subjects = watch('class12Subjects');

  const calcAgg = (subjects: Subject[]) => {
    const totalFull = subjects.reduce((s, x) => s + (Number(x.fullMarks) || 0), 0);
    const totalObt = subjects.reduce((s, x) => s + (Number(x.obtainedMarks) || 0), 0);
    const percentage = totalFull ? (totalObt / totalFull) * 100 : 0;
    const gpa = totalFull ? (totalObt / totalFull) * 10 : 0;
    return {
      totalFull,
      totalObt,
      percentage: Number(percentage.toFixed(2)),
      gpa: Number(gpa.toFixed(2)),
    };
  };

  const class10Agg = calcAgg(class10Subjects || []);
  const class12Agg = calcAgg(class12Subjects || []);
  const overall = useMemo(
    () => ({
      combinedGPA: Number(((class10Agg.gpa + class12Agg.gpa) / 2).toFixed(2)),
      overallPercentage: Number(((class10Agg.percentage + class12Agg.percentage) / 2).toFixed(2)),
      academicScore: Number((((class10Agg.gpa + class12Agg.gpa) / 2) * 10).toFixed(2)),
    }),
    [class10Agg.gpa, class12Agg.gpa, class10Agg.percentage, class12Agg.percentage],
  );

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
    const toastId = toast.loading('Compiling application PDF...');
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const data = getValues();
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
      if (college && college.logo) {
        try {
          const logoUrl = college.logo.startsWith('/') || college.logo.startsWith('data:') || college.logo.startsWith('http') || college.logo.startsWith('blob:')
            ? college.logo
            : `/logo/${college.logo}`;
          const logoDataUrl = await getImageDataUrl(logoUrl);
          doc.addImage(logoDataUrl, 'PNG', margin, currentY, 20, 20);
        } catch (e) {
          console.warn('Failed to load college logo for PDF:', e);
        }
      }

      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(college ? college.name : 'MBBS Bangladesh Partner College', margin + 24, currentY + 5);

      doc.setTextColor(bodyColor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Affiliated Medical University | Location: ${college ? college.location : 'Bangladesh'}`, margin + 24, currentY + 10);
      doc.text('Course: Bachelor of Medicine and Bachelor of Surgery (MBBS)', margin + 24, currentY + 15);

      currentY += 25;
      doc.setDrawColor(235, 230, 218);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, width - margin, currentY);

      currentY += 8;
      drawSectionTitle('STUDENT PROFILE DETAILS', currentY);

      if (docs.userPhoto) {
        try {
          const photoDataUrl = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target?.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(docs.userPhoto as File);
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

      doc.text(`Full Name: ${data.fullName}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Gender: ${data.gender}  |  Date of Birth: ${data.dateOfBirth}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Email Address: ${data.email}`, detailsX, infoY);
      infoY += spacingY;
      doc.text(`Mobile Number: ${mobileCountry}${data.mobile}`, detailsX, infoY);
      infoY += spacingY;
      if (data.whatsapp) {
        doc.text(`WhatsApp: ${whatsappCountry}${data.whatsapp}`, detailsX, infoY);
        infoY += spacingY;
      }
      doc.text(`Mailing Address: ${data.address}, ${data.city}, ${data.country}`, detailsX, infoY);

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
      doc.text(String(data.class10Year), margin + 65, currentY + 5.5);
      doc.text(class10Agg.gpa.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${class10Agg.percentage.toFixed(1)}%`, margin + 150, currentY + 5.5);
      doc.setDrawColor(245, 242, 235);
      doc.line(margin, currentY + 8, width - margin, currentY + 8);

      currentY += 8;
      doc.text('Class XII Higher Secondary Certificate', margin + 3, currentY + 5.5);
      doc.text(String(data.class12Year), margin + 65, currentY + 5.5);
      doc.text(class12Agg.gpa.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${class12Agg.percentage.toFixed(1)}%`, margin + 150, currentY + 5.5);
      doc.line(margin, currentY + 8, width - margin, currentY + 8);

      currentY += 8;
      doc.setFillColor(248, 246, 240);
      doc.rect(margin, currentY, width - margin * 2, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.text('Combined Academic Aggregates', margin + 3, currentY + 5.5);
      doc.text('-', margin + 65, currentY + 5.5);
      doc.text(overall.combinedGPA.toFixed(2), margin + 110, currentY + 5.5);
      doc.text(`${overall.overallPercentage.toFixed(1)}%`, margin + 150, currentY + 5.5);

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
      doc.text(`NEET Exam Year: ${data.neetYear}`, margin + 5, currentY + 6.5);
      doc.text(`NEET Performance Score: ${data.neetScore} / 720`, margin + 5, currentY + 11.5);

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

      if (docs.candidateSignature) {
        try {
          const sigDataUrl = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target?.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(docs.candidateSignature as File);
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

      doc.save(`${data.fullName.replace(/\s+/g, '_')}_MBBS_Application.pdf`);
      toast.success('PDF compiled and downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to compile PDF. Please try again.', { id: toastId });
    }
  };

  const validateUserPhoto = () => {
    if (!docs.userPhoto) {
      setDocErrors((d) => ({ ...d, userPhoto: 'Your photo is required' }));
      return false;
    }
    return true;
  };

  const validateDocs = () => {
    const next: Partial<Record<DocKey, string>> = {};
    STEP4_DOCS.forEach((k) => {
      if (!docs[k]) next[k] = `${DOC_LABELS[k]} is required`;
    });
    setDocErrors((d) => ({ ...d, ...next }));
    return Object.keys(next).length === 0;
  };

  const goNext = async () => {
    if (step === 0) {
      const fields = STEP_FIELDS[0];
      const ok = fields.length ? await trigger(fields as any) : true;
      if (!ok || !validateUserPhoto()) return;
    } else if (step === 3) {
      if (!validateDocs()) return;
    } else {
      const fields = STEP_FIELDS[step];
      const ok = fields.length ? await trigger(fields as any) : true;
      if (!ok) return;
    }
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setFurthest((f) => Math.max(f, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (i: number) => {
    setStep(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFinalSubmit = async () => {
    if (!validateUserPhoto()) {
      setStep(0);
      return;
    }
    if (!validateDocs()) {
      setStep(3);
      return;
    }
    const toastId = toast.loading('Submitting application to database...');
    setSubmitting(true);
    const data = getValues();
    try {
      const formData = new FormData();
      formData.append('collegeId', collegeId || '');
      formData.append('fullName', data.fullName);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('gender', data.gender);
      formData.append('email', data.email);
      formData.append('mobile', `${mobileCountry}${data.mobile}`);
      formData.append('whatsapp', data.whatsapp ? `${whatsappCountry}${data.whatsapp}` : '');
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('country', data.country);
      formData.append('class10', JSON.stringify({ subjects: class10Subjects }));
      formData.append('class12', JSON.stringify({ subjects: class12Subjects }));
      formData.append('neet', JSON.stringify({ year: data.neetYear, score: data.neetScore }));
      formData.append('userPhoto', docs.userPhoto as File);
      formData.append('passportPhoto', docs.passportPhoto as File);
      formData.append('authorizedSignature', docs.authorizedSignature as File);
      formData.append('candidateSignature', docs.candidateSignature as File);

      await axios.post('/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Application submitted successfully!', { id: toastId });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Final Submission Error details:', err);
      if (err.response && err.response.data) {
        console.error('Server response data:', err.response.data);
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const messages = err.response.data.errors.map((e: any) => `${e.path || e.param || 'field'}: ${e.msg}`).join('\n');
          toast.error(`Validation Failed:\n${messages}`, { id: toastId, duration: 6000 });
        } else if (err.response.data.message) {
          toast.error(`Server Error: ${err.response.data.message}`, { id: toastId });
        } else {
          toast.error(`Server Error: ${JSON.stringify(err.response.data)}`, { id: toastId });
        }
      } else {
        toast.error(`Submission failed: ${err.message || 'Connection error'}`, { id: toastId });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const values = getValues();

  return (
    <div className="min-h-screen" style={{ background: T.paper }}>
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <div className="border-b" style={{ borderColor: T.hairline, background: T.paperRaised }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-[11px] tracking-[0.16em] uppercase mb-1" style={{ color: T.brass, fontFamily: bodyFont, fontWeight: 600 }}>
            Application Dossier
          </p>
          <h1 className="text-2xl sm:text-3xl" style={{ color: T.ink, fontFamily: displayFont, fontWeight: 600 }}>
            {college ? college.name : 'Admission Application'}
          </h1>
        </div>
      </div>

      {/* College Details — carried over from whichever college card the applicant clicked */}
      {college && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <div
            className="rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start"
            style={{ background: T.paperRaised, border: `1px solid ${T.hairline}` }}
          >
            {college.logo && (
              <img
                src={college.logo.startsWith('/') || college.logo.startsWith('data:') || college.logo.startsWith('http') || college.logo.startsWith('blob:') ? college.logo : `/logo/${college.logo}`}
                alt={`${college.name} Logo`}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl border p-2 bg-white shrink-0 shadow-sm"
              />
            )}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink, lineHeight: 1.25 }}>
                    {college.name}
                  </h2>
                  <span
                    className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-2 text-white"
                    style={{ background: college.accentColor || '#059669', fontFamily: bodyFont }}
                  >
                    NMC Compliant
                  </span>
                </div>
                {college.badge && (
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap self-start"
                    style={{ background: T.brassSoft, color: T.brass, fontFamily: bodyFont, fontWeight: 600 }}
                  >
                    {college.badge}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed" style={{ borderColor: T.hairline }}>
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5" style={{ color: T.brass }} />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: T.mist, fontFamily: bodyFont }}>Location</p>
                    <p className="text-sm" style={{ color: T.ink, fontFamily: bodyFont, fontWeight: 500 }}>{college.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Wallet size={15} className="mt-0.5" style={{ color: T.brass }} />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: T.mist, fontFamily: bodyFont }}>Total Fees</p>
                    <p className="text-sm" style={{ color: T.ink, fontFamily: monoFont, fontWeight: 600 }}>{college.fees}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Stepper current={step} furthest={furthest} onJump={jumpTo} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit(onFinalSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-xl p-5 sm:p-8"
              style={{ background: T.paperRaised, border: `1px solid ${T.hairline}` }}
            >
              {/* ---------------- Step 0: Personal ---------------- */}
              {step === 0 && (
                <>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink }}>
                    Personal Information
                  </h2>
                  <p className="text-sm mt-1 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                    Please provide your basic personal details.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5 mb-5">
                    <div className="w-full max-w-[160px]">
                      <UploadCard
                        docKey="userPhoto"
                        file={docs.userPhoto}
                        error={docErrors.userPhoto}
                        onChange={(f) => {
                          setDocs((d) => ({ ...d, userPhoto: f }));
                          setDocErrors((d) => ({ ...d, userPhoto: undefined }));
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm" style={{ color: T.inkSoft, fontFamily: bodyFont, fontWeight: 500 }}>
                        Upload a recent photo of yourself
                      </p>
                      <p className="text-[13px] mt-1" style={{ color: T.mist, fontFamily: bodyFont }}>
                        Plain background, face clearly visible. JPG or PNG, up to 500KB. This is used to identify you on your application and admit card.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name" required error={errors.fullName?.message}>
                      <input className={inputBase} style={inputStyle(!!errors.fullName)} placeholder="As per NID / passport" {...register('fullName')} />
                    </Field>
                    <Field label="Date of Birth" required error={errors.dateOfBirth?.message}>
                      <input type="date" className={inputBase} style={inputStyle(!!errors.dateOfBirth)} {...register('dateOfBirth')} />
                    </Field>
                    <Field label="Gender" required error={errors.gender?.message}>
                      <select className={inputBase} style={inputStyle(!!errors.gender)} {...register('gender')}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field label="Email Address" required error={errors.email?.message}>
                      <input type="email" className={inputBase} style={inputStyle(!!errors.email)} placeholder="name@example.com" {...register('email')} />
                    </Field>
                    <Field label="Mobile Number" required error={errors.mobile?.message}>
                      <div className="flex">
                        <CountryCodeSelect value={mobileCountry} onChange={setMobileCountry} hasError={!!errors.mobile} />
                        <input
                          className={`${inputBase} rounded-l-none`}
                          style={inputStyle(!!errors.mobile, { borderLeft: 'none' })}
                          placeholder="1XXXXXXXXX"
                          inputMode="numeric"
                          {...register('mobile')}
                        />
                      </div>
                    </Field>
                    <Field label="WhatsApp Number" error={errors.whatsapp?.message}>
                      <div className="flex">
                        <CountryCodeSelect value={whatsappCountry} onChange={setWhatsappCountry} hasError={!!errors.whatsapp} />
                        <input
                          className={`${inputBase} rounded-l-none`}
                          style={inputStyle(!!errors.whatsapp, { borderLeft: 'none' })}
                          placeholder="1XXXXXXXXX"
                          inputMode="numeric"
                          {...register('whatsapp')}
                        />
                      </div>
                    </Field>
                    <Field label="Full Address" required error={errors.address?.message} className="md:col-span-2">
                      <textarea rows={2} className={inputBase} style={inputStyle(!!errors.address)} {...register('address')} />
                    </Field>
                    <Field label="City" required error={errors.city?.message}>
                      <input className={inputBase} style={inputStyle(!!errors.city)} {...register('city')} />
                    </Field>
                    <Field label="Country" required error={errors.country?.message}>
                      <input className={inputBase} style={inputStyle(!!errors.country)} {...register('country')} />
                    </Field>
                  </div>
                </>
              )}

              {/* ---------------- Step 1: Academic ---------------- */}
              {step === 1 && (
                <>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink }}>
                    Academic Information
                  </h2>
                  <p className="text-sm mt-1 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                    Enter your educational details for Class X and Class XII.
                  </p>

                  {/* Class X */}
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: T.hairline }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 16, color: T.ink }}>Class X</h3>
                    </div>
                    <Field label="Year of Passing" required className="mb-4 max-w-xs">
                      <select className={inputBase} style={inputStyle()} {...register('class10Year')}>
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      {errors.class10Year && <p className="text-xs mt-1" style={{ color: T.brick }}>{errors.class10Year.message}</p>}
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {class10Subjects?.map((_, idx) => (
                        <div key={idx} className="space-y-2 p-3 rounded-lg" style={{ background: T.paper }}>
                          <input placeholder={`Subject ${idx + 1}`} className={inputBase} style={inputStyle()} {...register(`class10Subjects.${idx}.name` as const)} />
                          <input type="number" placeholder="Full marks" className={inputBase} style={inputStyle()} {...register(`class10Subjects.${idx}.fullMarks` as const, { valueAsNumber: true })} />
                          <input type="number" placeholder="Obtained marks" className={inputBase} style={inputStyle()} {...register(`class10Subjects.${idx}.obtainedMarks` as const, { valueAsNumber: true })} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg p-3" style={{ background: T.brassSoft }}>
                      <LedgerRow label="Full" value={class10Agg.totalFull} />
                      <LedgerRow label="Obtained" value={class10Agg.totalObt} />
                      <LedgerRow label="Percentage" value={`${class10Agg.percentage}%`} />
                      <LedgerRow label="GPA" value={class10Agg.gpa} />
                    </div>
                  </div>

                  {/* Class XII */}
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: T.hairline }}>
                    <h3 className="mb-3" style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 16, color: T.ink }}>Class XII</h3>
                    <Field label="Year of Passing" required className="mb-4 max-w-xs">
                      <select className={inputBase} style={inputStyle()} {...register('class12Year')}>
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      {errors.class12Year && <p className="text-xs mt-1" style={{ color: T.brick }}>{errors.class12Year.message}</p>}
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {class12Subjects?.map((sub, idx) => (
                        <div key={idx} className="space-y-2 p-3 rounded-lg" style={{ background: T.paper }}>
                          <input value={sub.name} readOnly className={inputBase} style={{ ...inputStyle(), background: '#EFEBE0', color: T.mist }} />
                          <input type="number" placeholder="Full marks" className={inputBase} style={inputStyle()} {...register(`class12Subjects.${idx}.fullMarks` as const, { valueAsNumber: true })} />
                          <input type="number" placeholder="Obtained marks" className={inputBase} style={inputStyle()} {...register(`class12Subjects.${idx}.obtainedMarks` as const, { valueAsNumber: true })} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg p-3" style={{ background: T.brassSoft }}>
                      <LedgerRow label="Full" value={class12Agg.totalFull} />
                      <LedgerRow label="Obtained" value={class12Agg.totalObt} />
                      <LedgerRow label="Percentage" value={`${class12Agg.percentage}%`} />
                      <LedgerRow label="GPA" value={class12Agg.gpa} />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="mb-3" style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 16, color: T.ink }}>
                      Academic Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg p-4 text-center" style={{ background: T.sageSoft }}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: T.mist, fontFamily: bodyFont }}>Combined GPA</p>
                        <p style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 22, color: T.ink }}>{overall.combinedGPA}</p>
                      </div>
                      <div className="rounded-lg p-4 text-center" style={{ background: T.sageSoft }}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: T.mist, fontFamily: bodyFont }}>Overall %</p>
                        <p style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 22, color: T.ink }}>{overall.overallPercentage}%</p>
                      </div>
                      <div className="rounded-lg p-4 text-center" style={{ background: T.sageSoft }}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: T.mist, fontFamily: bodyFont }}>Merit Score</p>
                        <p style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 22, color: T.ink }}>{overall.academicScore}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- Step 2: NEET ---------------- */}
              {step === 2 && (
                <>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink }}>NEET Information</h2>
                  <p className="text-sm mt-1 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                    Enter the details of your most recent NEET attempt.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl">
                    <Field label="NEET Appeared Year" required error={errors.neetYear?.message}>
                      <select className={inputBase} style={inputStyle(!!errors.neetYear)} {...register('neetYear')}>
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="NEET Score" required error={errors.neetScore?.message}>
                      <input type="number" className={inputBase} style={inputStyle(!!errors.neetScore)} {...register('neetScore', { valueAsNumber: true })} />
                    </Field>
                  </div>
                </>
              )}

              {/* ---------------- Step 3: Documents ---------------- */}
              {step === 3 && (
                <>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink }}>Upload Documents</h2>
                  <p className="text-sm mt-1 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                    JPG, JPEG or PNG, each under 500KB.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STEP4_DOCS.map((k) => (
                      <UploadCard
                        key={k}
                        docKey={k}
                        file={docs[k]}
                        error={docErrors[k]}
                        onChange={(f) => {
                          setDocs((d) => ({ ...d, [k]: f }));
                          setDocErrors((d) => ({ ...d, [k]: undefined }));
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ---------------- Step 4: Review ---------------- */}
              {step === 4 && (
                <>
                  <h2 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 22, color: T.ink }}>Review & Submit</h2>
                  <p className="text-sm mt-1 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                    Please confirm every section before submitting your application.
                  </p>

                  {[
                    {
                      title: 'Personal Details',
                      step: 0,
                      rows: [
                        ['Full Name', values.fullName],
                        ['Date of Birth', values.dateOfBirth],
                        ['Gender', values.gender],
                        ['Email', values.email],
                        ['Mobile', `${mobileCountry} ${values.mobile || ''}`.trim()],
                        ['WhatsApp', values.whatsapp ? `${whatsappCountry} ${values.whatsapp}` : '—'],
                        ['Address', values.address],
                        ['City / Country', `${values.city}, ${values.country}`],
                      ],
                    },
                    {
                      title: 'Academic Details',
                      step: 1,
                      rows: [
                        ['Class X Year', values.class10Year],
                        ['Class X GPA', class10Agg.gpa],
                        ['Class XII Year', values.class12Year],
                        ['Class XII GPA', class12Agg.gpa],
                        ['Combined GPA', overall.combinedGPA],
                        ['Overall %', `${overall.overallPercentage}%`],
                      ],
                    },
                    {
                      title: 'NEET Details',
                      step: 2,
                      rows: [
                        ['Year', values.neetYear],
                        ['Score', values.neetScore],
                      ],
                    },
                  ].map((section) => (
                    <div key={section.title} className="mb-4 rounded-lg p-4" style={{ border: `1px solid ${T.hairline}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 15, color: T.ink }}>{section.title}</h3>
                        <button
                          type="button"
                          onClick={() => setStep(section.step)}
                          className="flex items-center gap-1 text-xs"
                          style={{ color: T.brass, fontFamily: bodyFont, fontWeight: 600 }}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        {section.rows.map(([label, val]) => (
                          <div key={label as string} className="flex justify-between py-1 text-sm" style={{ borderBottom: `1px dashed ${T.hairline}` }}>
                            <span style={{ color: T.mist, fontFamily: bodyFont }}>{label}</span>
                            <span style={{ color: T.ink, fontFamily: bodyFont, fontWeight: 500 }}>{val || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-lg p-4" style={{ border: `1px solid ${T.hairline}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 15, color: T.ink }}>Uploaded Documents</h3>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: T.brass, fontFamily: bodyFont, fontWeight: 600 }}
                      >
                        <Pencil size={12} /> Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(Object.keys(DOC_LABELS) as DocKey[]).map((k) => (
                        <div key={k} className="text-center">
                          <div className="rounded-md h-20 flex items-center justify-center mb-1" style={{ background: T.paper, border: `1px solid ${T.hairline}` }}>
                            {docs[k] ? (
                              <img src={URL.createObjectURL(docs[k] as File)} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <ImageOff size={18} style={{ color: T.mist }} />
                            )}
                          </div>
                          <p className="text-[11px]" style={{ color: T.mist, fontFamily: bodyFont }}>{DOC_LABELS[k]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Inline step navigation — part of the card's normal flow, no fixed/sticky navbar */}
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${T.hairline}` }}>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm"
                    style={{ color: T.inkSoft, fontFamily: bodyFont, fontWeight: 600, border: `1.5px solid ${T.hairline}`, background: T.paperRaised }}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : (
                  <span />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm"
                    style={{ color: '#fff', fontFamily: bodyFont, fontWeight: 600, background: T.ink }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit(onFinalSubmit)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm"
                    style={{ color: '#fff', fontFamily: bodyFont, fontWeight: 600, background: T.brass, opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
                    {submitting ? 'Submitting…' : 'Submit Application'}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center p-4"
            style={{ background: 'rgba(28,39,51,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="rounded-xl p-8 max-w-sm w-full text-center"
              style={{ background: T.paperRaised }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: T.sageSoft, color: T.sage }}
              >
                <Check size={26} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 20, color: T.ink }}>
                Application Submitted
              </h3>
              <p className="text-sm mt-2 mb-6" style={{ color: T.mist, fontFamily: bodyFont }}>
                Your admission dossier has been received. You'll hear back by email once it's reviewed.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={generatePDF}
                  className="w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95"
                  style={{ background: T.brass, color: '#fff', fontFamily: bodyFont, fontWeight: 600 }}
                >
                  <FileText size={15} /> Download PDF Receipt
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 rounded-lg text-sm cursor-pointer transition hover:opacity-90"
                  style={{ background: T.ink, color: '#fff', fontFamily: bodyFont, fontWeight: 600 }}
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationPage;