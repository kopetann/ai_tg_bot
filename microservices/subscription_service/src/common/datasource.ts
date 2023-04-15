import * as dotenv from 'dotenv';
import { config } from './config';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource(config.getTypeOrmConfig());
