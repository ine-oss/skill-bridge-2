import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import JobSeekerLayout from '../layouts/JobSeekerLayout'
import EmployerLayout from '../layouts/EmployerLayout'
import TrainingLayout from '../layouts/TrainingLayout'
import AdminLayout from '../layouts/AdminLayout'

import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import HowItWorksPage from '../pages/public/HowItWorksPage'
import FindJobsPage from '../pages/public/FindJobsPage'
import JobDetailsPage from '../pages/public/JobDetailsPage'
import CompaniesPage from '../pages/public/CompaniesPage'
import CompanyDetailsPage from '../pages/public/CompanyDetailsPage'
import TrainingPage from '../pages/public/TrainingPage'
import TrainingDetailsPage from '../pages/public/TrainingDetailsPage'
import SkillsPage from '../pages/public/SkillsPage'
import CareerResourcesPage from '../pages/public/CareerResourcesPage'
import ContactPage from '../pages/public/ContactPage'
import FAQPage from '../pages/public/FAQPage'
import PrivacyPage from '../pages/public/PrivacyPage'
import TermsPage from '../pages/public/TermsPage'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage'
import CreateJobSeekerAccountPage from '../pages/auth/CreateJobSeekerAccountPage'
import CreateEmployerAccountPage from '../pages/auth/CreateEmployerAccountPage'
import CreateTrainingAccountPage from '../pages/auth/CreateTrainingAccountPage'

import JobSeekerDashboardPage from '../pages/jobseeker/JobSeekerDashboardPage'
import JobSeekerProfilePage from '../pages/jobseeker/JobSeekerProfilePage'
import JobSeekerSkillsPage from '../pages/jobseeker/JobSeekerSkillsPage'
import JobSeekerSkillGapPage from '../pages/jobseeker/JobSeekerSkillGapPage'
import JobSeekerRoadmapPage from '../pages/jobseeker/JobSeekerRoadmapPage'
import JobSeekerPortfolioPage from '../pages/jobseeker/JobSeekerPortfolioPage'
import JobSeekerEvidencePage from '../pages/jobseeker/JobSeekerEvidencePage'
import JobSeekerJobsPage from '../pages/jobseeker/JobSeekerJobsPage'
import JobSeekerMatchedJobsPage from '../pages/jobseeker/JobSeekerMatchedJobsPage'
import JobSeekerSavedJobsPage from '../pages/jobseeker/JobSeekerSavedJobsPage'
import JobSeekerApplicationsPage from '../pages/jobseeker/JobSeekerApplicationsPage'
import JobSeekerInterviewsPage from '../pages/jobseeker/JobSeekerInterviewsPage'
import JobSeekerTrainingPage from '../pages/jobseeker/JobSeekerTrainingPage'
import JobSeekerMessagesPage from '../pages/jobseeker/JobSeekerMessagesPage'
import JobSeekerNotificationsPage from '../pages/jobseeker/JobSeekerNotificationsPage'
import JobSeekerSettingsPage from '../pages/jobseeker/JobSeekerSettingsPage'

import EmployerDashboardPage from '../pages/employer/EmployerDashboardPage'
import EmployerCompanyProfilePage from '../pages/employer/EmployerCompanyProfilePage'
import EmployerVerificationPage from '../pages/employer/EmployerVerificationPage'
import EmployerPostJobPage from '../pages/employer/EmployerPostJobPage'
import EmployerJobsPage from '../pages/employer/EmployerJobsPage'
import EmployerApplicantsPage from '../pages/employer/EmployerApplicantsPage'
import EmployerShortlistedPage from '../pages/employer/EmployerShortlistedPage'
import EmployerInterviewsPage from '../pages/employer/EmployerInterviewsPage'
import EmployerMessagesPage from '../pages/employer/EmployerMessagesPage'
import EmployerAnalyticsPage from '../pages/employer/EmployerAnalyticsPage'
import EmployerSettingsPage from '../pages/employer/EmployerSettingsPage'

import TrainingDashboardPage from '../pages/training/TrainingDashboardPage'
import TrainingProfilePage from '../pages/training/TrainingProfilePage'
import TrainingProgramsPage from '../pages/training/TrainingProgramsPage'
import TrainingCreatePage from '../pages/training/TrainingCreatePage'
import TrainingLearnersPage from '../pages/training/TrainingLearnersPage'
import TrainingCertificatesPage from '../pages/training/TrainingCertificatesPage'
import TrainingAnalyticsPage from '../pages/training/TrainingAnalyticsPage'
import TrainingSettingsPage from '../pages/training/TrainingSettingsPage'

