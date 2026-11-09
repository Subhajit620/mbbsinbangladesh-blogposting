import holyFamily from "../../assets/colleges/holy-family-red-crescent-new.webp";
import tairunnessa from "../../assets/colleges/tairunnessa-memorial-new.jpg";
import enamMedical from "../../assets/colleges/enam-medical-college-new.webp";
import jahurulIslam from "../../assets/colleges/jahurul-islam.jpg";
import zhSikder from "../../assets/colleges/zh-sikder-new.jpg";
import tmss from "../../assets/colleges/tmss-medical-college.jpg";
import bgcTrust from "../../assets/colleges/bgc-trust-new.jpg";
import addinSakina from "../../assets/colleges/addin-sakina-new.jpg";
import mainamoti from "../../assets/colleges/mainamoti-medical-new.jpg";
import southernMedical from "../../assets/colleges/southern-medical.jpg";
import bangladeshMedical from "../../assets/colleges/bangladesh-medical-college.png";
import college2 from "../../assets/colleges/college2.jpg";
import samorita from "../../assets/colleges/Samorita.webp";
import monnoImg from "../../assets/colleges/monno-medical-college.webp";
import parkviewImg from "../../assets/colleges/parkview-medical-college.webp";
import primeImg from "../../assets/colleges/prime-medical-college.webp";
import shahMokhdumImg from "../../assets/colleges/shah-mokhdum-medical-college.jpg";
import shahabuddinImg from "../../assets/colleges/shahabuddin-medical-college.jpg";
import northBengalImg from "../../assets/colleges/north-bengal-medical-college.jpg";
import shaheedMonsurImg from "../../assets/colleges/shaheed-monsur-ali-medical-college.jpg";
import rangpurCommunityImg from "../../assets/colleges/rangpur-community-medical-college.jpg";
import dhakaNationalImg from "../../assets/colleges/dhaka-national-medical-college-new.webp";
import addinAkijImg from "../../assets/colleges/addin-akij-medical-college.jpg";

// Logo imports
import logoAdDinAkij from "../../assets/logo/AD-DIN AKIJ Medical college.png";
import logoAnwerKhan from "../../assets/logo/Anwer Khan Modern.png";
import logoDelta from "../../assets/logo/Delta Medical College.png";
import logoDhakaNational from "../../assets/logo/Dhaka National Medical College.png";
import logoJalalabad from "../../assets/logo/Jalalabad Ragib-rabeya.png";
import logoMHSamorita from "../../assets/logo/MH samorita Hospital & medical colege.png";
import logoMonno from "../../assets/logo/Monno Medical college.png";
import logoParkView from "../../assets/logo/Park View Medical College.png";
import logoPrime from "../../assets/logo/Prime Medical College.png";
import logoShahMokhdum from "../../assets/logo/SHAH MOKHDUM Medical College.png";
import logoPopular from "../../assets/logo/popular Medical College.png";
import logoRangpur from "../../assets/logo/rangpur Community Medical.png";

// New logos
import logoHolyFamily from "../../assets/logo/HRFS.png";
import logoTairunnessa from "../../assets/logo/TMMC2.png";
import logoEnamMedical from "../../assets/logo/EMC.png";
import logoJahurulIslam from "../../assets/logo/JIMCH.png";
import logoZhSikder from "../../assets/logo/Zh-shikdar.png";
import logoTmss from "../../assets/logo/TMSS2.png";
import logoBgcTrust from "../../assets/logo/bgc4.png";
import logoAddinSakina from "../../assets/logo/AD-DIN AKIJ Medical college.png";
import logoMainamoti from "../../assets/logo/Mainmoti2.png";
import logoSouthernMedical from "../../assets/logo/SMMC.png";
import logoBangladeshMedical from "../../assets/logo/Bangladesh college1.png";

export interface CollegeCard {
  id: string;
  name: string;
  location: string;
  fees: string;
  image: string;
  logo: string;
  slug: string;
  tag?: string;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
  type?: string;
  established?: string;
  affiliatedUniversity?: string;
}

