/**
 * Seed data generator v2 for BTEB Results Zone clone.
 *
 * Key change from v1: a student now has a STABLE identity (roll, registration,
 * institute, department, batch year) that persists across all their semester
 * results. Searching a roll returns the student's COMPLETE ACADEMIC HISTORY
 * (every semester result they have), exactly like the original site.
 *
 * Also adds:
 *   - Multiple curricula (Diploma in Engineering / Textile / Agriculture /
 *     Fisheries / Forestry / Livestock) matching the official BTEB form.
 *   - Publication "files" (each publication bundles one or more PDF result
 *     files scraped from the official BTEB archive).
 *   - Regulations (2022).
 *
 * Run: `bun run scripts/generate-data.ts`
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "data");
mkdirSync(OUT, { recursive: true });

// ---------------- Departments (Technology list under Regulation 2022) ----------------
const departments = [
  { code: "CST", name: "Computer Science & Technology", bn: "কম্পিউটার সায়েন্স ও টেকনোলজি" },
  { code: "ET", name: "Electrical Technology", bn: "ইলেকট্রিক্যাল টেকনোলজি" },
  { code: "ENT", name: "Electronics Technology", bn: "ইলেকট্রনিক্স টেকনোলজি" },
  { code: "MT", name: "Mechanical Technology", bn: "মেকানিক্যাল টেকনোলজি" },
  { code: "CT", name: "Civil Technology", bn: "সিভিল টেকনোলজি" },
  { code: "RAC", name: "Refrigeration & Air Conditioning Technology", bn: "রেফ্রিজারেশন ও এয়ার কন্ডিশনিং টেকনোলজি" },
  { code: "AT", name: "Automobile Technology", bn: "অটোমোবাইল টেকনোলজি" },
  { code: "CHT", name: "Chemical Technology", bn: "কেমিক্যাল টেকনোলজি" },
  { code: "FT", name: "Food Technology", bn: "ফুড টেকনোলজি" },
  { code: "ARCH", name: "Architecture Technology", bn: "আর্কিটেকচার টেকনোলজি" },
  { code: "GPM", name: "Garment Design & Pattern Making", bn: "গার্মেন্টস ডিজাইন ও প্যাটার্ন মেকিং" },
  { code: "MET", name: "Mechatronics Technology", bn: "মেকাট্রনিক্স টেকনোলজি" },
];

// ---------------- Curricula (official BTEB exam types) ----------------
const curricula = [
  "Diploma in Engineering",
  "Diploma in Textile Engineering",
  "Diploma in Agriculture",
  "Diploma in Fisheries",
  "Diploma in Forestry",
  "Diploma in Livestock",
];

// ---------------- Institutes ----------------
const instituteData = [
  ["1010", "Dhaka Polytechnic Institute", "Dhaka", "Government"],
  ["1020", "Chattogram Polytechnic Institute", "Chattogram", "Government"],
  ["1030", "Khulna Polytechnic Institute", "Khulna", "Government"],
  ["1040", "Rajshahi Polytechnic Institute", "Rajshahi", "Government"],
  ["1050", "Sylhet Polytechnic Institute", "Sylhet", "Government"],
  ["1060", "Barishal Polytechnic Institute", "Barishal", "Government"],
  ["1070", "Rangpur Polytechnic Institute", "Rangpur", "Government"],
  ["1080", "Mymensingh Polytechnic Institute", "Mymensingh", "Government"],
  ["1090", "Cumilla Polytechnic Institute", "Cumilla", "Government"],
  ["1100", "Bogura Polytechnic Institute", "Bogura", "Government"],
  ["1110", "Pabna Polytechnic Institute", "Pabna", "Government"],
  ["1120", "Dinajpur Polytechnic Institute", "Dinajpur", "Government"],
  ["1130", "Faridpur Polytechnic Institute", "Faridpur", "Government"],
  ["1140", "Jashore Polytechnic Institute", "Jashore", "Government"],
  ["1150", "Kushtia Polytechnic Institute", "Kushtia", "Government"],
  ["1160", "Noakhali Polytechnic Institute", "Noakhali", "Government"],
  ["1170", "Patuakhali Polytechnic Institute", "Patuakhali", "Government"],
  ["1180", "Tangail Polytechnic Institute", "Tangail", "Government"],
  ["1190", "Habiganj Polytechnic Institute", "Habiganj", "Government"],
  ["1200", "Barguna Polytechnic Institute", "Barguna", "Government"],
  ["1210", "Moulvibazar Polytechnic Institute", "Moulvibazar", "Government"],
  ["1220", "Natore Polytechnic Institute", "Natore", "Government"],
  ["1230", "Sirajganj Polytechnic Institute", "Sirajganj", "Government"],
  ["1240", "Gopalganj Polytechnic Institute", "Gopalganj", "Government"],
  ["1250", "Cox's Bazar Polytechnic Institute", "Cox's Bazar", "Government"],
  ["1260", "Bhola Polytechnic Institute", "Bhola", "Government"],
  ["1270", "Brahmanbaria Polytechnic Institute", "Brahmanbaria", "Government"],
  ["1280", "Chandpur Polytechnic Institute", "Chandpur", "Government"],
  ["1290", "Chapai Nawabganj Polytechnic Institute", "Chapai Nawabganj", "Government"],
  ["1300", "Chuadanga Polytechnic Institute", "Chuadanga", "Government"],
  ["1310", "Feni Polytechnic Institute", "Feni", "Government"],
  ["1320", "Gazipur Polytechnic Institute", "Gazipur", "Government"],
  ["1330", "Jhenaidah Polytechnic Institute", "Jhenaidah", "Government"],
  ["1340", "Kishoreganj Polytechnic Institute", "Kishoreganj", "Government"],
  ["1350", "Kurigram Polytechnic Institute", "Kurigram", "Government"],
  ["1360", "Lakshmipur Polytechnic Institute", "Lakshmipur", "Government"],
  ["1370", "Magura Polytechnic Institute", "Magura", "Government"],
  ["1380", "Manikganj Polytechnic Institute", "Manikganj", "Government"],
  ["1390", "Munshiganj Polytechnic Institute", "Munshiganj", "Government"],
  ["1400", "Naogaon Polytechnic Institute", "Naogaon", "Government"],
  ["1410", "Narayanganj Polytechnic Institute", "Narayanganj", "Government"],
  ["1420", "Narsingdi Polytechnic Institute", "Narsingdi", "Government"],
  ["1430", "Netrokona Polytechnic Institute", "Netrokona", "Government"],
  ["1440", "Pirojpur Polytechnic Institute", "Pirojpur", "Government"],
  ["1450", "Rajbari Polytechnic Institute", "Rajbari", "Government"],
  ["1460", "Shariatpur Polytechnic Institute", "Shariatpur", "Government"],
  ["1470", "Sherpur Polytechnic Institute", "Sherpur", "Government"],
  ["1480", "Sunamganj Polytechnic Institute", "Sunamganj", "Government"],
  ["1490", "Joypurhat Polytechnic Institute", "Joypurhat", "Government"],
  ["1500", "Daffodil Polytechnic Institute", "Dhaka", "Private"],
] as const;

const institutes = instituteData.map(([code, name, district, type]) => ({
  code: code.trim(),
  name: name.trim(),
  district,
  type,
}));

// ---------------- Subject catalog per department ----------------
const subjectBank: Record<string, { code: string; name: string; credit: number }[]> = {
  CST: [
    { code: "67211", name: "Computer Fundamentals", credit: 3 },
    { code: "67212", name: "Electrical Circuits I", credit: 4 },
    { code: "67213", name: "Mathematics I", credit: 4 },
    { code: "67214", name: "Physics I", credit: 3 },
    { code: "67215", name: "English I", credit: 3 },
    { code: "67221", name: "Programming with C", credit: 4 },
    { code: "67222", name: "Digital Electronics", credit: 3 },
    { code: "67223", name: "Data Structure", credit: 4 },
    { code: "67224", name: "Discrete Mathematics", credit: 3 },
    { code: "67231", name: "Object Oriented Programming", credit: 4 },
    { code: "67232", name: "Database Management System", credit: 4 },
    { code: "67233", name: "Operating System", credit: 3 },
    { code: "67241", name: "Computer Networks", credit: 4 },
    { code: "67242", name: "Software Engineering", credit: 3 },
    { code: "67243", name: "Web Engineering", credit: 4 },
    { code: "67251", name: "Data Communication", credit: 3 },
    { code: "67252", name: "Microprocessor & Interfacing", credit: 4 },
    { code: "67261", name: "Project Work", credit: 4 },
    { code: "67262", name: "In-plant Training", credit: 2 },
    { code: "67271", name: "Cyber Security", credit: 3 },
    { code: "67272", name: "Cloud Computing", credit: 3 },
    { code: "67281", name: "Machine Learning", credit: 3 },
    { code: "67282", name: "Mobile Application Development", credit: 4 },
    { code: "67283", name: "IT Entrepreneurship", credit: 2 },
  ],
  ET: [
    { code: "66211", name: "Electrical Circuits I", credit: 4 },
    { code: "66212", name: "Electrical Drafting", credit: 3 },
    { code: "66213", name: "Mathematics I", credit: 4 },
    { code: "66214", name: "Physics I", credit: 3 },
    { code: "66215", name: "English I", credit: 3 },
    { code: "66221", name: "Electrical Machines I", credit: 4 },
    { code: "66222", name: "Electrical Circuits II", credit: 4 },
    { code: "66223", name: "Electronics I", credit: 3 },
    { code: "66231", name: "Electrical Machines II", credit: 4 },
    { code: "66232", name: "Power System I", credit: 4 },
    { code: "66233", name: "Electrical Measurements", credit: 3 },
    { code: "66241", name: "Power System II", credit: 4 },
    { code: "66242", name: "Switchgear & Protection", credit: 3 },
    { code: "66243", name: "Electrical Wiring", credit: 3 },
    { code: "66251", name: "Industrial Electronics", credit: 3 },
    { code: "66261", name: "Project Work", credit: 4 },
    { code: "66262", name: "In-plant Training", credit: 2 },
  ],
  ENT: [
    { code: "65211", name: "Electrical Circuits I", credit: 4 },
    { code: "65212", name: "Electronics Fundamentals", credit: 3 },
    { code: "65213", name: "Mathematics I", credit: 4 },
    { code: "65221", name: "Digital Electronics", credit: 4 },
    { code: "65222", name: "Electronic Devices", credit: 3 },
    { code: "65231", name: "Linear Integrated Circuits", credit: 4 },
    { code: "65232", name: "Microprocessor", credit: 4 },
    { code: "65241", name: "Microcontroller", credit: 4 },
    { code: "65242", name: "Communication Electronics", credit: 3 },
    { code: "65251", name: "Industrial Electronics", credit: 3 },
    { code: "65261", name: "Project Work", credit: 4 },
    { code: "65262", name: "In-plant Training", credit: 2 },
  ],
  MT: [
    { code: "64211", name: "Engineering Materials", credit: 3 },
    { code: "64212", name: "Engineering Drawing I", credit: 4 },
    { code: "64213", name: "Mathematics I", credit: 4 },
    { code: "64214", name: "Workshop Practice I", credit: 3 },
    { code: "64221", name: "Thermodynamics", credit: 4 },
    { code: "64222", name: "Strength of Materials", credit: 4 },
    { code: "64231", name: "Fluid Mechanics", credit: 4 },
    { code: "64232", name: "Machine Design", credit: 3 },
    { code: "64241", name: "Thermal Engineering", credit: 4 },
    { code: "64242", name: "Production Engineering", credit: 3 },
    { code: "64251", name: "Industrial Management", credit: 3 },
    { code: "64261", name: "Project Work", credit: 4 },
    { code: "64262", name: "In-plant Training", credit: 2 },
  ],
  CT: [
    { code: "63211", name: "Engineering Drawing I", credit: 4 },
    { code: "63212", name: "Mathematics I", credit: 4 },
    { code: "63213", name: "Physics I", credit: 3 },
    { code: "63214", name: "Civil Engineering Materials", credit: 3 },
    { code: "63221", name: "Surveying I", credit: 4 },
    { code: "63222", name: "Mechanics of Materials", credit: 4 },
    { code: "63231", name: "Structural Mechanics", credit: 4 },
    { code: "63232", name: "Concrete Technology", credit: 3 },
    { code: "63241", name: "Reinforced Concrete Design", credit: 4 },
    { code: "63242", name: "Geotechnical Engineering", credit: 3 },
    { code: "63251", name: "Highway Engineering", credit: 4 },
    { code: "63261", name: "Project Work", credit: 4 },
    { code: "63262", name: "In-plant Training", credit: 2 },
  ],
  RAC: [
    { code: "62211", name: "Thermodynamics", credit: 4 },
    { code: "62212", name: "Refrigeration Fundamentals", credit: 3 },
    { code: "62213", name: "Mathematics I", credit: 4 },
    { code: "62221", name: "Refrigeration Systems", credit: 4 },
    { code: "62222", name: "Air Conditioning", credit: 4 },
    { code: "62231", name: "Heat Transfer", credit: 3 },
    { code: "62232", name: "Refrigeration Components", credit: 4 },
    { code: "62241", name: "AC System Design", credit: 4 },
    { code: "62251", name: "Industrial Refrigeration", credit: 3 },
    { code: "62261", name: "Project Work", credit: 4 },
    { code: "62262", name: "In-plant Training", credit: 2 },
  ],
  AT: [
    { code: "61211", name: "Automobile Fundamentals", credit: 3 },
    { code: "61212", name: "Engineering Drawing", credit: 4 },
    { code: "61213", name: "Mathematics I", credit: 4 },
    { code: "61221", name: "Automobile Engines", credit: 4 },
    { code: "61222", name: "Automobile Chassis", credit: 3 },
    { code: "61231", name: "Automobile Transmission", credit: 4 },
    { code: "61232", name: "Automobile Electrical", credit: 3 },
    { code: "61241", name: "Automobile Maintenance", credit: 4 },
    { code: "61251", name: "Garage Management", credit: 3 },
    { code: "61261", name: "Project Work", credit: 4 },
    { code: "61262", name: "In-plant Training", credit: 2 },
  ],
  CHT: [
    { code: "60211", name: "Chemical Process Calculations", credit: 4 },
    { code: "60212", name: "Inorganic Chemistry", credit: 3 },
    { code: "60213", name: "Mathematics I", credit: 4 },
    { code: "60221", name: "Organic Chemistry", credit: 3 },
    { code: "60222", name: "Physical Chemistry", credit: 4 },
    { code: "60231", name: "Chemical Engineering", credit: 4 },
    { code: "60241", name: "Unit Operations", credit: 4 },
    { code: "60251", name: "Process Control", credit: 3 },
    { code: "60261", name: "Project Work", credit: 4 },
    { code: "60262", name: "In-plant Training", credit: 2 },
  ],
  FT: [
    { code: "69211", name: "Food Chemistry", credit: 4 },
    { code: "69212", name: "Food Microbiology", credit: 3 },
    { code: "69213", name: "Mathematics I", credit: 4 },
    { code: "69221", name: "Food Processing", credit: 4 },
    { code: "69222", name: "Food Engineering", credit: 3 },
    { code: "69231", name: "Food Preservation", credit: 4 },
    { code: "69232", name: "Food Quality Control", credit: 3 },
    { code: "69241", name: "Food Packaging", credit: 4 },
    { code: "69251", name: "Dairy Technology", credit: 3 },
    { code: "69261", name: "Project Work", credit: 4 },
    { code: "69262", name: "In-plant Training", credit: 2 },
  ],
  ARCH: [
    { code: "58211", name: "Architectural Drawing I", credit: 4 },
    { code: "58212", name: "Building Materials", credit: 3 },
    { code: "58213", name: "Mathematics I", credit: 4 },
    { code: "58221", name: "Architectural Design I", credit: 4 },
    { code: "58222", name: "History of Architecture", credit: 3 },
    { code: "58231", name: "Building Construction", credit: 4 },
    { code: "58232", name: "Structural Systems", credit: 3 },
    { code: "58241", name: "Urban Planning", credit: 3 },
    { code: "58251", name: "Landscape Design", credit: 3 },
    { code: "58261", name: "Project Work", credit: 4 },
    { code: "58262", name: "In-plant Training", credit: 2 },
  ],
  GPM: [
    { code: "59211", name: "Garment Fundamentals", credit: 3 },
    { code: "59212", name: "Textile Materials", credit: 4 },
    { code: "59213", name: "Mathematics I", credit: 4 },
    { code: "59221", name: "Pattern Making I", credit: 4 },
    { code: "59222", name: "Garment Construction", credit: 3 },
    { code: "59231", name: "Pattern Grading", credit: 4 },
    { code: "59232", name: "Fashion Design", credit: 3 },
    { code: "59241", name: "Apparel Production", credit: 4 },
    { code: "59251", name: "Quality Assurance", credit: 3 },
    { code: "59261", name: "Project Work", credit: 4 },
    { code: "59262", name: "In-plant Training", credit: 2 },
  ],
  MET: [
    { code: "61271", name: "Mechatronics Fundamentals", credit: 3 },
    { code: "61272", name: "Pneumatics & Hydraulics", credit: 4 },
    { code: "61273", name: "Mathematics I", credit: 4 },
    { code: "61274", name: "PLC Programming", credit: 4 },
    { code: "61275", name: "Sensors & Actuators", credit: 3 },
    { code: "61276", name: "Industrial Robotics", credit: 4 },
    { code: "61277", name: "SCADA Systems", credit: 3 },
    { code: "61278", name: "Project Work", credit: 4 },
  ],
};

// Names
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

// ---------------- Students (stable identities) ----------------
// Each student belongs to a batch (admission year) and an institute+department.
// Regulation 2022 batches start board exams from semester 1.
// Older batches (admission 2019) started board exams from semester 4.
type Student = {
  roll: string;
  registrationNo: string;
  name: string;
  instituteCode: string;
  instituteName: string;
  departmentCode: string;
  departmentName: string;
  curriculum: string;
  regulation: number;
  admissionYear: number; // batch start year
  batchLabel: string; // e.g. "19-20"
  boardExamStartSemester: number; // 1 (new) or 4 (old)
};

const students: Student[] = [];
const BATCHES = [
  { admissionYear: 2019, batchLabel: "19-20", boardStart: 4 },
  { admissionYear: 2020, batchLabel: "20-21", boardStart: 4 },
  { admissionYear: 2021, batchLabel: "21-22", boardStart: 1 },
  { admissionYear: 2022, batchLabel: "22-23", boardStart: 1 },
  { admissionYear: 2023, batchLabel: "23-24", boardStart: 1 },
];

// To keep the bundled JSON manageable, we only fully model a small subset of
// institutes × departments × batches. Each student gets a globally-unique
// 6-digit roll (mirrors the user's real roll like 449381).
const FEATURED_INSTITUTES = institutes.slice(0, 3); // 3 institutes (keep dev memory low)
const FEATURED_DEPARTMENTS = departments.slice(0, 3); // 3 depts
let rollCounter = 440000; // start near the user's roll range
for (const inst of FEATURED_INSTITUTES) {
  for (const dept of FEATURED_DEPARTMENTS) {
    for (const batch of BATCHES) {
      const curriculum =
        dept.code === "FT"
          ? pick(["Diploma in Agriculture", "Diploma in Fisheries"])
          : batch.admissionYear % 3 === 0
            ? "Diploma in Textile Engineering"
            : "Diploma in Engineering";
      const studentsInCell = randInt(4, 8);
      for (let s = 0; s < studentsInCell; s++) {
        rollCounter += 1;
        const roll = String(rollCounter).padStart(6, "0");
        const registrationNo = `${batch.admissionYear}${inst.code}${1000 + rollCounter}`;
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        students.push({
          roll,
          registrationNo,
          name,
          instituteCode: inst.code,
          instituteName: inst.name,
          departmentCode: dept.code,
          departmentName: dept.name,
          curriculum,
          regulation: 2022,
          admissionYear: batch.admissionYear,
          batchLabel: batch.batchLabel,
          boardExamStartSemester: batch.boardStart,
        });
      }
    }
  }
}

// ---------------- Publications (one per semester per batch) ----------------
// A publication = BTEB publishing a semester result batch. Each publication has:
//   - publish date, curriculum, semester, examYear
//   - one or more "files" (PDFs scraped from BTEB)
type Publication = {
  id: string;
  title: string;
  examType: string; // always "Diploma" here
  curriculum: string;
  semester: number;
  examYear: number;
  publicationDate: string;
  batchLabel: string;
  totalStudents: number;
  passRate: number;
  files: Array<{ fileId: string; fileName: string; students: number; passed: number; failed: number }>;
  rollStart: number;
  rollEnd: number;
};

const publications: Publication[] = [];
type SubjectResult = { code: string; name: string; credit: number; marks: number; letter: string; point: number; referred?: boolean };
type SemesterResult = {
  roll: string;
  registrationNo: string;
  name: string;
  instituteCode: string;
  instituteName: string;
  departmentCode: string;
  departmentName: string;
  examType: string;
  curriculum: string;
  regulation: number;
  batchLabel: string;
  admissionYear: number;
  semester: number;
  examYear: number;
  publicationId: string;
  publicationDate: string;
  subjects: SubjectResult[];
  gpa: number;
  letterGrade: string;
  result: "PASSED" | "FAILED" | "REFERRED";
  referredSubjects: string[];
};

const allSemesterResults: SemesterResult[] = [];

// Generate a semester result for a student
function genSemesterResult(student: Student, semester: number, publication: Publication): SemesterResult {
  const subjects = subjectBank[student.departmentCode] || subjectBank.CST;
  const nSub = randInt(5, Math.min(7, subjects.length));
  const startIdx = randInt(0, Math.max(0, subjects.length - nSub));
  const chosen = subjects.slice(startIdx, startIdx + nSub);

  let failedAny = false;
  const referredSubjects: string[] = [];
  let weightedPoint = 0;
  let totalCredit = 0;
  const subResults: SubjectResult[] = chosen.map((s) => {
    const r = rand();
    let marks: number;
    if (r < 0.05) marks = randInt(0, 32);
    else if (r < 0.14) marks = randInt(33, 49);
    else if (r < 0.34) marks = randInt(50, 59);
    else if (r < 0.58) marks = randInt(60, 69);
    else if (r < 0.82) marks = randInt(70, 79);
    else marks = randInt(80, 95);
    const g = gradeFromMarks(marks);
    const referred = g.letter === "F";
    if (referred) {
      failedAny = true;
      referredSubjects.push(`${s.code} - ${s.name}`);
    }
    weightedPoint += g.point * s.credit;
    totalCredit += s.credit;
    return { ...s, marks, letter: g.letter, point: g.point, referred };
  });

  const gpa = failedAny ? 0 : Math.round((weightedPoint / totalCredit) * 100) / 100;
  const letterGrade = failedAny
    ? "F"
    : gpa >= 4
      ? "A+"
      : gpa >= 3.5
        ? "A"
        : gpa >= 3
          ? "A-"
          : gpa >= 2.5
            ? "B"
            : gpa >= 2
              ? "C"
              : "D";
  const result: SemesterResult["result"] = failedAny ? "REFERRED" : "PASSED";

  return {
    roll: student.roll,
    registrationNo: student.registrationNo,
    name: student.name,
    instituteCode: student.instituteCode,
    instituteName: student.instituteName,
    departmentCode: student.departmentCode,
    departmentName: student.departmentName,
    examType: "Diploma",
    curriculum: student.curriculum,
    regulation: student.regulation,
    batchLabel: student.batchLabel,
    admissionYear: student.admissionYear,
    semester,
    examYear: publication.examYear,
    publicationId: publication.id,
    publicationDate: publication.publicationDate,
    subjects: subResults,
    gpa,
    letterGrade,
    result,
    referredSubjects,
  };
}

// For each batch, generate publications for semesters from boardExamStartSemester to 8
for (const batch of BATCHES) {
  // Students of this batch
  const batchStudents = students.filter((s) => s.batchLabel === batch.batchLabel);
  if (batchStudents.length === 0) continue;

  const startSem = batch.boardStart; // 1 or 4
  for (let sem = startSem; sem <= 8; sem++) {
    // publication date: roughly 6 months after semester start
    // semester N starts ~ admissionYear + floor((N-1)/2) years, exam mid-semester
    const examYear = batch.admissionYear + Math.floor((sem - 1) / 2) + (sem % 2 === 0 ? 1 : 0);
    const pubMonth = ((sem * 3) % 12) + 1;
    const pubDay = randInt(5, 25);
    const pubDate = `${examYear}-${String(pubMonth).padStart(2, "0")}-${String(pubDay).padStart(2, "0")}`;

    // group batch students by curriculum for separate publications
    const curriculaInBatch = [...new Set(batchStudents.map((s) => s.curriculum))];
    for (const curr of curriculaInBatch) {
      const currStudents = batchStudents.filter((s) => s.curriculum === curr);
      if (currStudents.length === 0) continue;
      const pubId = `pub-${batch.batchLabel}-${curr.replace(/[^a-z]/gi, "").slice(0, 4)}-${sem}`;
      const files = [
        {
          fileId: `${pubId}-f1`,
          fileName: `${curr} ${sem}th Semester ${examYear} - File 1.pdf`,
          students: currStudents.length,
          passed: 0,
          failed: 0,
        },
      ];
      const pub: Publication = {
        id: pubId,
        title: `${ordinal(sem)} Semester ${curr} Result ${examYear} (Batch ${batch.batchLabel})`,
        examType: "Diploma",
        curriculum: curr,
        semester: sem,
        examYear,
        publicationDate: pubDate,
        batchLabel: batch.batchLabel,
        totalStudents: 0,
        passRate: 0,
        files,
        rollStart: 0,
        rollEnd: 0,
      };

      // Generate semester result for each student of this batch+curriculum
      const rolls: number[] = [];
      let passed = 0;
      for (const st of currStudents) {
        const sr = genSemesterResult(st, sem, pub);
        allSemesterResults.push(sr);
        rolls.push(parseInt(st.roll, 10));
        if (sr.result === "PASSED") passed += 1;
      }
      pub.totalStudents = currStudents.length;
      pub.passRate = Math.round((passed / currStudents.length) * 1000) / 10;
      pub.files[0].passed = passed;
      pub.files[0].failed = currStudents.length - passed;
      if (rolls.length > 0) {
        pub.rollStart = Math.min(...rolls);
        pub.rollEnd = Math.max(...rolls);
      }
      publications.push(pub);
    }
  }
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
  const subs = subjectBank[dept.code] || subjectBank.CST;
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
  const subs = subjectBank[dept.code] || subjectBank.CST;
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
    regulation: 2022,
    totalBooks: books.length,
    books,
  };
});

// ---------------- Write files ----------------
writeFileSync(join(OUT, "departments.json"), JSON.stringify(departments, null, 2));
writeFileSync(join(OUT, "institutes.json"), JSON.stringify(institutes, null, 2));
writeFileSync(join(OUT, "students.json"), JSON.stringify(students, null, 2));
writeFileSync(join(OUT, "publications.json"), JSON.stringify(publications, null, 2));
writeFileSync(join(OUT, "results.json"), JSON.stringify(allSemesterResults, null, 2));
writeFileSync(join(OUT, "routines.json"), JSON.stringify(routines, null, 2));
writeFileSync(join(OUT, "booklists.json"), JSON.stringify(booklists, null, 2));

const totalResults = allSemesterResults.length;
const totalPassed = allSemesterResults.filter((r) => r.result === "PASSED").length;
const stats = {
  totalStudentsServed: 2300000,
  totalResults: totalResults,
  totalStudents: students.length,
  totalInstitutes: institutes.length,
  totalDepartments: departments.length,
  totalPublications: publications.length,
  totalRoutines: routines.length,
  overallPassRate: Math.round((totalPassed / totalResults) * 1000) / 10,
  yearsOfService: 5,
  uptime: 99.9,
  curriculaCount: curricula.length,
};
writeFileSync(join(OUT, "stats.json"), JSON.stringify(stats, null, 2));

console.log("Generated v2:");
console.log("  departments:", departments.length);
console.log("  institutes:", institutes.length);
console.log("  students:", students.length);
console.log("  publications:", publications.length);
console.log("  semester results:", allSemesterResults.length);
console.log("  routines:", routines.length);
console.log("  booklists:", booklists.length);
console.log("  overall pass rate:", stats.overallPassRate + "%");
// sanity: how many semester results per student on average
const perStudent = new Map<string, number>();
for (const r of allSemesterResults) perStudent.set(r.roll, (perStudent.get(r.roll) || 0) + 1);
const avg = (Array.from(perStudent.values()).reduce((a, b) => a + b, 0)) / perStudent.size;
console.log("  avg semester results per student:", avg.toFixed(2));
