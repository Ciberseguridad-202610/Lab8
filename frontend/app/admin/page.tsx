"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getStats,
  getInteractions,
  sendLure,
  sendFollowup,
  purgeInteractions,
} from "@/lib/api";

interface Stats {
  total: number;
  visits: number;
  submissions: number;
  clicks: number;
  conversionRate: string;
}

interface Interaction {
  id: string;
  sessionId: string;
  action: string;
  ipHash: string;
  userAgentHash: string;
  redirectedToAwareness: boolean;
  timestamp: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  PAGE_VISIT: { label: "Visita", color: "#1565c0" },
  FORM_SUBMIT: { label: "Envío de formulario", color: "#c62828" },
  LINK_CLICK: { label: "Clic en enlace", color: "#ef6c00" },
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lureTarget, setLureTarget] = useState("");
  const [lureStatus, setLureStatus] = useState("");
  const [emailTarget, setEmailTarget] = useState("");
  const [emailSessionId, setEmailSessionId] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [purgeConfirm, setPurgeConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [s, i] = await Promise.all([getStats(), getInteractions()]);
    setStats(s);
    setInteractions(i);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendLure = async (e: React.FormEvent) => {
    e.preventDefault();
    setLureStatus("Enviando...");
    try {
      const result = await sendLure(lureTarget);
      setLureStatus(`Enviado ✓ ID: ${result.messageId} — Revisa MailHog en localhost:8025`);
    } catch {
      setLureStatus("Error al enviar");
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus("Enviando...");
    try {
      const result = await sendFollowup(
        emailTarget,
        emailSessionId || crypto.randomUUID(),
      );
      setEmailStatus(
        `Enviado ✓ ID: ${result.messageId}${result.preview ? ` — Ver en: ${result.preview}` : ""}`,
      );
    } catch {
      setEmailStatus("Error al enviar");
    }
  };

  const handlePurge = async () => {
    if (!purgeConfirm) {
      setPurgeConfirm(true);
      return;
    }
    const result = await purgeInteractions();
    setPurgeConfirm(false);
    alert(`Eliminados ${result.deleted} registros`);
    fetchData();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            Panel de Control — Simulación Phishing
          </h1>
          <p style={styles.headerSub}>
            Lab 8 · CorpTech S.A. · Solo metadatos pedagógicos, sin credenciales
          </p>
        </div>
        <button onClick={fetchData} style={styles.refreshBtn}>
          ↻ Actualizar
        </button>
      </header>

      <div style={styles.container}>
        {/* Stats */}
        {stats && (
          <div style={styles.statsGrid}>
            {[
              { label: "Total eventos", value: stats.total, color: "#1a237e" },
              {
                label: "Visitas a la página",
                value: stats.visits,
                color: "#1565c0",
              },
              {
                label: "Envíos de formulario",
                value: stats.submissions,
                color: "#c62828",
              },
              {
                label: "Clics en enlaces",
                value: stats.clicks,
                color: "#ef6c00",
              },
              {
                label: "Tasa de conversión",
                value: stats.conversionRate,
                color: "#2e7d32",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  ...styles.statCard,
                  borderTop: `4px solid ${s.color}`,
                }}
              >
                <p style={styles.statValue}>{s.value}</p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Log de interacciones */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Registro de Interacciones</h2>
            <button
              onClick={handlePurge}
              style={{
                ...styles.dangerBtn,
                background: purgeConfirm ? "#c62828" : "#ef9a9a",
              }}
            >
              {purgeConfirm
                ? "¿Confirmar eliminación total?"
                : "🗑 Purgar datos"}
            </button>
          </div>

          {loading ? (
            <p style={styles.loadingText}>Cargando...</p>
          ) : interactions.length === 0 ? (
            <p style={styles.emptyText}>
              Sin interacciones registradas aún. Visita /phishing para iniciar.
            </p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {[
                      "Timestamp",
                      "Acción",
                      "Session ID",
                      "IP Hash",
                      "UA Hash",
                      "Redirigido",
                    ].map((h) => (
                      <th key={h} style={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {interactions.map((row) => {
                    const action = ACTION_LABELS[row.action] || {
                      label: row.action,
                      color: "#666",
                    };
                    return (
                      <tr key={row.id} style={styles.tr}>
                        <td style={styles.td}>
                          {new Date(row.timestamp).toLocaleString("es-CO")}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.actionBadge,
                              background: action.color,
                            }}
                          >
                            {action.label}
                          </span>
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontFamily: "monospace",
                            fontSize: "11px",
                          }}
                        >
                          {row.sessionId.slice(0, 8)}…
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontFamily: "monospace",
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {row.ipHash.slice(0, 12)}…
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontFamily: "monospace",
                            fontSize: "11px",
                            color: "#999",
                          }}
                        >
                          {row.userAgentHash.slice(0, 12)}…
                        </td>
                        <td style={styles.td}>
                          {row.redirectedToAwareness ? "✓" : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.privacyNote}>
            <strong>Privacidad por diseño:</strong> IPs y User-Agents se
            almacenan únicamente como hash SHA-256 irreversible. No se guardan
            contraseñas ni datos personales identificables.
          </div>
        </section>

        {/* Envío de correo de phishing (cebo) */}
        <section style={{ ...styles.card, borderTop: "4px solid #c62828" }}>
          <h2 style={{ ...styles.cardTitle, color: "#c62828" }}>
            Enviar Correo de Phishing (Cebo)
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
            Envía el correo simulado de phishing a un destinatario. Aparecerá en{" "}
            <a href="http://localhost:8025" target="_blank" rel="noreferrer" style={{ color: "#1565c0" }}>
              MailHog (localhost:8025)
            </a>
            . Contiene el enlace a <code>/phishing</code>.
          </p>
          <form onSubmit={handleSendLure} style={styles.emailForm}>
            <input
              type="email"
              placeholder="destinatario@ejemplo.com"
              value={lureTarget}
              onChange={(e) => setLureTarget(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={{ ...styles.sendBtn, background: "#c62828" }}>
              Enviar correo cebo
            </button>
          </form>
          {lureStatus && (
            <p style={{ ...styles.emailStatus, background: "#fff8f8", color: "#c62828" }}>
              {lureStatus}
            </p>
          )}
        </section>

        {/* Envío de correo formativo */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            Enviar Correo Educativo de Seguimiento
          </h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
            Simula el envío del correo formativo que recibirían los
            participantes. Requiere MailHog corriendo en localhost:1025 (ver
            docker-compose.yml).
          </p>
          <form onSubmit={handleSendEmail} style={styles.emailForm}>
            <input
              type="email"
              placeholder="destinatario@ejemplo.com"
              value={emailTarget}
              onChange={(e) => setEmailTarget(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Session ID (opcional)"
              value={emailSessionId}
              onChange={(e) => setEmailSessionId(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.sendBtn}>
              Enviar correo formativo
            </button>
          </form>
          {emailStatus && <p style={styles.emailStatus}>{emailStatus}</p>}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f0f2f5" },
  header: {
    background: "#1a237e",
    color: "white",
    padding: "20px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: "20px", fontWeight: "700", margin: 0 },
  headerSub: { fontSize: "13px", opacity: 0.75, margin: "4px 0 0" },
  refreshBtn: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "24px 20px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1a1a2e",
    margin: "0 0 4px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    marginBottom: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a237e",
    margin: 0,
  },
  dangerBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "white",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    background: "#f5f5f5",
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#555",
    borderBottom: "2px solid #e0e0e0",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 12px", color: "#444", verticalAlign: "middle" },
  actionBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    color: "white",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  privacyNote: {
    marginTop: "16px",
    padding: "12px 14px",
    background: "#e8f5e9",
    borderLeft: "4px solid #43a047",
    borderRadius: "0 6px 6px 0",
    fontSize: "13px",
    color: "#2e7d32",
  },
  loadingText: {
    color: "#999",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px",
  },
  emptyText: {
    color: "#999",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px",
  },
  emailForm: { display: "flex", gap: "10px", flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: "200px",
    padding: "9px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    padding: "9px 20px",
    background: "#1565c0",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  emailStatus: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#2e7d32",
    background: "#f1f8e9",
    padding: "8px 12px",
    borderRadius: "6px",
    wordBreak: "break-all",
  },
};
