'use client';

export default function LegitimoPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>CT</span>
          </div>
          <h1 style={styles.companyName}>CorpTech S.A.</h1>
          <p style={styles.portalLabel}>Portal Corporativo Oficial</p>
        </div>

        <div style={styles.verifiedBadge}>
          <span style={styles.verifiedIcon}>✓</span>
          <span>Sitio verificado · corptech.com</span>
        </div>

        <h2 style={styles.title}>Iniciar sesión</h2>
        <p style={styles.subtitle}>Bienvenido al portal legítimo de CorpTech</p>

        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Correo corporativo</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@corptech.com"
              style={styles.input}
              autoComplete="username"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" style={styles.button}>
            Iniciar sesión
          </button>
        </form>

        <div style={styles.links}>
          <a href="#" style={styles.linkA}>¿Olvidaste tu contraseña?</a>
          <span style={styles.divider}>·</span>
          <a href="mailto:soporte@corptech.com" style={styles.linkA}>Contactar soporte</a>
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
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  logoIcon: {
    color: 'white',
    fontWeight: '800',
    fontSize: '22px',
    letterSpacing: '-1px',
  },
  companyName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1b5e20',
    margin: '0 0 2px',
  },
  portalLabel: {
    fontSize: '13px',
    color: '#66bb6a',
    margin: 0,
  },
  verifiedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: '#f1f8e9',
    border: '1px solid #a5d6a7',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: '24px',
  },
  verifiedIcon: {
    background: '#2e7d32',
    color: 'white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '800',
    flexShrink: 0,
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 6px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    margin: '0 0 24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    color: '#333',
  },
  button: {
    padding: '13px',
    background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    letterSpacing: '0.3px',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    fontSize: '13px',
  },
  divider: { color: '#ccc' },
  linkA: {
    color: '#2e7d32',
    textDecoration: 'none',
    fontSize: '13px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
    fontSize: '11px',
    color: '#aaa',
  },
};
