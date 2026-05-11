import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendFollowupDto } from './dto/send-followup.dto';
import { SendLureDto } from './dto/send-lure.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('lure')
  sendLure(@Body() dto: SendLureDto) {
    return this.service.sendLure(dto);
  }

  @Post('followup')
  sendFollowup(@Body() dto: SendFollowupDto) {
    return this.service.sendFollowup(dto);
  }
}
