import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { join } from 'path';

export class Config {
  private config: ConfigService;

  constructor() {
    this.config = new ConfigService<Record<string, unknown>, false>();
  }

  public getTypeOrmConfig(): PostgresConnectionOptions {
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: parseInt(this.get('DB_PORT')),
      username: this.get('DB_USER'),
      password: this.get('DB_PASS'),
      database: this.get('DB_NAME'),
      migrations: [join(__dirname, '..', 'migrations', '*.ts')],
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: false,
    };
  }

  public get(value: string, defaultValue?: string): string | undefined {
    const configValue = this.config.get<string>(value);

    if (!configValue && defaultValue) {
      return defaultValue;
    }

    return configValue;
  }
}
