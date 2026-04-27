import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en",    label: "English",   flag: "🇺🇸" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "es",    label: "Español",   flag: "🇪🇸" },
  { code: "fr",    label: "Français",  flag: "🇫🇷" },
  { code: "de",    label: "Deutsch",   flag: "🇩🇪" },
  { code: "ja",    label: "日本語",     flag: "🇯🇵" },
  { code: "zh",    label: "中文",       flag: "🇨🇳" },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation("common");

  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="lang-select" className="form-label mb-0 text-white small">
        {t("language")}:
      </label>
      <select
        id="lang-select"
        className="form-select form-select-sm"
        style={{ width: "auto" }}
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}