import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector/cjs";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: "index",
    fallbackLng: "vi",
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
    supportedLngs: ["en", "de", "ja", "vi", "zh"],
    backend: {
      loadPath: (languages: string[]) =>
        `SHOPIFY_APP_URL/locales/${languages[0]}/index.json`,
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
