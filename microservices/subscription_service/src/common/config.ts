import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { GrpcOptionsInterface } from './interfaces/grpc.options.interface';

class Config {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  public getTypeOrmConfig(): PostgresConnectionOptions {
    return {
      type: 'postgres',
      host: this.get<string>('DB_HOST', '0.0.0.0'),
      port: this.get<number>('DB_PORT', 5434),
      username: this.get<string>('DB_USER'),
      password: this.get<string>('DB_PASS'),
      database: this.get<string>('DB_NAME'),
      migrations: [join(__dirname, '..', 'migrations', '*.ts')],
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: false,
    };
  }

  public getGrpcOptions(): GrpcOptions {
    return addReflectionToGrpcConfig(
      this.getGrpcOptionsObject({
        url: this.get('APPLICATION_URL', '0.0.0.0:50051'),
        protoPath: join(__dirname, '..', 'proto', 'subscription_service.proto'),
        package: 'subscription_service',
      }),
    );
  }

  public get<T>(value: string, defaultValue?: T): T {
    return this.configService.get<T>(value, defaultValue ?? <T>'') as T;
  }

  protected getGrpcOptionsObject(
    options?: GrpcOptionsInterface | null,
  ): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: {
        url: '',
        package: '',
        protoPath: '',
        loader: {
          defaults: true,
          keepCase: true,
          json: true,
          enums: String,
          longs: String,
          objects: true,
          arrays: true,
          includeDirs: [join(__dirname, '..', 'proto')],
        },
        ...(options ?? {}),
      },
    };
  }
}

export const config: Config = new Config();
