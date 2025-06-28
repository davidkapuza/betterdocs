import { NestFactory } from '@nestjs/core';

import { SeedersModule } from './seeders.module';
import { UsersSeederService } from './user/users-seeder.service';
import { DocumentsSeederService } from './document/documents-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedersModule);

  // Seed users first
  await app.get(UsersSeederService).seed();
  
  // Then seed documents (which will create a collection if needed)
  await app.get(DocumentsSeederService).seed();

  await app.close();
}

bootstrap();
