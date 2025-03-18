import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const typeOrmConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: false,
  logging: false,
});

export const dataSource = new DataSource(typeOrmConfig());
