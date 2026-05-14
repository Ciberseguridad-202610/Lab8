"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logInteraction } from "@/lib/api";

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem("sim_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("sim_session_id", id);
  }
  return id;
}

export default function PhishingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasLoggedVisit = useRef(false);

  useEffect(() => {
    if (hasLoggedVisit.current) return;
    hasLoggedVisit.current = true;
    const sessionId = getOrCreateSessionId();
    logInteraction(sessionId, "PAGE_VISIT");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const sessionId = getOrCreateSessionId();
    const form = e.currentTarget;

    // La contraseña se descarta aquí — nunca sale del navegador.
    const email =
      (form.elements.namedItem("email") as HTMLInputElement)?.value ??
      undefined;

    await logInteraction(sessionId, "FORM_SUBMIT", { submitterEmail: email });

    router.push("/awareness");
  };

  const handleForgotPassword = async () => {
    const sessionId = getOrCreateSessionId();
    await logInteraction(sessionId, "LINK_CLICK");
    router.push("/awareness");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo corporativo ficticio */}
        <div style={styles.logoArea}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>CT</span>
          </div>
          <h1 style={styles.companyName}>CorpTech S.A.</h1>
          <p style={styles.portalLabel}>Portal Corporativo</p>
        </div>

        <h2 style={styles.title}>Iniciar sesión</h2>
        <p style={styles.subtitle}>Ingresa tus credenciales corporativas</p>

        <form onSubmit={handleSubmit} style={styles.form} autoComplete="on">
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Correo corporativo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="usuario@corptech.com"
              style={styles.input}
              autoComplete="username"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={styles.links}>
          <button onClick={handleForgotPassword} style={styles.linkBtn}>
            ¿Olvidaste tu contraseña?
          </button>
          <span style={styles.divider}>·</span>
          <a href="mailto:soporte@corptech.com" style={styles.linkA}>
            Contactar soporte
          </a>
        </div>

        <div style={styles.footer}>
          <span>© 2026 CorpTech S.A. — Todos los derechos reservados</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #1565c0, #283593)",
    borderRadius: "12px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  },
  logoIcon: {
    color: "white",
    fontWeight: "800",
    fontSize: "22px",
    letterSpacing: "-1px",
  },
  companyName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a237e",
    margin: "0 0 2px",
  },
  portalLabel: {
    fontSize: "13px",
    color: "#7986cb",
    margin: 0,
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 6px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    margin: "0 0 24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "11px 14px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    color: "#333",
  },
  button: {
    padding: "13px",
    background: "linear-gradient(135deg, #1565c0, #283593)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.3px",
  },
  errorMsg: {
    color: "#c62828",
    fontSize: "13px",
    textAlign: "center",
  },
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    fontSize: "13px",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#1565c0",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline",
    padding: 0,
  },
  divider: {
    color: "#ccc",
  },
  linkA: {
    color: "#1565c0",
    textDecoration: "none",
    fontSize: "13px",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #f0f0f0",
    fontSize: "11px",
    color: "#aaa",
  },
};
