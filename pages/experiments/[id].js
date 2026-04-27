import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatNumber } from "@/lib/formatNumber";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from "recharts";

const API = "http://localhost:8000";

export default function ExperimentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t, i18n } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  const [experiment, setExperiment] = useState(null);
  const [retro, setRetro] = useState(null);
  const [present, setPresent] = useState(null);
  const [projection, setProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    fetch(`${API}/experiments/${id}`)
      .then((r) => r.json())
      .then((exp) => {
        setExperiment(exp);
        const params = `asset_type=${exp.asset_type}&asset_code=${exp.asset_code}&base_currency=${exp.base_currency}`;
        return Promise.all([
          fetch(`${API}/analysis/retrospective/${id}`).then((r) => r.json()),
          fetch(`${API}/analysis/present?${params}`).then((r) => r.json()),
          fetch(`${API}/analysis/projection?${params}&initial_amount=${exp.amount_invested}&horizon_days=90&n_simulations=1000`).then((r) => r.json()),
        ]);
      })
      .then(([r, p, proj]) => {
        setRetro(r);
        setPresent(p);
        setProjection(proj);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (!mounted) return null;

  const signalColor = {
    above: "success",
    below: "danger",
    neutral: "secondary",
  };

  const lastPoint = projection && projection.points
    ? projection.points[projection.points.length - 1]
    : null;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Link href="/experiments" className="btn btn-sm btn-outline-secondary mb-3">
          ← {t("actions.back")}
        </Link>

        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}

        {error && <div className="alert alert-danger">{t("error")}</div>}

        {!loading && !error && experiment && (
          <>
            <h4 className="mb-1">{experiment.name}</h4>
            <p className="text-muted small mb-4">
              <span className="badge bg-primary me-1">{experiment.asset_code}</span>
              <span className="badge bg-secondary me-1">{experiment.asset_type}</span>
              <span className="badge bg-dark">{experiment.base_currency}</span>
            </p>

            {/* LENS 1 - RETROSPECTIVE */}
            <div className="card mb-4">
              <div className="card-header bg-dark text-white fw-bold">
                🔭 {t("analysis.retrospective_title")}
              </div>
              <div className="card-body">
                {retro && (
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="card text-center border-0 bg-light h-100">
                        <div className="card-body">
                          <div className="small text-muted">{t("fields.amount")}</div>
                          <div className="fw-bold">{formatNumber(retro.amount_invested, i18n.language)} {retro.base_currency}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="card text-center border-0 bg-light h-100">
                        <div className="card-body">
                          <div className="small text-muted">Current Value</div>
                          <div className="fw-bold">{formatNumber(retro.current_value, i18n.language)} {retro.base_currency}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className={`card text-center border-0 h-100 ${retro.absolute_gain >= 0 ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}>
                        <div className="card-body">
                          <div className="small text-muted">Gain / Loss</div>
                          <div className={`fw-bold ${retro.absolute_gain >= 0 ? "text-success" : "text-danger"}`}>
                            {retro.absolute_gain >= 0 ? "+" : ""}{formatNumber(retro.absolute_gain, i18n.language)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className={`card text-center border-0 h-100 ${retro.percentage_gain >= 0 ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}>
                        <div className="card-body">
                          <div className="small text-muted">Return %</div>
                          <div className={`fw-bold fs-5 ${retro.percentage_gain >= 0 ? "text-success" : "text-danger"}`}>
                            {retro.percentage_gain >= 0 ? "+" : ""}{formatNumber(retro.percentage_gain, i18n.language)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LENS 2 - PRESENT */}
            <div className="card mb-4">
              <div className="card-header bg-dark text-white fw-bold">
                📊 {t("analysis.present_title")}
              </div>
              <div className="card-body">
                {present && (
                  <div className="row g-3 align-items-center">
                    <div className="col-md-4">
                      <div className="card text-center border-0 bg-light">
                        <div className="card-body">
                          <div className="small text-muted">Current Price</div>
                          <div className="fw-bold fs-5">{formatNumber(present.current_price, i18n.language)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-center border-0 bg-light">
                        <div className="card-body">
                          <div className="small text-muted">90d Moving Avg</div>
                          <div className="fw-bold fs-5">{formatNumber(present.moving_average_90d, i18n.language)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-center border-0 bg-light">
                        <div className="card-body">
                          <div className="small text-muted">Signal</div>
                          <span className={`badge bg-${signalColor[present.signal] || "secondary"} fs-6`}>
                            {present.signal?.toUpperCase()}
                          </span>
                          <div className="small mt-1">
                            {formatNumber(present.deviation_pct, i18n.language)}% deviation
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={[
                          { name: "90d MA", value: present.moving_average_90d },
                          { name: "Now", value: present.current_price },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={["auto", "auto"]} width={80} tickFormatter={(v) => formatNumber(v, i18n.language)} />
                          <Tooltip formatter={(v) => formatNumber(v, i18n.language)} />
                          <Line type="monotone" dataKey="value" stroke="#0d6efd" strokeWidth={2} dot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LENS 3 - MONTE CARLO PROJECTION */}
            <div className="card mb-4">
              <div className="card-header bg-dark text-white fw-bold">
                🎲 {t("analysis.projection_title")}
              </div>
              <div className="card-body">
                <div className="alert alert-warning small py-2">
                  {t("analysis.disclaimer")}
                </div>
                {projection && lastPoint && (
                  <>
                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <div className="card text-center border-0 bg-danger bg-opacity-10">
                          <div className="card-body py-2">
                            <div className="small text-muted">Pessimistic (p5)</div>
                            <div className="fw-bold text-danger">
                              {formatNumber(lastPoint.pessimistic, i18n.language)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card text-center border-0 bg-primary bg-opacity-10">
                          <div className="card-body py-2">
                            <div className="small text-muted">Median (p50)</div>
                            <div className="fw-bold text-primary">
                              {formatNumber(lastPoint.median, i18n.language)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card text-center border-0 bg-success bg-opacity-10">
                          <div className="card-body py-2">
                            <div className="small text-muted">Optimistic (p95)</div>
                            <div className="fw-bold text-success">
                              {formatNumber(lastPoint.optimistic, i18n.language)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={projection.points} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -2 }} />
                        <YAxis width={90} tickFormatter={(v) => formatNumber(v, i18n.language)} />
                        <Tooltip formatter={(v) => formatNumber(v, i18n.language)} />
                        <Legend />
                        <Area type="monotone" dataKey="optimistic" stroke="#198754" fill="#19875420" strokeWidth={1.5} name="Optimistic (p95)" />
                        <Area type="monotone" dataKey="median" stroke="#0d6efd" fill="#0d6efd20" strokeWidth={2} name="Median (p50)" />
                        <Area type="monotone" dataKey="pessimistic" stroke="#dc3545" fill="#dc354520" strokeWidth={1.5} name="Pessimistic (p5)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}