export const colleges: CollegeCard[] = [
  // Original 12 Colleges
  {
    id: '64b1f1a8e2b8f84d6c7b0001',
    name: 'Ad-Din Akij Medical College',
    location: 'Khulna',
    fees: '₹28–34 L',
    image: addinAkijImg,
    logo: logoAdDinAkij,
    slug: 'ad-din-akij-medical-college',
    badge: 'Premium',
    badgeColor: 'from-amber-500 to-orange-500',
    accentColor: '#059669',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0002',
    name: 'Anwer Khan Modern Medical College',
    location: 'Dhaka',
    fees: '₹35–40 L',
    image: college2,
    logo: logoAnwerKhan,
    slug: 'anwer-khan-modern-medical-college',
    badge: 'Best Clinical',
    badgeColor: 'from-emerald-500 to-teal-500',
    accentColor: '#0891b2',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0003',
    name: 'Shaheed Ziaur Rahman Medical College',
    location: 'Bogura',
    fees: '₹30–35 L',
    image: 'college3.jpg',
    logo: logoDelta,
    slug: 'shaheed-ziaur-rahman-medical-college',
    badge: 'Highly Rated',
    badgeColor: 'from-blue-500 to-indigo-500',
    accentColor: '#7c3aed',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0004',
    name: 'Dhaka National Medical College',
    location: 'Dhaka',
    fees: '₹38–42 L',
    image: dhakaNationalImg,
    logo: logoDhakaNational,
    slug: 'dhaka-national-medical-college',
    badge: 'Legacy',
    badgeColor: 'from-rose-500 to-pink-500',
    accentColor: '#e11d48',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0005',
    name: 'Jalalabad Ragib-Rabeya Medical College',
    location: 'Sylhet',
    fees: '₹32–36 L',
    image: 'college5.jpg',
    logo: logoJalalabad,
    slug: 'jalalabad-ragib-rabeya-medical-college',
    badge: 'Top Choice',
    badgeColor: 'from-violet-500 to-purple-600',
    accentColor: '#7c3aed',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0006',
    name: 'MH Samorita Medical College',
    location: 'Dhaka',
    fees: '₹28–32 L',
    image: samorita,
    logo: logoMHSamorita,
    slug: 'mh-samorita-medical-college',
    badge: 'Best Value',
    badgeColor: 'from-orange-500 to-amber-400',
    accentColor: '#d97706',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0007',
    name: 'Monno Medical College',
    location: 'Manikganj',
    fees: '₹27–31 L',
    image: monnoImg,
    logo: logoMonno,
    slug: 'monno-medical-college',
    badge: 'Green Campus',
    badgeColor: 'from-emerald-500 to-teal-500',
    accentColor: '#0891b2',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0008',
    name: 'Parkview Medical College',
    location: 'Sylhet',
    fees: '₹29–33 L',
    image: parkviewImg,
    logo: logoParkView,
    slug: 'parkview-medical-college',
    badge: 'Modern Labs',
    badgeColor: 'from-blue-500 to-indigo-500',
    accentColor: '#7c3aed',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0009',
    name: 'Prime Medical College',
    location: 'Rangpur',
    fees: '₹28–32 L',
    image: primeImg,
    logo: logoPrime,
    slug: 'prime-medical-college',
    badge: 'Popular',
    badgeColor: 'from-amber-500 to-orange-500',
    accentColor: '#059669',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0010',
    name: 'Shah Mokhdum Medical College',
    location: 'Rajshahi',
    fees: '₹25–30 L',
    image: shahMokhdumImg,
    logo: logoShahMokhdum,
    slug: 'shah-mokhdum-medical-college',
    badge: 'Affordable',
    badgeColor: 'from-rose-500 to-pink-500',
    accentColor: '#e11d48',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0011',
    name: 'Popular Medical College',
    location: 'Dhaka',
    fees: '₹36–41 L',
    image: 'college2.jpg',
    logo: logoPopular,
    slug: 'popular-medical-college',
    badge: 'Highly Rated',
    badgeColor: 'from-violet-500 to-purple-600',
    accentColor: '#7c3aed',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0012',
    name: 'Rangpur Community Medical College & Hospital',
    location: 'Rangpur',
    fees: '₹30–35 L',
    image: rangpurCommunityImg,
    logo: logoRangpur,
    slug: 'rangpur-community-medical-college-hospital',
    badge: 'Top Ranked',
    badgeColor: 'from-orange-500 to-amber-400',
    accentColor: '#d97706',
    tag: 'All',
  },

  // 11 Newly Appended Colleges mapped with their corresponding Database ObjectIds
  {
    id: '64b1f1a8e2b8f84d6c7b0015',
    name: 'Holy Family Red Crescent Medical College',
    location: 'Dhaka',
    fees: '₹35–40 L',
    image: holyFamily,
    logo: logoHolyFamily,
    slug: 'holy-family-red-crescent-medical-college',
    type: 'Private',
    established: '1999',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0017',
    name: 'Tairunnessa Medical College & Hospital',
    location: 'Gazipur, Dhaka',
    fees: '₹28–32 L',
    image: tairunnessa,
    logo: logoTairunnessa,
    slug: 'tairunnessa-medical-college-hospital',
    type: 'Private',
    established: '2002',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0016',
    name: 'Enam Medical College & Hospital',
    location: 'Savar, Dhaka',
    fees: '₹32–36 L',
    image: enamMedical,
    logo: logoEnamMedical,
    slug: 'enam-medical-college-hospital',
    type: 'Private',
    established: '2003',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0019',
    name: 'Jahurul Islam Medical College',
    location: 'Bajitpur, Kishoreganj',
    fees: '₹32–36 L',
    image: jahurulIslam,
    logo: logoJahurulIslam,
    slug: 'jahurul-islam-medical-college',
    type: 'Private',
    established: '1992',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b001f',
    name: 'Z. H. Sikder Women\'s Medical College',
    location: 'Dhanmondi, Dhaka',
    fees: '₹30–35 L',
    image: zhSikder,
    logo: logoZhSikder,
    slug: 'zh-sikder-womens-medical-college',
    type: 'Private',
    established: '1992',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0033',
    name: 'TMSS Medical College',
    location: 'Bogura',
    fees: '₹28–32 L',
    image: tmss,
    logo: logoTmss,
    slug: 'tmss-medical-college',
    type: 'Private',
    established: '2008',
    affiliatedUniversity: 'Bangladesh Medical University',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b002b',
    name: 'B.G.C Trust Medical College',
    location: 'Chandanaish, Chattogram',
    fees: '₹28–32 L',
    image: bgcTrust,
    logo: logoBgcTrust,
    slug: 'bgc-trust-medical-college',
    type: 'Private',
    established: '2002',
    affiliatedUniversity: 'Chattogram Medical University',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0032',
    name: 'Ad-Din Sakina Women\'s Medical College',
    location: 'Jashore',
    fees: '₹28–32 L',
    image: addinSakina,
    logo: logoAddinSakina,
    slug: 'ad-din-sakina-womens-medical-college',
    type: 'Private',
    established: '2012',
    affiliatedUniversity: 'Khulna Medical University',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0029',
    name: 'Mainamoti Medical College',
    location: 'Cumilla',
    fees: '₹28–32 L',
    image: mainamoti,
    logo: logoMainamoti,
    slug: 'mainamoti-medical-college',
    type: 'Private',
    established: '2011',
    affiliatedUniversity: 'Chattogram Medical University',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b002e',
    name: 'Southern Medical College & Hospital',
    location: 'Chattogram',
    fees: '₹28–32 L',
    image: southernMedical,
    logo: logoSouthernMedical,
    slug: 'southern-medical-college-hospital',
    type: 'Private',
    established: '2005',
    affiliatedUniversity: 'Chattogram Medical University',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0018',
    name: 'Bangladesh Medical College',
    location: 'Dhanmondi, Dhaka',
    fees: '₹35–40 L',
    image: bangladeshMedical,
    logo: logoBangladeshMedical,
    slug: 'bangladesh-medical-college',
    type: 'Private',
    established: '1986',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b001d',
    name: 'Shahabuddin Medical College',
    location: 'Gulshan, Dhaka',
    fees: '₹35–40 L',
    image: shahabuddinImg,
    logo: logoDelta,
    slug: 'shahabuddin-medical-college',
    type: 'Private',
    established: '2003',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0035',
    name: 'North Bengal Medical College',
    location: 'Sirajganj',
    fees: '₹30–35 L',
    image: northBengalImg,
    logo: logoJalalabad,
    slug: 'north-bengal-medical-college',
    type: 'Private',
    established: '2000',
    affiliatedUniversity: 'University of Rajshahi',
    tag: 'All',
  },
  {
    id: '64b1f1a8e2b8f84d6c7b0023',
    name: 'Shaheed Monsur Ali Medical College',
    location: 'Uttara, Dhaka',
    fees: '₹35–40 L',
    image: shaheedMonsurImg,
    logo: logoDhakaNational,
    slug: 'shaheed-monsur-ali-medical-college',
    type: 'Private',
    established: '1994',
    affiliatedUniversity: 'University of Dhaka',
    tag: 'All',
  }
];
