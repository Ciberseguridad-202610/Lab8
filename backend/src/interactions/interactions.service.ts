import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Interaction, ActionType } from './interaction.entity';
import { LogInteractionDto } from './dto/log-interaction.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);

  constructor(
    @InjectRepository(Interaction)
    private readonly repo: Repository<Interaction>,
    private readonly emailService: EmailService,
  ) {}

  async log(dto: LogInteractionDto, rawIp: string, rawUa: string): Promise<Interaction> {
    const ipHash = crypto.createHash('sha256').update(rawIp || 'unknown').digest('hex');
    const userAgentHash = crypto.createHash('sha256').update(rawUa || 'unknown').digest('hex');

    const interaction = this.repo.create({
      sessionId: dto.sessionId,
      action: dto.action,
      ipHash,
      userAgentHash,
      submitterEmail: dto.email || null,
      redirectedToAwareness: dto.action === ActionType.FORM_SUBMIT || dto.action === ActionType.LINK_CLICK,
    });

    const saved = await this.repo.save(interaction);

    // Envío automático del correo de seguimiento cuando alguien envía el formulario
    if (dto.action === ActionType.FORM_SUBMIT && dto.email) {
      this.emailService
        .sendFollowup({ to: dto.email, sessionId: dto.sessionId })
        .then(() => this.logger.log(`Seguimiento enviado automáticamente a ${dto.email}`))
        .catch((err) => this.logger.error(`Error enviando seguimiento a ${dto.email}: ${err.message}`));
    }

    return saved;
  }

  findAll(): Promise<Interaction[]> {
    return this.repo.find({ order: { timestamp: 'DESC' } });
  }

  async getStats() {
    const [total, visits, submissions, clicks] = await Promise.all([
      this.repo.count(),
      this.repo.count({ where: { action: ActionType.PAGE_VISIT } }),
      this.repo.count({ where: { action: ActionType.FORM_SUBMIT } }),
      this.repo.count({ where: { action: ActionType.LINK_CLICK } }),
    ]);

    const conversionRate = visits > 0 ? ((submissions / visits) * 100).toFixed(1) : '0';
    return { total, visits, submissions, clicks, conversionRate: `${conversionRate}%` };
  }

  async purgeAll(): Promise<{ deleted: number }> {
    const count = await this.repo.count();
    await this.repo.clear();
    return { deleted: count };
  }
}
