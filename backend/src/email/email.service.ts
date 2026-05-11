import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendFollowupDto } from './dto/send-followup.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const smtpUser = this.config.get<string>('SMTP_USER');
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'localhost'),
      port: parseInt(this.config.get('SMTP_PORT', '1025')),
      secure: false,
      auth: smtpUser ? { user: smtpUser, pass: this.config.get('SMTP_PASS') } : undefined,
    });
  }

  async sendFollowup(dto: SendFollowupDto): Promise<{ messageId: string; preview?: string }> {
    const info = await this.transporter.sendMail({
      from: '"Seguridad Corporativa [SIMULACIÓN LAB]" <security-sim@corptech-lab.local>',
      to: dto.to,
      subject: '[SIMULACIÓN EDUCATIVA] Participaste en una prueba de concientización sobre phishing',
      html: this.buildTemplate(dto.sessionId),
      text: this.buildPlainText(dto.sessionId),
    });

    this.logger.log(`Correo enviado - messageId: ${info.messageId} | para: ${dto.to}`);

    // nodemailer.getTestMessageUrl devuelve URL si se usa cuenta Ethereal
    const preview = nodemailer.getTestMessageUrl(info) as string | false;
    return { messageId: info.messageId, ...(preview ? { preview } : {}) };
  }

  private buildPlainText(sessionId: string): string {
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

  private buildTemplate(sessionId: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, Arial, sans-serif; background: #f0f2f5; color: #333; }
    .wrapper { max-width: 620px; margin: 24px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .header { background: linear-gradient(135deg, #b71c1c, #d32f2f); color: white; padding: 28px 32px; text-align: center; }
    .sim-badge { display: inline-block; background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.5); color: white; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
    .header h1 { font-size: 20px; font-weight: 700; line-height: 1.4; }
    .body { background: white; padding: 32px; }
    .section-title { font-size: 15px; font-weight: 700; color: #1a237e; margin: 24px 0 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8eaf6; padding-bottom: 6px; }
    .session-id { background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 10px 14px; font-family: monospace; font-size: 13px; color: #555; margin: 12px 0; }
    .alert-box { background: #fff8e1; border-left: 4px solid #ffa000; border-radius: 0 6px 6px 0; padding: 14px 16px; margin: 16px 0; }
    .alert-box ul { list-style: none; }
    .alert-box li { padding: 5px 0; font-size: 14px; }
    .alert-box li::before { content: "⚠️ "; }
    .checklist ul { list-style: none; }
    .checklist li { padding: 7px 0; font-size: 14px; border-bottom: 1px solid #f5f5f5; }
    .checklist li::before { content: "✅ "; }
    .incident-box { background: #ffebee; border: 1px solid #ef9a9a; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .incident-box ol { padding-left: 20px; }
    .incident-box li { padding: 5px 0; font-size: 14px; }
    .footer { background: #263238; color: #90a4ae; padding: 18px 24px; font-size: 12px; text-align: center; line-height: 1.6; }
    .footer strong { color: #cfd8dc; }
    p { line-height: 1.7; font-size: 14px; margin-bottom: 10px; }
    a { color: #1976d2; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="sim-badge">Simulación Educativa</div>
    <h1>Participaste en una prueba de concientización sobre phishing</h1>
  </div>
  <div class="body">
    <p>Hola,</p>
    <p>Como parte del <strong>Programa de Concientización en Ciberseguridad</strong> de CorpTech S.A., acabas de participar en una <strong>simulación controlada de evil twin / phishing</strong>. <strong>No hay ningún riesgo real:</strong> ninguna contraseña fue almacenada ni comprometida en ningún momento.</p>

    <div class="session-id">ID de referencia de sesión: ${sessionId}</div>

    <div class="section-title">¿Qué ocurrió?</div>
    <p>Recibiste (o visitaste) un enlace que imitaba el portal de inicio de sesión corporativo. Esta es la técnica de <em>phishing / evil twin</em> más frecuente: el atacante replica visualmente el portal legítimo en otro dominio para capturar credenciales.</p>

    <div class="section-title">Señales de alerta que debiste notar</div>
    <div class="alert-box">
      <ul>
        <li>La URL <strong>no</strong> coincidía con el dominio oficial <code>corptech.com</code></li>
        <li>El correo o enlace tenía un remitente externo o inusual</li>
        <li>No había un certificado HTTPS válido con el dominio corporativo correcto</li>
        <li>Se pedían credenciales con urgencia artificial o sin contexto claro</li>
      </ul>
    </div>

    <div class="section-title">Buenas prácticas para identificar y evitar phishing</div>
    <div class="checklist">
      <ul>
        <li>Verifica siempre la URL completa antes de ingresar cualquier credencial</li>
        <li>Usa un <strong>gestor de contraseñas</strong> (solo autocompleta en el dominio legítimo registrado)</li>
        <li>Activa <strong>autenticación de dos factores (2FA / MFA)</strong> en todas tus cuentas</li>
        <li>No hagas clic en enlaces de correos urgentes sin verificar el remitente real</li>
        <li>Ante la duda, escribe la URL directamente en el navegador en lugar de seguir enlaces</li>
        <li>Reporta correos sospechosos a <a href="mailto:security@corptech.com">security@corptech.com</a></li>
        <li>Nunca ingreses credenciales en redes Wi-Fi públicas sin VPN corporativa</li>
      </ul>
    </div>

    <div class="section-title">Si sospechas de un incidente real</div>
    <div class="incident-box">
      <ol>
        <li>No ingreses más datos. Cierra la pestaña de inmediato.</li>
        <li><strong>Cambia tu contraseña</strong> desde el portal oficial corporativo.</li>
        <li>Notifica al equipo de Seguridad: <a href="mailto:security@corptech.com">security@corptech.com</a> | Extensión <strong>1234</strong>.</li>
        <li>No compartas información sobre el posible incidente por canales no seguros (WhatsApp, correo personal).</li>
        <li>Conserva capturas de pantalla y encabezados del correo como evidencia.</li>
      </ol>
    </div>

    <p>Para recursos adicionales, visita el portal de RR.HH. bajo <em>"Ciberseguridad → Phishing y Concientización"</em> o contacta a tu responsable de seguridad de área.</p>
    <p>Gracias por participar en esta iniciativa. La concientización es la primera línea de defensa.</p>
    <p><strong>Equipo de Seguridad de la Información<br>CorpTech S.A.</strong></p>
  </div>
  <div class="footer">
    Este mensaje es parte de una <strong>simulación autorizada con fines exclusivamente pedagógicos</strong>.<br>
    Ninguna credencial fue almacenada ni procesada. · ID de referencia: ${sessionId}<br>
    CorpTech S.A. · Programa de Concientización en Ciberseguridad · Lab 8
  </div>
</div>
</body>
</html>`;
  }
}
