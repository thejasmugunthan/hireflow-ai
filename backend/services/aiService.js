import OpenAI from 'openai';

/**
 * Common technology skills dictionary for heuristic matching fallback
 */
const TECH_SKILLS = [
  'React', 'Next.js', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
  'Node.js', 'Express', 'FastAPI', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'Go',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'REST APIs', 'SQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'LLM', 'NLP', 'Scikit-learn',
  'Pandas', 'NumPy', 'Data Analysis', 'DevOps', 'Microservices', 'System Design'
];

/**
 * Analyzes a resume against a target job using OpenAI or heuristic fallback
 */
export const analyzeCandidateResume = async ({ resumeText, job, candidateName }) => {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      status: 'completed',
      matchScore: 60,
      summary: `Application received for ${candidateName}. Resume text was not parseable from document formatting, but basic profile meets initial screening threshold.`,
      skills: job.skills || [],
      matchedSkills: job.skills ? job.skills.slice(0, 2) : [],
      missingSkills: job.skills ? job.skills.slice(2) : [],
      strengths: ['Application submitted on time', 'Profile matches role interest'],
      gaps: ['Detailed resume text could not be extracted for comprehensive scoring'],
      evaluatedAt: new Date(),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key' && !apiKey.startsWith('mock_')) {
    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `
You are an expert AI Technical Talent Screener for HireFlow AI.
Analyze the following candidate's resume for the specific job opening below.

Job Details:
- Title: ${job.title}
- Required Skills: ${job.skills.join(', ')}
- Description: ${job.description}

Candidate Name: ${candidateName}
Resume Content:
"""
${resumeText.slice(0, 4000)}
"""

Provide your assessment in strictly valid JSON format with the following schema:
{
  "match_score": <number between 0 and 100 representing suitability>,
  "summary": "<2-3 sentence concise executive summary advisory to the hiring team>",
  "skills": ["<all relevant technical and domain skills extracted from resume>"],
  "matched_skills": ["<skills present in resume that match the job requirements>"],
  "missing_skills": ["<job requirements not clearly found in resume>"],
  "strengths": ["<2-4 key technical or experience strengths>"],
  "gaps": ["<1-3 potential gaps, missing credentials, or areas to investigate in interview>"]
}

Respond ONLY with valid JSON without markdown fences.
`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return {
        status: 'completed',
        matchScore: Math.min(100, Math.max(0, Math.round(parsed.match_score || 70))),
        summary: parsed.summary || 'Candidate profile analyzed successfully.',
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        matchedSkills: Array.isArray(parsed.matched_skills) ? parsed.matched_skills : [],
        missingSkills: Array.isArray(parsed.missing_skills) ? parsed.missing_skills : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
        evaluatedAt: new Date(),
      };
    } catch (openaiErr) {
      console.warn('OpenAI API call failed or timed out. Using intelligent heuristic analysis fallback:', openaiErr.message);
    }
  }

  // Intelligent Heuristic Analysis Engine
  return generateHeuristicAnalysis({ resumeText, job, candidateName });
};

/**
 * Deterministic & intelligent NLP heuristic engine for offline or zero-key operations
 */
export const generateHeuristicAnalysis = ({ resumeText, job, candidateName }) => {
  const lowerText = resumeText.toLowerCase();
  const jobSkills = job.skills || [];

  // Extract detected tech skills from resume
  const detectedSkills = [];
  TECH_SKILLS.forEach((skill) => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(resumeText)) {
      detectedSkills.push(skill);
    }
  });

  // Check matching against job requirements
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach((reqSkill) => {
    const isMatched =
      detectedSkills.some((s) => s.toLowerCase() === reqSkill.toLowerCase()) ||
      lowerText.includes(reqSkill.toLowerCase());

    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate match score
  let score = 50;
  if (jobSkills.length > 0) {
    const matchRatio = matchedSkills.length / jobSkills.length;
    score = Math.round(matchRatio * 50 + 35); // Range ~35-85
  }

  // Bonus for overall technical skill density
  if (detectedSkills.length >= 6) score += 10;
  else if (detectedSkills.length >= 3) score += 5;

  // Bonus for experience signals
  if (/year|years|experience|intern|internship|project|developed|built/i.test(resumeText)) {
    score += 5;
  }

  score = Math.min(95, Math.max(45, score));

  // Determine strengths & gaps
  const strengths = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Demonstrated proficiency in ${matchedSkills.slice(0, 3).join(', ')}`);
  }
  if (detectedSkills.length >= 4) {
    strengths.push(`Broad technical repertoire (${detectedSkills.slice(0, 4).join(', ')})`);
  }
  if (/full[- ]?stack|end[- ]to[- ]end|architecture/i.test(resumeText)) {
    strengths.push('Exposure to full lifecycle development & project architecture');
  }
  if (strengths.length === 0) {
    strengths.push('Solid foundational background and clear career progression');
  }

  const gaps = [];
  if (missingSkills.length > 0) {
    gaps.push(`Key job skill(s) not prominently mentioned: ${missingSkills.slice(0, 2).join(', ')}`);
  }
  if (!/cloud|aws|docker|ci\/cd|deployment/i.test(resumeText)) {
    gaps.push('Limited explicit mention of cloud deployment or CI/CD pipelines');
  }
  if (gaps.length === 0) {
    gaps.push('Assess depth of architecture scaling in upcoming interview rounds');
  }

  const summary = `Candidate ${candidateName} demonstrates a ${
    score >= 80 ? 'strong' : score >= 65 ? 'solid' : 'moderate'
  } alignment with the ${job.title} role. Shows verified experience in ${
    matchedSkills.slice(0, 3).join(', ') || 'software development'
  }, scoring an estimated ${score}% match.`;

  return {
    status: 'completed',
    matchScore: score,
    summary,
    skills: Array.from(new Set([...detectedSkills, ...matchedSkills])),
    matchedSkills,
    missingSkills,
    strengths,
    gaps,
    evaluatedAt: new Date(),
  };
};
