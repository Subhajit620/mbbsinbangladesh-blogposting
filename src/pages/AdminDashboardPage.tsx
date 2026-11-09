import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  MessageSquare,
  LogOut,
  Search,
  Filter,
  Trash2,
  Eye,
  Check,
  X,
  ChevronRight,
  User,
  GraduationCap,
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  Clock,
  ArrowUpRight,
  Download
} from 'lucide-react';
import AdminBlogManager from '../components/AdminBlogManager';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    // Uploaded files are served from the API origin (same origin in production,
    // VITE_API_URL when the backend is deployed separately).
    return `${import.meta.env.VITE_API_URL || ''}${path}`;
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'consultations' | 'blogs'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [applications, setApplications] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [passingYearFilter, setPassingYearFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Selected Dossier detail drawer state
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Authenticate on mount
  useEffect(() => {
    if (localStorage.getItem('admin_token') !== 'aspiring_life_auth_token') {
      navigate('/admin');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, consRes] = await Promise.all([
        axios.get('/api/applications'),
        axios.get('/api/consultations')
      ]);
      setApplications(appsRes.data || []);
      setConsultations(consRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data. Check backend connections.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully.');
    navigate('/admin');
  };

  // Applications operations
  const updateApplicationStatus = async (id: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      await axios.put(`/api/applications/${id}`, { status: newStatus });
      toast.success(`Application marked as ${newStatus}!`, { id: toastId });
      
      // Update local state
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status. Check permissions.', { id: toastId });
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this application? This action is irreversible.')) return;
    const toastId = toast.loading('Deleting application record...');
    try {
      await axios.delete(`/api/applications/${id}`);
      toast.success('Application record deleted successfully.', { id: toastId });
      setApplications(prev => prev.filter(app => app._id !== id));
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete application record.', { id: toastId });
    }
  };

  // Metrics calculators
  const stats = useMemo(() => {
    const totalApps = applications.length;
    const pendingApps = applications.filter(a => a.status === 'Pending').length;
    const approvedApps = applications.filter(a => a.status === 'Approved').length;
    const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
    const totalCons = consultations.length;

    const scores = applications.map(a => a.neet?.score).filter(s => typeof s === 'number' && s > 0);
    const avgNeet = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return { totalApps, pendingApps, approvedApps, rejectedApps, totalCons, avgNeet };
  }, [applications, consultations]);

  // College names for filtering dropdown
  const uniqueColleges = useMemo(() => {
    const list = new Set(applications.map(a => a.collegeName).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [applications]);

  // Locations for filtering dropdown
  const uniqueLocations = useMemo(() => {
    const list = new Set(consultations.map(c => c.location).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [consultations]);

  // Passing years for filtering dropdown
  const uniquePassingYears = useMemo(() => {
    const list = new Set(consultations.map(c => String(c.passingYear)).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [consultations]);

  // Filtered lists
  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const matchesSearch = searchQuery === '' || 
        a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.mobile?.includes(searchQuery);
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesCollege = collegeFilter === 'All' || a.collegeName === collegeFilter;
      return matchesSearch && matchesStatus && matchesCollege;
    });
  }, [applications, searchQuery, statusFilter, collegeFilter]);

  const exportApplicationsPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = '#1C2733';
    const accentColor = '#A9772E';
    const margin = 15;
    const width = 297;
    const height = 210;

    doc.setFillColor(28, 39, 51);
    doc.rect(0, 0, width, 20, 'F');

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ASPIRING LIFE ADMISSIONS - APPLICATIONS LEDGER REGISTER', margin, 12);

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, width - margin - 55, 9);
    doc.text(`Total Records: ${filteredApplications.length}`, width - margin - 55, 15);

    let currentY = 30;

    const drawRow = (rowY: number, cols: string[], isHeader = false, statusVal = '') => {
      // Background row block
      if (isHeader) {
        doc.setFillColor(240, 238, 232);
        doc.rect(margin, rowY, 267, 8, 'F');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, rowY, 267, 8, 'F');
      }

      // Outer row border
      doc.setDrawColor(210, 205, 195);
      doc.setLineWidth(0.3);
      doc.rect(margin, rowY, 267, 8);

      const offsets = [0, 40, 95, 143, 175, 193, 211, 229];
      const widths = [40, 55, 48, 32, 18, 18, 18, 38];

      for (let i = 0; i < cols.length; i++) {
        // Vertical cell borders
        if (i > 0) {
          doc.line(margin + offsets[i], rowY, margin + offsets[i], rowY + 8);
        }

        // Cell Text printing
        const textVal = cols[i] || '';
        doc.setTextColor(primaryColor);
        if (isHeader) {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8.5);
        } else {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
        }

        // Alignment check
        if (i === 4 || i === 5 || i === 6) {
          // Center align NEET Score, NEET Year and GPA
          doc.text(textVal, margin + offsets[i] + widths[i] / 2, rowY + 5.5, { align: 'center' });
        } else if (i === 7 && !isHeader) {
          // Colored status text
          doc.setTextColor(statusVal === 'Approved' ? '#059669' : statusVal === 'Rejected' ? '#DC2626' : '#D97706');
          doc.setFont('Helvetica', 'bold');
          doc.text(textVal, margin + offsets[i] + 3, rowY + 5.5);
        } else {
          // Left align with string truncation bounds to prevent overlap
          const maxChar = i === 0 ? 18 : i === 1 ? 26 : i === 2 ? 22 : 16;
          const truncated = textVal.length > maxChar ? textVal.slice(0, maxChar - 3) + '...' : textVal;
          doc.text(truncated, margin + offsets[i] + 3, rowY + 5.5);
        }
      }
    };

    const headers = ['Candidate Name', 'Target College Name', 'Email Address', 'Mobile Number', 'NEET Score', 'NEET Year', 'GPA', 'Status'];
    
    // Draw header row
    drawRow(currentY, headers, true);

    currentY += 8;

    filteredApplications.forEach((app) => {
      if (currentY > height - 20) {
        doc.addPage();
        doc.setFillColor(28, 39, 51);
        doc.rect(0, 0, width, 20, 'F');

        doc.setTextColor('#FFFFFF');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`ASPIRING LIFE ADMISSIONS - APPLICATIONS LEDGER REGISTER (Page ${doc.getNumberOfPages()})`, margin, 12);

        currentY = 30;
        drawRow(currentY, headers, true);
        currentY += 8;
      }

      const rowValues = [
        app.fullName || '',
        app.collegeName || '',
        app.email || '',
        app.mobile || '',
        String(app.neet?.score || 'N/A'),
        String(app.neet?.year || 'N/A'),
        String(app.overall?.combinedGPA?.toFixed(2) || 'N/A'),
        app.status || ''
      ];

      drawRow(currentY, rowValues, false, app.status || '');
      currentY += 8;
    });

    doc.save(`Applications_Export_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Applications register list exported successfully!');
  };

  const exportConsultationsPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = '#1C2733';
    const accentColor = '#A9772E';
    const margin = 15;
    const width = 297;
    const height = 210;

    doc.setFillColor(28, 39, 51);
    doc.rect(0, 0, width, 20, 'F');

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ASPIRING LIFE ADMISSIONS - CONSULTATIONS REQUESTS REGISTER', margin, 12);

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, width - margin - 55, 9);
    doc.text(`Total Records: ${filteredConsultations.length}`, width - margin - 55, 15);

    let currentY = 30;

    const drawRow = (rowY: number, cols: string[], isHeader = false) => {
      if (isHeader) {
        doc.setFillColor(240, 238, 232);
        doc.rect(margin, rowY, 267, 8, 'F');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, rowY, 267, 8, 'F');
      }

      doc.setDrawColor(210, 205, 195);
      doc.setLineWidth(0.3);
      doc.rect(margin, rowY, 267, 8);

      const offsets = [0, 40, 90, 122, 164, 182, 200, 232];
      const widths = [40, 50, 32, 42, 18, 18, 32, 35];

      for (let i = 0; i < cols.length; i++) {
        if (i > 0) {
          doc.line(margin + offsets[i], rowY, margin + offsets[i], rowY + 8);
        }

        const textVal = cols[i] || '';
        doc.setTextColor(primaryColor);
        if (isHeader) {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8.5);
        } else {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
        }

        if (i === 4 || i === 5 || i === 6) {
          doc.text(textVal, margin + offsets[i] + widths[i] / 2, rowY + 5.5, { align: 'center' });
        } else {
          const maxChar = i === 0 ? 18 : i === 1 ? 24 : i === 2 ? 16 : i === 3 ? 18 : 16;
          const truncated = textVal.length > maxChar ? textVal.slice(0, maxChar - 3) + '...' : textVal;
          doc.text(truncated, margin + offsets[i] + 3, rowY + 5.5);
        }
      }
    };

    const headers = ['Candidate Name', 'Email Address', 'Mobile Phone', 'Current Location', 'NEET Score', 'NEET Year', 'Passing Year', 'Request Date'];
    drawRow(currentY, headers, true);
    currentY += 8;

    filteredConsultations.forEach((c) => {
      if (currentY > height - 20) {
        doc.addPage();
        doc.setFillColor(28, 39, 51);
        doc.rect(0, 0, width, 20, 'F');

        doc.setTextColor('#FFFFFF');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`ASPIRING LIFE ADMISSIONS - CONSULTATIONS REQUESTS REGISTER (Page ${doc.getNumberOfPages()})`, margin, 12);

        currentY = 30;
        drawRow(currentY, headers, true);
        currentY += 8;
      }

      const rowValues = [
        c.fullName || '',
        c.email || '',
        c.phone || '',
        c.location || '',
        String(c.neetScore || 'N/A'),
        String(c.neetYear || 'N/A'),
        String(c.passingYear || 'N/A'),
        c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'
      ];

      drawRow(currentY, rowValues, false);
      currentY += 8;
    });

    doc.save(`Consultations_Export_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Consultation requests exported successfully!');
  };

  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      const matchesSearch = searchQuery === '' || 
        c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery);
      const matchesYear = passingYearFilter === 'All' || String(c.passingYear) === passingYearFilter;
      const matchesLocation = locationFilter === 'All' || c.location === locationFilter;
      return matchesSearch && matchesYear && matchesLocation;
    });
  }, [consultations, searchQuery, passingYearFilter, locationFilter]);

  const exportIndividualApplicationPDF = (app: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = '#1C2733';
    const accentColor = '#A9772E';
    const margin = 15;
    const width = 210;
    const height = 297;

    // --- Header Banner ---
    doc.setFillColor(28, 39, 51);
    doc.rect(0, 0, width, 30, 'F');

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('ASPIRING LIFE ADMISSIONS', margin, 12);

    doc.setTextColor(accentColor);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('OFFICIAL CANDIDATE REGISTRY FILE DOSSIER RECEIPT', margin, 18);

    doc.setTextColor('#FFFFFF');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, width - margin - 40, 11);
    doc.text(`Status: ${(app.status || 'Pending').toUpperCase()}`, width - margin - 40, 16);

    let currentY = 40;

    // Helper to draw gold-colored pill heading section markers
    const drawSectionTitle = (title: string, y: number) => {
      doc.setFillColor(169, 119, 46); // gold
      doc.rect(margin, y, 3, 6, 'F');
      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(title, margin + 6, y + 4.8);
      return y + 12;
    };

    // Helper to draw a key-value grid row
    const drawKeyValueRow = (y: number, key1: string, val1: string, key2?: string, val2?: string) => {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor('#6B7280'); // grey
      doc.text(key1, margin, y);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor);
      doc.text(String(val1 || 'N/A'), margin + 35, y);

      if (key2 && val2 !== undefined) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor('#6B7280');
        doc.text(key2, margin + 95, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryColor);
        doc.text(String(val2 || 'N/A'), margin + 130, y);
      }
      return y + 6.5;
    };

    // 1. Target Course & College Info
    currentY = drawSectionTitle('1. Target Admission Choice', currentY);
    currentY = drawKeyValueRow(currentY, 'Target College:', app.collegeName || 'N/A');
    currentY = drawKeyValueRow(currentY, 'Course Registered:', app.courseName || 'N/A', 'Dossier ID:', app._id || 'N/A');
    currentY = drawKeyValueRow(currentY, 'Registry Status:', app.status || 'Pending', 'Date Registered:', app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A');

    currentY += 4;

    // 2. Personal Information
    currentY = drawSectionTitle('2. Candidate Personal Information', currentY);
    currentY = drawKeyValueRow(currentY, 'Full Name:', app.fullName || 'N/A', 'Gender:', app.gender || 'N/A');
    currentY = drawKeyValueRow(currentY, 'Email Address:', app.email || 'N/A', 'Mobile Number:', app.mobile || 'N/A');
    currentY = drawKeyValueRow(currentY, 'Date of Birth:', app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : 'N/A', 'WhatsApp Sync:', app.whatsapp || 'N/A');
    currentY = drawKeyValueRow(currentY, 'Home Address:', app.address || 'N/A');
    currentY = drawKeyValueRow(currentY, 'City/Location:', app.city || 'N/A', 'Country Residence:', app.country || 'N/A');

    currentY += 4;

    // 3. Academic Credentials - Class 10
    currentY = drawSectionTitle('3. Academic Record - Class X', currentY);
    const cls10School = app.class10?.schoolName || 'N/A';
    const cls10Board = app.class10?.boardName || 'N/A';
    const cls10Year = app.class10?.passingYear || 'N/A';
    const cls10Pct = app.class10?.percentage ? `${app.class10.percentage.toFixed(2)}%` : 'N/A';
    const cls10GPA = app.class10?.gpa ? app.class10.gpa.toFixed(2) : 'N/A';

    currentY = drawKeyValueRow(currentY, 'School Name:', cls10School, 'Board Name:', cls10Board);
    currentY = drawKeyValueRow(currentY, 'Passing Year:', String(cls10Year), 'GPA / Marks %:', `${cls10GPA} (${cls10Pct})`);

    // List Class X subject rows
    if (app.class10?.subjects && app.class10.subjects.length > 0) {
      currentY += 2;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor('#888888');
      doc.text('Subject Grade Ledger Details (Class X):', margin, currentY);
      currentY += 4.5;

      const subHeaderY = currentY;
      doc.setFillColor(245, 243, 238);
      doc.rect(margin, subHeaderY - 3.5, 180, 5, 'F');
      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('Subject Name', margin + 3, subHeaderY);
      doc.text('Full Marks', margin + 70, subHeaderY, { align: 'right' });
      doc.text('Obtained Marks', margin + 110, subHeaderY, { align: 'right' });
      doc.text('Percentage %', margin + 150, subHeaderY, { align: 'right' });
      currentY += 4;

      app.class10.subjects.forEach((sub: any) => {
        if (currentY > height - 20) {
          doc.addPage();
          currentY = 20;
        }
        const fullM = sub.fullMarks || 100;
        const obtM = sub.obtainedMarks || 0;
        const pctVal = fullM > 0 ? `${((obtM / fullM) * 100).toFixed(1)}%` : '0%';
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(sub.name || 'N/A', margin + 3, currentY);
        doc.text(String(fullM), margin + 70, currentY, { align: 'right' });
        doc.text(String(obtM), margin + 110, currentY, { align: 'right' });
        doc.text(pctVal, margin + 150, currentY, { align: 'right' });
        
        // Underline row
        doc.setDrawColor(240, 238, 232);
        doc.line(margin, currentY + 1.5, margin + 180, currentY + 1.5);
        currentY += 4.5;
      });
    }

    currentY += 4;

    // 4. Academic Credentials - Class 12
    if (currentY > height - 80) {
      doc.addPage();
      currentY = 20;
    }

    currentY = drawSectionTitle('4. Academic Record - Class XII (Higher Secondary)', currentY);
    const cls12School = app.class12?.schoolName || 'N/A';
    const cls12Board = app.class12?.boardName || 'N/A';
    const cls12Year = app.class12?.passingYear || 'N/A';
    const cls12Pct = app.class12?.percentage ? `${app.class12.percentage.toFixed(2)}%` : 'N/A';
    const cls12GPA = app.class12?.gpa ? app.class12.gpa.toFixed(2) : 'N/A';

    currentY = drawKeyValueRow(currentY, 'School Name:', cls12School, 'Board Name:', cls12Board);
    currentY = drawKeyValueRow(currentY, 'Passing Year:', String(cls12Year), 'GPA / Marks %:', `${cls12GPA} (${cls12Pct})`);
    
    // Physics, Chemistry, Biology detailed marks
    const pcbm = app.overall || {};
    currentY = drawKeyValueRow(
      currentY, 
      'PCB Total Marks:', `${pcbm.pcbTotalObtained || 0} / ${pcbm.pcbTotalFull || 0}`,
      'PCB Percentage / GPA:', `${(pcbm.pcbPercentage || 0).toFixed(2)}% / ${(pcbm.pcbGPA || 0).toFixed(2)}`
    );

    // List Class XII subject rows
    if (app.class12?.subjects && app.class12.subjects.length > 0) {
      currentY += 2;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor('#888888');
      doc.text('Subject Grade Ledger Details (Class XII):', margin, currentY);
      currentY += 4.5;

      const subHeaderY2 = currentY;
      doc.setFillColor(245, 243, 238);
      doc.rect(margin, subHeaderY2 - 3.5, 180, 5, 'F');
      doc.setTextColor(primaryColor);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('Subject Name', margin + 3, subHeaderY2);
      doc.text('Full Marks', margin + 70, subHeaderY2, { align: 'right' });
      doc.text('Obtained Marks', margin + 110, subHeaderY2, { align: 'right' });
      doc.text('Percentage %', margin + 150, subHeaderY2, { align: 'right' });
      currentY += 4;

      app.class12.subjects.forEach((sub: any) => {
        if (currentY > height - 20) {
          doc.addPage();
          currentY = 20;
        }
        const fullM = sub.fullMarks || 100;
        const obtM = sub.obtainedMarks || 0;
        const pctVal = fullM > 0 ? `${((obtM / fullM) * 100).toFixed(1)}%` : '0%';
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(sub.name || 'N/A', margin + 3, currentY);
        doc.text(String(fullM), margin + 70, currentY, { align: 'right' });
        doc.text(String(obtM), margin + 110, currentY, { align: 'right' });
        doc.text(pctVal, margin + 150, currentY, { align: 'right' });
        
        // Underline row
        doc.setDrawColor(240, 238, 232);
        doc.line(margin, currentY + 1.5, margin + 180, currentY + 1.5);
        currentY += 4.5;
      });
    }

    currentY += 4;

    // 5. NEET Exam Details
    if (currentY > height - 50) {
      doc.addPage();
      currentY = 20;
    }

    currentY = drawSectionTitle('5. National Eligibility cum Entrance Test (NEET)', currentY);
    const neetRoll = app.neet?.rollNo || 'N/A';
    const neetScore = app.neet?.score || 'N/A';
    const neetPct = app.neet?.percentile || 'N/A';
    const neetRank = app.neet?.rank || 'N/A';
    const neetYear = app.neet?.year || 'N/A';

    currentY = drawKeyValueRow(currentY, 'NEET Roll Number:', neetRoll, 'NEET Exam Score:', String(neetScore));
    currentY = drawKeyValueRow(currentY, 'NEET Percentile:', String(neetPct), 'NEET All India Rank:', String(neetRank));
    currentY = drawKeyValueRow(currentY, 'NEET Qualification Year:', String(neetYear));

    // Sign off footer
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor('#888888');
    doc.text('This candidate admission dossier is compiled from official verified database records.', margin, height - 12);

    doc.save(`Candidate_Dossier_${app.fullName.replace(/\s+/g, '_')}.pdf`);
    toast.success('Candidate dossier PDF exported successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Toaster position="top-right" />

      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0 w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-white uppercase">Aspiring Life Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight leading-none block">Aspiring Life</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 block mt-1">Management Cockpit</span>
              </div>
            </div>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'applications', label: 'Student Applications', icon: ClipboardList, badge: stats.pendingApps },
              { id: 'consultations', label: 'Consultations', icon: MessageSquare },
              { id: 'blogs', label: 'Manage Blogs', icon: FileText }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-emerald-600' : 'bg-orange-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="border-t border-slate-800 pt-6 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Go to Home Page
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            End Admin Session
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Loading Overlay */}
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent mb-4"
            />
            <p className="text-slate-400 text-sm font-medium">Synchronizing with live database...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {activeTab === 'overview' && 'System Cockpit'}
                  {activeTab === 'applications' && 'Student Admission Dossiers'}
                  {activeTab === 'consultations' && 'Live Inquiries List'}
                  {activeTab === 'blogs' && 'Blog Articles Publisher'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {activeTab === 'overview' && 'Real-time performance index and statistics.'}
                  {activeTab === 'applications' && 'Audit, approve, and manage course applications.'}
                  {activeTab === 'consultations' && 'Process call requests from the consult wizard.'}
                  {activeTab === 'blogs' && 'Create, edit, and delete news, notices, and advice articles.'}
                </p>
              </div>

              {/* Refresh Trigger */}
              <button
                onClick={fetchDashboardData}
                className="self-start px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                Fetch New Records
              </button>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats dashboard cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'Total Applications', value: stats.totalApps, icon: ClipboardList, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { label: 'Pending Audits', value: stats.pendingApps, icon: Clock, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                    { label: 'Approved Admissions', value: stats.approvedApps, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Consultations', value: stats.totalCons, icon: MessageSquare, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className={`p-5 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 shadow-lg flex items-center gap-4 ${stat.color.split(' ')[2]}`}
                    >
                      <div className={`p-3.5 rounded-2xl shrink-0 ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        <h4 className="text-xl sm:text-2xl font-black text-white mt-2 leading-none">{stat.value}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Grid details: recent items and statistics widgets */}
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Left stats parameters */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-lg">System Averages</h3>
                      <p className="text-slate-400 text-xs mt-1">Key quality markers computed globally.</p>
                      
                      <div className="space-y-6 mt-8">
                        <div>
                          <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-slate-400">Average NEET Score</span>
                            <span className="text-emerald-400">{stats.avgNeet} / 720</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.avgNeet / 720) * 100}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span className="text-slate-400">Approved Rate</span>
                            <span className="text-orange-400">
                              {stats.totalApps ? Math.round((stats.approvedApps / stats.totalApps) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${stats.totalApps ? (stats.approvedApps / stats.totalApps) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Database Status: Active</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live connection
                      </span>
                    </div>
                  </div>

                  {/* Right recent list */}
                  <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-extrabold text-white text-lg">Recent Applications</h3>
                        <p className="text-slate-400 text-xs mt-1">Audit status of candidates.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        All Applications <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {applications.slice(0, 4).map((app) => (
                        <div
                          key={app._id}
                          className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-2xl hover:border-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                              <User className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{app.fullName}</p>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{app.collegeName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                              app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                              'bg-orange-500/10 text-orange-400'
                            }`}>
                              {app.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setActiveTab('applications');
                              }}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {applications.length === 0 && (
                        <p className="text-slate-500 text-sm py-8 text-center italic">No applications found in database.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                {/* Search & filters panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search by student name, email, phone..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Status filter dropdown */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded-2xl px-3 py-2 w-full md:w-auto">
                      <Filter className="text-slate-500 shrink-0" size={15} />
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-300 outline-none w-full cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* College Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded-2xl px-3 py-2 w-full md:w-auto">
                      <select
                        value={collegeFilter}
                        onChange={e => setCollegeFilter(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-300 outline-none w-full cursor-pointer"
                      >
                        <option value="All">All Colleges</option>
                        {uniqueColleges.filter(c => c !== 'All').map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Export Applications PDF Button */}
                    <button
                      onClick={exportApplicationsPDF}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl cursor-pointer transition shadow-md shrink-0"
                    >
                      <Download size={14} /> Export PDF
                    </button>
                  </div>
                </div>

                {/* Applications grid list/table */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800/80">
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Student Name</th>
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Target College</th>
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">NEET Score</th>
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">NEET Year</th>
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                          <th className="py-4.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/65">
                        {filteredApplications.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-850/30 transition-colors group">
                            <td className="py-4 px-6">
                              <p className="text-sm font-bold text-white leading-tight">{app.fullName}</p>
                              <p className="text-xs text-slate-400 mt-1">{app.email}</p>
                            </td>
                            <td className="py-4 px-6 text-sm font-semibold text-slate-300">{app.collegeName}</td>
                            <td className="py-4 px-6 text-sm font-bold text-slate-300 text-center">{app.neet?.score || 'N/A'}</td>
                            <td className="py-4 px-6 text-sm font-semibold text-slate-300 text-center">{app.neet?.year || 'N/A'}</td>
                            <td className="py-4 px-6">
                              <select
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app._id, e.target.value as any)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none border cursor-pointer ${
                                  app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}
                              >
                                <option value="Pending" className="bg-slate-900 text-orange-400">Pending</option>
                                <option value="Approved" className="bg-slate-900 text-emerald-400">Approved</option>
                                <option value="Rejected" className="bg-slate-900 text-rose-400">Rejected</option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className="p-2 text-slate-400 hover:text-white bg-slate-950/40 border border-slate-800 hover:border-slate-750 rounded-xl transition-all cursor-pointer"
                                  title="View Full dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteApplication(app._id)}
                                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredApplications.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-sm font-medium text-slate-500">
                              No dossiers match the query filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CONSULTATIONS */}
            {activeTab === 'consultations' && (
              <div className="space-y-6">
                {/* Search & filters panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search consultations..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Location state filter dropdown */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded-2xl px-3 py-2 w-full md:w-auto">
                      <MapPin className="text-slate-500 shrink-0" size={15} />
                      <select
                        value={locationFilter}
                        onChange={e => setLocationFilter(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-300 outline-none w-full cursor-pointer"
                      >
                        <option value="All">All Locations</option>
                        {uniqueLocations.filter(l => l !== 'All').map((l, idx) => (
                          <option key={idx} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    {/* Passing year Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded-2xl px-3 py-2 w-full md:w-auto">
                      <Calendar className="text-slate-500 shrink-0" size={15} />
                      <select
                        value={passingYearFilter}
                        onChange={e => setPassingYearFilter(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-300 outline-none w-full cursor-pointer"
                      >
                        <option value="All">All Passing Years</option>
                        {uniquePassingYears.filter(y => y !== 'All').map((y, idx) => (
                          <option key={idx} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    {/* Export Consultations PDF Button */}
                    <button
                      onClick={exportConsultationsPDF}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl cursor-pointer transition shadow-md shrink-0"
                    >
                      <Download size={14} /> Export PDF
                    </button>
                  </div>
                </div>

                {/* Consultations cards layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConsultations.map((c) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-750 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full">
                            Callback Request
                          </span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        <div className="text-left">
                          <h3 className="font-extrabold text-white text-base leading-tight">{c.fullName}</h3>
                          <p className="text-xs text-slate-400 truncate mt-1">{c.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-850 text-left">
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">NEET Score</p>
                            <p className="text-sm font-bold text-emerald-400 mt-1">{c.neetScore} / 720</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Passing Year</p>
                            <p className="text-sm font-semibold text-slate-300 mt-1">{c.passingYear}</p>
                          </div>
                        </div>

                        <div className="pt-3 flex gap-4 text-left text-xs text-slate-400">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {c.location}</span>
                          <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {c.phone}</span>
                        </div>
                      </div>

                      {/* Consultation Delete option */}
                      <div className="mt-6 pt-4 border-t border-slate-850 flex justify-end">
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this consultation callback request?')) return;
                            const toastId = toast.loading('Deleting request...');
                            try {
                              await axios.delete(`/api/consultations/${c._id}`);
                              toast.success('Consultation request deleted.', { id: toastId });
                              setConsultations(prev => prev.filter(item => item._id !== c._id));
                            } catch (e) {
                              console.error(e);
                              toast.error('Failed to delete callback request.', { id: toastId });
                            }
                          }}
                          className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Dismiss Request
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {filteredConsultations.length === 0 && (
                    <div className="col-span-full py-16 text-center text-sm font-medium text-slate-500 italic">
                      No live inquiries match current filter parameters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <AdminBlogManager />
            )}
          </div>
        )}
      </main>

      {/* CANDIDATE DOSSIER DRAWER */}
      <AnimatePresence>
        {selectedApp && (
          <>
            {/* Drawer backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            {/* Slider container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-slate-950 border-b border-slate-850 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="font-extrabold text-sm uppercase tracking-wider text-slate-300">Admission Dossier Details</span>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Contents Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-left">
                {/* Header block with avatar */}
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start pb-6 border-b border-slate-850">
                  <img
                    src={getImageUrl(selectedApp.userPhoto) || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'}
                    alt={selectedApp.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-800 p-1 bg-slate-950 shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{selectedApp.fullName}</h3>
                    <p className="text-sm font-semibold text-slate-400">{selectedApp.collegeName}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        selectedApp.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        selectedApp.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {selectedApp.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Applied: {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Section: Personal Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Gender</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Date of Birth</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.dateOfBirth ? new Date(selectedApp.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Email Address</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5 break-all">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Mobile Number</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.mobile}</p>
                    </div>
                    {selectedApp.whatsapp && (
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">WhatsApp</p>
                        <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.whatsapp}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">City</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Country</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.country}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Mailing Address</p>
                      <p className="text-sm font-medium text-slate-350 mt-0.5 leading-relaxed">{selectedApp.address}</p>
                    </div>
                  </div>
                </div>

                {/* Section: Academic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Academic Records</h4>
                  
                  {/* Class X & XII overview summary */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Class 10 Passing Year</p>
                      <p className="text-sm font-bold text-slate-300 mt-0.5">{selectedApp.class10?.year || 'N/A'}</p>
                      <p className="text-xs text-slate-400 mt-1">GPA: {selectedApp.class10?.gpa || 'N/A'} • {selectedApp.class10?.percentage || 0}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Class 12 Passing Year</p>
                      <p className="text-sm font-bold text-slate-300 mt-0.5">{selectedApp.class12?.year || 'N/A'}</p>
                      <p className="text-xs text-slate-400 mt-1">GPA: {selectedApp.class12?.gpa || 'N/A'} • {selectedApp.class12?.percentage || 0}%</p>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-slate-850 flex justify-between text-xs text-slate-400 font-semibold">
                      <span>Combined GPA: <span className="text-emerald-400 font-bold">{selectedApp.overall?.combinedGPA || 'N/A'}</span></span>
                      <span>Overall Percentage: <span className="text-orange-400 font-bold">{selectedApp.overall?.overallPercentage || 0}%</span></span>
                      <span>Academic Score: <span className="text-blue-400 font-bold">{selectedApp.overall?.academicScore || 'N/A'}</span></span>
                    </div>
                  </div>

                  {/* Class 12 biology parameters table */}
                  <div className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/30">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950/70 border-b border-slate-850">
                          <th className="py-2.5 px-4 font-bold text-slate-400 uppercase">Class 12 Subject</th>
                          <th className="py-2.5 px-4 font-bold text-slate-400 uppercase text-right">Obtained Marks</th>
                          <th className="py-2.5 px-4 font-bold text-slate-400 uppercase text-right">Full Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/60 font-medium">
                        {(selectedApp.class12?.subjects || []).map((sub: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-900/40">
                            <td className="py-2.5 px-4 text-slate-300 font-bold">{sub.name}</td>
                            <td className="py-2.5 px-4 text-slate-300 text-right">{sub.obtainedMarks}</td>
                            <td className="py-2.5 px-4 text-slate-500 text-right">{sub.fullMarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section: NEET details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">NEET Parameters</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl text-left">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">NEET Exam Year</p>
                      <p className="text-sm font-semibold text-slate-350 mt-0.5">{selectedApp.neet?.year || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">NEET Score / Marks</p>
                      <p className="text-sm font-extrabold text-orange-400 mt-0.5">{selectedApp.neet?.score || 'N/A'} / 720</p>
                    </div>
                  </div>
                </div>

                {/* Section: Uploaded Documents */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Candidate Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'passportPhoto', label: 'Passport Photo' },
                      { key: 'authorizedSignature', label: 'Authorized Signature' },
                      { key: 'candidateSignature', label: 'Candidate Signature' }
                    ].map((doc) => (
                      <a
                        key={doc.key}
                        href={getImageUrl(selectedApp[doc.key])}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 p-4 rounded-2xl text-center hover:bg-slate-850/10 transition-colors flex flex-col justify-between"
                      >
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">{doc.label}</p>
                        {selectedApp[doc.key] ? (
                          <div className="space-y-3">
                            <div className="h-16 flex items-center justify-center">
                              <img
                                src={getImageUrl(selectedApp[doc.key])}
                                alt={doc.label}
                                className="max-h-full max-w-full object-contain rounded-lg border border-slate-800"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 hover:text-emerald-350 cursor-pointer block">View Fullscreen</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic block py-4">No Document</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-5 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApplicationStatus(selectedApp._id, 'Approved')}
                    disabled={selectedApp.status === 'Approved'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Check size={14} /> Approve Application
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApp._id, 'Rejected')}
                    disabled={selectedApp.status === 'Rejected'}
                    className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <X size={14} /> Reject Application
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportIndividualApplicationPDF(selectedApp)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download size={14} /> Export Dossier PDF
                  </button>
                  <button
                    onClick={() => deleteApplication(selectedApp._id)}
                    className="px-4 py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500 bg-rose-500/10 text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 size={14} /> Delete Record
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
