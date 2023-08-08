import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootsrap() {
  await repl(AppModule);
}

bootsrap();
