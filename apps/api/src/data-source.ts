import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://charts_user:charts_password@localhost:5432/charts_generator',
  synchronize: true,
  logging: false,
  entities: [User, Session],
  migrations: [__dirname + '/../migrations/*.{ts,js,sql}'],
});

// Export only the named DataSource instance for TypeORM CLI compatibility

