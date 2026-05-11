import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Interaction, ActionType } from './interaction.entity';
import { LogInteractionDto } from './dto/log-interaction.dto';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private readonly repo: Repository<Interaction>,
  ) {}

  async log(dto: LogInteractionDto, rawIp: string, rawUa: string): Promise<Interaction> {
    // Nunca almacenamos IP ni UA en texto claro — sólo su hash SHA-256
    const ipHash = crypto.createHash('sha256').update(rawIp || 'unknown').digest('hex');
    const userAgentHash = crypto.createHash('sha256').update(rawUa || 'unknown').digest('hex');

    const interaction = this.repo.create({
      sessionId: dto.sessionId,
      action: dto.action,
      ipHash,
      userAgentHash,
      redirectedToAwareness: dto.action === ActionType.FORM_SUBMIT || dto.action === ActionType.LINK_CLICK,
    });

    return this.repo.save(interaction);
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

  // Eliminar todos los registros (retención de datos / derecho al olvido)
  async purgeAll(): Promise<{ deleted: number }> {
    const count = await this.repo.count();
    await this.repo.clear();
    return { deleted: count };
  }
}
