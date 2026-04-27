import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8000";

export default function Experiments() {
  const { t, i18n } = useTranslation("common");
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`${API}/experiments`)
      .then((r) => r.json())
      .then((data) => { setExperiments(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3">{t("experiments")}</h4>

        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{t("error")}</div>
        )}

        {!loading && !error && experiments.length === 0 && (
          <div className="alert alert-secondary">{t("no_data")}</div>
        )}

        {!loading && !error && experiments.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>{t("fields.name")}</th>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Currency</th>
                  <th>{t("fields.amount")}</th>
                  <th>{t("fields.date")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp) => (
                  <tr key={exp.id}>
                    <td className="text-muted small">{exp.id}</td>
                    <td><strong>{exp.name}</strong></td>
                    <td>
                      <span className={`badge ${exp.asset_type === "crypto" ? "bg-warning text-dark" : "bg-info text-dark"}`}>
                        {exp.asset_type}
                      </span>
                    </td>
                    <td><span className="badge bg-primary">{exp.asset_code}</span></td>
                    <td><span className="badge bg-secondary">{exp.base_currency}</span></td>
                    <td>
                      {new Intl.NumberFormat(i18n.language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(exp.amount_invested)}
                    </td>
                    <td>{new Date(exp.invested_at).toLocaleDateString(i18n.language)}</td>
                    <td>
                      <Link href={`/experiments/${exp.id}`} className="btn btn-sm btn-outline-primary">
                        {t("actions.view")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}