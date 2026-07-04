/**
 * Seed data generator for BTEB Results Zone clone.
 * Run: `bun run scripts/generate-data.ts`
 * Produces JSON files in /data that are bundled with the app (Vercel-ready, read-only FS safe).
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "data");
mkdirSync(OUT, { recursive: true });

// ---------------- Departments ----------------
const departments = [
  { code: "CMT", name: "Computer Technology", bn: "কম্পিউটার টেকনোলজি" },
  { code: "ET", name: "Electrical Technology", bn: "ইলেকট্রিক্যাল টেকনোলজি" },
  { code: "ENT", name: "Electronics Technology", bn: "ইলেকট্রনিক্স টেকনোলজি" },
  { code: "MT", name: "Mechanical Technology", bn: "মেকানিক্যাল টেকনোলজি" },
  { code: "CT", name: "Civil Technology", bn: "সিভিল টেকনোলজি" },
  { code: "RAC", name: "Refrigeration & Air Conditioning Technology", bn: "রেফ্রিজারেশন ও এয়ার কন্ডিশনিং টেকনোলজি" },
  { code: "AT", name: "Automobile Technology", bn: "অটোমোবাইল টেকনোলজি" },
  { code: "CHT", name: "Chemical Technology", bn: "কেমিক্যাল টেকনোলজি" },
  { code: "TT", name: "Textile Technology", bn: "টেক্সটাইল টেকনোলজি" },
  { code: "TCT", name: "Telecommunication Technology", bn: "টেলিকমিউনিকেশন টেকনোলজি" },
  { code: "ARCH", name: "Architecture Technology", bn: "আর্কিটেকচার টেকনোলজি" },
  { code: "GDPM", name: "Garment Design & Pattern Making Technology", bn: "গার্মেন্টস ডিজাইন ও প্যাটার্ন মেকিং টেকনোলজি" },
];

// ---------------- Institutes ----------------
const instituteData = [
  ["1010", "Dhaka Polytechnic Institute", "Dhaka", "Government"],
  ["1020", "Chittagong Polytechnic Institute", "Chattogram", "Government"],
  ["1030", "Khulna Polytechnic Institute", "Khulna", "Government"],
  ["1040", "Rajshahi Polytechnic Institute", "Rajshahi", "Government"],
  ["1050", "Sylhet Polytechnic Institute", "Sylhet", "Government"],
  ["1060", "Barisal Polytechnic Institute", "Barishal", "Government"],
  ["1070", "Rangpur Polytechnic Institute", "Rangpur", "Government"],
  ["1080", "Mymensingh Polytechnic Institute", "Mymensingh", "Government"],
  ["1090", "Comilla Polytechnic Institute", "Cumilla", "Government"],
  ["1100", "Bogra Polytechnic Institute", "Bogura", "Government"],
  ["1110", "Pabna Polytechnic Institute", "Pabna", "Government"],
  ["1120", "Dinajpur Polytechnic Institute", "Dinajpur", "Government"],
  ["1130", "Faridpur Polytechnic Institute", "Faridpur", "Government"],
  ["1140", "Jashore Polytechnic Institute", "Jashore", "Government"],
  ["1150", "Kushtia Polytechnic Institute", "Kushtia", "Government"],
  ["1160", "Noakhali Polytechnic Institute", "Noakhali", "Government"],
  ["1170", "Patuakhali Polytechnic Institute", "Patuakhali", "Government"],
  ["1180", "Tangail Polytechnic Institute", "Tangail", "Government"],
  ["1190", "Habiganj Polytechnic Institute", "Habiganj", "Government"],
  ["1200", "Sherpur Polytechnic Institute", "Sherpur", "Government"],
  ["1210", "Moulvibazar Polytechnic Institute", "Moulvibazar", "Government"],
  ["1220", "Natore Polytechnic Institute", "Natore", "Government"],
  ["1230", "Sirajganj Polytechnic Institute", "Sirajganj", "Government"],
  ["1240", "Gopalganj Polytechnic Institute", "Gopalganj", "Government"],
  ["1250", "Cox's Bazar Polytechnic Institute", "Cox's Bazar", "Government"],
  ["2010", "Daffodil Polytechnic Institute", "Dhaka", "Private"],
  ["2020", "IDEAL Polytechnic Institute", "Dhaka", "Private"],
  ["2030", "Bangladesh Sweden Polytechnic Institute", "Kushtia", "Government"],
  ["2040", "Tampa Polytechnic Institute", "Dhaka", "Private"],
  ["2050", "Ahsanullah Polytechnic Institute", "Dhaka", "Private"],
  ["2060", "Khulna Mohila Polytechnic Institute", "Khulna", "Government"],
  ["2070", "Dhaka Mohila Polytechnic Institute", "Dhaka", "Government"],
  ["2080", "Chittagong Mohila Polytechnic Institute", "Chattogram", "Government"],
  ["2090", "Rajshahi Mohila Polytechnic Institute", "Rajshahi", "Government"],
  ["2100", "Sylhet Mohila Polytechnic Institute", "Sylhet", "Government"],
  ["2110", "Barishal Mohila Polytechnic Institute", "Barishal", "Government"],
  ["2120", "Rangpur Mohila Polytechnic Institute", "Rangpur", "Government"],
  ["2130", "Mymensingh Mohila Polytechnic Institute", "Mymensingh", "Government"],
  ["2140", "Viqarunnisa Polytechnic Institute", "Dhaka", "Private"],
  ["2150", "Modhumati Polytechnic Institute", "Bagerhat", "Private"],
  ["2160", "Padma Polytechnic Institute", "Rajbari", "Private"],
  ["2170", "Mymensingh Engineering College", "Mymensingh", "Government"],
  ["2180", "Bangladesh Institute of Glass & Ceramics", "Dhaka", "Government"],
  ["2190", "Survey Institute of Bangladesh", "Dhaka", "Government"],
  ["2200", "Kurigram Polytechnic Institute", "Kurigram", "Government"],
  ["2210", "Joypurhat Polytechnic Institute", "Joypurhat", "Government"],
  ["2220", "Naogaon Polytechnic Institute", "Naogaon", "Government"],
  ["2230", "Narayanganj Polytechnic Institute", "Narayanganj", "Government"],
  ["2240", "Gazipur Polytechnic Institute", "Gazipur", "Government"],
  ["2250", "Manikganj Polytechnic Institute", "Manikganj", "Government"],
] as const;

const institutes = instituteData.map(([code, name, district, type]) => ({
  code: code.trim(),
  name: name.trim(),
  district,
  type,
}));

// ---------------- Subject catalog per department ----------------
const subjectBank: Record<string, { code: string; name: string; credit: number }[]> = {
  CMT: [
    { code: "67411", name: "Computer Fundamentals", credit: 3 },
    { code: "67412", name: "Electrical Circuits I", credit: 4 },
    { code: "67413", name: "Mathematics I", credit: 4 },
    { code: "67414", name: "Physics I", credit: 3 },
    { code: "67415", name: "English I", credit: 3 },
    { code: "67421", name: "Programming with C", credit: 4 },
    { code: "67422", name: "Digital Electronics", credit: 3 },
    { code: "67423", name: "Data Structure", credit: 4 },
    { code: "67424", name: "Discrete Mathematics", credit: 3 },
    { code: "67431", name: "Object Oriented Programming", credit: 4 },
    { code: "67432", name: "Database Management System", credit: 4 },
    { code: "67433", name: "Operating System", credit: 3 },
    { code: "67441", name: "Computer Networks", credit: 4 },
    { code: "67442", name: "Software Engineering", credit: 3 },
    { code: "67443", name: "Web Engineering", credit: 4 },
    { code: "67451", name: "Data Communication", credit: 3 },
    { code: "67452", name: "Microprocessor & Interfacing", credit: 4 },
    { code: "67461", name: "Project Work", credit: 4 },
    { code: "67462", name: "In-plant Training", credit: 2 },
  ],
  ET: [
    { code: "66411", name: "Electrical Circuits I", credit: 4 },
    { code: "66412", name: "Electrical Drafting", credit: 3 },
    { code: "66413", name: "Mathematics I", credit: 4 },
    { code: "66414", name: "Physics I", credit: 3 },
    { code: "66415", name: "English I", credit: 3 },
    { code: "66421", name: "Electrical Machines I", credit: 4 },
    { code: "66422", name: "Electrical Circuits II", credit: 4 },
    { code: "66423", name: "Electronics I", credit: 3 },
    { code: "66431", name: "Electrical Machines II", credit: 4 },
    { code: "66432", name: "Power System I", credit: 4 },
    { code: "66433", name: "Electrical Measurements", credit: 3 },
    { code: "66441", name: "Power System II", credit: 4 },
    { code: "66442", name: "Switchgear & Protection", credit: 3 },
    { code: "66443", name: "Electrical Wiring", credit: 3 },
    { code: "66451", name: "Industrial Electronics", credit: 3 },
    { code: "66461", name: "Project Work", credit: 4 },
    { code: "66462", name: "In-plant Training", credit: 2 },
  ],
  ENT: [
    { code: "65411", name: "Electrical Circuits I", credit: 4 },
    { code: "65412", name: "Electronics Fundamentals", credit: 3 },
    { code: "65413", name: "Mathematics I", credit: 4 },
    { code: "65421", name: "Digital Electronics", credit: 4 },
    { code: "65422", name: "Electronic Devices", credit: 3 },
    { code: "65431", name: "Linear Integrated Circuits", credit: 4 },
    { code: "65432", name: "Microprocessor", credit: 4 },
    { code: "65441", name: "Microcontroller", credit: 4 },
    { code: "65442", name: "Communication Electronics", credit: 3 },
    { code: "65451", name: "Industrial Electronics", credit: 3 },
    { code: "65461", name: "Project Work", credit: 4 },
    { code: "65462", name: "In-plant Training", credit: 2 },
  ],
  MT: [
    { code: "64411", name: "Engineering Materials", credit: 3 },
    { code: "64412", name: "Engineering Drawing I", credit: 4 },
    { code: "64413", name: "Mathematics I", credit: 4 },
    { code: "64414", name: "Workshop Practice I", credit: 3 },
    { code: "64421", name: "Thermodynamics", credit: 4 },
    { code: "64422", name: "Strength of Materials", credit: 4 },
    { code: "64431", name: "Fluid Mechanics", credit: 4 },
    { code: "64432", name: "Machine Design", credit: 3 },
    { code: "64441", name: "Thermal Engineering", credit: 4 },
    { code: "64442", name: "Production Engineering", credit: 3 },
    { code: "64451", name: "Industrial Management", credit: 3 },
    { code: "64461", name: "Project Work", credit: 4 },
    { code: "64462", name: "In-plant Training", credit: 2 },
  ],
  CT: [
    { code: "63411", name: "Engineering Drawing I", credit: 4 },
    { code: "63412", name: "Mathematics I", credit: 4 },
    { code: "63413", name: "Physics I", credit: 3 },
    { code: "63414", name: "Civil Engineering Materials", credit: 3 },
    { code: "63421", name: "Surveying I", credit: 4 },
    { code: "63422", name: "Mechanics of Materials", credit: 4 },
    { code: "63431", name: "Structural Mechanics", credit: 4 },
    { code: "63432", name: "Concrete Technology", credit: 3 },
    { code: "63441", name: "Reinforced Concrete Design", credit: 4 },
    { code: "63442", name: "Geotechnical Engineering", credit: 3 },
    { code: "63451", name: "Highway Engineering", credit: 4 },
    { code: "63461", name: "Project Work", credit: 4 },
    { code: "63462", name: "In-plant Training", credit: 2 },
  ],
  RAC: [
    { code: "62411", name: "Thermodynamics", credit: 4 },
    { code: "62412", name: "Refrigeration Fundamentals", credit: 3 },
    { code: "62413", name: "Mathematics I", credit: 4 },
    { code: "62421", name: "Refrigeration Systems", credit: 4 },
    { code: "62422", name: "Air Conditioning", credit: 4 },
    { code: "62431", name: "Heat Transfer", credit: 3 },
    { code: "62432", name: "Refrigeration Components", credit: 4 },
    { code: "62441", name: "AC System Design", credit: 4 },
    { code: "62451", name: "Industrial Refrigeration", credit: 3 },
    { code: "62461", name: "Project Work", credit: 4 },
    { code: "62462", name: "In-plant Training", credit: 2 },
  ],
  AT: [
    { code: "61411", name: "Automobile Fundamentals", credit: 3 },
    { code: "61412", name: "Engineering Drawing", credit: 4 },
    { code: "61413", name: "Mathematics I", credit: 4 },
    { code: "61421", name: "Automobile Engines", credit: 4 },
    { code: "61422", name: "Automobile Chassis", credit: 3 },
    { code: "61431", name: "Automobile Transmission", credit: 4 },
    { code: "61432", name: "Automobile Electrical", credit: 3 },
    { code: "61441", name: "Automobile Maintenance", credit: 4 },
    { code: "61451", name: "Garage Management", credit: 3 },
    { code: "61461", name: "Project Work", credit: 4 },
    { code: "61462", name: "In-plant Training", credit: 2 },
  ],
  CHT: [
    { code: "60411", name: "Chemical Process Calculations", credit: 4 },
    { code: "60412", name: "Inorganic Chemistry", credit: 3 },
    { code: "60413", name: "Mathematics I", credit: 4 },
    { code: "60421", name: "Organic Chemistry", credit: 3 },
    { code: "60422", name: "Physical Chemistry", credit: 4 },
    { code: "60431", name: "Chemical Engineering", credit: 4 },
    { code: "60441", name: "Unit Operations", credit: 4 },
    { code: "60451", name: "Process Control", credit: 3 },
    { code: "60461", name: "Project Work", credit: 4 },
    { code: "60462", name: "In-plant Training", credit: 2 },
  ],
  TT: [
    { code: "69411", name: "Textile Fiber", credit: 4 },
    { code: "69412", name: "Yarn Manufacturing I", credit: 4 },
    { code: "69413", name: "Mathematics I", credit: 4 },
    { code: "69421", name: "Fabric Manufacturing", credit: 4 },
    { code: "69422", name: "Textile Chemistry", credit: 3 },
    { code: "69431", name: "Wet Processing", credit: 4 },
    { code: "69432", name: "Textile Testing", credit: 3 },
    { code: "69441", name: "Apparel Manufacturing", credit: 4 },
    { code: "69451", name: "Quality Control", credit: 3 },
    { code: "69461", name: "Project Work", credit: 4 },
    { code: "69462", name: "In-plant Training", credit: 2 },
  ],
  TCT: [
    { code: "68411", name: "Electrical Circuits", credit: 4 },
    { code: "68412", name: "Telecommunication Fundamentals", credit: 3 },
    { code: "68413", name: "Mathematics I", credit: 4 },
    { code: "68421", name: "Digital Electronics", credit: 4 },
    { code: "68422", name: "Signals & Systems", credit: 3 },
    { code: "68431", name: "Telecommunication Systems", credit: 4 },
    { code: "68432", name: "Antenna & Wave Propagation", credit: 3 },
    { code: "68441", name: "Mobile Communication", credit: 4 },
    { code: "68451", name: "Optical Fiber Communication", credit: 3 },
    { code: "68461", name: "Project Work", credit: 4 },
    { code: "68462", name: "In-plant Training", credit: 2 },
  ],
  ARCH: [
    { code: "58411", name: "Architectural Drawing I", credit: 4 },
    { code: "58412", name: "Building Materials", credit: 3 },
    { code: "58413", name: "Mathematics I", credit: 4 },
    { code: "58421", name: "Architectural Design I", credit: 4 },
    { code: "58422", name: "History of Architecture", credit: 3 },
    { code: "58431", name: "Building Construction", credit: 4 },
    { code: "58432", name: "Structural Systems", credit: 3 },
    { code: "58441", name: "Urban Planning", credit: 3 },
    { code: "58451", name: "Landscape Design", credit: 3 },
    { code: "58461", name: "Project Work", credit: 4 },
    { code: "58462", name: "In-plant Training", credit: 2 },
  ],
  GDPM: [
    { code: "59411", name: "Garment Fundamentals", credit: 3 },
    { code: "59412", name: "Textile Materials", credit: 4 },
    { code: "59413", name: "Mathematics I", credit: 4 },
    { code: "59421", name: "Pattern Making I", credit: 4 },
    { code: "59422", name: "Garment Construction", credit: 3 },
    { code: "59431", name: "Pattern Grading", credit: 4 },
    { code: "59432", name: "Fashion Design", credit: 3 },
    { code: "59441", name: "Apparel Production", credit: 4 },
    { code: "59451", name: "Quality Assurance", credit: 3 },
    { code: "59461", name: "Project Work", credit: 4 },
    { code: "59462", name: "In-plant Training", credit: 2 },
  ],
};

// ---------------- Names ----------------
const firstNames = [
  "Md.", "Mohammad", "Abdul", "Abu", "Sk.", "Mst.", "Tahmina", "Sumaiya", "Nusrat", "Fariha",
  "Sadia", "Rumana", "Rakibul", "Sakibul", "Tanvir", "Imran", "Hasan", "Rahim", "Karim", "Jamal",
  "Rifat", "Shohan", "Ariful", "Nazmul", "Shahidul", "Mizanur", "Fahim", "Naimur", "Rakib", "Shuvo",
  "Asif", "Sabbir", "Rasel", "Sujon", "Habib", "Nayan", "Jewel", "Shanto", "Milon", "Sumon",
  "Priya", "Ripa", "Liza", "Mitu", "Rani", "Anika", "Tania", "Mim", "Jui", "Sabbira",
];
const lastNames = [
  "Islam", "Hossain", "Rahman", "Ahmed", "Khan", "Akter", "Begum", "Sheikh", "Chowdhury", "Das",
  "Sarker", "Miah", "Talukder", "Barua", "Roy", "Haque", "Mondal", "Ali", "Uddin", "Nesa",
  "Akash", "Rana", "Mahmud", "Faruk", "Hossen", "Biswas", "Paul", "Dasgupta", "Saha", "Akther",
];

// ---------------- GPA / Grade mapping ----------------
function gradeFromMarks(marks: number) {
  if (marks >= 80) return { letter: "A+", point: 4.0 };
  if (marks >= 70) return { letter: "A", point: 3.5 };
  if (marks >= 60) return { letter: "A-", point: 3.0 };
  if (marks >= 50) return { letter: "B", point: 2.5 };
  if (marks >= 40) return { letter: "C", point: 2.0 };
  if (marks >= 33) return { letter: "D", point: 1.0 };
  return { letter: "F", point: 0.0 };
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240115);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

// ---------------- Publications ----------------
// Matches the official BTEB Archive System (result.bteb.gov.bd) form:
//   Name of Examination  -> examType (Diploma, SSC VOC, HSC VOC, Short Course)
//   Name of Curriculum   -> curriculum (Diploma in Engineering / Textile / Agriculture...)
//   Semester / Class     -> semester
//   Exam Year            -> examYear
const publications = [
  { id: "pub-2025-1sem", title: "1st Semester Diploma in Engineering Result 2025", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 1, examYear: 2025, publicationDate: "2025-03-15", totalStudents: 0, passRate: 0 },
  { id: "pub-2025-3sem", title: "3rd Semester Diploma in Engineering Result 2025", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 3, examYear: 2025, publicationDate: "2025-05-20", totalStudents: 0, passRate: 0 },
  { id: "pub-2024-5sem", title: "5th Semester Diploma in Engineering Result 2024", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 5, examYear: 2024, publicationDate: "2024-11-10", totalStudents: 0, passRate: 0 },
  { id: "pub-2024-7sem", title: "7th Semester Diploma in Engineering Result 2024", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 7, examYear: 2024, publicationDate: "2024-09-05", totalStudents: 0, passRate: 0 },
  { id: "pub-2024-8sem", title: "8th Semester (Final) Diploma in Engineering Result 2024", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 8, examYear: 2024, publicationDate: "2024-12-28", totalStudents: 0, passRate: 0 },
  { id: "pub-2025-2sem", title: "2nd Semester Diploma in Engineering Result 2025", examType: "Diploma", curriculum: "Diploma in Engineering", semester: 2, examYear: 2025, publicationDate: "2025-06-30", totalStudents: 0, passRate: 0 },
  { id: "pub-2025-textile-1", title: "1st Semester Diploma in Textile Result 2025", examType: "Diploma", curriculum: "Diploma in Textile", semester: 1, examYear: 2025, publicationDate: "2025-04-02", totalStudents: 0, passRate: 0 },
  { id: "pub-2024-agri-3", title: "3rd Semester Diploma in Agriculture Result 2024", examType: "Diploma", curriculum: "Diploma in Agriculture", semester: 3, examYear: 2024, publicationDate: "2024-10-18", totalStudents: 0, passRate: 0 },
];

type SubjectResult = { code: string; name: string; credit: number; marks: number; letter: string; point: number };
type StudentResult = {
  roll: string; registrationNo: string; name: string; instituteCode: string; instituteName: string;
  departmentCode: string; departmentName: string; examType: string; curriculum: string;
  semester: number; examYear: number;
  publicationId: string; publicationDate: string; subjects: SubjectResult[]; gpa: number;
  letterGrade: string; result: "PASSED" | "FAILED"; cgpa: number;
};

const results: StudentResult[] = [];
const pubStats: Record<string, { total: number; passed: number; gpaSum: number; gradeCount: Record<string, number>; deptCount: Record<string, number> }> = {};

let rollSeq = 100000;
for (const pub of publications) {
  pubStats[pub.id] = { total: 0, passed: 0, gpaSum: 0, gradeCount: {}, deptCount: {} };
  const count = randInt(90, 160);
  for (let i = 0; i < count; i++) {
    const inst = pick(institutes);
    const dept = pick(departments);
    const subjects = subjectBank[dept.code] || subjectBank.CMT;
    const nSub = randInt(5, Math.min(7, subjects.length));
    const startIdx = randInt(0, Math.max(0, subjects.length - nSub));
    const chosen = subjects.slice(startIdx, startIdx + nSub);

    let failedAny = false;
    let weightedPoint = 0;
    let totalCredit = 0;
    const subResults: SubjectResult[] = chosen.map((s) => {
      const r = rand();
      let marks: number;
      if (r < 0.06) marks = randInt(0, 32);
      else if (r < 0.16) marks = randInt(33, 49);
      else if (r < 0.36) marks = randInt(50, 59);
      else if (r < 0.6) marks = randInt(60, 69);
      else if (r < 0.82) marks = randInt(70, 79);
      else marks = randInt(80, 95);
      const g = gradeFromMarks(marks);
      if (g.letter === "F") failedAny = true;
      weightedPoint += g.point * s.credit;
      totalCredit += s.credit;
      return { ...s, marks, letter: g.letter, point: g.point };
    });

    const gpa = failedAny ? 0 : Math.round((weightedPoint / totalCredit) * 100) / 100;
    const letterGrade = failedAny ? "F" : gpa >= 4 ? "A+" : gpa >= 3.5 ? "A" : gpa >= 3 ? "A-" : gpa >= 2.5 ? "B" : gpa >= 2 ? "C" : "D";
    const result: "PASSED" | "FAILED" = failedAny ? "FAILED" : "PASSED";

    const priorGpas: number[] = [];
    for (let s = 1; s < pub.semester; s++) {
      const pr = rand();
      if (pr < 0.05) priorGpas.push(0);
      else priorGpas.push(Math.round((2.5 + rand() * 1.5) * 100) / 100);
    }
    const allGpas = [...priorGpas, gpa];
    const cgpa = Math.round((allGpas.reduce((a, b) => a + b, 0) / allGpas.length) * 100) / 100;

    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    rollSeq += 1;
    const roll = String(rollSeq).padStart(8, "0");
    const registrationNo = `${pub.examYear - 4}${inst.code}0${randInt(1000, 9999)}`;

    results.push({
      roll, registrationNo, name, instituteCode: inst.code, instituteName: inst.name,
      departmentCode: dept.code, departmentName: dept.name,
      examType: pub.examType, curriculum: pub.curriculum,
      semester: pub.semester, examYear: pub.examYear,
      publicationId: pub.id, publicationDate: pub.publicationDate, subjects: subResults, gpa,
      letterGrade, result, cgpa,
    });

    const st = pubStats[pub.id];
    st.total += 1;
    if (result === "PASSED") st.passed += 1;
    if (result === "PASSED") st.gpaSum += gpa;
    st.gradeCount[letterGrade] = (st.gradeCount[letterGrade] || 0) + 1;
    st.deptCount[dept.code] = (st.deptCount[dept.code] || 0) + 1;
  }
}

for (const pub of publications) {
  const st = pubStats[pub.id];
  pub.totalStudents = st.total;
  pub.passRate = Math.round((st.passed / st.total) * 1000) / 10;
  // Assign the official BTEB roll range for this publication.
  // It spans the actual stored rolls plus padding to simulate absent /
  // invalid rolls that the crawler would encounter on the official archive.
  const pubRolls = results
    .filter((r) => r.publicationId === pub.id)
    .map((r) => parseInt(r.roll, 10));
  if (pubRolls.length > 0) {
    const minRoll = Math.min(...pubRolls);
    const maxRoll = Math.max(...pubRolls);
    // pad both ends so the crawl finds "not in published range" gaps
    pub.rollStart = minRoll - randInt(5, 15);
    pub.rollEnd = maxRoll + randInt(5, 20);
  } else {
    pub.rollStart = 100001;
    pub.rollEnd = 100200;
  }
}

// ---------------- Routines ----------------
const routineTitles = [
  "Diploma in Engineering 1st Semester Exam Routine 2025",
  "Diploma in Engineering 3rd Semester Exam Routine 2025",
  "Diploma in Engineering 5th Semester Exam Routine 2024",
  "Diploma in Engineering 7th Semester Exam Routine 2024",
  "Diploma in Engineering 2nd Semester Exam Routine 2025",
  "Diploma in Engineering 4th Semester Exam Routine 2024",
];
const routines = routineTitles.map((title, idx) => {
  const sem = [1, 3, 5, 7, 2, 4][idx];
  const year = [2025, 2025, 2024, 2024, 2025, 2024][idx];
  const startDate = new Date(year, idx * 2, 5 + idx * 3);
  const dept = departments[idx % departments.length];
  const subs = subjectBank[dept.code] || subjectBank.CMT;
  const schedule = subs.slice(0, 6).map((s, j) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + j * 3);
    return {
      date: d.toISOString().slice(0, 10),
      day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][j],
      subjectCode: s.code,
      subjectName: s.name,
      time: "10:00 AM - 1:00 PM",
    };
  });
  const end = new Date(startDate);
  end.setDate(end.getDate() + 15);
  return {
    id: `routine-${idx + 1}`,
    title,
    semester: sem,
    examYear: year,
    departmentCode: dept.code,
    departmentName: dept.name,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    schedule,
    publishedAt: new Date(year, idx, 1).toISOString().slice(0, 10),
  };
});

// ---------------- Booklists ----------------
const booklists = departments.map((dept) => {
  const subs = subjectBank[dept.code] || subjectBank.CMT;
  const books = subs.map((s) => ({
    code: s.code,
    name: s.name,
    credit: s.credit,
    author: pick([
      "Dr. M. A. Wadud",
      "Prof. A. K. M. Fazlul Haque",
      "Md. Ashraf Hossain",
      "Engr. S. M. Nazrul Islam",
      "Dr. Quazi S. Hossain",
      "Prof. M. Rafiqul Islam",
    ]),
    edition: pick(["1st Edition", "2nd Edition", "3rd Edition", "Revised Edition"]),
    publisher: pick(["Technical Education Board", "Bangla Book House", "Student Publications", "Bangladesh Book Depot"]),
  }));
  return {
    id: `booklist-${dept.code}`,
    departmentCode: dept.code,
    departmentName: dept.name,
    curriculumYear: 2022,
    totalBooks: books.length,
    books,
  };
});

// ---------------- Write files ----------------
writeFileSync(join(OUT, "departments.json"), JSON.stringify(departments, null, 2));
writeFileSync(join(OUT, "institutes.json"), JSON.stringify(institutes, null, 2));
writeFileSync(join(OUT, "publications.json"), JSON.stringify(publications, null, 2));
writeFileSync(join(OUT, "results.json"), JSON.stringify(results, null, 2));
writeFileSync(join(OUT, "routines.json"), JSON.stringify(routines, null, 2));
writeFileSync(join(OUT, "booklists.json"), JSON.stringify(booklists, null, 2));

const totalResults = results.length;
const totalPassed = results.filter((r) => r.result === "PASSED").length;
const uniqueStudents = new Set(results.map((r) => r.roll)).size;
const stats = {
  totalStudentsServed: 2300000,
  totalResults: totalResults,
  totalInstitutes: institutes.length,
  totalDepartments: departments.length,
  totalPublications: publications.length,
  totalRoutines: routines.length,
  overallPassRate: Math.round((totalPassed / totalResults) * 1000) / 10,
  yearsOfService: 5,
  uptime: 99.9,
  uniqueStudentsInDataset: uniqueStudents,
};
writeFileSync(join(OUT, "stats.json"), JSON.stringify(stats, null, 2));

console.log("Generated:");
console.log("  departments:", departments.length);
console.log("  institutes:", institutes.length);
console.log("  publications:", publications.length);
console.log("  results:", results.length);
console.log("  routines:", routines.length);
console.log("  booklists:", booklists.length);
console.log("  overall pass rate:", stats.overallPassRate + "%");
