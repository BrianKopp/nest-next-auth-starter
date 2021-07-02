import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ViewsService } from './views.service';

@Controller('/')
export class ViewsController {
  constructor(private viewService: ViewsService) {}

  @Get('*')
  static(@Req() req: Request, @Res() res: Response) {
    const handle = this.viewService.getNextServer().getRequestHandler();
    handle(req, res);
  }
}
