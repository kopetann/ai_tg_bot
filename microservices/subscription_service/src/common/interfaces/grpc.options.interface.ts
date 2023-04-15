import { join } from 'path';
import { Type } from '@nestjs/common';

export interface GrpcOptionsInterface {
  url?: string;
  package?: string;
  protoPath?: string;
  loader?: {
    defaults: boolean;
    keepCase: boolean;
    json: boolean;
    enums: Type;
    longs: Type;
    objects: boolean;
    arrays: boolean;
    includeDirs: [string];
  };
}
