import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation.json";
import arTranslations from "./locales/ar/translation.json";

// Retrieve the language from local storage or fallback to 'en'
const language = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    ar: {
      translation: arTranslations,
    },
  },
  lng: language, // Set the language from local storage
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Save the selected language to local storage on language change
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
