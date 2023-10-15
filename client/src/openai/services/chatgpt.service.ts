import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatGptService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly configService: ConfigService,
  ) {}

  async getText(text: string) {
    const response = await fetch(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
        },
        body: JSON.stringify({}),
      },
    );
    const data = await response.json();
    return data.choices[0].text;
  }
}
