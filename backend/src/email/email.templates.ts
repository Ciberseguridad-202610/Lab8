import { readFileSync } from "node:fs";
import { join } from "node:path";

const templatesDir = join(__dirname, "templates");
const templateCache = new Map<string, string>();

function loadTemplate(fileName: string): string {
  const cached = templateCache.get(fileName);
  if (cached) return cached;

  const content = readFileSync(join(templatesDir, fileName), "utf-8");
  templateCache.set(fileName, content);
  return content;
}

function renderTemplate(
  fileName: string,
  replacements: Record<string, string>,
): string {
  return Object.entries(replacements).reduce(
    (template, [key, value]) => template.split(`{{${key}}}`).join(value),
    loadTemplate(fileName),
  );
}

export function buildLureHtmlTemplate(phishingUrl: string): string {
  return renderTemplate("lure.html", { phishingUrl });
}

export function buildFollowupPlainTextTemplate(sessionId: string): string {
  return `
[SIMULACIÓN EDUCATIVA - CARÁCTER FICTICIO]

Hola,

Acabas de participar en una simulación controlada de phishing organizada por CorpTech S.A.
No hay ningún riesgo real: ninguna contraseña fue almacenada ni comprometida.

ID de sesión de referencia: ${sessionId}

SEÑALES QUE DEBISTE NOTAR:
- La URL no coincidía con el dominio oficial (corptech.com)
- El correo tenía remitente externo o inusual
- No había HTTPS con el dominio correcto verificado
- Se pedían credenciales con urgencia artificial

BUENAS PRÁCTICAS:
✅ Verifica siempre la URL completa antes de ingresar credenciales
✅ Usa un gestor de contraseñas (solo autocompleta en dominios legítimos)
✅ Activa autenticación de dos factores (2FA/MFA)
✅ No hagas clic en enlaces urgentes sin verificar al remitente
✅ Ante la duda, escribe la URL directamente en el navegador
✅ Reporta correos sospechosos a security@corptech.com

SI SOSPECHAS DE UN INCIDENTE REAL:
1. No ingreses más datos
2. Cierra la pestaña y cambia tu contraseña inmediatamente
3. Notifica al equipo de seguridad: security@corptech.com | ext. 1234
4. No compartas información sobre el incidente por canales no seguros

—
Equipo de Seguridad de la Información - CorpTech S.A.
Este mensaje es parte de una simulación autorizada con fines exclusivamente pedagógicos.
  `.trim();
}

export function buildFollowupHtmlTemplate(sessionId: string): string {
  return renderTemplate("followup.html", { sessionId });
}
