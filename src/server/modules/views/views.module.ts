import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';

@Module({
  providers: [ViewsService],
  controllers: [ViewsController],
})
export class ViewsModule {}
