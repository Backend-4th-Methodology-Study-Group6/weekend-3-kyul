import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig: {
  type: 'postgres';
  host: string;
  username: string;
  password: string;
  port: number;
  database: string;
  synchronize: boolean;
} = config.get('db');

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.PSQL_HOSTNAME || dbConfig.host,
  port: Number(process.env.PSQL_PORT) || dbConfig.port,
  username: process.env.PSQL_USERNAME || dbConfig.username,
  password: process.env.PSQL_PASSWORD || dbConfig.password,
  database: process.env.PSQL_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
};
