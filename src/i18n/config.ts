import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Dynamically import all translation files
const translations = import.meta.glob("../../public/locales/*/index.json", {
  eager: true,
});

// Build resources object dynamically
const resources = Object.keys(translations).reduce((acc, path) => {
  // Extract language code from path (e.g., '../../public/locales/vi/index.json' -> 'vi')
  const lang = path.split("/").slice(-2)[0];

  return {
    ...acc,
    [lang]: {
      translation: (translations[path] as any).default,
    },
  };
}, {});

console.log(resources);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "vi", // Default language
    fallbackLng: "vi", // Fallback language
    defaultNS: "translation",
    ns: ["translation"],
    debug: import.meta.env.NODE_ENV === "development", // Check development environment using Vite env
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${import.meta.env.VITE_APP_URL}/locales/{{lng}}/{{ns}}.json`,
      parse: (data: string) =>
        JSON.parse(
          data
            .replace(/^"(.+)"$/, "$1")
            .replace(/\\n/g, "")
            .replace(/\\/g, "")
        ),
    },
  });

export default i18n;
