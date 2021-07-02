import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewsModule } from './modules/views/views.module';

@Module({
  imports: [ViewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
