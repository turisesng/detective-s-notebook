export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  background: string;
  motive: string;
  alibi: string;
  relationship: string;
  isGuilty: boolean;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  collectedAt: string;
  location: string;
  category: 'physical' | 'digital' | 'testimonial' | 'forensic';
  relevantSuspect?: string;
}

export interface CaseData {
  id: string; // Added ID for selection
  title: string;
  caseNumber: string;
  date: string;
  location: string;
  summary: string;
  victim: {
    name: string;
    age: number;
    occupation: string;
    description: string;
  };
  suspects: Suspect[];
  evidence: Evidence[];
  solution: string;
  correctSuspect: string;
  correctEvidence: string[];
}

export const CASES: CaseData[] = [
  {
    id: "case-midnight-gallery",
    title: "The Midnight Gallery Murder",
    caseNumber: "MCU-2024-0847",
    date: "November 14, 2024",
    location: "Blackwood Art Gallery, NYC",
    summary: "Renowned art dealer Marcus Blackwood was found dead in his private gallery at 11:47 PM...",
    victim: {
      name: "Marcus Blackwood",
      age: 58,
      occupation: "Art Dealer",
      description: "A prominent figure known for sharp business acumen and controversial deals."
    },
    suspects: [
      {
        id: "s1",
        name: "Elena Vasquez",
        age: 34,
        occupation: "Art Restorer",
        background: "Former protégé of Marcus Blackwood.",
        motive: "Discovered Marcus was selling forgeries she restored.",
        alibi: "Working in the studio alone.",
        relationship: "Employee",
        isGuilty: true
      },
      // ... Add your other suspects (s2, s3) here
    ],
    evidence: [
      {
        id: "e1",
        title: "Broken Venetian Vase",
        description: "Shattered 18th-century vase found near the victim's desk.",
        detailedDescription: "Blood traces and hair fibers were found on the fragment...",
        collectedAt: "Nov 14, 2024 — 11:52 PM",
        location: "Venetian Room",
        category: "physical",
        relevantSuspect: "s1"
      },
      // ... Add your other evidence (e2 - e8) here
    ],
    correctSuspect: "s1",
    correctEvidence: ["e1", "e4", "e6"],
    solution: "Elena Vasquez murdered Marcus Blackwood. She used her security override code to disable the CCTV..."
  },
  {
    id: "case-glass-paradox",
    title: "The Glass Paradox",
    caseNumber: "MCU-2026-0224",
    date: "February 24, 2026",
    location: "Sterling Manor, Sussex",
    summary: "Lord Alistair Sterling was found dead in his study. His partner claims an intruder broke in through the window, but the evidence points elsewhere.",
    victim: {
      name: "Lord Alistair Sterling",
      age: 65,
      occupation: "CEO of Sterling Estates",
      description: "A man of rigid routine who had recently discovered a massive financial discrepancy."
    },
    suspects: [
      {
        id: "julian-vane",
        name: "Julian Vane",
        age: 42,
        occupation: "CFO / Business Partner",
        background: "A smooth talker with a hidden high-stakes gambling addiction.",
        motive: "Alistair discovered Julian embezzled $50M to cover his debts.",
        alibi: "Claims he was in the garden and saw the intruder jump from the balcony.",
        relationship: "Business Partner",
        isGuilty: true
      },
      {
        id: "isabella-sterling",
        name: "Lady Isabella Sterling",
        age: 58,
        occupation: "Estate Manager",
        background: "The stoic wife who handled all legal correspondences.",
        motive: "Wanted to save the family name from Alistair's business failures.",
        alibi: "Was in the library with the butler.",
        relationship: "Wife",
        isGuilty: false
      }
    ],
    evidence: [
      {
        id: "g1",
        title: "Outward Glass Shards",
        description: "Glass fragments found on the exterior balcony.",
        detailedDescription: "Every single piece of glass from the shattered window is outside on the balcony. None were found inside.",
        collectedAt: "Feb 24, 2026 — 11:45 PM",
        location: "External Balcony",
        category: "physical",
        relevantSuspect: "julian-vane"
      },
      {
        id: "g2",
        title: "Forensic Audit Letter",
        description: "Letter authorizing an investigation into the CFO.",
        detailedDescription: "A signed letter to J Steven and Partners dated Feb 24th, proving Alistair was about to expose Julian.",
        collectedAt: "Feb 25, 2026 — 9:00 AM",
        location: "Victim's Desk",
        category: "testimonial",
        relevantSuspect: "julian-vane"
      }
    ],
    correctSuspect: "julian-vane",
    correctEvidence: ["g1", "g2"],
    solution: "Julian Vane killed Alistair. To stage a break-in, he smashed the window, but did so from the inside, causing the glass to fall onto the balcony."
  }
];

export const caseData = CASES[0];

export const hints = [
  "Look carefully at the victim's last known location.",
  "Consider who had access to the crime scene.",
  "Pay attention to the timeline of events.",
  "Physical evidence can be more trustworthy than alibis.",
  "Motive, means, and opportunity are key.",
];