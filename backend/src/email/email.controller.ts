import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendFollowupDto } from './dto/send-followup.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('followup')
  sendFollowup(@Body() dto: SendFollowupDto) {
    return this.service.sendFollowup(dto);
  }
}
