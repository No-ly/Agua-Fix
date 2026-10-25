import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { envs } from '../config/envs';
import { User } from '../auth/entities/user.entity';
import { Report } from '../reports/entities/report.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [User, Report],
  // join(__dirname) funciona igual en src (ts) y en dist (js), y en Windows
  migrations: [join(__dirname, 'migrations', '[0-9]*-*{.ts,.js}')],
  // El esquema solo cambia con migraciones (requisito del examen)
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
