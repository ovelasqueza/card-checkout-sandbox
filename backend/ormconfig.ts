import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'card_checkout',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
});
