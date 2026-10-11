/*
 * ─────────────────────────────────────────────────────────────
 *  THE ONE FILE YOU EDIT.
 *  Everything on the site is read from here. The server mirrors
 *  `projects` and `experience` into MongoDB on boot, and the
 *  client bundles this file as an instant fallback.
 *
 *  Lines marked  TODO  are placeholders waiting for your details.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: 'Aarya',
  lastName: 'Patil',
  role: 'Full-Stack Developer',
  location: 'Pune, India',
  timezone: 'Asia/Kolkata',
  tzLabel: 'IST',

  status: {
    open: true,
    seeking: 'Internships & Full-Time SDE/PM roles', // TODO: adjust
  },

  // One or two sentences. Shown under your name on the cover.
  intro:
    'Third-Year Computer Engineering Student at Pune Institute Of Computer Technology, Pune. I build full-stack products using MERN stack and care about the small details that make software feel considered.', // TODO

  email: 'aaryapatil5445@gmail.com',

  links: {
    github: 'https://github.com/PatilAarya',
    linkedin: 'https://www.linkedin.com/in/aarya-patil-735472315/',
    resume: 'https://drive.google.com/file/d/1Y9h5sgT1pL1Hvogus4_CfSeeq-ffvTrF/view?usp=sharing', // put the PDF at client/public/resume.pdf
  },

  // The "30-second version" (telegram). Keep each line short.
  telegram: [
    'Upcoming Summer 2027 Intern at Mastercard',
    'Computer Engineering at PICT, Pune, graduating 2028',
    'Interned at Shivani Scientific Industries as a QA & Automation Engineer',
    'Full-Stack Developer, MERN Stack',
    'Shipped one live product, more on the way',
    'Open to Internships and Full-Time Roles',
  ],

  // Toolkit. tier: 'daily' | 'comfortable' | 'learning'
  skills: [
    { name: 'React', tier: 'daily', note: 'My go-to for interfaces. This site is built with it.' },
    { name: 'Node.js', tier: 'daily', note: 'APIs, scripts, and the server behind this page.' },
    { name: 'Express', tier: 'comfortable', note: 'Routing, middleware, and small, fast REST APIs.' },
    { name: 'MongoDB', tier: 'comfortable', note: 'Schemas with Mongoose. This guestbook is stored in it.' },
    { name: 'HTML & CSS', tier: 'daily', note: 'Hand-written. No UI kit was used for this page.' },
    { name: 'Git', tier: 'comfortable', note: 'Branches, rebases, and readable commit history.' },
    { name: 'Java', tier: 'comfortable', note: 'Data structures and algorithms practice.' },
    { name: 'SQL', tier: 'comfortable', note: 'Joins, indexes, and coursework at PICT.' },
    { name: 'Docker', tier: 'learning', note: 'Learning to containerize my projects.' },
    { name: 'Agentic AI', tier: 'learning', note: 'Exploring how LLM agents plan, use tools, and get things done.' },
    { name: 'RAG', tier: 'learning', note: 'Learning retrieval-augmented generation to ground LLMs in real data.' },
  ],

  // "Currently" column. Update it now and then; the date shows on the site.
  now: {
    updated: '2026-10-12',
    building: 'Avsar, a campus placement platform, and this portfolio.',
    learning: 'Docker, Agentic AI and RAG, plus System Design fundamentals',
    reading: "The Product Manager's Playbook by Stefan Richter",
  },
};

export const projects = [
  {
    slug: 'sahayog',
    title: 'Sahayog',
    year: '2026', // TODO: confirm year
    role: 'Team project · Team Lead module, frontend & backend',
    status: 'Live',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Flask'],
    summary: 'NGO field workforce management with face-recognition attendance and GPS geo-fencing.',
    description:
      'NGOs often run field work on paper registers, which invites proxy attendance and lost data. Sahayog gives administrators, team leads and field workers their own dashboards for tasks, attendance, leave and field reports. Built with my team, where I built the Team Lead module end to end.',
    highlights: [
      'Biometric check-in: a Flask microservice verifies a live webcam capture against the worker’s registered face, so proxy attendance gets caught',
      'GPS geo-fencing flags check-ins made outside the task site for the team lead to review',
      'Smart task creation with conflict-aware scheduling and fatigue warnings for workers over 35 hrs/week',
      'Three role-based portals (Admin, Team Lead, Field Worker) on JWT-secured REST APIs, with Cloudinary for photo evidence',
    ],
    live: 'https://she-solves3-0-sahayog.vercel.app/',
    repo: 'https://github.com/PatilAarya/Sahayog_Advanced',
    image: '/sahayog.png', // file lives in client/public/sahayog.png
  },
];

export const experience = [
  {
    slug: 'pict',
    kind: 'Education',
    org: 'Pune Institute of Computer Technology',
    role: 'B.Tech in Computer Engineering · CGPA 9.55',
    start: '2025',
    end: '2028',
    location: 'Pune',
    summary: 'Hackathons, Research and Teaching alongside coursework in DBMS, OOP, DSA and Software Engineering.',
    points: [
      'One of 168 teams in Round 3 of The Ken’s Case Competition 2026, out of 6,183 teams from 263 campuses',
      'Top 5 finalist among 371 teams at the Code The Cause 2025–26 hackathon',
      'Volunteer instructor at PICT Model School, 25+ hours of teaching',
    ],
    stack: ['DBMS', 'OOP', 'DSA', 'Software Engineering'],
  },
  {
    slug: 'shivani-scientific',
    kind: 'Internship',
    org: 'Shivani Scientific Industries Pvt. Ltd.',
    role: 'QA & Automation Engineer Intern · 6 months',
    start: 'Jan 2025',
    end: 'Jun 2025',
    location: 'Mumbai',
    summary: 'Worked in the Technical Department on Manual Testing, Test Automation and Data Analysis for IoT monitoring products.',
    points: [
      'Validated web and mobile app features across 350+ functional, UI and regression test scenarios, finding 150+ defects and verifying fixes with developers',
      'Automated end-to-end regression for 3 core user flows (login, signup, dashboard) using Cypress, cutting manual regression effort',
      'Analysed 6–8 months of production IoT data from a cloned HeidiSQL database, using Pandas, Matplotlib and Seaborn in Jupyter to spot recurring patterns and false alarms',
    ],
    stack: ['Cypress', 'Pandas', 'Jupyter', 'HeidiSQL'],
  },
  {
    slug: 'gpm',
    kind: 'Education',
    org: 'Government Polytechnic, Mumbai',
    role: 'Diploma in Computer Engineering · 96.08%',
    start: '2022',
    end: '2025',
    location: 'Mumbai',
    summary: 'Three-year Diploma before moving to PICT for the B.Tech.',
    points: [
      'Published a research paper on quantum computing in IJIRT, Vol. 10, Issue 10',
      'Winner of 3 state-level competitions: quizzes (INSTRUSTINE 2025, PRAVINYA 2024) and a paper presentation (TANTRA UTSAV 2024)',
    ],
    stack: ['Technical Paper Presentation', 'Quantum Computing', 'Research Skills'],
  },
    {
    slug: 'dalmia',
    kind: 'Education',
    org: 'N. L. Dalmia High School',
    role: 'ICSE (Class X) · 95.80%',
    start: '2018',
    end: '2022',
    location: 'Thane',
    summary: 'Schooling done with a love for sports and Shakespearean literature.',
    points: [
      'Represented the school at the Regional level of the Council’s National Sports & Games 2019 (100m, 200m, Long Jump, 4 x 100m Relay, Girls U/14)',
      'Won Gold Medals and Certificates in 100m, 200m, Long Jump',
    ],
    stack: ['Public Speaking', 'Athletics'],
  },
];

export default { profile, projects, experience };