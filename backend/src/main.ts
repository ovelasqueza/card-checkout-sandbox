import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 0; // 0 = puerto dinámico
  const server = await app.listen(port);
  const actualPort = server.address().port;
  console.log(`Application is running on: http://localhost:${actualPort}`);
}
bootstrap();
