export const skillCategories = [
  { id: 'frontend', name: 'Frontend Development', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST APIs'] },
  { id: 'data', name: 'Data & Analytics', skills: ['SQL', 'Excel', 'Power BI', 'Python'] },
  { id: 'marketing', name: 'Marketing', skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'] },
]

export const userSkills = [
  { name: 'JavaScript', level: 'Advanced', score: 90 },
  { name: 'Python', level: 'Intermediate', score: 68 },
  { name: 'HTML', level: 'Advanced', score: 95 },
  { name: 'CSS', level: 'Advanced', score: 90 },
  { name: 'React', level: 'Intermediate', score: 45 },
  { name: 'SQL', level: 'Beginner', score: 25 },
  { name: 'Git', level: 'Intermediate', score: 52 },
]

export const skillGapData = {
  targetCareer: 'Frontend Developer',
  currentSkills: ['JavaScript', 'HTML', 'CSS'],
  requiredSkills: ['React', 'SQL', 'Git', 'REST APIs'],
  missingSkills: ['React', 'SQL', 'Git', 'REST APIs'],
  skillStrength: [
    { skill: 'JavaScript', value: 90 },
    { skill: 'HTML', value: 95 },
    { skill: 'CSS', value: 90 },
    { skill: 'React', value: 45 },
    { skill: 'SQL', value: 25 },
  ],
  recommendedLearning: ['Learn React fundamentals', 'Build APIs integration project', 'Practice SQL joins', 'Use Git workflows'],
}
