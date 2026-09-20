// Seed data — 12 realistic injustice reports across India
const SEED_REPORTS = [
  {
    id: "r1",
    title: "Police brutality against peaceful protesters in Delhi",
    description:
      "On 15 Sep 2026, over 200 students peacefully marching near Jantar Mantar were lathi-charged without warning. Several were hospitalised, including minors. No FIR has been registered despite 48 hours passing.",
    category: "police",
    severity: "critical",
    location: { lat: 28.6272, lng: 77.2182, name: "Jantar Mantar, New Delhi" },
    state: "Delhi",
    mediaUrl: null,
    author: "Riya Sharma",
    verified: true,
    upvotes: 342,
    shares: 1280,
    createdAt: "2026-09-15T10:30:00Z",
    tags: ["students", "protest", "lathicharge"],
  },
  {
    id: "r2",
    title: "Land grabbed from tribal community — forest ministry silent",
    description:
      "400 acres of tribal forest land in Bastar have been illegally transferred to a mining corporation. Affected Adivasi families have received eviction notices with no rehabilitation plan.",
    category: "rights",
    severity: "high",
    location: { lat: 19.1167, lng: 81.95, name: "Bastar, Chhattisgarh" },
    state: "Chhattisgarh",
    mediaUrl: null,
    author: "Prakash Netam",
    verified: true,
    upvotes: 218,
    shares: 760,
    createdAt: "2026-09-10T08:15:00Z",
    tags: ["adivasi", "land", "mining", "forest"],
  },
  {
    id: "r3",
    title: "Journalist arrested for reporting flood relief scam",
    description:
      "Independent journalist Arjun Mishra was detained under sedition charges after publishing a report on alleged diversion of ₹12 crore flood-relief funds in Muzaffarpur.",
    category: "media",
    severity: "critical",
    location: { lat: 26.1209, lng: 85.3647, name: "Muzaffarpur, Bihar" },
    state: "Bihar",
    mediaUrl: null,
    author: "Press Freedom Watch",
    verified: true,
    upvotes: 495,
    shares: 2150,
    createdAt: "2026-09-12T14:00:00Z",
    tags: ["press freedom", "sedition", "corruption"],
  },
  {
    id: "r4",
    title: "Industrial effluent dumped in Yamuna — residents poisoned",
    description:
      "A leather tannery in Kanpur has been illegally discharging chromium-laced effluent into a Yamuna tributary. Residents report skin diseases and at least 3 cattle deaths. CPCB notices ignored.",
    category: "environment",
    severity: "high",
    location: { lat: 26.4499, lng: 80.3319, name: "Jajmau, Kanpur" },
    state: "Uttar Pradesh",
    mediaUrl: null,
    author: "Green Yamuna Collective",
    verified: true,
    upvotes: 189,
    shares: 430,
    createdAt: "2026-09-08T07:45:00Z",
    tags: ["pollution", "yamuna", "tannery", "health"],
  },
  {
    id: "r5",
    title: "RTI activist shot dead — case buried in Maharashtra",
    description:
      "Santosh Patil, who had filed 14 RTIs exposing contractor fraud worth ₹38 crore, was found dead with gunshot wounds. Police initially ruled it suicide despite evidence of struggle.",
    category: "corruption",
    severity: "critical",
    location: { lat: 17.6862, lng: 75.9, name: "Solapur, Maharashtra" },
    state: "Maharashtra",
    mediaUrl: null,
    author: "RTI Foundation India",
    verified: true,
    upvotes: 721,
    shares: 3400,
    createdAt: "2026-09-05T09:00:00Z",
    tags: ["RTI", "murder", "cover-up", "corruption"],
  },
  {
    id: "r6",
    title: "Dalit family's house demolished without court order",
    description:
      "In broad daylight, a Dalit family of 6 in Rajkot had their home demolished by the municipal corporation, citing encroachment — despite holding a registered deed. No notice was served.",
    category: "rights",
    severity: "high",
    location: { lat: 22.3039, lng: 70.8022, name: "Rajkot, Gujarat" },
    state: "Gujarat",
    mediaUrl: null,
    author: "Dalit Adhikar Manch",
    verified: false,
    upvotes: 156,
    shares: 520,
    createdAt: "2026-09-18T11:20:00Z",
    tags: ["dalit", "demolition", "housing rights"],
  },
  {
    id: "r7",
    title: "Custodial torture at Bengaluru police station",
    description:
      "A 23-year-old auto driver was detained without charges and tortured for 3 days at a Bengaluru police station. Medical reports confirm burns and fractures. Victim's family refused to file FIR under coercion.",
    category: "police",
    severity: "critical",
    location: { lat: 12.9716, lng: 77.5946, name: "Bengaluru, Karnataka" },
    state: "Karnataka",
    mediaUrl: null,
    author: "PUCL Karnataka",
    verified: true,
    upvotes: 388,
    shares: 1760,
    createdAt: "2026-09-14T16:30:00Z",
    tags: ["custodial torture", "police", "human rights"],
  },
  {
    id: "r8",
    title: "Coal mine collapse — 11 workers trapped, rescue delayed by 18 hours",
    description:
      "An illegal coal mine in Meghalaya's East Jaintia Hills collapsed trapping 11 workers. NDRF teams arrived 18 hours later. Mine was operating despite a National Green Tribunal ban.",
    category: "environment",
    severity: "critical",
    location: { lat: 25.3689, lng: 92.1, name: "East Jaintia Hills, Meghalaya" },
    state: "Meghalaya",
    mediaUrl: null,
    author: "North East Watch",
    verified: true,
    upvotes: 267,
    shares: 890,
    createdAt: "2026-09-17T04:00:00Z",
    tags: ["coal mine", "illegal mining", "NGT", "workers"],
  },
  {
    id: "r9",
    title: "School girls harassed by teacher — principal shields abuser",
    description:
      "Multiple class 9 students in Jaipur reported repeated sexual harassment by a male teacher. The school principal suspended two whistleblower students instead. Parents' complaints to DEO dismissed.",
    category: "rights",
    severity: "high",
    location: { lat: 26.9124, lng: 75.7873, name: "Jaipur, Rajasthan" },
    state: "Rajasthan",
    mediaUrl: null,
    author: "Anonymous (Verified)",
    verified: true,
    upvotes: 532,
    shares: 2800,
    createdAt: "2026-09-11T13:00:00Z",
    tags: ["harassment", "school", "children", "cover-up"],
  },
  {
    id: "r10",
    title: "Sand mafia attacks villagers protesting illegal mining",
    description:
      "Over 30 villagers were attacked with iron rods by sand mafia goons in Madhya Pradesh's Chambal region when they blocked illegal riverbed mining. Police filed a case against the villagers instead.",
    category: "corruption",
    severity: "high",
    location: { lat: 26.2183, lng: 77.3918, name: "Chambal, Madhya Pradesh" },
    state: "Madhya Pradesh",
    mediaUrl: null,
    author: "Chambal Nagrik Manch",
    verified: true,
    upvotes: 293,
    shares: 1100,
    createdAt: "2026-09-13T18:00:00Z",
    tags: ["sand mafia", "mining", "police nexus"],
  },
  {
    id: "r11",
    title: "Hospital denies emergency treatment, patient dies",
    description:
      "A 32-year-old accident victim was denied emergency treatment at a private hospital in Hyderabad citing non-payment of advance deposit. The patient died en route to the government hospital 14 km away.",
    category: "rights",
    severity: "critical",
    location: { lat: 17.385, lng: 78.4867, name: "Hyderabad, Telangana" },
    state: "Telangana",
    mediaUrl: null,
    author: "HealthRights India",
    verified: true,
    upvotes: 445,
    shares: 1990,
    createdAt: "2026-09-16T22:15:00Z",
    tags: ["healthcare", "emergency", "denial", "private hospital"],
  },
  {
    id: "r12",
    title: "Dissent crackdown: 3 activists jailed under UAPA in Assam",
    description:
      "Three Assamese farmers' rights activists were arrested under UAPA provisions for organizing anti-dam protests. No bail granted in 6 months despite no charge sheet being filed.",
    category: "judicial",
    severity: "high",
    location: { lat: 26.1445, lng: 91.7362, name: "Guwahati, Assam" },
    state: "Assam",
    mediaUrl: null,
    author: "Assam Krishak Sangha",
    verified: true,
    upvotes: 198,
    shares: 670,
    createdAt: "2026-09-07T10:30:00Z",
    tags: ["UAPA", "detention", "farmers", "dam"],
  },
];

