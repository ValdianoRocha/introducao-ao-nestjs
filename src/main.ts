import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const Porta = process.env.PORT
console.log(Porta);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen( Porta ?? 3000);

}
bootstrap();
