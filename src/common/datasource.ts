import * as dotenv from 'dotenv';
import { Config } from './config';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource: DataSource = new DataSource(
  new Config().getTypeOrmConfig(),
);