const STORAGE_KEY = "justicemap_reports";

function loadReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return SEED_REPORTS;
}

function saveReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (_) {}
}

// Simple reactive store
let _reports = loadReports();
let _listeners = [];

export const CATEGORIES = {
  police:      { label: "Police Brutality",   color: "#e63946", bg: "bg-red-500/20",    text: "text-red-400",    icon: "🚔" },
  corruption:  { label: "Corruption",         color: "#f97316", bg: "bg-orange-500/20", text: "text-orange-400", icon: "💰" },
  environment: { label: "Environment",        color: "#22c55e", bg: "bg-green-500/20",  text: "text-green-400",  icon: "🌿" },
  rights:      { label: "Rights Violation",   color: "#a855f7", bg: "bg-purple-500/20", text: "text-purple-400", icon: "✊" },
  media:       { label: "Media Suppression",  color: "#3b82f6", bg: "bg-blue-500/20",   text: "text-blue-400",   icon: "📰" },
  judicial:    { label: "Judicial Delay",     color: "#eab308", bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "⚖️" },
};

export const SEVERITY = {
  critical: { label: "Critical", color: "#e63946", ring: "ring-red-500" },
  high:     { label: "High",     color: "#f97316", ring: "ring-orange-500" },
  medium:   { label: "Medium",   color: "#eab308", ring: "ring-yellow-500" },
  low:      { label: "Low",      color: "#22c55e", ring: "ring-green-500" },
};

export const INDIA_STATES = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function getReports() { return [..._reports]; }

export function getReport(id) { return _reports.find((r) => r.id === id) || null; }

export function addReport(report) {
  _reports = [report, ..._reports];
  saveReports(_reports);
  _listeners.forEach((fn) => fn(_reports));
}

export function upvoteReport(id) {
  _reports = _reports.map((r) =>
    r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
  );
  saveReports(_reports);
  _listeners.forEach((fn) => fn(_reports));
}

export function subscribe(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter((l) => l !== fn); };
}

export function getStats() {
  const reports = getReports();
  return {
    total: reports.length,
    states: new Set(reports.map((r) => r.state)).size,
    verified: reports.filter((r) => r.verified).length,
    totalShares: reports.reduce((a, r) => a + r.shares, 0),
  };
}
