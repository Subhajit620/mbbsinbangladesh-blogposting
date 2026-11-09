const mongoose = require('mongoose');
const dotenv = require('dotenv');
const College = require('./models/College');

dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const colleges = [
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0001'),
    collegeName: 'Ad-Din Akij Medical College',
    courseName: 'MBBS',
    image: 'college1.jpg',
    logo: 'AD-DIN AKIJ Medical college.png',
    description: 'Ad-Din Akij Medical College offers world-class medical education in Khulna with excellent infrastructure and clinical support.',
    duration: '5 Years',
    fees: 33000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Khulna',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0002'),
    collegeName: 'Anwer Khan Modern Medical College',
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'Anwer Khan Modern.png',
    description: 'Anwer Khan Modern Medical College is a premier medical school located in Dhanmondi, Dhaka with highly specialized clinical facilities.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0003'),
    collegeName: 'Delta Medical College',
    courseName: 'MBBS',
    image: 'college3.jpg',
    logo: 'Delta Medical College.png',
    description: 'Delta Medical College is well known for oncology and comprehensive general medical education located in Dhaka.',
    duration: '5 Years',
    fees: 47500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0004'),
    collegeName: 'Dhaka National Medical College',
    courseName: 'MBBS',
    image: 'college4.jpeg',
    logo: 'Dhaka National Medical College.png',
    description: 'Dhaka National Medical College has a legacy of excellence in training physicians in Old Dhaka with a large patient flow.',
    duration: '5 Years',
    fees: 48000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0005'),
    collegeName: 'Jalalabad Ragib-Rabeya Medical College',
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'Jalalabad Ragib-Rabeya Medical College offers premium facilities and rich academic records in Pathantula, Sylhet.',
    duration: '5 Years',
    fees: 46950,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sylhet',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0006'),
    collegeName: 'MH Samorita Medical College',
    courseName: 'MBBS',
    image: 'college6.jpeg',
    logo: 'MH samorita Hospital & medical colege.png',
    description: 'MH Samorita Medical College is centrally located in Dhaka, combining high-quality teaching with robust hospital clinical practice.',
    duration: '5 Years',
    fees: 44000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0007'),
    collegeName: 'Monno Medical College',
    courseName: 'MBBS',
    image: 'college7.jpg',
    logo: 'Monno Medical college.png',
    description: 'Monno Medical College in Manikganj offers a green campus, modern teaching hospital and structured clinical training for MBBS students.',
    duration: '5 Years',
    fees: 29000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Manikganj',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0008'),
    collegeName: 'Parkview Medical College',
    courseName: 'MBBS',
    image: 'college8.jpg',
    logo: 'Park View Medical College.png',
    description: 'Parkview Medical College in Sylhet offers modern laboratories and state-of-the-art diagnostics for practical medicine learning.',
    duration: '5 Years',
    fees: 36000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sylhet',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0009'),
    collegeName: 'Prime Medical College',
    courseName: 'MBBS',
    image: 'college9.jpg',
    logo: 'Prime Medical College.png',
    description: 'Prime Medical College in Rangpur is highly sought after by foreign students for its structured residency and clinical mentorship.',
    duration: '5 Years',
    fees: 42500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Rangpur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0010'),
    collegeName: 'Shah Mokhdum Medical College',
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'SHAH MOKHDUM Medical College.png',
    description: 'Shah Mokhdum Medical College in Rajshahi is an affordable private medical college with a dedicated teaching hospital and NEET-focused admissions.',
    duration: '5 Years',
    fees: 27000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Rajshahi',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0011'),
    collegeName: 'Popular Medical College',
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'popular Medical College.png',
    description: 'Popular Medical College offers a premium hospital setting with dynamic patient exposure in Dhanmondi, Dhaka.',
    duration: '5 Years',
    fees: 43000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0012'),
    collegeName: 'Rangpur Community Medical College & Hospital',
    courseName: 'MBBS',
    image: 'college1.jpg',
    logo: 'rangpur Community Medical.png',
    description: 'Rangpur Community Medical College is a premier private medical institution with top-tier rankings in northern Bangladesh.',
    duration: '5 Years',
    fees: 44500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Rangpur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0013'),
    collegeName: "Ad-Din Women's Medical College",
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'AD-DIN AKIJ Medical college.png',
    description: 'Ad-Din Women\'s Medical College is a specialized medical institution for female students located in Dhaka.',
    duration: '5 Years',
    fees: 43000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0014'),
    collegeName: 'Ad-Din Momin Medical College',
    courseName: 'MBBS',
    image: 'college3.jpg',
    logo: 'AD-DIN AKIJ Medical college.png',
    description: 'Ad-Din Momin Medical College offers quality medical education in Jessore, Bangladesh.',
    duration: '5 Years',
    fees: 35000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Jessore',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0015'),
    collegeName: 'Holy Family Red Crescent Medical College',
    courseName: 'MBBS',
    image: 'college4.jpeg',
    logo: 'Dhaka National Medical College.png',
    description: 'Holy Family Red Crescent Medical College is a prestigious private medical college located in Ramna, Dhaka.',
    duration: '5 Years',
    fees: 50250,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0016'),
    collegeName: 'Enam Medical College & Hospital',
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'Anwer Khan Modern.png',
    description: 'Enam Medical College is a renowned medical school located in Savar, Dhaka, with a massive teaching hospital.',
    duration: '5 Years',
    fees: 40000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0017'),
    collegeName: 'Tairunnessa Medical College & Hospital',
    courseName: 'MBBS',
    image: 'college6.jpeg',
    logo: 'MH samorita Hospital & medical colege.png',
    description: 'Tairunnessa Medical College is a well-established medical institution in Gazipur, offering excellent clinical programs.',
    duration: '5 Years',
    fees: 36000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Gazipur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0018'),
    collegeName: 'Bangladesh Medical College',
    courseName: 'MBBS',
    image: 'college7.jpg',
    logo: 'Delta Medical College.png',
    description: 'Bangladesh Medical College is the first private medical college in Bangladesh, located in Dhanmondi, Dhaka.',
    duration: '5 Years',
    fees: 49000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0019'),
    collegeName: 'Jahurul Islam Medical College',
    courseName: 'MBBS',
    image: 'college8.jpg',
    logo: 'Monno Medical college.png',
    description: 'Jahurul Islam Medical College is one of the oldest private medical colleges, located in Kishoreganj.',
    duration: '5 Years',
    fees: 42000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Kishoreganj',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001a'),
    collegeName: "Kumudini Women's Medical College",
    courseName: 'MBBS',
    image: 'college9.jpg',
    logo: 'Monno Medical college.png',
    description: 'Kumudini Women\'s Medical College is a dedicated medical school for women in Tangail, offering comprehensive campus facilities.',
    duration: '5 Years',
    fees: 45300,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Tangail',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001b'),
    collegeName: 'Ibrahim Medical College',
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'popular Medical College.png',
    description: 'Ibrahim Medical College is associated with BIRDEM and is known for its high standards of medical education and ethics.',
    duration: '5 Years',
    fees: 44500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001c'),
    collegeName: 'Medical College for Women & Hospital',
    courseName: 'MBBS',
    image: 'college3.jpg',
    logo: 'Delta Medical College.png',
    description: 'Medical College for Women & Hospital is a pioneer institution for female medical students located in Sector 8, Uttara, Dhaka.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001d'),
    collegeName: 'Shahabuddin Medical College',
    courseName: 'MBBS',
    image: 'college4.jpeg',
    logo: 'Anwer Khan Modern.png',
    description: 'Shahabuddin Medical College is centrally located in Gulshan, Dhaka, with a modern hospital and diverse clinical departments.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001e'),
    collegeName: 'Marks Medical College',
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'MH samorita Hospital & medical colege.png',
    description: 'Marks Medical College in Mirpur, Dhaka, offers comprehensive clinical exposure and state of the art lecture halls.',
    duration: '5 Years',
    fees: 39000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b001f'),
    collegeName: "Z. H. Sikder Women's Medical College",
    courseName: 'MBBS',
    image: 'college6.jpeg',
    logo: 'popular Medical College.png',
    description: 'Z. H. Sikder Women\'s Medical College is a prominent female medical school with a high capacity teaching hospital in Dhaka.',
    duration: '5 Years',
    fees: 42000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0020'),
    collegeName: 'International Medical College',
    courseName: 'MBBS',
    image: 'college7.jpg',
    logo: 'Anwer Khan Modern.png',
    description: 'International Medical College is located in Gazipur, offering scenic green campus and high standard medical programs.',
    duration: '5 Years',
    fees: 44000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Gazipur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0021'),
    collegeName: 'City Medical College',
    courseName: 'MBBS',
    image: 'college8.jpg',
    logo: 'rangpur Community Medical.png',
    description: 'City Medical College in Gazipur offers comprehensive curriculum and quality modern laboratories for students.',
    duration: '5 Years',
    fees: 40000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Gazipur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0022'),
    collegeName: 'President Abdul Hamid Medical College',
    courseName: 'MBBS',
    image: 'college9.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'President Abdul Hamid Medical College in Kishoreganj offers a premium hospital setting with dynamic patient exposure.',
    duration: '5 Years',
    fees: 38000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Kishoreganj',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0023'),
    collegeName: 'Shaheed Monsur Ali Medical College',
    courseName: 'MBBS',
    image: 'college1.jpg',
    logo: 'Dhaka National Medical College.png',
    description: 'Shaheed Monsur Ali Medical College is located in Uttara, Dhaka, offering modern facilities and clinical rotations.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0024'),
    collegeName: 'Diabetic Association Medical College',
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'popular Medical College.png',
    description: 'Diabetic Association Medical College in Faridpur provides structured residency and clinical mentorship.',
    duration: '5 Years',
    fees: 42000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Faridpur',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0025'),
    collegeName: 'Universal Medical College',
    courseName: 'MBBS',
    image: 'college3.jpg',
    logo: 'MH samorita Hospital & medical colege.png',
    description: 'Universal Medical College is centrally located in Mohakhali, Dhaka, with a highly advanced clinical facility.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0026'),
    collegeName: 'Ibn Sina Medical College',
    courseName: 'MBBS',
    image: 'college4.jpeg',
    logo: 'Anwer Khan Modern.png',
    description: 'Ibn Sina Medical College in Kalyanpur, Dhaka, combines high quality teaching with robust hospital clinical practice.',
    duration: '5 Years',
    fees: 44000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0027'),
    collegeName: 'Community Based Medical College',
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'rangpur Community Medical.png',
    description: 'Community Based Medical College in Mymensingh is a highly sought private medical school with deep clinical heritage.',
    duration: '5 Years',
    fees: 45600,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Mymensingh',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0028'),
    collegeName: 'East West Medical College',
    courseName: 'MBBS',
    image: 'college6.jpeg',
    logo: 'Delta Medical College.png',
    description: 'East West Medical College in Aichi Nagar, Turag, Dhaka, has dynamic patient exposure and modern laboratories.',
    duration: '5 Years',
    fees: 46000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Dhaka',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0029'),
    collegeName: 'Mainamoti Medical College',
    courseName: 'MBBS',
    image: 'college7.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'Mainamoti Medical College in Comilla provides quality medical education and comprehensive general clinics.',
    duration: '5 Years',
    fees: 40000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Comilla',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002a'),
    collegeName: 'Central Medical College',
    courseName: 'MBBS',
    image: 'college8.jpg',
    logo: 'MH samorita Hospital & medical colege.png',
    description: 'Central Medical College in Comilla offers modern diagnostics and intensive clinical program options.',
    duration: '5 Years',
    fees: 41000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Comilla',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002b'),
    collegeName: 'B.G.C Trust Medical College',
    courseName: 'MBBS',
    image: 'college9.jpg',
    logo: 'rangpur Community Medical.png',
    description: 'B.G.C Trust Medical College in Chittagong provides highly affordable tuition packages and clinical practice.',
    duration: '5 Years',
    fees: 33000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Chittagong',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002c'),
    collegeName: 'Eastern Medical College',
    courseName: 'MBBS',
    image: 'college1.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'Eastern Medical College in Comilla is widely ranked for its high quality residential campus and medical curriculum.',
    duration: '5 Years',
    fees: 43000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Comilla',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002d'),
    collegeName: 'Institute of Applied Health Science (IAHS)',
    courseName: 'MBBS',
    image: 'college2.jpg',
    logo: 'popular Medical College.png',
    description: 'Institute of Applied Health Science (IAHS) in Chittagong offers a rich clinical heritage and modern diagnostics.',
    duration: '5 Years',
    fees: 42000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Chittagong',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002e'),
    collegeName: 'Southern Medical College & Hospital',
    courseName: 'MBBS',
    image: 'college3.jpg',
    logo: 'Delta Medical College.png',
    description: 'Southern Medical College in Chittagong offers structured residency and hands-on medical training.',
    duration: '5 Years',
    fees: 41000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Chittagong',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b002f'),
    collegeName: 'North East Medical College',
    courseName: 'MBBS',
    image: 'college4.jpeg',
    logo: 'Anwer Khan Modern.png',
    description: 'North East Medical College in Sylhet offers an expansive hospital setup and dynamic patient flow.',
    duration: '5 Years',
    fees: 42500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sylhet',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0030'),
    collegeName: "Sylhet Women's Medical College",
    courseName: 'MBBS',
    image: 'college5.jpg',
    logo: 'Monno Medical college.png',
    description: 'Sylhet Women\'s Medical College is a premier private medical school dedicated for women in Sylhet town.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sylhet',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0031'),
    collegeName: 'Khwaja Yunus Ali Medical College',
    courseName: 'MBBS',
    image: 'college6.jpeg',
    logo: 'AD-DIN AKIJ Medical college.png',
    description: 'Khwaja Yunus Ali Medical College in Sirajganj offers a massive state of the art campus and multi-specialty hospital.',
    duration: '5 Years',
    fees: 48500,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sirajganj',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0032'),
    collegeName: "Ad-Din Sakina Women's Medical College",
    courseName: 'MBBS',
    image: 'college7.jpg',
    logo: 'AD-DIN AKIJ Medical college.png',
    description: 'Ad-Din Sakina Women\'s Medical College offers a specialized medical program for female students in Jessore.',
    duration: '5 Years',
    fees: 33000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Jessore',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0033'),
    collegeName: 'TMSS Medical College',
    courseName: 'MBBS',
    image: 'college8.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'TMSS Medical College in Bogra is highly ranked for its extensive rural health program and large teaching facility.',
    duration: '5 Years',
    fees: 45000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Bogra',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0034'),
    collegeName: 'Khulna City Medical College',
    courseName: 'MBBS',
    image: 'college9.jpg',
    logo: 'rangpur Community Medical.png',
    description: 'Khulna City Medical College in Khulna offers standard clinical teaching and high quality hospital internships.',
    duration: '5 Years',
    fees: 40000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Khulna',
    country: 'Bangladesh'
  },
  {
    _id: new mongoose.Types.ObjectId('64b1f1a8e2b8f84d6c7b0035'),
    collegeName: 'North Bengal Medical College',
    courseName: 'MBBS',
    image: 'college1.jpg',
    logo: 'Jalalabad Ragib-rabeya.png',
    description: 'North Bengal Medical College is the first private medical college in northern Bangladesh, located in Sirajganj.',
    duration: '5 Years',
    fees: 38000,
    eligibility: '10+2 PCB min 60%, NEET Qualified',
    city: 'Sirajganj',
    country: 'Bangladesh'
  }
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI env variable is not set!');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    console.log('Upserting colleges (inserting new / updating existing)...');
    const bulkOps = colleges.map(college => ({
      updateOne: {
        filter: { _id: college._id },
        update: { $set: college },
        upsert: true
      }
    }));
    await College.bulkWrite(bulkOps);
    console.log('Colleges upserted successfully!');

    console.log('Starting API Server...');
    require('./index.js');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
