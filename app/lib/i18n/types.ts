/**
 * Language type definitions for BuildTrustBG i18n system
 * Supports scalable addition of new languages
 */

export type Language = "bg" | "en";

export interface Translations {
  // Navigation
  navigation: {
    home: string;
    companies: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
    admin: string;
  };

  // Header / Brand
  header: {
    title: string;
    tagline: string;
  };

  // Footer
  footer: {
    tagline: string;
    navigation: string;
    company: string;
    legal: string;
    contact: string;
    email: string;
    facebook: string;
    navHome: string;
    navCompanies: string;
    registerCompany: string;
    companyLogin: string;
    terms: string;
    privacy: string;
    cookies: string;
    reviewsPolicy: string;
    pricing: string;
    categories: string;
    copyright: string;
    rightsReserved: string;
  };

  // Home Page
  home: {
    title: string;
    description: string;
    searchPlaceholder: string;
    browseCompanies: string;
    filterByCity: string;
    noResults: string;
    loadingCompanies: string;
  };

  // Companies Page
  companies: {
    title: string;
    description: string;
    searchPlaceholder: string;
    filterByCity: string;
    noResults: string;
    verified: string;
    reviews: string;
    rating: string;
    trustScore: string;
    contact: string;
  };

  // Company Profile Page
  companyProfile: {
    profileTitle: string;
    verified: string;
    trustScore: string;
    profileCompletion: string;
    verifiedCompany: string;
    verifiedDomain: string;
    reviewCount: string;
    averageRating: string;
    reviewConsistency: string;
    companyAge: string;
    responseRate: string;
    responseSpeed: string;
    reviewFreshness: string;
    categoryScores: string;
    profile: string;
    reviews: string;
    verification: string;
    engagement: string;
    reputation: string;
    noDataMessage: string;
    updatedAt: string;
    today: string;
    confidence: string;
    status: string;
    aiAnalysis: string;
    aiSummary: string;
    aiSummaryDescription: string;
    sentimentDistribution: string;
    keyTopics: string;
    keyTopicsDescription: string;
    mainInsights: string;
    quality: string;
    recommendation: string;
    flags: string;
    details: string;
    description: string;
    contact: string;
    services: string;
    workingHours: string;
    projects: string;
    gallery: string;
    socialNetworks: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    editProfile: string;
    overview: string;
    services: string;
    projects: string;
    gallery: string;
    messages: string;
    reviews: string;
    verification: string;
    subscription: string;
    settings: string;
    statisticsTitle: string;
    quickActionsTitle: string;
  };

  // Admin Dashboard
  admin: {
    title: string;
    dashboard: string;
    approvedCompanies: string;
    pendingCompanies: string;
    rejectedCompanies: string;
    categories: string;
    cities: string;
    users: string;
    reviews: string;
    homepage: string;
    settings: string;
  };

  // Buttons & Actions
  buttons: {
    login: string;
    register: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    remove: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    viewProfile: string;
    viewMore: string;
    viewLess: string;
    contactUs: string;
  };

  // Status & Badges
  status: {
    verified: string;
    pending: string;
    rejected: string;
    approved: string;
    active: string;
    inactive: string;
    legend: string;
    excellent: string;
    veryGood: string;
    good: string;
    trustworthy: string;
    weak: string;
    poor: string;
  };

  // Trust Score Levels
  trust: {
    veryHigh: string;
    high: string;
    medium: string;
    low: string;
    veryLow: string;
  };

  // Sentiment
  sentiment: {
    veryPositive: string;
    positive: string;
    neutral: string;
    negative: string;
    veryNegative: string;
  };

  // Review Flags
  reviewFlags: {
    spamRisk: string;
    fakeReviewRisk: string;
    duplicateContent: string;
    personalInformation: string;
    aggressiveLanguage: string;
    advertisement: string;
    veryShortReview: string;
    suspiciousPattern: string;
  };

