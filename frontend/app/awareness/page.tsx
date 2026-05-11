'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const REDIRECT_DELAY = 30; // segundos antes de redirigir al portal legítimo
const LEGITIMATE_URL = process.env.NEXT_PUBLIC_LEGITIMATE_PORTAL || '/legitimo';

const CHECKLIST = [
  { icon: '🔍', title: 'Verifica la URL completa', desc: 'Antes de ingresar credenciales, confirma que el dominio sea exactamente el oficial (ej: corptech.com, sin guiones ni subdominios extraños).' },
  { icon: '🔒', title: 'Revisa el certificado HTTPS', desc: 'Haz clic en el candado del navegador y verifica que el certificado pertenezca al dominio correcto.' },
  { icon: '🔑', title: 'Usa un gestor de contraseñas', desc: 'Los gestores como Bitwarden o 1Password solo autocompletan en el dominio legítimo registrado, bloqueando phishing automáticamente.' },
  { icon: '📱', title: 'Activa 2FA / MFA', desc: 'Incluso si tus credenciales son comprometidas, el segundo factor bloquea el acceso al atacante.' },
  { icon: '📧', title: 'Desconfía de correos urgentes', desc: 'Los ataques de phishing frecuentemente usan urgencia artificial ("tu cuenta será suspendida") para que actúes sin pensar.' },
  { icon: '🚫', title: 'No hagas clic, escribe la URL', desc: 'Ante cualquier duda sobre un enlace, escribe la dirección directamente en la barra del navegador.' },
];