import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminJobsPage from '../pages/admin/AdminJobsPage'
import AdminApplicationsPage from '../pages/admin/AdminApplicationsPage'
import AdminTrainingPage from '../pages/admin/AdminTrainingPage'
import AdminVerificationPage from '../pages/admin/AdminVerificationPage'
import AdminSkillsPage from '../pages/admin/AdminSkillsPage'
import AdminReportsPage from '../pages/admin/AdminReportsPage'
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage'
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage'
import AdminSecurityPage from '../pages/admin/AdminSecurityPage'
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'

import NotFoundPage from '../pages/errors/NotFoundPage'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage'
import ErrorPage from '../pages/errors/ErrorPage'

import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training/:id" element={<TrainingDetailsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/career-resources" element={<CareerResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/create-jobseeker" element={<CreateJobSeekerAccountPage />} />
        <Route path="/create-employer" element={<CreateEmployerAccountPage />} />
        <Route path="/create-training-provider" element={<CreateTrainingAccountPage />} />
      </Route>

      <Route path="/jobseeker" element={<ProtectedRoute allowedRoles={['jobseeker']}><JobSeekerLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<JobSeekerDashboardPage />} />
        <Route path="profile" element={<JobSeekerProfilePage />} />
        <Route path="skills" element={<JobSeekerSkillsPage />} />
        <Route path="skill-gap" element={<JobSeekerSkillGapPage />} />
        <Route path="roadmap" element={<JobSeekerRoadmapPage />} />
        <Route path="portfolio" element={<JobSeekerPortfolioPage />} />
        <Route path="evidence" element={<JobSeekerEvidencePage />} />
        <Route path="jobs" element={<JobSeekerJobsPage />} />
        <Route path="search" element={<JobSeekerJobsPage />} />
        <Route path="matched-jobs" element={<JobSeekerMatchedJobsPage />} />
        <Route path="saved-jobs" element={<JobSeekerSavedJobsPage />} />
        <Route path="applications" element={<JobSeekerApplicationsPage />} />
        <Route path="interviews" element={<JobSeekerInterviewsPage />} />
        <Route path="training" element={<JobSeekerTrainingPage />} />
        <Route path="messages" element={<JobSeekerMessagesPage />} />
        <Route path="notifications" element={<JobSeekerNotificationsPage />} />
        <Route path="settings" element={<JobSeekerSettingsPage />} />
      </Route>

      <Route path="/employer" element={<ProtectedRoute allowedRoles={['employer']}><EmployerLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<EmployerDashboardPage />} />
        <Route path="company-profile" element={<EmployerCompanyProfilePage />} />
        <Route path="verification" element={<EmployerVerificationPage />} />
        <Route path="post-job" element={<EmployerPostJobPage />} />
        <Route path="jobs" element={<EmployerJobsPage />} />
        <Route path="applicants" element={<EmployerApplicantsPage />} />
        <Route path="shortlisted" element={<EmployerShortlistedPage />} />
        <Route path="interviews" element={<EmployerInterviewsPage />} />
        <Route path="messages" element={<EmployerMessagesPage />} />
        <Route path="analytics" element={<EmployerAnalyticsPage />} />
        <Route path="settings" element={<EmployerSettingsPage />} />
      </Route>

      <Route path="/training" element={<ProtectedRoute allowedRoles={['training']}><TrainingLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<TrainingDashboardPage />} />
        <Route path="profile" element={<TrainingProfilePage />} />
        <Route path="programs" element={<TrainingProgramsPage />} />
        <Route path="create" element={<TrainingCreatePage />} />
        <Route path="learners" element={<TrainingLearnersPage />} />
        <Route path="certificates" element={<TrainingCertificatesPage />} />
        <Route path="analytics" element={<TrainingAnalyticsPage />} />
        <Route path="settings" element={<TrainingSettingsPage />} />
      </Route>

      <Route path="/teaching-center" element={<ProtectedRoute allowedRoles={['training', 'teaching_center']}><TrainingLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<TrainingDashboardPage />} />
        <Route path="courses" element={<TrainingProgramsPage />} />
        <Route path="students" element={<TrainingLearnersPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="training" element={<AdminTrainingPage />} />
        <Route path="verification" element={<AdminVerificationPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="security" element={<AdminSecurityPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