  // Common Messages
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    noData: string;
    notFound: string;
    unauthorized: string;
    serverError: string;
    tryAgain: string;
    or: string;
    and: string;
    all: string;
    other: string;
  };

  // Access Control
  accessControl: {
    accessDenied: string;
    accessDeniedTitle: string;
    accessDeniedDescription: string;
    notAuthorized: string;
    contactAdmin: string;
    goHome: string;
    adminOnly: string;
    companyOnly: string;
    loginRequired: string;
  };

  // Forms
  forms: {
    name: string;
    email: string;
    phone: string;
    message: string;
    subject: string;
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    minLength: string;
    maxLength: string;
  };

  // Language
  language: {
    bulgarian: string;
    english: string;
    selectLanguage: string;
  };

  // Home Page - Extended
  homeExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    searchTitle: string;
    searchDescription: string;
    premiumSearch: string;
    serviceLabel: string;
    serviceSelect: string;
    cityLabel: string;
    citySelect: string;
    searchButton: string;
    browseButton: string;
    features: string;
    realReviews: string;
    wholeBulgaria: string;
    platformTitle: string;
    platformTagline: string;
    comparisonLabel: string;
    comparisonValue: string;
    verificationLabel: string;
    verificationValue: string;
    whyBuildTrust: string;
    whyTitle: string;
    whyDescription: string;
    verifiedCompaniesTitle: string;
    verifiedCompaniesDesc: string;
    realReviewsTitle: string;
    realReviewsDesc: string;
    compareCompaniesTitle: string;
    compareCompaniesDesc: string;
    freeSearchTitle: string;
    freeSearchDesc: string;
    popularCategories: string;
    categoriesTitle: string;
    categoriesDescription: string;
    categories: string;
    howItWorks: string;
    howTitle: string;
    howDescription: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
    step4: string;
    step4Desc: string;
    companiesSection: string;
    companiesSectionTitle: string;
    companiesSectionDescription: string;
    comingSoon: string;
    registerCompanyButton: string;
    ctaTitle: string;
    ctaDescription: string;
    startSearch: string;
  };

  // Login Page
  auth: {
    loginTitle: string;
    loginDescription: string;
    emailLabel: string;
    passwordLabel: string;
    loginButton: string;
    noAccount: string;
    registerLink: string;
    registerTitle: string;
    registerDescription: string;
    companyName: string;
    companyNamePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    cityPlaceholder: string;
    servicePlaceholder: string;
    websiteLabel: string;
    descriptionLabel: string;
    submitApplication: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    applicationNotice: string;
    applicationSuccess: string;
    companyDashboard: string;
    adminDashboard: string;
  };

  // Dashboard Company Pages
  dashboardCompany: {
    companyDashboard: string;
    overviewTitle: string;
    overviewDescription: string;
    editProfileTitle: string;
    editProfileDescription: string;
    galleryTitle: string;
    galleryDescription: string;
    projectsTitle: string;
    projectsDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    reviewsTitle: string;
    reviewsDescription: string;
    messagesTitle: string;
    messagesDescription: string;
    verificationTitle: string;
    verificationDescription: string;
    subscriptionTitle: string;
    subscriptionDescription: string;
    visits: string;
    inquiries: string;
    likes: string;
    basicInfo: string;
    basicInfoDescription: string;
    generalInfo: string;
    contactInfo: string;
    location: string;
    branding: string;
    profileComplete: string;
    editProfile: string;
    viewProfile: string;
    goldVerification: string;
    premium: string;
    featured: string;
    heroWelcome: string;
    heroSubtitle: string;
    profileCompletionLabel: string;
    kpiProfileViews: string;
    kpiTrustScore: string;
    kpiReviews: string;
    kpiProjects: string;
    kpiServices: string;
    kpiMessages: string;
    kpiGallery: string;
    trustScoreExcellent: string;
    trustScoreVeryGood: string;
    trustScoreGood: string;
    trustScoreNeedsImprovement: string;
    recommendationAddGallery: string;
    recommendationVerify: string;
    recommendationCollectReviews: string;
    recommendationCompleteProfile: string;
    activityTimeline: string;
    activityNoActivity: string;
    activityProfileUpdated: string;
    activityGalleryUploaded: string;
    activityNewReview: string;
    activityVerificationRequested: string;
    activityTrustScoreIncreased: string;
    aiInsightTitle: string;
    aiInsightDescription: string;
    aiInsightUploadPhotos: string;
    aiInsightVerified: string;
    aiInsightDescription300: string;
    kpiLast30Days: string;
    kpiAverage: string;
    kpiCompleted: string;
    kpiImagesUploaded: string;
    activityHoursAgo: string;
    activityDayAgo: string;
    itemsRemaining: string;
  };

  // Admin Pages
  adminPages: {
    adminDashboard: string;
    companiesTitle: string;
    companiesDescription: string;
    approvedCompaniesTitle: string;
    approvedCompaniesDescription: string;
    pendingCompaniesTitle: string;
    pendingCompaniesDescription: string;
    rejectedCompaniesTitle: string;
    rejectedCompaniesDescription: string;
    categoriesTitle: string;
    categoriesDescription: string;
    citiesTitle: string;
    citiesDescription: string;
    usersTitle: string;
    usersDescription: string;
    reviewsTitle: string;
    reviewsDescription: string;
    homepageTitle: string;
    homepageDescription: string;
    settingsTitle: string;
    settingsDescription: string;
    approveButton: string;
    rejectButton: string;
    deleteButton: string;
    editButton: string;
    viewButton: string;
    actions: string;
    status: string;
    pending: string;
    approved: string;
    rejected: string;
  };

  // Pages
  pages: {
    contactTitle: string;
    contactDescription: string;
    termsTitle: string;
    termsDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    cookiesTitle: string;
    cookiesDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
    serverErrorTitle: string;
    serverErrorDescription: string;
  };

  // Form Labels
  formLabels: {
    companyName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    industry: string;
    service: string;
    website: string;
    description: string;
    logoUrl: string;
    coverImageUrl: string;
    basicInfo: string;
    saveSettings: string;
    selectOption: string;
    platformName: string;
    platformEmail: string;
    supportPhone: string;
    maxGalleryImages: string;
    premiumPrice: string;
    goldVerificationFee: string;
    maintenanceMode: string;
    allowNewRegistrations: string;
    emailNotifications: string;
  };

  // Panel Descriptions
  panels: {
    descriptionTemplate: string;
    managedByCompany: string;
    placedForAddition: string;
    profileTemplate: string;
    contactsManaged: string;
    servicesManaged: string;
    workingHoursManaged: string;
    projectsManaged: string;
    galleryManaged: string;
    socialNetworksManaged: string;
    reviewsPublic: string;
    verificationManaged: string;
    subscriptionPlanned: string;
    aiAnalysisDescription: string;
    keywordsDescription: string;
    qualityIndicators: string;
  };

  // Statistics
  stats: {
    visits: string;
    inquiries: string;
    reviews: string;
    likes: string;
    positiveReviews: string;
    neutralReviews: string;
    negativeReviews: string;
    workflowApproval: string;
    stripeIntegration: string;
  };

  // Service Categories
  categories: {
    houseConstruction: string;
    generalRenovation: string;
    roofing: string;
    insulation: string;
    electrical: string;
    plumbing: string;
    architecture: string;
    interiorDesign: string;
    painting: string;
    flooring: string;
    windowsDoors: string;
    hvac: string;
    landscaping: string;
    demolition: string;
    excavation: string;
  };

  // Major Bulgarian Cities
  cities: {
    sofia: string;
    plovdiv: string;
    varna: string;
    burgas: string;
    ruse: string;
    staraZagora: string;
    velikoTarnovo: string;
    blagoevgrad: string;
    lovech: string;
    vidin: string;
    smolyan: string;
    sliven: string;
    shumen: string;
    dobrich: string;
    kardzhali: string;
    kyustendil: string;
    montana: string;
    silistra: string;
    targovishte: string;
    yambol: string;
  };

  // Onboarding
  onboarding: {
    welcomeBadge: string;
    welcomeTitle: string;
    welcomeDescription: string;
    successMessage: string;
  };

  // Profile Completion
  profileCompletion: {
    title: string;
    progress: string;
    missingItems: string;
    completedItems: string;
    logo: string;
    description: string;
    services: string;
    contactInfo: string;
    gallery: string;
    verification: string;
    socialLinks: string;
    coverImage: string;
    workingHours: string;
    projects: string;
  };

  // Premium Features
  premiumFeatures: {
    premiumBadge: string;
    premiumTitle: string;
    premiumPrice: string;
    premiumPriceUnit: string;
    becomePremium: string;
    benefits: string;
    priorityRanking: string;
    unlimitedGallery: string;
    featuredProfile: string;
    statsAnalytics: string;
    expansionSupport: string;
    currentPlan: string;
    freePlan: string;
    freePlanDesc: string;
    upgradeOptions: string;
  };

  // Verification
  verification: {
    goldBadge: string;
    statusRegistered: string;
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
    registeredDescription: string;
    pendingDescription: string;
    approvedDescription: string;
    timelineTitle: string;
    goldTitle: string;
    goldPrice: string;
    goldPriceUnit: string;
    applyNow: string;
    verificationBenefits: string;
    verifiedBadge: string;
    enhancedTrust: string;
    searchPriority: string;
    clientVisibility: string;
  };

  // Featured Company
  featured: {
    featuredBadge: string;
    featuredTitle: string;
    featuredPrice: string;
    featuredPriceUnit: string;
    learnMore: string;
    featuredDescription: string;
  };

  // Empty States
  emptyStates: {
    noGallery: string;
    noGalleryAction: string;
    noProjects: string;
    noProjectsAction: string;
    noReviews: string;
    noReviewsAction: string;
    noMessages: string;
    noMessagesAction: string;
    noServices: string;
    noServicesAction: string;
    noLogo: string;
    noLogoAction: string;
    noDescription: string;
    noDescriptionAction: string;
    noVerification: string;
    noVerificationAction: string;
  };

  // Next Steps
  nextSteps: {
    title: string;
    recommendedActions: string;
    priorityActions: string;
    otherActions: string;
    completeProfile: string;
    uploadLogo: string;
    addDescription: string;
    addContact: string;
    addServices: string;
    uploadGallery: string;
    addProjects: string;
    startVerification: string;
    collectReviews: string;
    improveTrustScore: string;
  };

  // Quick Actions
  quickActions: {
    title: string;
    editProfile: string;
    editProfileDesc: string;
    uploadPhotos: string;
    addProject: string;
    manageServices: string;
    gallery: string;
    galleryDesc: string;
    projects: string;
    projectsDesc: string;
    services: string;
    servicesDesc: string;
    reviews: string;
    reviewsDesc: string;
    messages: string;
    messagesDesc: string;
  };

  // Trust Score Dashboard
  trustScoreDashboard: {
    title: string;
    overviewTitle: string;
    overviewEmpty: string;
    startVerification: string;
    factorScores: string;
    confidence: string;
    status: string;
    updated: string;
  };

  // Companies Page
  companiesPage: {
    badge: string;
    title: string;
    description: string;
    categoriesTitle: string;
    categoriesDescription: string;
    citiesTitle: string;
    citiesDescription: string;
    catalogBadge: string;
    catalogDescription: string;
    registerButton: string;
    loginButton: string;
  };
}
