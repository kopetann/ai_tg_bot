import { ConfigService } from '@nestjs/config';

class Config {
  private config: ConfigService;

  constructor() {
    this.config = new ConfigService();
  }

  public get<T>(value: string, defaultValue?: T): T {
    return this.config.get(value, defaultValue ?? <T>'') as T;
  }
}

export const config: Config = new Config();
