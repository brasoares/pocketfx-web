import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { t } = useTranslation("common");

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-2">
      <span className="navbar-brand fw-bold fs-5">
        💱 {t("app_title")}
        <span className="text-secondary fw-normal fs-6 ms-2">
          {t("app_subtitle")}
        </span>
      </span>
      <LanguageSelector />
    </nav>
  );
}