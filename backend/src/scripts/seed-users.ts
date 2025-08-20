import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('👥 Iniciando proceso de seed de usuarios...');

  const users = [
    {
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@example.com'
    },
    {
      name: 'María Fernanda García',
      email: 'maria.garcia@example.com'
    },
    {
      name: 'Carlos Eduardo Rodríguez',
      email: 'carlos.rodriguez@example.com'
    },
    {
      name: 'Ana Sofía López',
      email: 'ana.lopez@example.com'
    },
    {
      name: 'Luis Miguel Torres',
      email: 'luis.torres@example.com'
    },
    {
      name: 'Isabella Martínez',
      email: 'isabella.martinez@example.com'
    },
    {
      name: 'Diego Alejandro Sánchez',
      email: 'diego.sanchez@example.com'
    },
    {
      name: 'Valentina Herrera',
      email: 'valentina.herrera@example.com'
    },
    {
      name: 'Sebastián Morales',
      email: 'sebastian.morales@example.com'
    },
    {
      name: 'Camila Andrea Jiménez',
      email: 'camila.jimenez@example.com'
    }
  ];

  try {
    for (const userData of users) {
      try {
        // Verificar si el usuario ya existe
        const existingUsers = await usersService.findAll();
        const userExists = existingUsers.some(user => user.email === userData.email);
        
        if (!userExists) {
          await usersService.create(userData);
          console.log(`✅ Usuario creado: ${userData.name} (${userData.email})`);
        } else {
          console.log(`⚠️  Usuario ya existe: ${userData.name} (${userData.email})`);
        }
      } catch (error) {
        console.log(`❌ Error creando usuario ${userData.name}: ${error.message}`);
      }
    }
    
    console.log('🎉 Proceso de seed de usuarios completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed de usuarios:', error);
  } finally {
    await app.close();
  }
}

seedUsers().catch((error) => {
  console.error('❌ Error fatal en el script de seed de usuarios:', error);
  process.exit(1);
});