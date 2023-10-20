import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '../definitions/connect.openai.definition';
import { ConnectOpenAiInterface } from '../interfaces/connect.openai.interface';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import { config } from '../../common/config';
import { RolesInterface } from '../../common/interfaces/roles.interface';
import { Transcriptions } from 'openai/resources/audio';
import Transcription = Transcriptions.Transcription;

@Injectable()
export class OpenAiService {
  private __openai: any;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private config: ConnectOpenAiInterface,
  ) {
    this.__openai = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  public makeChatRequest(
    messages: RolesInterface[],
  ): Promise<OpenAI.Chat.ChatCompletion> {
    return this.__openai.chat.completions.create({
      model: config.get('CHATGPT_MODEL') || 'gpt-3.5-turbo',
      messages,
    });
  }

  public async transcribe(file: string): Promise<string> {
    try {
      return this.__openai.audio.transcriptions
        .create({
          file: fs.createReadStream(file) as any,
          model: 'whisper-1',
        })
        .then((response: Transcription) => response.text);
    } catch (e) {
      console.error(e.message);
    }
  }
}
