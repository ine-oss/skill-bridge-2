/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const translations = {
  en: {
    home: 'Home', companies: 'Companies', training: 'Training', about: 'About', search: 'Search', login: 'Login', join: 'Join now',
    dashboard: 'Dashboard', profile: 'My profile', skills: 'My skills', evidence: 'Evidence', jobs: 'Find jobs',
    learners: 'Students',
    applications: 'Applications', messages: 'Messages', notifications: 'Notifications', settings: 'Settings',
    verification: 'Verification', postJob: 'Post job', myJobs: 'My jobs', programs: 'Training programs', createTraining: 'Create training', users: 'Users', logout: 'Log out', back: 'Back', menu: 'Menu', language: 'Language',
    save: 'Save changes', cancel: 'Cancel', uploadCv: 'Upload CV', cvTitle: 'CV and professional proof',
    cvDescription: 'Add your CV, experience, and references so employers can trust what they see.',
    upload: 'Upload', review: 'Under review', verified: 'Verified', pending: 'Pending verification',
    completeProfile: 'Complete your profile', references: 'Work recommendations', experience: 'Experience',
  },
  rw: {
    home: 'Ahabanza', companies: 'Ibigo', training: 'Amahugurwa', about: 'Abo turi bo', search: 'Shakisha', login: 'Injira', join: 'Tangira ubu',
    dashboard: 'Ikibaho', profile: 'Umwirondoro wanjye', skills: 'Ubumenyi bwanjye', evidence: 'Ibimenyetso',
    jobs: 'Shaka akazi', learners: 'Abanyeshuri', applications: 'Ubusabe', messages: 'Ubutumwa', notifications: 'Amatangazo', settings: 'Igenamiterere',
    verification: 'Kugenzura', postJob: 'Shyiraho akazi', myJobs: 'Akazi kanjye', programs: 'Gahunda z’amahugurwa', createTraining: 'Kora amahugurwa', users: 'Abakoresha', logout: 'Sohoka', back: 'Subira inyuma', menu: 'Ibikubiyemo', language: 'Ururimi',
    save: 'Bika impinduka', cancel: 'Reka', uploadCv: 'Shyiramo CV', cvTitle: 'CV n’ibimenyetso by’umwuga',
    cvDescription: 'Shyiramo CV, uburambe, n’ibyemezo by’abo mwakoranye kugira ngo abakoresha bakwizere.',
    upload: 'Shyiramo', review: 'Birimo kugenzurwa', verified: 'Byemejwe', pending: 'Biracyagenzurwa',
    completeProfile: 'Uzuza umwirondoro', references: 'Ibyifuzo by’abo mwakoranye', experience: 'Uburambe',
  },
  sw: {
    home: 'Nyumbani', companies: 'Makampuni', training: 'Mafunzo', about: 'Kuhusu sisi', search: 'Tafuta', login: 'Ingia', join: 'Jiunge sasa',
    dashboard: 'Dashibodi', profile: 'Wasifu wangu', skills: 'Ujuzi wangu', evidence: 'Ushahidi', jobs: 'Tafuta kazi',
    applications: 'Maombi', learners: 'Wanafunzi', postJob: 'Chapisha kazi', myJobs: 'Kazi zangu', programs: 'Programu za mafunzo', createTraining: 'Unda mafunzo', users: 'Watumiaji', messages: 'Ujumbe', notifications: 'Arifa', settings: 'Mipangilio', verification: 'Uthibitishaji',
    logout: 'Ondoka', back: 'Rudi', menu: 'Menyu', language: 'Lugha', save: 'Hifadhi mabadiliko', cancel: 'Ghairi',
    uploadCv: 'Pakia CV', cvTitle: 'CV na uthibitisho wa kitaalamu', cvDescription: 'Ongeza CV, uzoefu, na mapendekezo ili waajiri wakuamini.',
    upload: 'Pakia', review: 'Inakaguliwa', verified: 'Imethibitishwa', pending: 'Inasubiri uthibitisho', completeProfile: 'Kamilisha wasifu',
    references: 'Mapendekezo ya waajiri', experience: 'Uzoefu',
  },
  fr: {
    home: 'Accueil', companies: 'Entreprises', training: 'Formation', about: 'À propos', search: 'Rechercher', login: 'Connexion', join: 'Rejoindre',
    dashboard: 'Tableau de bord', profile: 'Mon profil', skills: 'Mes compétences', evidence: 'Preuves', jobs: 'Trouver un emploi',
    applications: 'Candidatures', learners: 'Étudiants', postJob: 'Publier un emploi', myJobs: 'Mes emplois', programs: 'Programmes de formation', createTraining: 'Créer une formation', users: 'Utilisateurs', messages: 'Messages', notifications: 'Notifications', settings: 'Paramètres', verification: 'Vérification',
    logout: 'Se déconnecter', back: 'Retour', menu: 'Menu', language: 'Langue', save: 'Enregistrer', cancel: 'Annuler',
    uploadCv: 'Téléverser le CV', cvTitle: 'CV et preuves professionnelles', cvDescription: 'Ajoutez votre CV, votre expérience et des recommandations pour inspirer confiance aux employeurs.',
    upload: 'Téléverser', review: 'En cours de vérification', verified: 'Vérifié', pending: 'Vérification en attente', completeProfile: 'Compléter le profil',
    references: 'Recommandations professionnelles', experience: 'Expérience',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('skillbridge-language') || 'en')

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    localStorage.setItem('skillbridge-language', nextLanguage)
  }

  const value = useMemo(() => ({
    language,
    setLanguage: changeLanguage,
    t: (key) => translations[language]?.[key] || translations.en[key] || key,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}