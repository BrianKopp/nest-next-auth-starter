import { Injectable, OnModuleInit } from '@nestjs/common';
import next, { NextServer } from 'next/dist/server/next';

@Injectable()
export class ViewsService implements OnModuleInit {
  private server: NextServer;

  async onModuleInit(): Promise<void> {
    try {
      this.server = next({ dev: true, dir: './src/client' });
      await this.server.prepare();
    } catch (err) {
      console.log('error starting next server', err);
    }
  }

  getNextServer(): NextServer {
    return this.server;
  }
}
