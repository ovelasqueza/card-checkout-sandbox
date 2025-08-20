import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductRepositoryPort } from '../domain/ports/product.repository.port';
import { Product } from '../domain/entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productRepository = app.get<ProductRepositoryPort>('ProductRepositoryPort');

  console.log('🌱 Iniciando proceso de seed...');

  const products = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Smartphone Samsung Galaxy A54',
      description: 'Smartphone con pantalla de 6.4 pulgadas, 128GB de almacenamiento y cámara de 50MP. Incluye cargador rápido y funda protectora.',
      price: 899000.00,
      stock: 25
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Laptop HP Pavilion 15',
      description: 'Laptop con procesador Intel Core i5 de 11va generación, 8GB RAM DDR4, 512GB SSD y pantalla Full HD de 15.6 pulgadas. Ideal para trabajo y estudio.',
      price: 2299000.00,
      stock: 15
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Auriculares Sony WH-1000XM4',
      description: 'Auriculares inalámbricos premium con cancelación de ruido líder en la industria y hasta 30 horas de batería. Incluye estuche de viaje.',
      price: 649000.00,
      stock: 40
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Tablet iPad Air',
      description: 'Tablet de 10.9 pulgadas con chip M1, 64GB de almacenamiento y compatibilidad con Apple Pencil de 2da generación. Perfecta para creativos.',
      price: 1899000.00,
      stock: 20
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Smart TV LG 55 pulgadas',
      description: 'Smart TV 4K UHD de 55 pulgadas con webOS, compatibilidad HDR10 y Dolby Vision. Incluye control remoto mágico y soporte de pared.',
      price: 1599000.00,
      stock: 10
    },
    {
      id: uuidv4(),
      name: 'Consola PlayStation 5',
      description: 'Consola de videojuegos de última generación con SSD ultra rápido, gráficos 4K y tecnología de audio 3D. Incluye control DualSense.',
      price: 2499000.00,
      stock: 8
    },
    {
      id: uuidv4(),
      name: 'Apple Watch Series 9',
      description: 'Smartwatch con pantalla Always-On Retina, GPS, resistencia al agua y monitoreo avanzado de salud. Correa deportiva incluida.',
      price: 1299000.00,
      stock: 30
    },
    {
      id: uuidv4(),
      name: 'Cámara Canon EOS R50',
      description: 'Cámara mirrorless de 24.2MP con grabación de video 4K, pantalla táctil abatible y conectividad Wi-Fi. Incluye lente 18-45mm.',
      price: 1799000.00,
      stock: 12
    },
    {
      id: uuidv4(),
      name: 'Teclado Mecánico Logitech MX',
      description: 'Teclado mecánico inalámbrico con switches táctiles, retroiluminación inteligente y conectividad multi-dispositivo.',
      price: 349000.00,
      stock: 50
    },
    {
      id: uuidv4(),
      name: 'Monitor Gaming ASUS 27"',
      description: 'Monitor gaming de 27 pulgadas, 144Hz, 1ms de respuesta, resolución QHD y tecnología G-Sync compatible. Ideal para gamers.',
      price: 899000.00,
      stock: 18
    }
  ];

  try {
    for (const productData of products) {
      // Verificar si el producto ya existe
      const existingProduct = await productRepository.findById(productData.id);
      
      if (!existingProduct) {
        const product = new Product(
          productData.id,
          productData.name,
          productData.description,
          productData.price,
          productData.stock,
          new Date()
        );
        
        await productRepository.save(product);
        console.log(`✅ Producto creado: ${productData.name}`);
      } else {
        console.log(`⚠️  Producto ya existe: ${productData.name}`);
      }
    }
    
    console.log('🎉 Proceso de seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Error fatal en el script de seed:', error);
  process.exit(1);
});