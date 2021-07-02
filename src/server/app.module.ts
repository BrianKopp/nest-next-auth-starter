import { Module } from '@nestjs/common';
import { ViewsModule } from './modules/views/views.module';

@Module({
  imports: [ViewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
