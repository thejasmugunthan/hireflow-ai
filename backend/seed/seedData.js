import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Admin from '../models/Admin.js';
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import Application from '../models/Application.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hireflow_ai';
    await mongoose.connect(mongoURI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await Admin.deleteMany({});
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Application.deleteMany({});
    console.log('🧹 Cleared existing data.');

    // 1. Seed Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const admin = await Admin.create({
      email: 'admin@enter.in',
      passwordHash,
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email} (password: admin123)`);

    // 2. Seed 10 Realistic Jobs
    const jobsData = [
      {
        title: 'React Developer',
        description:
          'Design and build high-performance, accessible, and responsive user interfaces using React, TypeScript, and Tailwind CSS. Collaborate with backend engineers to integrate RESTful APIs and ensure seamless UX.',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'Redux', 'REST APIs'],
        location: 'Bangalore / Hybrid',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'Node.js Backend Developer',
        description:
          'Develop scalable microservices, backend REST APIs, and database schemas with Node.js, Express, MongoDB, and Redis. Ensure robust authentication, rate limiting, and performance optimization.',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
        location: 'Bangalore',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'Full Stack Developer',
        description:
          'Take full ownership of web product features end-to-end using React, Node.js, Express, and PostgreSQL/MongoDB. Work across responsive frontends, backend architecture, and cloud deployment pipelines.',
        skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express', 'TypeScript', 'AWS'],
        location: 'Bangalore / Remote',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'Python Developer',
        description:
          'Build data processing pipelines, backend services, and automated scraping workflows using Python, FastAPI, and SQLAlchemy. Optimize database queries and API response times.',
        skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'Celery', 'Redis'],
        location: 'Hyderabad / Hybrid',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'AI/ML Intern',
        description:
          'Work on LLM prompt engineering, RAG pipelines, model fine-tuning, and embedding search using Python, PyTorch, OpenAI APIs, and LangChain. Build smart prototypes for automated document intelligence.',
        skills: ['Python', 'Machine Learning', 'LLM', 'PyTorch', 'OpenAI', 'LangChain', 'FastAPI'],
        location: 'Bangalore',
        employmentType: 'Internship',
        status: 'Active',
      },
      {
        title: 'Frontend Developer',
        description:
          'Craft pixel-perfect, responsive web interfaces with modern JavaScript/React, CSS animations, and cross-browser compatibility. Optimize web vitals and client-side rendering speed.',
        skills: ['JavaScript', 'React', 'CSS3', 'HTML5', 'Tailwind CSS', 'Vite', 'Git'],
        location: 'Remote',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'Backend Developer',
        description:
          'Design resilient backend architectures, handle high-concurrency API traffic, and manage database migrations using Node.js and SQL/NoSQL databases.',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker', 'CI/CD'],
        location: 'Pune / Hybrid',
        employmentType: 'Full-time',
        status: 'Active',
      },
      {
        title: 'Software Engineer Intern',
        description:
          'Join a fast-paced engineering team to build customer-facing features, write automated unit tests, and learn industry best practices in full-stack web engineering.',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'Data Structures'],
        location: 'Bangalore',
        employmentType: 'Internship',
        status: 'Active',
      },
      {
        title: 'Data Analyst Intern',
        description:
          'Analyze candidate and user behavior metrics, write complex SQL queries, and build visual dashboards using Tableau, PowerBI, and Python Pandas.',
        skills: ['SQL', 'Python', 'Pandas', 'Data Analysis', 'Tableau', 'Excel'],
        location: 'Mumbai / Remote',
        employmentType: 'Internship',
        status: 'Active',
      },
      {
        title: 'DevOps Intern',
        description:
          'Assist in maintaining cloud infrastructure on AWS, setting up GitHub Actions CI/CD pipelines, containerizing services with Docker, and monitoring application health.',
        skills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Git', 'Kubernetes', 'Bash'],
        location: 'Bangalore',
        employmentType: 'Internship',
        status: 'Active',
      },
    ];

    const seededJobs = await Job.insertMany(jobsData);
    console.log(`💼 Seeded ${seededJobs.length} jobs.`);

    // 3. Seed Realistic Candidates and Applications
    const candidatesData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Rahul Sharma - Full Stack Developer. Experienced with React, Node.js, Express, MongoDB, REST APIs, and Tailwind CSS. Built multiple SaaS applications with authentication, responsive dashboards, and PostgreSQL databases.',
        jobIndex: 0, // React Developer
        stage: 'R2',
        note: 'I have 3 years of hands-on experience building modern React dashboards and Node.js REST APIs.',
        matchScore: 84,
        summary:
          'Candidate has strong full-stack proficiency with React, Node.js, and MongoDB, showing high alignment for the frontend/fullstack requirements.',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST APIs'],
        matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
        missingSkills: ['Redux'],
        strengths: ['Strong component architecture design', 'Hands-on full-stack experience with REST APIs'],
        gaps: ['Limited explicit mentions of large-scale state management like Redux/Zustand'],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 4 * 86400000), reason: 'Application submitted' },
          { from: 'Applied', to: 'R1', changedAt: new Date(Date.now() - 3 * 86400000), reason: 'Passed initial screening' },
          { from: 'R1', to: 'R2', changedAt: new Date(Date.now() - 1 * 86400000), reason: 'Strong performance in R1 technical test' },
        ],
        interviewNotes: [
          { stage: 'R1', rating: 4, notes: 'Very clear explanation of React rendering cycles, custom hooks, and API integration.', createdAt: new Date(Date.now() - 2 * 86400000) },
        ],
      },
      {
        name: 'Ananya Rao',
        email: 'ananya.rao@example.com',
        phone: '+91 91234 56789',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Ananya Rao - AI/ML Enthusiast and final year student. Proficient in Python, PyTorch, Scikit-learn, OpenAI API, LangChain, and FastAPI. Built an automated PDF question answering pipeline with vector search embeddings.',
        jobIndex: 4, // AI/ML Intern
        stage: 'R1',
        note: 'Passionate about building practical LLM agents and prompt workflows. Excited about HireFlow!',
        matchScore: 92,
        summary:
          'Exceptional profile for the AI/ML Intern role. Strong foundation in PyTorch, LangChain, and OpenAI API integrations.',
        skills: ['Python', 'PyTorch', 'OpenAI', 'LangChain', 'FastAPI', 'Machine Learning', 'Docker'],
        matchedSkills: ['Python', 'Machine Learning', 'LLM', 'PyTorch', 'OpenAI', 'LangChain', 'FastAPI'],
        missingSkills: [],
        strengths: ['Hands-on project with vector embeddings and LangChain', 'Clean code practices in Python and FastAPI'],
        gaps: ['New graduate / intern without multi-year enterprise production experience'],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 2 * 86400000), reason: 'Application submitted' },
          { from: 'Applied', to: 'R1', changedAt: new Date(Date.now() - 1 * 86400000), reason: 'Resume shortlisted for technical round' },
        ],
        interviewNotes: [],
      },
      {
        name: 'Kiran Patel',
        email: 'kiran.patel@example.com',
        phone: '+91 99887 76655',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Kiran Patel - Backend Engineer. 4 years specializing in Node.js, Express, PostgreSQL, MongoDB, Redis caching, and Docker microservices. Designed high throughput payment gateway webhooks.',
        jobIndex: 1, // Node.js Backend Developer
        stage: 'Approved',
        note: 'Looking forward to driving backend scalability and database reliability.',
        matchScore: 95,
        summary:
          'Outstanding backend candidate with deep expertise in Node.js, distributed databases, Redis, and high-concurrency systems.',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST APIs', 'Microservices'],
        matchedSkills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
        missingSkills: [],
        strengths: ['Extensive distributed systems experience', 'Mastery of database optimization and caching'],
        gaps: [],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 10 * 86400000), reason: 'Application received' },
          { from: 'Applied', to: 'R1', changedAt: new Date(Date.now() - 8 * 86400000), reason: 'Shortlisted' },
          { from: 'R1', to: 'R2', changedAt: new Date(Date.now() - 5 * 86400000), reason: 'Aced coding test' },
          { from: 'R2', to: 'R3', changedAt: new Date(Date.now() - 2 * 86400000), reason: 'System design interview passed' },
          { from: 'R3', to: 'Approved', changedAt: new Date(Date.now() - 1 * 86400000), reason: 'Leadership round approved offer' },
        ],
        interviewNotes: [
          { stage: 'R1', rating: 5, notes: 'Superb understanding of Node event loop and DB indexing.', createdAt: new Date(Date.now() - 8 * 86400000) },
          { stage: 'R2', rating: 5, notes: 'Designed a bulletproof idempotency mechanism for payment webhooks.', createdAt: new Date(Date.now() - 5 * 86400000) },
          { stage: 'R3', rating: 5, notes: 'Great culture fit and engineering maturity. Recommended hire.', createdAt: new Date(Date.now() - 2 * 86400000) },
        ],
      },
      {
        name: 'Pooja Verma',
        email: 'pooja.verma@example.com',
        phone: '+91 97654 32109',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Pooja Verma - Frontend Developer. Experience with HTML5, CSS3, JavaScript, Vue.js, and basic React. Designed landing pages and marketing websites.',
        jobIndex: 2, // Full Stack Developer
        stage: 'R1 Reject',
        note: 'Interested in growing into full stack development.',
        matchScore: 58,
        summary:
          'Candidate has decent frontend foundational skills in HTML/CSS/Vue, but lacks the backend database and API architecture experience required for Full Stack.',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'Vue', 'React'],
        matchedSkills: ['React'],
        missingSkills: ['Node.js', 'MongoDB', 'PostgreSQL', 'Express', 'TypeScript', 'AWS'],
        strengths: ['Clean UI design instincts', 'Good basic JavaScript skills'],
        gaps: ['No demonstrated backend experience in Node.js, Express, or SQL/NoSQL databases'],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 6 * 86400000), reason: 'Applied' },
          { from: 'Applied', to: 'R1', changedAt: new Date(Date.now() - 4 * 86400000), reason: 'Invited to initial screening' },
          { from: 'R1', to: 'R1 Reject', changedAt: new Date(Date.now() - 2 * 86400000), reason: 'Lacks backend experience required for full stack role' },
        ],
        interviewNotes: [
          { stage: 'R1', rating: 2, notes: 'Struggled with backend queries and server architecture questions.', createdAt: new Date(Date.now() - 3 * 86400000) },
        ],
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 98111 22233',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Vikram Singh - Python Backend Developer. Experienced in Django, FastAPI, Celery, PostgreSQL, Redis, and Docker. Implemented automated batch jobs and REST endpoints.',
        jobIndex: 3, // Python Developer
        stage: 'Applied',
        note: 'Excited about the Python Developer opening.',
        matchScore: 88,
        summary:
          'Strong Python backend background with FastAPI and PostgreSQL. Great fit for the Python Developer opening.',
        skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'Celery', 'Redis', 'Git'],
        matchedSkills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Docker', 'Celery', 'Redis'],
        missingSkills: [],
        strengths: ['Direct experience with FastAPI, Celery, and async queues', 'Strong PostgreSQL schema design'],
        gaps: ['Limited public cloud architecture details'],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 1 * 86400000), reason: 'Application submitted' },
        ],
        interviewNotes: [],
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha.k@example.com',
        phone: '+91 98450 12345',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeRawText:
          'Sneha Kulkarni - DevOps Engineer Intern. Skills: Docker, AWS (EC2, S3, ECS), GitHub Actions, Linux, Kubernetes, Terraform. Set up CI/CD pipelines for 5 student projects.',
        jobIndex: 9, // DevOps Intern
        stage: 'R3',
        note: 'Passionate about infrastructure as code and automated deployments.',
        matchScore: 90,
        summary:
          'High match score for DevOps Intern. Shows strong hands-on CI/CD pipeline automation and containerization expertise.',
        skills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Git', 'Kubernetes', 'Terraform'],
        matchedSkills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Git', 'Kubernetes'],
        missingSkills: ['Bash'],
        strengths: ['Hands-on GitHub Actions workflow configuration', 'Solid container orchestration concepts'],
        gaps: ['Deep multi-region AWS networking setup is still developing'],
        stageHistory: [
          { from: null, to: 'Applied', changedAt: new Date(Date.now() - 5 * 86400000), reason: 'Application received' },
          { from: 'Applied', to: 'R1', changedAt: new Date(Date.now() - 4 * 86400000), reason: 'Screening passed' },
          { from: 'R1', to: 'R2', changedAt: new Date(Date.now() - 2 * 86400000), reason: 'Linux and Docker practical passed' },
          { from: 'R2', to: 'R3', changedAt: new Date(Date.now() - 1 * 86400000), reason: 'Advanced to final round' },
        ],
        interviewNotes: [
          { stage: 'R1', rating: 4, notes: 'Clear understanding of Dockerfiles and multi-stage builds.', createdAt: new Date(Date.now() - 4 * 86400000) },
          { stage: 'R2', rating: 5, notes: 'Built a working CI/CD pipeline on live demo flawlessly.', createdAt: new Date(Date.now() - 2 * 86400000) },
        ],
      },
    ];

    for (const cData of candidatesData) {
      const candidate = await Candidate.create({
        name: cData.name,
        email: cData.email,
        phone: cData.phone,
        resumeUrl: cData.resumeUrl,
        resumeRawText: cData.resumeRawText,
      });

      const targetJob = seededJobs[cData.jobIndex];

      await Application.create({
        candidateId: candidate._id,
        jobId: targetJob._id,
        note: cData.note,
        stage: cData.stage,
        stageHistory: cData.stageHistory,
        aiAnalysis: {
          status: 'completed',
          matchScore: cData.matchScore,
          summary: cData.summary,
          skills: cData.skills,
          matchedSkills: cData.matchedSkills,
          missingSkills: cData.missingSkills,
          strengths: cData.strengths,
          gaps: cData.gaps,
          evaluatedAt: new Date(),
        },
        interviewNotes: cData.interviewNotes,
      });
    }

    console.log(`👥 Seeded ${candidatesData.length} candidates and applications with AI insights & timelines.`);
    console.log('✅ Seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
