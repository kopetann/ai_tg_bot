import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConnectOpenAiInterface } from '../interfaces/connect.openai.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConnectOpenAiInterface>().build();
