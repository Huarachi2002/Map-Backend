import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  
  // Aumentar el límite del tamaño de la solicitud a 50MB
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: [
      'http://localhost:3000', // URL de desarrollo
      'https://webcolaborativaux-cgfaamc3gggwegg6.eastus-01.azurewebsites.net' // URL de Azure
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(port, '0.0.0.0', ()=> {
    Logger.log(`Server in port ${port}`)
  });
}
bootstrap();
