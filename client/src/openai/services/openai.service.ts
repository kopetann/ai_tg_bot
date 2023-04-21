import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '../definitions/connect.openai.definition';
import { ConnectOpenAiInterface } from '../interfaces/connect.openai.interface';
import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import { config } from '../../common/config';
import { VoiceTranscriptionResponseInterface } from '../interfaces/voice.transcription.response.interface';

@Injectable()
export class OpenAiService {
  private readonly __config: any;
  private __openai: any;

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
      model: config.get('CHATGPT_MODEL') || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }],
    });
  }

  public async transcribe(file: string): Promise<string> {
    try {
      return this.__openai
        .createTranscription(fs.createReadStream(file) as any, 'whisper-1')
        .then(
          (response: VoiceTranscriptionResponseInterface) => response.data.text,
        );
    } catch (e) {
      console.error(e.message);
    }
  }
}
