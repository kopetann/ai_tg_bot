import { Controller, Get, Res } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  @Get()
  public acceptRedirectToBot(@Res() res) {
    return res.redirect('https://t.me/okayai_bot');
  }
}
