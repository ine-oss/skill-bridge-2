import { jobs as sampleJobs } from './jobs'
import { trainingCatalog as samplePrograms } from './training'

const keys = {
  jobs: 'skillbridge-posted-jobs',
  programs: 'skillbridge-created-programs',
  applications: 'skillbridge-job-applications',
  savedJobs: 'skillbridge-saved-jobs',
  enrollments: 'skillbridge-enrollments',
}

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getWorkspaceJobs() {
  return [...readList(keys.jobs), ...sampleJobs]
}

export function createWorkspaceJob(job) {
  const created = { ...job, id: `local-${Date.now()}`, posted: 'Just now', status: 'Active' }
  writeList(keys.jobs, [created, ...readList(keys.jobs)])
  return created
}

export function updateWorkspaceJob(id, changes) {
  const updated = readList(keys.jobs).map((job) => job.id === id ? { ...job, ...changes } : job)
  writeList(keys.jobs, updated)
}

export function getWorkspacePrograms() {
  return [...readList(keys.programs), ...samplePrograms]
}

export function createWorkspaceProgram(program) {
  const created = { ...program, id: `local-${Date.now()}`, progress: 0, certificate: true }
  writeList(keys.programs, [created, ...readList(keys.programs)])
  return created
}

export function getAppliedJobIds() {
  return readList(keys.applications)
}

export function applyToWorkspaceJob(job) {
  const applications = readList(keys.applications)
  if (applications.some((application) => application.id === job.id)) return false
  writeList(keys.applications, [{ id: job.id, jobTitle: job.title, company: job.company, status: 'Submitted', appliedDate: new Date().toISOString().slice(0, 10) }, ...applications])
  return true
}

export function getSavedJobIds() {
  return readList(keys.savedJobs)
}

export function toggleSavedWorkspaceJob(id) {
  const savedIds = readList(keys.savedJobs)
  const isSaved = savedIds.includes(id)
  writeList(keys.savedJobs, isSaved ? savedIds.filter((savedId) => savedId !== id) : [id, ...savedIds])
  return !isSaved
}

export function getWorkspaceEnrollments() {
  return readList(keys.enrollments)
}

export function enrollInWorkspaceProgram(program) {
  const enrollments = readList(keys.enrollments)
  if (enrollments.some((enrollment) => enrollment.id === program.id)) return false
  writeList(keys.enrollments, [{ id: program.id, title: program.title, provider: program.provider, enrolledAt: new Date().toISOString().slice(0, 10) }, ...enrollments])
  return true
}