export default function AwarenessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);
  const [paused, setPaused] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(sessionStorage.getItem('sim_session_id') || 'N/A');
  }, []);

  useEffect(() => {
    if (paused) return;
    if (countdown <= 0) {
      router.push(LEGITIMATE_URL);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, paused]);

  const progress = ((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100;

  return (
    <div style={styles.page}>
      {/* Banner principal de alerta */}
      <div style={styles.alertBanner}>
        <div style={styles.alertIcon}>⚠️</div>
        <div>
          <h1 style={styles.alertTitle}>¡Esta era una simulación de phishing!</h1>
          <p style={styles.alertSub}>
            Participaste en un ejercicio educativo controlado de <strong>evil twin / phishing</strong>.
            <br />
            <strong>Ninguna contraseña fue almacenada ni comprometida.</strong> Esto es una prueba pedagógica.
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Explicación del ejercicio */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>¿Qué acaba de ocurrir?</h2>
          <p style={styles.text}>
            Visitaste (o enviaste datos en) una página que <strong>imitaba visualmente</strong> el portal
            corporativo de CorpTech S.A. Esta técnica se llama <em>evil twin</em> o <em>phishing por suplantación
            de identidad</em>: un atacante real replaca el diseño de un sitio legítimo en otro dominio
            para robar credenciales.
          </p>
          <p style={styles.text}>
            En este laboratorio controlado, el formulario <strong>nunca envió tus credenciales</strong> a
            ningún servidor. Solo se registró el evento de interacción (si visitaste la página o
            enviaste el formulario) como metadato pedagógico anónimo.
          </p>
          {sessionId !== 'N/A' && (
            <div style={styles.sessionBox}>
              <span style={styles.sessionLabel}>ID de sesión de referencia:</span>
              <code style={styles.sessionId}>{sessionId}</code>
            </div>
          )}
        </section>

        {/* Señales de alerta */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Señales que debiste notar</h2>
          <div style={styles.warningList}>
            {[
              'La URL del navegador no era corptech.com — revísala siempre antes de ingresar.',
              'El correo o enlace que te llevó aquí provenía de un dominio externo o inusual.',
              'No había un certificado HTTPS válido del dominio corporativo oficial.',
              'Se pedían credenciales con urgencia o sin contexto claro.',
            ].map((w, i) => (
              <div key={i} style={styles.warningItem}>
                <span style={styles.warningDot}>⚠</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist de buenas prácticas */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Checklist: cómo protegerte del phishing</h2>
          <div style={styles.checkGrid}>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={styles.checkItem}>
                <span style={styles.checkIcon}>{item.icon}</span>
                <div>
                  <strong style={styles.checkTitle}>{item.title}</strong>
                  <p style={styles.checkDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pasos ante incidente real */}
        <section style={{ ...styles.card, background: '#fff8f8', border: '1px solid #ffcdd2' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#c62828' }}>
            Si sospechas de un incidente real
          </h2>
          <ol style={styles.incidentList}>
            {[
              'No ingreses más datos. Cierra la pestaña de inmediato.',
              'Cambia tu contraseña desde el portal oficial corporativo.',
              'Notifica al equipo de Seguridad: security@corptech.com | Ext. 1234.',
              'No compartas información sobre el incidente por canales no seguros (WhatsApp, correo personal).',
              'Conserva capturas de pantalla y los encabezados del correo sospechoso como evidencia.',
            ].map((step, i) => (
              <li key={i} style={styles.incidentStep}>
                <span style={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Redirección automática */}
        <section style={styles.redirectCard}>
          <p style={styles.redirectText}>
            Serás redirigido al portal legítimo automáticamente en{' '}
            <strong style={styles.countdown}>{countdown}s</strong>
          </p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <div style={styles.redirectActions}>
            <button
              onClick={() => setPaused(!paused)}
              style={styles.pauseBtn}
            >
              {paused ? '▶ Reanudar' : '⏸ Pausar'}
            </button>
            <button onClick={() => router.push(LEGITIMATE_URL)} style={styles.redirectNow}>
              Ir al portal ahora →
            </button>
          </div>
          <p style={styles.redirectNote}>
            Redirigiendo a: <code style={{ fontSize: '12px' }}>{LEGITIMATE_URL}</code>
          </p>
        </section>

        {/* Declaración ficticia */}
        <div style={styles.disclaimer}>
          <strong>DECLARACIÓN:</strong> Este ejercicio es de carácter exclusivamente ficticio y
          pedagógico, realizado en un entorno de laboratorio controlado (Lab 8 — Ciberseguridad,
          Universidad de los Andes). No se almacenaron contraseñas, no se involucró personal real,
          y no se ejecutó ninguna acción contra sistemas de producción.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#fafafa',
  },
  alertBanner: {
    background: 'linear-gradient(135deg, #b71c1c, #d32f2f)',
    color: 'white',
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  alertIcon: {
    fontSize: '48px',
    flexShrink: 0,
  },
  alertTitle: {
    fontSize: '24px',
    fontWeight: '800',
    margin: '0 0 6px',
  },
  alertSub: {
    fontSize: '15px',
    margin: 0,
    opacity: 0.95,
    lineHeight: 1.6,
  },
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '24px 20px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '24px 28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1a237e',
    margin: '0 0 16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e8eaf6',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  text: {
    fontSize: '14px',
    color: '#444',
    lineHeight: 1.7,
    marginBottom: '12px',
  },
  sessionBox: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
  },
  sessionLabel: {
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap',
  },
  sessionId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#333',
    wordBreak: 'break-all',
  },
  warningList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  warningItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#444',
    background: '#fff8e1',
    borderLeft: '4px solid #ffa000',
    padding: '10px 14px',
    borderRadius: '0 6px 6px 0',
  },
  warningDot: {
    color: '#ffa000',
    flexShrink: 0,
    marginTop: '1px',
  },
  checkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
  },
  checkItem: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '14px',
    background: '#f8f9ff',
    borderRadius: '8px',
    border: '1px solid #e8eaf6',
  },
  checkIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  checkTitle: {
    display: 'block',
    fontSize: '14px',
    color: '#1a237e',
    marginBottom: '4px',
  },
  checkDesc: {
    fontSize: '13px',
    color: '#555',
    margin: 0,
    lineHeight: 1.5,
  },
  incidentList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  incidentStep: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#444',
  },
  stepNum: {
    width: '26px',
    height: '26px',
    background: '#c62828',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
  redirectCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '24px 28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    textAlign: 'center',
  },
  redirectText: {
    fontSize: '16px',
    color: '#333',
    margin: '0 0 16px',
  },
  countdown: {
    fontSize: '22px',
    color: '#1565c0',
  },
  progressBar: {
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '0 0 16px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #1565c0, #283593)',
    transition: 'width 1s linear',
    borderRadius: '4px',
  },
  redirectActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  pauseBtn: {
    padding: '8px 20px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  },
  redirectNow: {
    padding: '8px 20px',
    background: '#1565c0',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  redirectNote: {
    fontSize: '12px',
    color: '#999',
  },
  disclaimer: {
    background: '#f3f3f3',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '14px 18px',
    fontSize: '12px',
    color: '#555',
    lineHeight: 1.6,
    textAlign: 'center',
  },
};
