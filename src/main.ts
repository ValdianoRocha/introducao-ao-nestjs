import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {

  const porta = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder() //vai gerar um documento com base nas informaçoes que vamos passar 
    .setTitle('API de user') // titulo
    .setDescription('Documentaçãoda API de usuario com NestJs + Prisma + Swagger') //descrição Fornece uma descrição detalhada da API.
    .setVersion('1.0')
    .addBasicAuth({   // REPRESENTA OS CAMPOS AUTENTICADOS
      // esquema jwt bearer
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'heaher'

    })
    // .addTag('users')
    .build() //construir a configuração 

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remova propriedade não decoradas no Dto
      forbidNonWhitelisted: true, //retorne erro se enviar propriedade não permitidas 
      transform: true,            // transforma os tipos automaticamente EX:(string -> number)

    })
  )

  await app.listen(porta, () => {
    console.log(`http://localhost:${porta}/api`);
  });
}


bootstrap();
