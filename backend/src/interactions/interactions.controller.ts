import { Controller, Post, Get, Delete, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { InteractionsService } from './interactions.service';
import { LogInteractionDto } from './dto/log-interaction.dto';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly service: InteractionsService) {}

  @Post()
  log(@Body() dto: LogInteractionDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '';
    const ua = req.headers['user-agent'] || '';
    return this.service.log(dto, ip, ua);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  // Endpoint de eliminación segura para cumplimiento de retención de datos
  @Delete('purge')
  purgeAll() {
    return this.service.purgeAll();
  }
}
