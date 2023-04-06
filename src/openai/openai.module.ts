import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './definitions/connect.openai.definition';
import { OpenAiService } from './services/openai.service';

@Global()
@Module({
  controllers: [],
  providers: [OpenAiService],
  exports: [OpenAiService],
  imports: [],
})
export class OpenaiModule extends ConfigurableModuleClass {}
