import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { SendFollowupDto } from "./dto/send-followup.dto";
import { SendLureDto } from "./dto/send-lure.dto";
import {
  buildFollowupHtmlTemplate,
  buildFollowupPlainTextTemplate,
  buildLureHtmlTemplate,
} from "./email.templates";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const smtpUser = this.config.get<string>("SMTP_USER");
    this.transporter = nodemailer.createTransport({
      host: this.config.get("SMTP_HOST", "localhost"),
      port: parseInt(this.config.get("SMTP_PORT", "1025")),
      secure: false,
      auth: smtpUser
        ? { user: smtpUser, pass: this.config.get("SMTP_PASS") }
        : undefined,
    });
  }

  async sendLure(dto: SendLureDto): Promise<{ messageId: string }> {
    const phishingUrl = `${this.config.get("FRONTEND_URL", "http://localhost:3000")}/phishing`;
    const info = await this.transporter.sendMail({
      from: '"IT Security - CorpTech" <it-security@corptech.com>',
      to: dto.to,
      subject: "Acción requerida: Verificación de cuenta corporativa",
      html: buildLureHtmlTemplate(phishingUrl),
      text: `Estimado usuario,\n\nSe ha detectado actividad inusual en tu cuenta. Por favor verifica tu identidad en el siguiente enlace:\n${phishingUrl}\n\nEste enlace expira en 24 horas.\n\nEquipo de IT - CorpTech S.A.`,
    });
    this.logger.log(
      `Correo de cebo enviado - messageId: ${info.messageId} | para: ${dto.to}`,
    );
    return { messageId: info.messageId };
  }

  async sendFollowup(
    dto: SendFollowupDto,
  ): Promise<{ messageId: string; preview?: string }> {
    const info = await this.transporter.sendMail({
      from: '"Seguridad Corporativa [SIMULACIÓN LAB]" <security-sim@corptech-lab.local>',
      to: dto.to,
      subject:
        "[SIMULACIÓN EDUCATIVA] Participaste en una prueba de concientización sobre phishing",
      html: buildFollowupHtmlTemplate(dto.sessionId),
      text: buildFollowupPlainTextTemplate(dto.sessionId),
    });

    this.logger.log(
      `Correo enviado - messageId: ${info.messageId} | para: ${dto.to}`,
    );

    // nodemailer.getTestMessageUrl devuelve URL si se usa cuenta Ethereal
    const preview = nodemailer.getTestMessageUrl(info) as string | false;
    return { messageId: info.messageId, ...(preview ? { preview } : {}) };
  }
}
