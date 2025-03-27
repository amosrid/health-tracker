type Locale = "en" | "id" | "es"

interface Translations {
  [key: string]: {
    [locale in Locale]?: string
  }
}

// Translation dictionary
const translations: Translations = {
  // Common
  "app.name": {
    en: "HealthTrack",
    id: "HealthTrack",
    es: "HealthTrack",
  },
  "app.tagline": {
    en: "Track your health journey",
    id: "Lacak perjalanan kesehatanmu",
    es: "Sigue tu viaje de salud",
  },

  // Navigation
  "nav.water": {
    en: "Water",
    id: "Air",
    es: "Agua",
  },
  "nav.calories": {
    en: "Calories",
    id: "Kalori",
    es: "Calorías",
  },
  "nav.bmi": {
    en: "BMI",
    id: "BMI",
    es: "IMC",
  },
  "nav.dashboard": {
    en: "Dashboard",
    id: "Dasbor",
    es: "Panel",
  },
  "nav.settings": {
    en: "Settings",
    id: "Pengaturan",
    es: "Ajustes",
  },

  // Water Tracker
  "water.title": {
    en: "Water Intake",
    id: "Asupan Air",
    es: "Consumo de Agua",
  },
  "water.description": {
    en: "Track your daily hydration",
    id: "Lacak hidrasi harian Anda",
    es: "Controla tu hidratación diaria",
  },
  "water.add": {
    en: "Add Water",
    id: "Tambah Air",
    es: "Añadir Agua",
  },
  "water.goal": {
    en: "Daily Water Goal",
    id: "Target Air Harian",
    es: "Objetivo Diario de Agua",
  },
  "water.progress": {
    en: "Today's Progress",
    id: "Kemajuan Hari Ini",
    es: "Progreso de Hoy",
  },
  "water.today": {
    en: "Today's Hydration",
    id: "Hidrasi Hari Ini",
    es: "Hidratación de Hoy",
  },
  "water.glass.small": {
    en: "Small",
    id: "Kecil",
    es: "Pequeño",
  },
  "water.glass.medium": {
    en: "Medium",
    id: "Sedang",
    es: "Mediano",
  },
  "water.glass.large": {
    en: "Large",
    id: "Besar",
    es: "Grande",
  },
  "water.glass.xl": {
    en: "XL",
    id: "XL",
    es: "XL",
  },
  "water.add.custom": {
    en: "Add Custom",
    id: "Tambah Kustom",
    es: "Añadir Personalizado",
  },
  "water.add.custom.title": {
    en: "Add Custom Glass",
    id: "Tambah Gelas Kustom",
    es: "Añadir Vaso Personalizado",
  },
  "water.add.custom.description": {
    en: "Create a custom glass size for your water tracking",
    id: "Buat ukuran gelas kustom untuk pelacakan air Anda",
    es: "Crea un tamaño de vaso personalizado para tu seguimiento de agua",
  },
  "water.glass.name": {
    en: "Glass Name",
    id: "Nama Gelas",
    es: "Nombre del Vaso",
  },
  "water.glass.name.placeholder": {
    en: "Coffee Mug",
    id: "Mug Kopi",
    es: "Taza de Café",
  },
  "water.glass.size": {
    en: "Size",
    id: "Ukuran",
    es: "Tamaño",
  },
  "water.add.glass": {
    en: "Add Glass",
    id: "Tambah Gelas",
    es: "Añadir Vaso",
  },

  // Calorie Counter
  "calories.title": {
    en: "Calorie Intake",
    id: "Asupan Kalori",
    es: "Consumo de Calorías",
  },
  "calories.description": {
    en: "Track your daily nutrition",
    id: "Lacak nutrisi harian Anda",
    es: "Controla tu nutrición diaria",
  },
  "calories.add": {
    en: "Add Food",
    id: "Tambah Makanan",
    es: "Añadir Comida",
  },
  "calories.search": {
    en: "Search foods...",
    id: "Cari makanan...",
    es: "Buscar alimentos...",
  },
  "calories.today": {
    en: "Today's Nutrition",
    id: "Nutrisi Hari Ini",
    es: "Nutrición de Hoy",
  },
  "calories.intake": {
    en: "Calorie Intake",
    id: "Asupan Kalori",
    es: "Consumo de Calorías",
  },

  // BMI Calculator
  "bmi.title": {
    en: "BMI Calculator",
    id: "Kalkulator BMI",
    es: "Calculadora de IMC",
  },
  "bmi.description": {
    en: "Calculate your Body Mass Index",
    id: "Hitung Indeks Massa Tubuh Anda",
    es: "Calcula tu Índice de Masa Corporal",
  },
  "bmi.calculate": {
    en: "Calculate BMI",
    id: "Hitung BMI",
    es: "Calcular IMC",
  },
  "bmi.status": {
    en: "BMI Status",
    id: "Status BMI",
    es: "Estado de IMC",
  },
  "bmi.full": {
    en: "Body Mass Index (BMI)",
    id: "Indeks Massa Tubuh (BMI)",
    es: "Índice de Masa Corporal (IMC)",
  },
  "bmi.not.calculated": {
    en: "Not calculated",
    id: "Belum dihitung",
    es: "No calculado",
  },
  "bmi.category.underweight": {
    en: "Underweight",
    id: "Kekurangan berat badan",
    es: "Bajo peso",
  },
  "bmi.category.normal": {
    en: "Normal weight",
    id: "Berat badan normal",
    es: "Peso normal",
  },
  "bmi.category.overweight": {
    en: "Overweight",
    id: "Kelebihan berat badan",
    es: "Sobrepeso",
  },
  "bmi.category.obese": {
    en: "Obese",
    id: "Obesitas",
    es: "Obesidad",
  },

  // Settings
  "settings.title": {
    en: "Settings",
    id: "Pengaturan",
    es: "Ajustes",
  },
  "settings.language": {
    en: "Language",
    id: "Bahasa",
    es: "Idioma",
  },
  "settings.units": {
    en: "Measurement Units",
    id: "Satuan Ukuran",
    es: "Unidades de Medida",
  },
  "settings.theme": {
    en: "Theme",
    id: "Tema",
    es: "Tema",
  },
  "settings.darkMode": {
    en: "Dark Mode",
    id: "Mode Gelap",
    es: "Modo Oscuro",
  },

  // Dashboard
  "dashboard.title": {
    en: "Dashboard",
    id: "Dasbor",
    es: "Panel",
  },
  "dashboard.progress": {
    en: "Progress",
    id: "Kemajuan",
    es: "Progreso",
  },
  "dashboard.history": {
    en: "History",
    id: "Riwayat",
    es: "Historial",
  },
  "dashboard.plan": {
    en: "Plan",
    id: "Rencana",
    es: "Plan",
  },

  // Profile
  "profile.title": {
    en: "Profile",
    id: "Profil",
    es: "Perfil",
  },
  "profile.edit": {
    en: "Edit",
    id: "Edit",
    es: "Editar",
  },
  "profile.save": {
    en: "Save",
    id: "Simpan",
    es: "Guardar",
  },
  "profile.updated": {
    en: "Profile updated",
    id: "Profil diperbarui",
    es: "Perfil actualizado",
  },
  "profile.updated.description": {
    en: "Your profile information has been saved.",
    id: "Informasi profil Anda telah disimpan.",
    es: "Tu información de perfil ha sido guardada.",
  },
  "profile.member.since": {
    en: "Member Since",
    id: "Anggota Sejak",
    es: "Miembro Desde",
  },
  "profile.last.login": {
    en: "Last Login",
    id: "Login Terakhir",
    es: "Último Acceso",
  },
  "profile.unknown": {
    en: "Unknown",
    id: "Tidak diketahui",
    es: "Desconocido",
  },
  "profile.not.set": {
    en: "Not set",
    id: "Belum diatur",
    es: "No establecido",
  },

  // Health data
  "health.summary": {
    en: "Health Summary",
    id: "Ringkasan Kesehatan",
    es: "Resumen de Salud",
  },
  "health.summary.description": {
    en: "Your current health metrics and goals",
    id: "Metrik dan target kesehatan Anda saat ini",
    es: "Tus métricas y objetivos de salud actuales",
  },
  progress: {
    en: "Progress",
    id: "Kemajuan",
    es: "Progreso",
  },
  height: {
    en: "Height",
    id: "Tinggi",
    es: "Altura",
  },
  weight: {
    en: "Weight",
    id: "Berat",
    es: "Peso",
  },
  age: {
    en: "Age",
    id: "Usia",
    es: "Edad",
  },
  years: {
    en: "years",
    id: "tahun",
    es: "años",
  },
  gender: {
    en: "Gender",
    id: "Jenis Kelamin",
    es: "Género",
  },
  "activity.level": {
    en: "Activity Level",
    id: "Tingkat Aktivitas",
    es: "Nivel de Actividad",
  },
  "activity.sedentary": {
    en: "Sedentary (little or no exercise)",
    id: "Tidak aktif (sedikit atau tidak ada olahraga)",
    es: "Sedentario (poco o ningún ejercicio)",
  },
  "activity.light": {
    en: "Light (exercise 1-3 days/week)",
    id: "Ringan (olahraga 1-3 hari/minggu)",
    es: "Ligero (ejercicio 1-3 días/semana)",
  },
  "activity.moderate": {
    en: "Moderate (exercise 3-5 days/week)",
    id: "Sedang (olahraga 3-5 hari/minggu)",
    es: "Moderado (ejercicio 3-5 días/semana)",
  },
  "activity.active": {
    en: "Active (exercise 6-7 days/week)",
    id: "Aktif (olahraga 6-7 hari/minggu)",
    es: "Activo (ejercicio 6-7 días/semana)",
  },
  "activity.very.active": {
    en: "Very Active (intense exercise daily)",
    id: "Sangat Aktif (olahraga intensif setiap hari)",
    es: "Muy Activo (ejercicio intenso diario)",
  },
  "measurement.units": {
    en: "Measurement Units",
    id: "Satuan Ukuran",
    es: "Unidades de Medida",
  },
  "units.metric": {
    en: "Metric (cm, kg)",
    id: "Metrik (cm, kg)",
    es: "Métrico (cm, kg)",
  },
  "units.imperial": {
    en: "Imperial (in, lbs)",
    id: "Imperial (in, lbs)",
    es: "Imperial (in, lbs)",
  },
  "view.detailed.dashboard": {
    en: "View Detailed Dashboard",
    id: "Lihat Dasbor Terperinci",
    es: "Ver Panel Detallado",
  },

  // AI Health Insights
  "ai.health.insights": {
    en: "AI Health Insights",
    id: "Wawasan Kesehatan AI",
    es: "Perspectivas de Salud IA",
  },
  "ai.health.insights.description": {
    en: "Personalized health recommendations based on your data",
    id: "Rekomendasi kesehatan yang dipersonalisasi berdasarkan data Anda",
    es: "Recomendaciones de salud personalizadas basadas en tus datos",
  },
  "ai.health.insights.coming.soon": {
    en: "AI-powered health insights will be available here soon.",
    id: "Wawasan kesehatan berbasis AI akan segera tersedia di sini.",
    es: "Las perspectivas de salud impulsadas por IA estarán disponibles aquí pronto.",
  },
  "ai.health.insights.integration": {
    en: "This feature will be integrated with OpenRouter API to provide personalized health recommendations.",
    id: "Fitur ini akan diintegrasikan dengan API OpenRouter untuk memberikan rekomendasi kesehatan yang dipersonalisasi.",
    es: "Esta función se integrará con la API de OpenRouter para proporcionar recomendaciones de salud personalizadas.",
  },

  // Theme
  "theme.changed": {
    en: "Theme changed",
    id: "Tema diubah",
    es: "Tema cambiado",
  },
  "theme.changed.description": {
    en: "The application theme has been changed to {theme}.",
    id: "Tema aplikasi telah diubah menjadi {theme}.",
    es: "El tema de la aplicación ha sido cambiado a {theme}.",
  },
  "theme.customize": {
    en: "Customize the app appearance",
    id: "Sesuaikan tampilan aplikasi",
    es: "Personaliza la apariencia de la aplicación",
  },
}

// Default locale
let currentLocale: Locale = "en"

// Initialize locale from localStorage if available
if (typeof window !== "undefined") {
  const savedLocale = localStorage.getItem("locale") as Locale
  if (savedLocale && ["en", "id", "es"].includes(savedLocale)) {
    currentLocale = savedLocale
  }
}

// Translation function
export function t(key: string, locale?: Locale): string {
  const useLocale = locale || currentLocale

  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`)
    return key
  }

  return translations[key][useLocale] || translations[key]["en"] || key
}

// Set locale
export function setLocale(locale: Locale): void {
  if (!["en", "id", "es"].includes(locale)) {
    console.error(`Invalid locale: ${locale}`)
    return
  }

  currentLocale = locale
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale)
    // Dispatch event for components to update
    window.dispatchEvent(new Event("localeChanged"))
  }
}

// Get current locale
export function getLocale(): Locale {
  return currentLocale
}

// Available locales
export const availableLocales = [
  { code: "en", name: "English" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "es", name: "Español" },
]

