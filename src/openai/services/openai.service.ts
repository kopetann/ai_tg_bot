import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '../definitions/connect.openai.definition';
import { ConnectOpenAiInterface } from '../interfaces/connect.openai.interface';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAiService {
  public __config: any;
  public __openai: any;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private config: ConnectOpenAiInterface,
  ) {
    this.__config = new Configuration({
      apiKey: config.apiKey,
    });
    this.__openai = new OpenAIApi(this.__config);
  }

  public async makeChatRequest(text: string): Promise<any> {
    return await this.__openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }],
      // max_tokens: 1000,
    });
  }
}
