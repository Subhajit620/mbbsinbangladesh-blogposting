import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/AboutPage';
import ApplicationPage from './pages/ApplicationPage';
import ApplyWizard from './pages/ApplyWizard';
import AllCollegesPage from './pages/AllCollegesPage';
import ServicesPage from './pages/ServicesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ConsultUs from './components/ConsultUs';

// Import all 23 college pages
import AdDinAkijMedicalCollege from './pages/college/AdDinAkijMedicalCollege';
import AnwerKhanModernMedicalCollege from './pages/college/AnwerKhanModernMedicalCollege';
import ShaheedZiaurRahmanMedicalCollege from './pages/college/ShaheedZiaurRahmanMedicalCollege';
import DhakaNationalMedicalCollege from './pages/college/DhakaNationalMedicalCollege';
import JalalabadRagibRabeyaMedicalCollege from './pages/college/JalalabadRagibRabeyaMedicalCollege';
import MHSamoritaMedicalCollege from './pages/college/MHSamoritaMedicalCollege';
import MonnoMedicalCollege from './pages/college/MonnoMedicalCollege';
import ParkviewMedicalCollege from './pages/college/ParkviewMedicalCollege';
import PrimeMedicalCollege from './pages/college/PrimeMedicalCollege';
import ShahMokhdumMedicalCollege from './pages/college/ShahMokhdumMedicalCollege';
import PopularMedicalCollege from './pages/college/PopularMedicalCollege';
import RangpurCommunityMedicalCollegeHospital from './pages/college/RangpurCommunityMedicalCollegeHospital';
import HolyFamilyRedCrescentMedicalCollege from './pages/college/HolyFamilyRedCrescentMedicalCollege';
import TairunnessaMedicalCollegeHospital from './pages/college/TairunnessaMedicalCollegeHospital';
import EnamMedicalCollegeHospital from './pages/college/EnamMedicalCollegeHospital';
import JahurulIslamMedicalCollege from './pages/college/JahurulIslamMedicalCollege';
import ZHSikderWomensMedicalCollege from './pages/college/ZHSikderWomensMedicalCollege';
import TMSSMedicalCollege from './pages/college/TMSSMedicalCollege';
import BGCTrustMedicalCollege from './pages/college/BGCTrustMedicalCollege';
import AdDinSakinaWomensMedicalCollege from './pages/college/AdDinSakinaWomensMedicalCollege';
import MainamotiMedicalCollege from './pages/college/MainamotiMedicalCollege';
import SouthernMedicalCollegeHospital from './pages/college/SouthernMedicalCollegeHospital';
import BangladeshMedicalCollege from './pages/college/BangladeshMedicalCollege';
import ShahabuddinMedicalCollege from './pages/college/ShahabuddinMedicalCollege';
import NorthBengalMedicalCollege from './pages/college/NorthBengalMedicalCollege';
import ShaheedMonsurAliMedicalCollege from './pages/college/ShaheedMonsurAliMedicalCollege';

function ConsultUsWrapper() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;
  return <ConsultUs />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans text-gray-900 antialiased scroll-smooth">
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/application/:collegeId" element={<ApplicationPage />} />
          <Route path="/apply/:collegeId" element={<ApplyWizard />} />
          <Route path="/colleges" element={<AllCollegesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* College Details Pages Routes */}
          <Route path="/college/ad-din-akij-medical-college" element={<AdDinAkijMedicalCollege />} />
          <Route path="/college/anwer-khan-modern-medical-college" element={<AnwerKhanModernMedicalCollege />} />
          <Route path="/college/shaheed-ziaur-rahman-medical-college" element={<ShaheedZiaurRahmanMedicalCollege />} />
          <Route path="/college/dhaka-national-medical-college" element={<DhakaNationalMedicalCollege />} />
          <Route path="/college/jalalabad-ragib-rabeya-medical-college" element={<JalalabadRagibRabeyaMedicalCollege />} />
          <Route path="/college/mh-samorita-medical-college" element={<MHSamoritaMedicalCollege />} />
          <Route path="/college/monno-medical-college" element={<MonnoMedicalCollege />} />
          <Route path="/college/parkview-medical-college" element={<ParkviewMedicalCollege />} />
          <Route path="/college/prime-medical-college" element={<PrimeMedicalCollege />} />
          <Route path="/college/shah-mokhdum-medical-college" element={<ShahMokhdumMedicalCollege />} />
          <Route path="/college/popular-medical-college" element={<PopularMedicalCollege />} />
          <Route path="/college/rangpur-community-medical-college-hospital" element={<RangpurCommunityMedicalCollegeHospital />} />
          <Route path="/college/holy-family-red-crescent-medical-college" element={<HolyFamilyRedCrescentMedicalCollege />} />
          <Route path="/college/tairunnessa-medical-college-hospital" element={<TairunnessaMedicalCollegeHospital />} />
          <Route path="/college/enam-medical-college-hospital" element={<EnamMedicalCollegeHospital />} />
          <Route path="/college/jahurul-islam-medical-college" element={<JahurulIslamMedicalCollege />} />
          <Route path="/college/zh-sikder-womens-medical-college" element={<ZHSikderWomensMedicalCollege />} />
          <Route path="/college/tmss-medical-college" element={<TMSSMedicalCollege />} />
          <Route path="/college/bgc-trust-medical-college" element={<BGCTrustMedicalCollege />} />
          <Route path="/college/ad-din-sakina-womens-medical-college" element={<AdDinSakinaWomensMedicalCollege />} />
          <Route path="/college/mainamoti-medical-college" element={<MainamotiMedicalCollege />} />
          <Route path="/college/southern-medical-college-hospital" element={<SouthernMedicalCollegeHospital />} />
          <Route path="/college/bangladesh-medical-college" element={<BangladeshMedicalCollege />} />
          <Route path="/college/shahabuddin-medical-college" element={<ShahabuddinMedicalCollege />} />
          <Route path="/college/north-bengal-medical-college" element={<NorthBengalMedicalCollege />} />
          <Route path="/college/shaheed-monsur-ali-medical-college" element={<ShaheedMonsurAliMedicalCollege />} />
        </Routes>
        <ConsultUsWrapper />
      </div>
    </BrowserRouter>
  );
}
